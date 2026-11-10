import * as THREE from 'three';
import { ArabCity, TimeOfDay } from '../../types/game';
import {
  createArabicRoadSignTexture,
  createAsphaltTexture,
  createMashrabiyaTexture,
  createSidewalkCurbTexture,
  createStorefrontTexture,
} from '../../utils/proceduralTextures';
import { createCivilianVehicle } from './CarModel';

export interface AmbientTrafficCar {
  mesh: THREE.Group;
  speed: number;
  laneX: number;
  direction: 1 | -1;
  length: number;
}

export interface StreetSceneNodes {
  sceneGroup: THREE.Group;
  trafficCars: AmbientTrafficCar[];
  pickupZoneMesh: THREE.Mesh;
  dropoffZoneMesh: THREE.Mesh;
  pickupBeaconLight: THREE.PointLight;
  dropoffBeaconLight: THREE.PointLight;
  passengerFigure: THREE.Group;
  streetLights: THREE.PointLight[];
  skyMesh: THREE.Mesh;
  dirLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
}

/**
 * Builds the realistic Arab street environment with authentic architecture,
 * date palms, Arab road signs, storefronts, mosque minaret, and ambient traffic.
 */
export function buildArabStreetScene(
  city: ArabCity,
  timeOfDay: TimeOfDay,
  roadLength: number = 600,
  roadWidth: number = 24
): StreetSceneNodes {
  const sceneGroup = new THREE.Group();

  // 1. Textures & Materials
  const asphaltTex = createAsphaltTexture();
  asphaltTex.repeat.set(1, roadLength / 16);
  const roadMaterial = new THREE.MeshStandardMaterial({
    map: asphaltTex,
    roughness: 0.85,
    metalness: 0.1,
  });

  const sidewalkTex = createSidewalkCurbTexture();
  sidewalkTex.repeat.set(1, roadLength / 8);
  const sidewalkMaterial = new THREE.MeshStandardMaterial({
    map: sidewalkTex,
    roughness: 0.9,
    metalness: 0.05,
  });

  const curbMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
  });

  const sandMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Warm sand / earth
    roughness: 0.95,
  });

  // 2. Road surface
  const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
  const roadMesh = new THREE.Mesh(roadGeo, roadMaterial);
  roadMesh.rotation.x = -Math.PI / 2;
  roadMesh.receiveShadow = true;
  sceneGroup.add(roadMesh);

  // 3. Central Median (جزيرة وسطية مزينة بالنخيل والأزهار)
  const medianWidth = 3.2;
  const medianGeo = new THREE.BoxGeometry(medianWidth, 0.25, roadLength);
  const medianMesh = new THREE.Mesh(medianGeo, sidewalkMaterial);
  medianMesh.position.set(0, 0.12, 0);
  medianMesh.receiveShadow = true;
  sceneGroup.add(medianMesh);

  // Central grass/soil strip inside median
  const medianSoilGeo = new THREE.BoxGeometry(medianWidth - 0.6, 0.28, roadLength);
  const medianSoil = new THREE.Mesh(medianSoilGeo, sandMaterial);
  medianSoil.position.set(0, 0.14, 0);
  sceneGroup.add(medianSoil);

  // 4. Sidewalks (Left & Right)
  const sidewalkWidth = 6;
  const leftSidewalkGeo = new THREE.BoxGeometry(sidewalkWidth, 0.3, roadLength);
  const leftSidewalk = new THREE.Mesh(leftSidewalkGeo, sidewalkMaterial);
  leftSidewalk.position.set(-(roadWidth / 2 + sidewalkWidth / 2), 0.15, 0);
  leftSidewalk.receiveShadow = true;
  sceneGroup.add(leftSidewalk);

  const rightSidewalk = new THREE.Mesh(leftSidewalkGeo, sidewalkMaterial);
  rightSidewalk.position.set(roadWidth / 2 + sidewalkWidth / 2, 0.15, 0);
  rightSidewalk.receiveShadow = true;
  sceneGroup.add(rightSidewalk);

  // 5. Surrounding Ground / Desert / Pavement extension
  const groundGeo = new THREE.PlaneGeometry(400, roadLength + 200);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xc2a378, // Arab urban sand/pavement color
    roughness: 0.98,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.05;
  groundMesh.receiveShadow = true;
  sceneGroup.add(groundMesh);

  // 6. Realistic Procedural Date Palm Trees (نخيل التمر العربي)
  function createDatePalm(): THREE.Group {
    const palm = new THREE.Group();

    // Trunk with segmented ringed sections
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.9,
    });

    const segments = 9;
    let currY = 0;
    for (let s = 0; s < segments; s++) {
      const radiusBottom = 0.32 - s * 0.015;
      const radiusTop = 0.30 - s * 0.015;
      const height = 0.7;
      const segGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 10);
      const segMesh = new THREE.Mesh(segGeo, trunkMat);
      segMesh.position.y = currY + height / 2;
      // Slight natural curvature
      segMesh.rotation.z = Math.sin(s * 0.5) * 0.04;
      segMesh.castShadow = true;
      palm.add(segMesh);
      currY += height;
    }

    // Dates cluster (عراجين التمر)
    const datesMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
    const datesGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const datesCluster1 = new THREE.Mesh(datesGeo, datesMat);
    datesCluster1.position.set(0.3, currY - 0.2, 0);
    palm.add(datesCluster1);

    const datesCluster2 = new THREE.Mesh(datesGeo, datesMat);
    datesCluster2.position.set(-0.3, currY - 0.2, 0.2);
    palm.add(datesCluster2);

    // Palm fronds (أوراق وخوص النخيل)
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });

    const frondCount = 14;
    for (let f = 0; f < frondCount; f++) {
      const angle = (f / frondCount) * Math.PI * 2;
      const frondGeo = new THREE.ConeGeometry(0.65, 3.2, 4);
      frondGeo.translate(0, 1.6, 0);
      const frondMesh = new THREE.Mesh(frondGeo, leafMat);
      frondMesh.position.set(0, currY, 0);
      frondMesh.rotation.y = angle;
      frondMesh.rotation.x = Math.PI / 3.2 + (f % 2 === 0 ? 0.2 : 0);
      frondMesh.castShadow = true;
      palm.add(frondMesh);
    }

    return palm;
  }

  // Plant palms along the central median
  for (let z = -roadLength / 2 + 25; z < roadLength / 2 - 25; z += 35) {
    const palm = createDatePalm();
    palm.position.set(0, 0.15, z);
    sceneGroup.add(palm);
  }

  // 7. Ornate Arab Street Lamps with street illumination
  const streetLights: THREE.PointLight[] = [];
  const lampPoleMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.3,
    metalness: 0.85,
  });

  const lampLanternMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfef08a,
    emissiveIntensity: timeOfDay === 'night' ? 1.5 : timeOfDay === 'sunset' ? 0.8 : 0.1,
  });

  function createStreetLamp(): THREE.Group {
    const lamp = new THREE.Group();

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.16, 7.5, 12);
    const poleMesh = new THREE.Mesh(poleGeo, lampPoleMat);
    poleMesh.position.y = 3.75;
    lamp.add(poleMesh);

    // Curved arched arms
    const armGeo = new THREE.BoxGeometry(2.4, 0.12, 0.12);
    const armMesh = new THREE.Mesh(armGeo, lampPoleMat);
    armMesh.position.y = 7.4;
    lamp.add(armMesh);

    // Lanterns (Left & Right heads)
    const lanternGeo = new THREE.BoxGeometry(0.4, 0.5, 0.4);
    const lanternLeft = new THREE.Mesh(lanternGeo, lampLanternMat);
    lanternLeft.position.set(1.1, 7.1, 0);
    lamp.add(lanternLeft);

    const lanternRight = new THREE.Mesh(lanternGeo, lampLanternMat);
    lanternRight.position.set(-1.1, 7.1, 0);
    lamp.add(lanternRight);

    // Realistic PointLight pool on roadway
    const light = new THREE.PointLight(
      0xfde047,
      timeOfDay === 'night' ? 2.5 : timeOfDay === 'sunset' ? 1.2 : 0,
      25,
      1.5
    );
    light.position.set(0, 7.2, 0);
    lamp.add(light);
    streetLights.push(light);

    return lamp;
  }

  // Place street lamps along the median
  for (let z = -roadLength / 2 + 42; z < roadLength / 2 - 20; z += 55) {
    const lamp = createStreetLamp();
    lamp.position.set(0, 0.15, z);
    sceneGroup.add(lamp);
  }

  // 8. Authentic Arab Buildings & Storefronts
  const mashrabiyaTex = createMashrabiyaTexture();
  mashrabiyaTex.repeat.set(2, 4);

  const buildingWallMat = new THREE.MeshStandardMaterial({
    map: mashrabiyaTex,
    roughness: 0.9,
    metalness: 0.05,
  });

  const modernTowerMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.85,
  });

  let storeCounter = 0;

  function buildArabBuilding(xPos: number, zPos: number, height: number, width: number, isModern: boolean = false): THREE.Group {
    const bldg = new THREE.Group();
    bldg.position.set(xPos, 0, zPos);

    // Main structure
    const bldgGeo = new THREE.BoxGeometry(width, height, 16);
    const bldgMesh = new THREE.Mesh(bldgGeo, isModern ? modernTowerMat : buildingWallMat);
    bldgMesh.position.y = height / 2;
    bldgMesh.castShadow = true;
    bldgMesh.receiveShadow = true;
    bldg.add(bldgMesh);

    // Balconies with railings
    if (!isModern) {
      const balconyCount = Math.floor(height / 6);
      const balcMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      for (let b = 1; b <= balconyCount; b++) {
        const balcGeo = new THREE.BoxGeometry(width * 0.7, 0.25, 2.2);
        const balc = new THREE.Mesh(balcGeo, balcMat);
        balc.position.set(0, b * 6 - 1.5, xPos > 0 ? -8.5 : 8.5);
        bldg.add(balc);
      }
    }

    // Rooftop details (water tank + satellite dishes - iconic Middle Eastern rooftop silhouette)
    const roofY = height;

    // Water tank (خزان ماء)
    const tankGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.3 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(width * 0.2, roofY + 1.1, 0);
    bldg.add(tank);

    // Satellite dish (طبق ستلايت)
    const dishGeo = new THREE.SphereGeometry(1.1, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2.5);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.7 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = -Math.PI / 4;
    dish.position.set(-width * 0.25, roofY + 1.2, 2);
    bldg.add(dish);

    // Ground floor storefront banner (Facing road)
    const storeTex = createStorefrontTexture(storeCounter++);
    const signMat = new THREE.MeshStandardMaterial({
      map: storeTex,
      roughness: 0.4,
      emissive: 0xffffff,
      emissiveIntensity: timeOfDay === 'night' ? 0.45 : 0.1,
    });
    const signGeo = new THREE.PlaneGeometry(width * 0.85, 2.8);
    const signMesh = new THREE.Mesh(signGeo, signMat);
    // Face the street
    signMesh.position.set(0, 3.8, xPos > 0 ? -8.1 : 8.1);
    if (xPos > 0) {
      signMesh.rotation.y = Math.PI;
    }
    bldg.add(signMesh);

    // Storefront fabric awning (مظلة مقلمة)
    const awningGeo = new THREE.BoxGeometry(width * 0.88, 0.15, 2.4);
    const awningMat = new THREE.MeshStandardMaterial({
      color: storeCounter % 2 === 0 ? 0xb91c1c : 0x047857,
      roughness: 0.8,
    });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.set(0, 4.8, xPos > 0 ? -9.1 : 9.1);
    awning.rotation.x = xPos > 0 ? -0.2 : 0.2;
    bldg.add(awning);

    // Sidewalk Cafe tables and chairs outside cafe stores
    if (storeCounter % 4 === 0) {
      const tableGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 12);
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.set(0, 0.4, xPos > 0 ? -10.5 : 10.5);
      bldg.add(table);
    }

    return bldg;
  }

  // Generate buildings lining both sides of the street
  const bldgWidth = 22;
  const bldgSpacing = 24;
  for (let z = -roadLength / 2 + 20; z < roadLength / 2 - 20; z += bldgSpacing) {
    const isModern = city === 'dubai' || (city === 'riyadh' && Math.random() > 0.4);
    const heightLeft = isModern ? 35 + Math.random() * 45 : 18 + Math.random() * 16;
    const heightRight = isModern ? 35 + Math.random() * 45 : 18 + Math.random() * 16;

    // Left buildings
    const leftBldg = buildArabBuilding(-(roadWidth / 2 + sidewalkWidth + 8), z, heightLeft, bldgWidth, isModern);
    sceneGroup.add(leftBldg);

    // Right buildings
    const rightBldg = buildArabBuilding(roadWidth / 2 + sidewalkWidth + 8, z, heightRight, bldgWidth, isModern);
    sceneGroup.add(rightBldg);
  }

  // 9. Iconic Mosque with Dome & Minaret along the boulevard
  const mosqueGroup = new THREE.Group();
  mosqueGroup.position.set(-(roadWidth / 2 + sidewalkWidth + 24), 0, 50);

  // Mosque Main Hall
  const mosqueBaseGeo = new THREE.BoxGeometry(28, 14, 28);
  const mosqueMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 });
  const mosqueBase = new THREE.Mesh(mosqueBaseGeo, mosqueMat);
  mosqueBase.position.y = 7;
  mosqueBase.castShadow = true;
  mosqueGroup.add(mosqueBase);

  // Golden Dome (قبة المسجد الذهبية)
  const domeGeo = new THREE.SphereGeometry(8.5, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.15,
    metalness: 0.85,
  });
  const domeMesh = new THREE.Mesh(domeGeo, domeMat);
  domeMesh.position.y = 14;
  mosqueGroup.add(domeMesh);

  // Tall Minaret (مئذنة المسجد)
  const minaretGeo = new THREE.CylinderGeometry(1.8, 2.4, 42, 16);
  const minaret = new THREE.Mesh(minaretGeo, mosqueMat);
  minaret.position.set(16, 21, 16);
  minaret.castShadow = true;
  mosqueGroup.add(minaret);

  // Minaret top cone & illuminated crescent (هلال المنارة)
  const topConeGeo = new THREE.ConeGeometry(2.2, 5, 16);
  const topCone = new THREE.Mesh(topConeGeo, domeMat);
  topCone.position.set(16, 44.5, 16);
  mosqueGroup.add(topCone);

  const crescentGeo = new THREE.TorusGeometry(0.7, 0.12, 8, 16, Math.PI * 1.5);
  const crescentMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
  const crescent = new THREE.Mesh(crescentGeo, crescentMat);
  crescent.position.set(16, 47.8, 16);
  crescent.rotation.z = Math.PI / 4;
  mosqueGroup.add(crescent);

  // Minaret green beacon light at night
  const minaretLight = new THREE.PointLight(0x10b981, 2, 40);
  minaretLight.position.set(16, 45, 16);
  mosqueGroup.add(minaretLight);

  sceneGroup.add(mosqueGroup);

  // 10. Arabic Road Signs along the curbs
  function addRoadSign(type: 'stop' | 'speed60' | 'street', x: number, z: number, text?: string) {
    const signTex = createArabicRoadSignTexture(type, text);
    const signGroup = new THREE.Group();
    signGroup.position.set(x, 0, z);

    // Metal pole
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 12);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.6;
    signGroup.add(pole);

    // Sign plate
    const plateGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const plateMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.3 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, 2.6, 0.05);
    if (x > 0) plate.rotation.y = Math.PI;
    signGroup.add(plate);

    sceneGroup.add(signGroup);
  }

  addRoadSign('stop', roadWidth / 2 + 1.2, -60);
  addRoadSign('speed60', -(roadWidth / 2 + 1.2), -120);
  addRoadSign('street', roadWidth / 2 + 1.2, 80, 'شارع الرشيد');
  addRoadSign('street', -(roadWidth / 2 + 1.2), 0, 'طريق الملك فهد');

  // 11. Interactive Passenger Figure & Beacons
  const passengerFigure = createPassengerMesh();
  passengerFigure.position.set(roadWidth / 2 + 2.5, 0.15, 30);
  sceneGroup.add(passengerFigure);

  // Pickup zone halo & beacon column
  const beaconGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.1, 32);
  const pickupMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.6,
  });
  const pickupZoneMesh = new THREE.Mesh(beaconGeo, pickupMat);
  pickupZoneMesh.position.set(roadWidth / 2 + 2.5, 0.2, 30);
  sceneGroup.add(pickupZoneMesh);

  const pickupBeaconLight = new THREE.PointLight(0x10b981, 3, 15);
  pickupBeaconLight.position.set(roadWidth / 2 + 2.5, 2.5, 30);
  sceneGroup.add(pickupBeaconLight);

  // Dropoff zone halo & beacon column
  const dropoffMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.6,
  });
  const dropoffZoneMesh = new THREE.Mesh(beaconGeo, dropoffMat);
  dropoffZoneMesh.position.set(-(roadWidth / 2 + 2.5), 0.2, -180);
  dropoffZoneMesh.visible = false;
  sceneGroup.add(dropoffZoneMesh);

  const dropoffBeaconLight = new THREE.PointLight(0xf59e0b, 0, 15);
  dropoffBeaconLight.position.set(-(roadWidth / 2 + 2.5), 2.5, -180);
  sceneGroup.add(dropoffBeaconLight);

  // 12. Ambient AI Traffic Vehicles
  const trafficCars: AmbientTrafficCar[] = [];
  const trafficConfigs = [
    { type: 'microbus' as const, color: 0xffffff, speed: 28, laneX: 4.8, dir: 1 as const, z: -100 },
    { type: 'sedan' as const, color: 0x3b82f6, speed: 36, laneX: 8.5, dir: 1 as const, z: -40 },
    { type: 'pickup' as const, color: 0xd97706, speed: 30, laneX: 4.8, dir: 1 as const, z: 120 },
    { type: 'microbus' as const, color: 0xffffff, speed: 32, laneX: -4.8, dir: -1 as const, z: 80 },
    { type: 'sedan' as const, color: 0x10b981, speed: 40, laneX: -8.5, dir: -1 as const, z: -150 },
    { type: 'sedan' as const, color: 0xef4444, speed: 35, laneX: -4.8, dir: -1 as const, z: 20 },
  ];

  trafficConfigs.forEach((cfg) => {
    const mesh = createCivilianVehicle(cfg.type, cfg.color);
    mesh.position.set(cfg.laneX, 0, cfg.z);
    if (cfg.dir === -1) {
      mesh.rotation.y = Math.PI;
    }
    sceneGroup.add(mesh);
    trafficCars.push({
      mesh,
      speed: cfg.speed,
      laneX: cfg.laneX,
      direction: cfg.dir,
      length: cfg.type === 'microbus' ? 4.8 : 4.2,
    });
  });

  // 13. Lighting Rig (3-Point studio setup + Sun Directional Light)
  const dirLight = new THREE.DirectionalLight(
    timeOfDay === 'sunset' ? 0xf97316 : timeOfDay === 'night' ? 0x38bdf8 : 0xfffaed,
    timeOfDay === 'sunset' ? 2.8 : timeOfDay === 'night' ? 0.4 : 3.2
  );
  dirLight.position.set(60, 90, 40);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 300;
  dirLight.shadow.camera.left = -60;
  dirLight.shadow.camera.right = 60;
  dirLight.shadow.camera.top = 60;
  dirLight.shadow.camera.bottom = -60;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.normalBias = 0.02;
  sceneGroup.add(dirLight);

  const hemiLight = new THREE.HemisphereLight(
    timeOfDay === 'night' ? 0x0f172a : timeOfDay === 'sunset' ? 0xfdba74 : 0xbae6fd,
    timeOfDay === 'night' ? 0x020617 : timeOfDay === 'sunset' ? 0x78350f : 0x78716c,
    timeOfDay === 'night' ? 0.35 : timeOfDay === 'sunset' ? 1.2 : 1.4
  );
  sceneGroup.add(hemiLight);

  // 14. Horizon Sky & Desert Dome
  const skyGeo = new THREE.SphereGeometry(380, 32, 16);
  const skyMat = new THREE.MeshBasicMaterial({
    color: timeOfDay === 'night' ? 0x090d16 : timeOfDay === 'sunset' ? 0xca8a04 : 0x7dd3fc,
    side: THREE.BackSide,
  });
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  sceneGroup.add(skyMesh);

  return {
    sceneGroup,
    trafficCars,
    pickupZoneMesh,
    dropoffZoneMesh,
    pickupBeaconLight,
    dropoffBeaconLight,
    passengerFigure,
    streetLights,
    skyMesh,
    dirLight,
    hemiLight,
  };
}

/**
 * Creates a procedural 3D human passenger figure (waving on sidewalk in traditional/modern clothes)
 */
function createPassengerMesh(): THREE.Group {
  const pGroup = new THREE.Group();

  // Robe / Body (Thobe / Galabeya / Casual jacket)
  const bodyGeo = new THREE.CylinderGeometry(0.3, 0.45, 1.3, 12);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.95;
  body.castShadow = true;
  pGroup.add(body);

  // Head
  const headGeo = new THREE.SphereGeometry(0.22, 12, 12);
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.75;
  pGroup.add(head);

  // Keffiyeh / Headdress or hair
  const headwearGeo = new THREE.SphereGeometry(0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.8);
  const headwearMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.9 });
  const headwear = new THREE.Mesh(headwearGeo, headwearMat);
  headwear.position.y = 1.78;
  pGroup.add(headwear);

  // Waving Arm (hailing taxi!)
  const armGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.85, 8);
  const armMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
  const arm = new THREE.Mesh(armGeo, armMat);
  arm.position.set(-0.45, 1.5, 0);
  arm.rotation.z = Math.PI / 2.8; // Raised high waving
  arm.rotation.x = -Math.PI / 6;
  pGroup.add(arm);

  // Briefcase / luggage bag
  const bagGeo = new THREE.BoxGeometry(0.2, 0.35, 0.45);
  const bagMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
  const bag = new THREE.Mesh(bagGeo, bagMat);
  bag.position.set(0.48, 0.4, 0);
  pGroup.add(bag);

  return pGroup;
}
