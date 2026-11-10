import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';
import {
  ArabicDialect,
  ArabCity,
  CameraViewMode,
  DialogueOption,
  DrivingStyleType,
  Passenger,
  TaxiState,
  TimeOfDay,
} from '../../types/game';
import { proceduralAudio } from '../../utils/proceduralAudio';
import { createArabTaxi, TaxiVehicleNodes } from './CarModel';
import { buildArabStreetScene, StreetSceneNodes } from './ArabStreetScene';
import { PedestrianSystem } from './PedestrianSystem';
import {
  ARABIC_PASSENGER_DATA,
  generatePassengerRequest,
  generateRealisticPassenger,
  getAvailableConversation,
  getMoodFromSatisfaction,
} from '../../utils/passengerInteractions';

// Pre-allocated reusable module-scope math objects to ensure ZERO garbage collection in the render loop
const _camTarget = new THREE.Vector3();
const _camOffset = new THREE.Vector3();
const _forward = new THREE.Vector3();

interface TaxiCanvasProps {
  city: ArabCity;
  timeOfDay: TimeOfDay;
  cameraView: CameraViewMode;
  selectedDialect: ArabicDialect | 'auto';
  hornTrigger?: number;
  inputState: {
    gas: boolean;
    brake: boolean;
    steerLeft: boolean;
    steerRight: boolean;
    handbrake: boolean;
  };
  acActive: boolean;
  fulfillRequestTrigger?: number;
  apologyTrigger?: number;
  blessingTrigger?: number;
  activeDialogueOption?: DialogueOption | null;
  onStateUpdate: (state: TaxiState) => void;
  onPassengerUpdate: (passenger: Passenger | null, status: 'searching' | 'onboard' | 'dropped') => void;
}

/**
 * Creates dynamic 3D speech bubble texture for in-car passenger reactions
 */
function createCarSpeechBubbleTexture(text: string, flag: string = '🚕'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background speech bubble with dark luxury gold accent
  const x = 12, y = 12, w = 488, h = 110, r = 24;
  ctx.fillStyle = 'rgba(24, 20, 16, 0.94)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  // Bubble pointer
  ctx.lineTo(x + w / 2 + 20, y + h);
  ctx.lineTo(x + w / 2, y + h + 24);
  ctx.lineTo(x + w / 2 - 20, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Flag & Arabic dialogue
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 28px "Cairo", sans-serif';
  ctx.fillStyle = '#fef3c7';

  // Truncate if long
  const displayLine = text.length > 38 ? text.slice(0, 36) + '...' : text;
  ctx.fillText(`${flag} "${displayLine}"`, w / 2 + 10, h / 2 + 10);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const TaxiCanvas: React.FC<TaxiCanvasProps> = ({
  city,
  timeOfDay,
  cameraView,
  selectedDialect,
  hornTrigger = 0,
  inputState,
  acActive,
  fulfillRequestTrigger = 0,
  apologyTrigger = 0,
  blessingTrigger = 0,
  activeDialogueOption = null,
  onStateUpdate,
  onPassengerUpdate,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Synchronized refs for fast animation loop
  const hornTriggerRef = useRef(hornTrigger);
  hornTriggerRef.current = hornTrigger;

  const fulfillRequestTriggerRef = useRef(fulfillRequestTrigger);
  fulfillRequestTriggerRef.current = fulfillRequestTrigger;

  const apologyTriggerRef = useRef(apologyTrigger);
  apologyTriggerRef.current = apologyTrigger;

  const blessingTriggerRef = useRef(blessingTrigger);
  blessingTriggerRef.current = blessingTrigger;

  const activeDialogueOptionRef = useRef<DialogueOption | null>(activeDialogueOption);
  activeDialogueOptionRef.current = activeDialogueOption;

  const selectedDialectRef = useRef<ArabicDialect | 'auto'>(selectedDialect);
  selectedDialectRef.current = selectedDialect;

  const acActiveRef = useRef<boolean>(acActive);
  acActiveRef.current = acActive;

  const stateRef = useRef<TaxiState>({
    speedKmh: 0,
    rpm: 800,
    gear: 'D',
    steeringAngle: 0,
    headlightsOn: true,
    hazardLightsOn: false,
    meterHired: false,
    meterDistanceKm: 0,
    currentFare: 0,
    totalEarnings: 0,
    tripsCompleted: 0,
    customerRating: 5.0,
    posX: 4.8,
    posZ: 0,
    heading: 0,
    driverXp: 0,
    driverLevel: 1,
    acActive: false,
    drivingStyle: 'normal',
    comfortScore: 92,
    totalSatisfiedPassengers: 0,
  });

  const cityRef = useRef<ArabCity>(city);
  cityRef.current = city;

  const timeOfDayRef = useRef<TimeOfDay>(timeOfDay);
  timeOfDayRef.current = timeOfDay;

  const cameraViewRef = useRef<CameraViewMode>(cameraView);
  cameraViewRef.current = cameraView;

  const inputRef = useRef(inputState);
  inputRef.current = inputState;

  // Passenger mission reference
  const currentPassengerRef = useRef<Passenger | null>(null);
  const missionStatusRef = useRef<'searching' | 'onboard' | 'dropped'>('searching');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL from renderer string per Three.js directives
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Renderer initialization
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure =
      timeOfDayRef.current === 'sunset' ? 1.25 : timeOfDayRef.current === 'night' ? 1.05 : 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // 2. Scene & Studio Environment Reflection
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(
      timeOfDayRef.current === 'night' ? 0x090d16 : timeOfDayRef.current === 'sunset' ? 0xca8a04 : 0xbae6fd,
      40,
      320
    );

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.2, 500);
    camera.position.set(0, 5, -10);

    // 4. Build Arab Street Scene
    const streetNodes: StreetSceneNodes = buildArabStreetScene(cityRef.current, timeOfDayRef.current);
    scene.add(streetNodes.sceneGroup);

    // 5. Build Arab Taxi Player Vehicle
    const taxiNodes: TaxiVehicleNodes = createArabTaxi(cityRef.current, false);
    scene.add(taxiNodes.group);
    taxiNodes.group.position.set(4.8, 0, 0);

    // 5b. Floating Overhead 3D Passenger Speech Bubble attached to taxi
    const initialTex = createCarSpeechBubbleTexture('يا أسطى وديني للمشوار', '🧕');
    const bubbleMat = new THREE.SpriteMaterial({
      map: initialTex,
      transparent: true,
      opacity: 0,
      depthTest: false,
    });
    const passengerSpeechSprite = new THREE.Sprite(bubbleMat);
    passengerSpeechSprite.position.set(0, 2.7, 0);
    passengerSpeechSprite.scale.set(4.2, 1.4, 1);
    taxiNodes.group.add(passengerSpeechSprite);

    let bubbleTimer = 0;

    const showCarSpeechBubble = (text: string, flag: string = '💬') => {
      passengerSpeechSprite.material.map?.dispose();
      passengerSpeechSprite.material.map = createCarSpeechBubbleTexture(text, flag);
      passengerSpeechSprite.material.needsUpdate = true;
      passengerSpeechSprite.material.opacity = 1;
      bubbleTimer = 4.2;
    };

    // 6. Build AI Pedestrian System on Sidewalks
    const pedestrianSystem = new PedestrianSystem(20, 550, 24);
    scene.add(pedestrianSystem.rootGroup);
    let lastHornValue = hornTriggerRef.current || 0;
    let hornTimestamps: number[] = [];

    // Vehicle kinematic state
    let posX = 4.8;
    let posZ = 0;
    let heading = 0;
    let speed = 0;
    let steerAngle = 0;
    let wheelSpinAngle = 0;
    let pitchAngle = 0;
    let rollAngle = 0;
    let lastSpeed = 0;
    let lastTime = performance.now();

    // Interaction timers & telemetry
    let smoothDrivingTimer = 0;
    let rideTimeOnboard = 0;
    let nextRequestTimer = 8;
    let nextConversationTimer = 14;
    let lastReactionCooldown = 0;
    let destinationCommentTriggered = false;
    let lastFulfillTrigger = fulfillRequestTriggerRef.current || 0;
    let lastApologyTrigger = apologyTriggerRef.current || 0;
    let lastBlessingTrigger = blessingTriggerRef.current || 0;
    let lastHandledDialogueId: string | null = null;

    // Start procedural audio engine
    proceduralAudio.init();
    proceduralAudio.startEngine();

    // Initialize first realistic passenger
    currentPassengerRef.current = generateRealisticPassenger(
      cityRef.current,
      0,
      selectedDialectRef.current
    );
    onPassengerUpdate(currentPassengerRef.current, 'searching');

    // Update 3D pickup beacon positions
    streetNodes.passengerFigure.position.set(
      currentPassengerRef.current.pickupPos.x,
      0.15,
      currentPassengerRef.current.pickupPos.z
    );
    streetNodes.pickupZoneMesh.position.set(
      currentPassengerRef.current.pickupPos.x - 2,
      0.2,
      currentPassengerRef.current.pickupPos.z
    );
    streetNodes.pickupBeaconLight.position.set(
      currentPassengerRef.current.pickupPos.x - 2,
      2.5,
      currentPassengerRef.current.pickupPos.z
    );

    streetNodes.dropoffZoneMesh.position.set(
      currentPassengerRef.current.dropoffPos.x + 2,
      0.2,
      currentPassengerRef.current.dropoffPos.z
    );
    streetNodes.dropoffBeaconLight.position.set(
      currentPassengerRef.current.dropoffPos.x + 2,
      2.5,
      currentPassengerRef.current.dropoffPos.z
    );
    streetNodes.dropoffZoneMesh.visible = false;

    // Animation loop variables
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const syncState = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (syncState === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    // Helper to dispatch passenger reaction
    const triggerPassengerReaction = (
      text: string,
      satisfactionDelta: number,
      soundType: 'gasp' | 'happy' | 'pop',
      moodTag: string
    ) => {
      const pass = currentPassengerRef.current;
      if (!pass || missionStatusRef.current !== 'onboard') return;

      lastReactionCooldown = 3.6; // Cooldown to avoid repetitive spamming
      pass.satisfaction = Math.max(5, Math.min(100, pass.satisfaction + satisfactionDelta));
      pass.currentMood = getMoodFromSatisfaction(pass.satisfaction);
      pass.lastReactionText = text;
      pass.lastReactionTime = performance.now();

      pass.conversationHistory.push({
        id: Math.random().toString(),
        sender: 'passenger',
        textAr: text,
        timestamp: Date.now(),
        moodIndicator: moodTag,
      });

      if (soundType === 'gasp') proceduralAudio.playPassengerGasp();
      else if (soundType === 'happy') proceduralAudio.playPassengerHappy();
      else proceduralAudio.playDialoguePop();

      showCarSpeechBubble(text, pass.dialectFlag);
      onPassengerUpdate({ ...pass }, 'onboard');
    };

    // Main animation & simulation tick
    function tick() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const input = inputRef.current;
      const maxSpeed = 34; // ~122 km/h
      const accelRate = 18;
      const brakeRate = 28;
      const drag = 3.5;

      // 1. Vehicle Driving Physics
      let isAccelerating = false;
      if (input.gas) {
        speed += accelRate * dt;
        isAccelerating = true;
      } else if (input.brake) {
        if (speed > 1) {
          speed -= brakeRate * dt;
        } else {
          speed -= accelRate * 0.6 * dt;
          isAccelerating = true;
        }
      } else {
        if (speed > 0) speed = Math.max(0, speed - drag * dt);
        else if (speed < 0) speed = Math.min(0, speed + drag * dt);
      }

      if (input.handbrake) {
        speed = THREE.MathUtils.damp(speed, 0, 12, dt);
      }

      speed = THREE.MathUtils.clamp(speed, -12, maxSpeed);

      // Steering
      const maxSteer = 0.58;
      let targetSteer = 0;
      if (input.steerLeft) targetSteer += maxSteer;
      if (input.steerRight) targetSteer -= maxSteer;

      steerAngle = THREE.MathUtils.damp(steerAngle, targetSteer, 9, dt);

      if (Math.abs(speed) > 0.05) {
        const turnSpeedFactor = THREE.MathUtils.clamp(1.4 - Math.abs(speed) / 45, 0.35, 1.2);
        const headingDelta = steerAngle * (speed / 2.6) * turnSpeedFactor * dt;
        heading += headingDelta;
      }

      // Update positions
      posX += Math.sin(heading) * speed * dt;
      posZ += Math.cos(heading) * speed * dt;

      // Curb boundaries & curb bump check
      const maxRoadX = 11.2;
      let hitCurb = false;
      if (posX > maxRoadX) {
        posX = maxRoadX;
        speed *= 0.82;
        hitCurb = true;
      } else if (posX < -maxRoadX) {
        posX = -maxRoadX;
        speed *= 0.82;
        hitCurb = true;
      }

      const roadLimit = 280;
      if (posZ > roadLimit) posZ -= roadLimit * 2;
      if (posZ < -roadLimit) posZ += roadLimit * 2;

      // 3D vehicle transforms
      taxiNodes.group.position.set(posX, 0, posZ);
      taxiNodes.group.rotation.y = heading;

      wheelSpinAngle += (speed / 0.35) * dt;
      taxiNodes.frontLeftWheel.rotation.x = wheelSpinAngle;
      taxiNodes.frontRightWheel.rotation.x = wheelSpinAngle;
      taxiNodes.rearLeftWheel.rotation.x = wheelSpinAngle;
      taxiNodes.rearRightWheel.rotation.x = wheelSpinAngle;

      taxiNodes.frontLeftWheel.rotation.y = steerAngle;
      taxiNodes.frontRightWheel.rotation.y = steerAngle;
      taxiNodes.steeringWheel.rotation.z = -steerAngle * 2.2;

      const targetPitch = (isAccelerating ? -0.03 : 0) + (input.brake ? 0.04 : 0);
      pitchAngle = THREE.MathUtils.damp(pitchAngle, targetPitch, 8, dt);
      const targetRoll = -steerAngle * (speed / maxSpeed) * 0.12;
      rollAngle = THREE.MathUtils.damp(rollAngle, targetRoll, 8, dt);

      taxiNodes.cabinGroup.rotation.x = pitchAngle;
      taxiNodes.cabinGroup.rotation.z = rollAngle;

      taxiNodes.prayerBeads.rotation.z = THREE.MathUtils.damp(
        taxiNodes.prayerBeads.rotation.z,
        rollAngle * 3.5,
        6,
        dt
      );
      taxiNodes.prayerBeads.rotation.x = THREE.MathUtils.damp(
        taxiNodes.prayerBeads.rotation.x,
        pitchAngle * 4.0,
        6,
        dt
      );

      // 2. Ambient traffic update
      streetNodes.trafficCars.forEach((traffic) => {
        const trafficSpeedMps = (traffic.speed * 1000) / 3600;
        traffic.mesh.position.z += traffic.direction * trafficSpeedMps * dt;
        if (traffic.mesh.position.z > 290) traffic.mesh.position.z = -290;
        if (traffic.mesh.position.z < -290) traffic.mesh.position.z = 290;
      });

      // 3. Horn & pedestrian reaction
      const currentHorn = hornTriggerRef.current || 0;
      let didHonkThisFrame = false;
      if (currentHorn !== lastHornValue) {
        lastHornValue = currentHorn;
        didHonkThisFrame = true;
        hornTimestamps.push(now);
        pedestrianSystem.onTaxiHorn({ x: posX, z: posZ });
      }
      pedestrianSystem.update(dt, { x: posX, z: posZ }, speed);

      // Keep only horn stamps within last 4 seconds
      hornTimestamps = hornTimestamps.filter((t) => now - t < 4000);

      // 4. Audio update
      const speedKmh = Math.round(speed * 3.6);
      proceduralAudio.updateEngine(speedKmh, isAccelerating);

      // 5. Overhead speech bubble countdown
      if (bubbleTimer > 0) {
        bubbleTimer -= dt;
        if (bubbleTimer < 0.8) {
          passengerSpeechSprite.material.opacity = Math.max(0, bubbleTimer / 0.8);
        }
      }

      // 6. Driving style telemetry analysis
      const accel = (speed - lastSpeed) / dt;
      lastSpeed = speed;

      let currentStyle: DrivingStyleType = 'normal';
      if (lastReactionCooldown > 0) lastReactionCooldown -= dt;

      const passenger = currentPassengerRef.current;
      const currentTaxiState = stateRef.current;

      // Check external triggers (Apology / Blessing / Request fulfill / Dialogue)
      const curApology = apologyTriggerRef.current || 0;
      if (curApology !== lastApologyTrigger) {
        lastApologyTrigger = curApology;
        if (passenger && missionStatusRef.current === 'onboard') {
          triggerPassengerReaction('حصل خير يا أسطى، مسامحك ومقدر تعبك بالشارع 🙏', 12, 'happy', '🤝 عفو');
        }
      }

      const curBlessing = blessingTriggerRef.current || 0;
      if (curBlessing !== lastBlessingTrigger) {
        lastBlessingTrigger = curBlessing;
        if (passenger && missionStatusRef.current === 'onboard') {
          triggerPassengerReaction(
            'سبحان الذي سخر لنا هذا وما كنا له مقرنين.. الله يحفظنا ويحفظ طريقنا 🤲',
            10,
            'happy',
            '📿 سكينة'
          );
        }
      }

      const curFulfill = fulfillRequestTriggerRef.current || 0;
      if (curFulfill !== lastFulfillTrigger) {
        lastFulfillTrigger = curFulfill;
        if (passenger && passenger.activeRequest && !passenger.activeRequest.fulfilled) {
          passenger.activeRequest.fulfilled = true;
          passenger.completedRequestsCount += 1;
          const corpus = ARABIC_PASSENGER_DATA[passenger.dialect];
          let thanks = 'تسلم يا كابتن ما قصرت!';
          if (passenger.activeRequest.type === 'ac_toggle') {
            thanks = acActiveRef.current
              ? corpus.requests.turnOnAc.fulfilledThanks
              : corpus.requests.turnOffAc.fulfilledThanks;
          } else if (passenger.activeRequest.type === 'radio_station') {
            thanks = corpus.requests.changeRadio.fulfilledThanks;
          } else if (passenger.activeRequest.type === 'speed_up') {
            thanks = corpus.requests.speedUp.fulfilledThanks;
          } else if (passenger.activeRequest.type === 'slow_down') {
            thanks = corpus.requests.slowDown.fulfilledThanks;
          }

          passenger.tipMultiplier = Number(
            (passenger.tipMultiplier + passenger.activeRequest.rewardTipPercent / 100).toFixed(2)
          );
          proceduralAudio.playRequestFulfilled();
          triggerPassengerReaction(thanks, 16, 'happy', '✨ شكر');
        }
      }

      // Check active dialogue choice selection
      const activeOption = activeDialogueOptionRef.current;
      if (activeOption && activeOption.id !== lastHandledDialogueId) {
        lastHandledDialogueId = activeOption.id;
        if (passenger && missionStatusRef.current === 'onboard') {
          // Add driver response
          passenger.conversationHistory.push({
            id: Math.random().toString(),
            sender: 'driver',
            textAr: activeOption.textAr,
            timestamp: Date.now(),
            moodIndicator: '🚕 السائق',
          });
          // Add passenger reply
          setTimeout(() => {
            triggerPassengerReaction(activeOption.replyAr, activeOption.effectOnSatisfaction, 'happy', '💬 رد');
          }, 400);
        }
      }

      // Realistic Driving Telemetry & Passenger Reactions
      if (passenger && missionStatusRef.current === 'onboard') {
        rideTimeOnboard += dt;
        const corpus = ARABIC_PASSENGER_DATA[passenger.dialect];

        // Telemetry 1: Hard Braking (G-Force deceleration)
        if (accel < -15.5 && Math.abs(speed) > 4) {
          currentStyle = 'aggressive';
          if (lastReactionCooldown <= 0) {
            const reaction =
              corpus.reactions.hardBrake[Math.floor(Math.random() * corpus.reactions.hardBrake.length)];
            triggerPassengerReaction(reaction, -12, 'gasp', '💥 فرملة قوية');
          }
        }
        // Telemetry 2: Reckless Swerve / Drift
        else if (Math.abs(steerAngle) > 0.42 && Math.abs(speedKmh) > 45) {
          currentStyle = 'aggressive';
          if (lastReactionCooldown <= 0) {
            const reaction =
              corpus.reactions.recklessSwerve[
                Math.floor(Math.random() * corpus.reactions.recklessSwerve.length)
              ];
            triggerPassengerReaction(reaction, -10, 'gasp', '🌀 انعطاف حاد');
          }
        }
        // Telemetry 3: Curb Bump / Sidewalk collision
        else if (hitCurb && Math.abs(speedKmh) > 15) {
          currentStyle = 'erratic';
          if (lastReactionCooldown <= 0) {
            const reaction =
              corpus.reactions.curbBump[Math.floor(Math.random() * corpus.reactions.curbBump.length)];
            triggerPassengerReaction(reaction, -14, 'gasp', '🚨 صعود رصيف');
          }
        }
        // Telemetry 4: Horn Spamming (3+ times in short window)
        else if (hornTimestamps.length >= 3 && didHonkThisFrame) {
          if (lastReactionCooldown <= 0) {
            const reaction =
              corpus.reactions.hornSpam[Math.floor(Math.random() * corpus.reactions.hornSpam.length)];
            triggerPassengerReaction(reaction, -6, 'pop', '📢 بوري مزعج');
          }
        }
        // Telemetry 5: Extreme Speeding
        else if (Math.abs(speedKmh) > 85) {
          currentStyle = 'erratic';
          if (lastReactionCooldown <= 0) {
            if (passenger.persona === 'hurried_worker') {
              const cheer =
                corpus.reactions.speeding.hurried[
                  Math.floor(Math.random() * corpus.reactions.speeding.hurried.length)
                ];
              triggerPassengerReaction(cheer, 6, 'happy', '⚡ سرعة مطلوبة');
            } else {
              const scold =
                corpus.reactions.speeding.general[
                  Math.floor(Math.random() * corpus.reactions.speeding.general.length)
                ];
              triggerPassengerReaction(scold, -8, 'pop', '⚡ سرعة مفرطة');
            }
          }
        }
        // Telemetry 6: Smooth Driving
        else if (Math.abs(speedKmh) >= 28 && Math.abs(speedKmh) <= 72 && Math.abs(steerAngle) < 0.18) {
          smoothDrivingTimer += dt;
          currentStyle = 'smooth';
          if (smoothDrivingTimer > 18) {
            smoothDrivingTimer = 0;
            if (lastReactionCooldown <= 0) {
              const praise =
                corpus.reactions.smoothDriving[
                  Math.floor(Math.random() * corpus.reactions.smoothDriving.length)
                ];
              triggerPassengerReaction(praise, 10, 'happy', '🌟 سياقة راقية');
            }
          }
        } else {
          smoothDrivingTimer = Math.max(0, smoothDrivingTimer - dt * 0.5);
          currentStyle = 'normal';
        }

        // Periodic In-Ride Passenger Request (Every ~18s)
        nextRequestTimer -= dt;
        if (nextRequestTimer <= 0 && !passenger.activeRequest && rideTimeOnboard > 5) {
          nextRequestTimer = 22 + Math.random() * 12;
          passenger.activeRequest = generatePassengerRequest(passenger, {
            acActive: acActiveRef.current,
            speedKmh,
          });
          proceduralAudio.playDialoguePop();
          showCarSpeechBubble(passenger.activeRequest.promptAr, '✨');
          onPassengerUpdate({ ...passenger }, 'onboard');
        }

        // Active request countdown
        if (passenger.activeRequest && !passenger.activeRequest.fulfilled && !passenger.activeRequest.expired) {
          passenger.activeRequest.remainingSeconds -= dt;
          if (passenger.activeRequest.remainingSeconds <= 0) {
            passenger.activeRequest.expired = true;
            triggerPassengerReaction('شكلك ما سمعتني يا كابتن.. مو مشكلة', -6, 'pop', '⏳ انتهاء وقت الطلب');
          }
        }

        // Periodic Interactive Conversation Prompt (Every ~25s)
        nextConversationTimer -= dt;
        if (nextConversationTimer <= 0 && !passenger.activeRequest && rideTimeOnboard > 8) {
          nextConversationTimer = 28 + Math.random() * 15;
          const convo = getAvailableConversation(passenger);
          if (convo) {
            passenger.conversationHistory.push({
              id: Math.random().toString(),
              sender: 'passenger',
              textAr: convo.promptAr,
              timestamp: Date.now(),
              moodIndicator: `💬 ${convo.topicAr}`,
              options: convo.options,
            });
            proceduralAudio.playDialoguePop();
            showCarSpeechBubble(convo.promptAr, '🗣️');
            onPassengerUpdate({ ...passenger }, 'onboard');
          }
        }
      }

      // 7. Passenger Mission Lifecycle (Pickup / Dropoff)
      if (passenger) {
        if (missionStatusRef.current === 'searching') {
          const distToPickup = Math.hypot(posX - (passenger.pickupPos.x - 2), posZ - passenger.pickupPos.z);
          streetNodes.pickupBeaconLight.intensity = 2 + Math.sin(now * 0.006) * 1.5;

          if (distToPickup < 4.2 && Math.abs(speed) < 2.0) {
            // Passenger boarded!
            missionStatusRef.current = 'onboard';
            streetNodes.passengerFigure.visible = false;
            streetNodes.pickupZoneMesh.visible = false;
            streetNodes.pickupBeaconLight.intensity = 0;
            streetNodes.dropoffZoneMesh.visible = true;
            streetNodes.dropoffBeaconLight.intensity = 3;

            proceduralAudio.playMeterBeep();
            currentTaxiState.meterHired = true;
            currentTaxiState.currentFare = passenger.fareEstimate;

            // Show initial greeting
            showCarSpeechBubble(passenger.greetingAr, passenger.dialectFlag);
            onPassengerUpdate(passenger, 'onboard');
          }
        } else if (missionStatusRef.current === 'onboard') {
          streetNodes.dropoffBeaconLight.intensity = 2 + Math.sin(now * 0.006) * 1.5;
          const distToDropoff = Math.hypot(posX - (passenger.dropoffPos.x + 2), posZ - passenger.dropoffPos.z);

          const kmDrivenThisFrame = (Math.abs(speed) * dt) / 1000;
          currentTaxiState.meterDistanceKm += kmDrivenThisFrame;

          // Approaching destination observation
          if (distToDropoff < 35 && !destinationCommentTriggered) {
            destinationCommentTriggered = true;
            const corpus = ARABIC_PASSENGER_DATA[passenger.dialect];
            const destComments = corpus.destinationComments[passenger.destinationName];
            const comment =
              destComments && destComments.length > 0
                ? destComments[Math.floor(Math.random() * destComments.length)]
                : 'قربنا نوصل يا كابتن، عاشت إيدك على التوصيلة!';
            triggerPassengerReaction(comment, 8, 'pop', '📍 اقتراب من الوجهة');
          }

          if (distToDropoff < 4.8 && Math.abs(speed) < 2.0) {
            // Arrived at destination!
            missionStatusRef.current = 'dropped';

            // Satisfaction scales final tip
            const satMultiplier = passenger.satisfaction >= 85 ? 1.35 : passenger.satisfaction >= 65 ? 1.15 : 1.0;
            const tip = Math.round(passenger.fareEstimate * (passenger.tipMultiplier * satMultiplier - 1));
            const totalTripEarned = Math.max(passenger.fareEstimate, passenger.fareEstimate + tip);

            currentTaxiState.totalEarnings += totalTripEarned;
            currentTaxiState.tripsCompleted += 1;
            currentTaxiState.meterHired = false;
            currentTaxiState.totalSatisfiedPassengers += passenger.satisfaction >= 70 ? 1 : 0;

            // Rating adjustment based on passenger satisfaction
            const tripRating = passenger.satisfaction >= 80 ? 5.0 : passenger.satisfaction >= 60 ? 4.0 : 3.0;
            currentTaxiState.customerRating = Number(
              ((currentTaxiState.customerRating * (currentTaxiState.tripsCompleted - 1) + tripRating) /
                currentTaxiState.tripsCompleted).toFixed(1)
            );

            proceduralAudio.playPaymentSound();
            confetti({
              particleCount: passenger.satisfaction > 75 ? 75 : 35,
              spread: 70,
              origin: { y: 0.6 },
            });

            onPassengerUpdate(passenger, 'dropped');

            // Reset flags and spawn next passenger
            setTimeout(() => {
              destinationCommentTriggered = false;
              rideTimeOnboard = 0;
              nextRequestTimer = 8;
              nextConversationTimer = 14;

              const nextPass = generateRealisticPassenger(
                cityRef.current,
                posZ,
                selectedDialectRef.current
              );
              currentPassengerRef.current = nextPass;
              missionStatusRef.current = 'searching';

              streetNodes.passengerFigure.position.set(nextPass.pickupPos.x, 0.15, nextPass.pickupPos.z);
              streetNodes.passengerFigure.visible = true;

              streetNodes.pickupZoneMesh.position.set(nextPass.pickupPos.x - 2, 0.2, nextPass.pickupPos.z);
              streetNodes.pickupZoneMesh.visible = true;
              streetNodes.pickupBeaconLight.position.set(nextPass.pickupPos.x - 2, 2.5, nextPass.pickupPos.z);

              streetNodes.dropoffZoneMesh.position.set(nextPass.dropoffPos.x + 2, 0.2, nextPass.dropoffPos.z);
              streetNodes.dropoffZoneMesh.visible = false;
              streetNodes.dropoffBeaconLight.position.set(nextPass.dropoffPos.x + 2, 2.5, nextPass.dropoffPos.z);

              onPassengerUpdate(nextPass, 'searching');
            }, 3200);
          }
        }
      }

      // 8. Camera positioning
      const camMode = cameraViewRef.current;
      _forward.set(Math.sin(heading), 0, Math.cos(heading));

      if (camMode === 'cockpit') {
        _camOffset.set(0.42, 1.15, 0.25).applyAxisAngle(THREE.Object3D.DEFAULT_UP, heading);
        camera.position.set(posX + _camOffset.x, _camOffset.y, posZ + _camOffset.z);
        _camTarget.set(posX + _forward.x * 20, 1.1, posZ + _forward.z * 20);
        camera.lookAt(_camTarget);
      } else if (camMode === 'hood') {
        _camOffset.set(0, 0.95, 2.2).applyAxisAngle(THREE.Object3D.DEFAULT_UP, heading);
        camera.position.set(posX + _camOffset.x, _camOffset.y, posZ + _camOffset.z);
        _camTarget.set(posX + _forward.x * 30, 0.8, posZ + _forward.z * 30);
        camera.lookAt(_camTarget);
      } else if (camMode === 'orbit') {
        const orbitAngle = now * 0.0004;
        camera.position.set(posX + Math.cos(orbitAngle) * 12, 5.5, posZ + Math.sin(orbitAngle) * 12);
        camera.lookAt(posX, 1.2, posZ);
      } else {
        const chaseDist = 7.8;
        const chaseHeight = 3.2;
        const targetCamX = posX - _forward.x * chaseDist;
        const targetCamZ = posZ - _forward.z * chaseDist;
        const targetCamY = chaseHeight;

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 6.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 6.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 6.5, dt);

        _camTarget.set(posX + _forward.x * 4, 1.4, posZ + _forward.z * 4);
        camera.lookAt(_camTarget);
      }

      // State report to React UI
      currentTaxiState.speedKmh = Math.abs(speedKmh);
      currentTaxiState.gear = speedKmh < -0.5 ? 'R' : speedKmh > 0.5 ? 'D' : 'N';
      currentTaxiState.steeringAngle = steerAngle;
      currentTaxiState.rpm = 800 + Math.abs(speedKmh) * 55 + (isAccelerating ? 900 : 0);
      currentTaxiState.posX = posX;
      currentTaxiState.posZ = posZ;
      currentTaxiState.heading = heading;
      currentTaxiState.drivingStyle = currentStyle;
      currentTaxiState.acActive = acActiveRef.current;
      if (passenger) {
        currentTaxiState.comfortScore = passenger.satisfaction;
      }
      onStateUpdate({ ...currentTaxiState });

      // Render
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    // Start loop
    if (isSoftwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      pedestrianSystem.dispose();
      proceduralAudio.dispose();
      passengerSpeechSprite.material.dispose();
      passengerSpeechSprite.material.map?.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full relative" />;
};
