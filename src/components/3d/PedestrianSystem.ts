import * as THREE from 'three';

export type PedestrianState = 'walking' | 'idle' | 'startled';

export interface PedestrianAI {
  group: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  head: THREE.Mesh;
  emoteSprite: THREE.Sprite;
  state: PedestrianState;
  speed: number;
  direction: 1 | -1;
  baseX: number;
  walkCycle: number;
  startledTimer: number;
  sidewalkSide: 'left' | 'right';
  exclamationText: string;
}

const ARABIC_STARTLED_PHRASES = [
  'حاسب يا أسطى!',
  'يا ساتر يا رب!',
  'خضيتني بالزامور!',
  'الله يهديك انتبه!',
  'دير بالك يا كابتن!',
  'يا زلمة على مهلك!',
  'شوي شوي في الشارع!',
];

/**
 * Creates an exclamation reaction speech bubble sprite
 */
function createReactionEmoteTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Speech bubble background
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 6;

  // Rounded rectangle
  const x = 10, y = 10, w = 236, h = 90, r = 18;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  // Bubble tail pointing down
  ctx.lineTo(x + w / 2 + 15, y + h);
  ctx.lineTo(x + w / 2, y + h + 22);
  ctx.lineTo(x + w / 2 - 15, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Arabic dialogue text
  ctx.fillStyle = '#991b1b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 28px "Cairo", sans-serif';
  ctx.fillText(text, w / 2 + 10, h / 2 + 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Articulated 3D Pedestrian Model
 */
export function createPedestrian(
  x: number,
  z: number,
  sidewalkSide: 'left' | 'right',
  outfitVariant: number
): PedestrianAI {
  const group = new THREE.Group();
  group.position.set(x, 0.15, z);

  // Clothing color palette (Thobe, Galabeya, Casual streetwear)
  const palettes = [
    { clothes: 0xf8fafc, pants: 0xf8fafc, headwear: 0xdc2626, hasKeffiyeh: true }, // White thobe + Red keffiyeh
    { clothes: 0x1e3a8a, pants: 0x0f172a, headwear: 0x18181b, hasKeffiyeh: false }, // Navy jacket + jeans
    { clothes: 0x78350f, pants: 0x451a03, headwear: 0xfef3c7, hasKeffiyeh: false }, // Brown traditional
    { clothes: 0x065f46, pants: 0x1e293b, headwear: 0xf8fafc, hasKeffiyeh: true }, // Green galabeya
    { clothes: 0xd97706, pants: 0x78350f, headwear: 0x000000, hasKeffiyeh: false }, // Amber modern shirt
  ];

  const style = palettes[outfitVariant % palettes.length];
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
  const clothesMat = new THREE.MeshStandardMaterial({ color: style.clothes, roughness: 0.8 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: style.pants, roughness: 0.8 });

  // 1. Torso
  const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.32);
  const torso = new THREE.Mesh(torsoGeo, clothesMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  group.add(torso);

  // 2. Head
  const headGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.72;
  group.add(head);

  // Headdress (Keffiyeh or Hair)
  if (style.hasKeffiyeh) {
    const keffiyehGeo = new THREE.SphereGeometry(0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const keffiyehMat = new THREE.MeshStandardMaterial({ color: style.headwear, roughness: 0.9 });
    const keffiyeh = new THREE.Mesh(keffiyehGeo, keffiyehMat);
    keffiyeh.position.y = 1.75;
    group.add(keffiyeh);
  } else {
    // Hair
    const hairGeo = new THREE.SphereGeometry(0.19, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.76;
    group.add(hair);
  }

  // 3. Legs
  const legGeo = new THREE.BoxGeometry(0.18, 0.75, 0.2);
  legGeo.translate(0, -0.375, 0); // Pivot at top (hip)

  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(0.15, 0.75, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(-0.15, 0.75, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // 4. Arms
  const armGeo = new THREE.BoxGeometry(0.14, 0.65, 0.16);
  armGeo.translate(0, -0.325, 0); // Pivot at shoulder

  const leftArm = new THREE.Mesh(armGeo, clothesMat);
  leftArm.position.set(0.36, 1.45, 0);
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, clothesMat);
  rightArm.position.set(-0.36, 1.45, 0);
  rightArm.castShadow = true;
  group.add(rightArm);

  // 5. Speech / Reaction Emote Sprite above head
  const phrase = ARABIC_STARTLED_PHRASES[Math.floor(Math.random() * ARABIC_STARTLED_PHRASES.length)];
  const emoteTex = createReactionEmoteTexture(phrase);
  const spriteMat = new THREE.SpriteMaterial({
    map: emoteTex,
    transparent: true,
    opacity: 0, // initially hidden
    depthTest: false,
  });
  const emoteSprite = new THREE.Sprite(spriteMat);
  emoteSprite.position.set(0, 2.5, 0);
  emoteSprite.scale.set(2.2, 1.1, 1);
  group.add(emoteSprite);

  return {
    group,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    head,
    emoteSprite,
    state: 'walking',
    speed: 1.2 + Math.random() * 0.8,
    direction: Math.random() > 0.5 ? 1 : -1,
    baseX: x,
    walkCycle: Math.random() * Math.PI * 2,
    startledTimer: 0,
    sidewalkSide,
    exclamationText: phrase,
  };
}

/**
 * Pedestrian Population AI System
 */
export class PedestrianSystem {
  public pedestrians: PedestrianAI[] = [];
  public rootGroup: THREE.Group = new THREE.Group();

  constructor(count: number = 16, roadLength: number = 550, roadWidth: number = 24) {
    const sidewalkOffset = roadWidth / 2 + 2.8;

    for (let i = 0; i < count; i++) {
      const isRightSide = i % 2 === 0;
      const x = isRightSide
        ? sidewalkOffset + Math.random() * 2.2
        : -(sidewalkOffset + Math.random() * 2.2);

      const z = -roadLength / 2 + 30 + Math.random() * (roadLength - 60);
      const ped = createPedestrian(x, z, isRightSide ? 'right' : 'left', i);

      // Face direction of travel
      ped.group.rotation.y = ped.direction === 1 ? 0 : Math.PI;

      this.pedestrians.push(ped);
      this.rootGroup.add(ped.group);
    }
  }

  /**
   * Broadcast taxi horn to all pedestrians within radius (e.g. 35 meters)
   */
  public onTaxiHorn(taxiPos: { x: number; z: number }) {
    this.pedestrians.forEach((ped) => {
      const dist = Math.hypot(ped.group.position.x - taxiPos.x, ped.group.position.z - taxiPos.z);
      if (dist < 38) {
        this.triggerStartle(ped);
      }
    });
  }

  /**
   * Trigger startle reaction: jump back toward building wall, wave arms up, show Arabic exclamation
   */
  private triggerStartle(ped: PedestrianAI) {
    if (ped.state === 'startled') return;
    ped.state = 'startled';
    ped.startledTimer = 2.4; // startled for 2.4 seconds

    // Jump back away from the street towards the building facade
    const dodgeDistance = 1.4;
    if (ped.sidewalkSide === 'right') {
      ped.group.position.x = ped.baseX + dodgeDistance;
    } else {
      ped.group.position.x = ped.baseX - dodgeDistance;
    }

    // Arms up in air in panic/surprise
    ped.leftArm.rotation.x = -Math.PI * 0.85;
    ped.rightArm.rotation.x = -Math.PI * 0.85;
    ped.leftArm.rotation.z = 0.4;
    ped.rightArm.rotation.z = -0.4;

    // Show startled speech bubble
    ped.emoteSprite.material.opacity = 1;
  }

  /**
   * Update all pedestrians each frame
   */
  public update(dt: number, taxiPos: { x: number; z: number }, taxiSpeed: number) {
    const dangerDist = 6.5; // Trigger proximity evasion if taxi is too close

    this.pedestrians.forEach((ped) => {
      // 1. Proximity check to player's taxi
      const distToTaxi = Math.hypot(
        ped.group.position.x - taxiPos.x,
        ped.group.position.z - taxiPos.z
      );

      // If taxi gets too close or swerves toward sidewalk, startle the pedestrian
      if (distToTaxi < dangerDist) {
        this.triggerStartle(ped);
      }

      // 2. State-specific behavior
      if (ped.state === 'startled') {
        ped.startledTimer -= dt;

        // Little jump / tremble animation
        ped.group.position.y = 0.15 + Math.sin(ped.startledTimer * 16) * 0.08;

        // Look toward taxi
        const angleToTaxi = Math.atan2(
          taxiPos.x - ped.group.position.x,
          taxiPos.z - ped.group.position.z
        );
        ped.group.rotation.y = angleToTaxi;

        // Fade out speech bubble near end of startled timer
        if (ped.startledTimer < 0.6) {
          ped.emoteSprite.material.opacity = ped.startledTimer / 0.6;
        }

        // Recover back to walking
        if (ped.startledTimer <= 0) {
          ped.state = 'walking';
          ped.emoteSprite.material.opacity = 0;
          ped.group.position.y = 0.15;
          ped.group.position.x = ped.baseX; // return to normal walking lane
          ped.group.rotation.y = ped.direction === 1 ? 0 : Math.PI;
          ped.leftArm.rotation.z = 0;
          ped.rightArm.rotation.z = 0;
        }
      } else {
        // Normal Walking AI
        ped.walkCycle += ped.speed * 4.5 * dt;

        // Move forward along sidewalk
        ped.group.position.z += ped.direction * ped.speed * dt;

        // Leg swing animation
        const legAngle = Math.sin(ped.walkCycle) * 0.55;
        ped.leftLeg.rotation.x = legAngle;
        ped.rightLeg.rotation.x = -legAngle;

        // Arm swing animation (in opposition to legs)
        ped.leftArm.rotation.x = -legAngle * 0.8;
        ped.rightArm.rotation.x = legAngle * 0.8;

        // Subtle vertical bobbing
        ped.group.position.y = 0.15 + Math.abs(Math.sin(ped.walkCycle * 2)) * 0.04;

        // Road wrap bounds
        const roadLimit = 270;
        if (ped.group.position.z > roadLimit) {
          ped.group.position.z = -roadLimit;
        } else if (ped.group.position.z < -roadLimit) {
          ped.group.position.z = roadLimit;
        }
      }
    });
  }

  public dispose() {
    this.pedestrians.forEach((ped) => {
      ped.emoteSprite.material.dispose();
      ped.emoteSprite.material.map?.dispose();
    });
    this.pedestrians = [];
  }
}
