import * as THREE from 'three';
import { ARAB_CITIES, ArabCity } from '../../types/game';
import { createLicensePlateTexture, createTaxiRoofSignTexture } from '../../utils/proceduralTextures';

export interface TaxiVehicleNodes {
  group: THREE.Group;
  frontLeftWheel: THREE.Group;
  frontRightWheel: THREE.Group;
  rearLeftWheel: THREE.Group;
  rearRightWheel: THREE.Group;
  steeringWheel: THREE.Mesh;
  prayerBeads: THREE.Group;
  headlights: THREE.SpotLight[];
  taillightMaterial: THREE.MeshStandardMaterial;
  reverseLightMaterial: THREE.MeshStandardMaterial;
  roofSignMaterial: THREE.MeshBasicMaterial;
  bodyMaterial: THREE.MeshStandardMaterial;
  cabinGroup: THREE.Group;
}

/**
 * Creates a high-fidelity, multi-part procedural Arab Taxi vehicle
 * adhering strictly to the Three.js skill guidelines (>12 parts, 3 silhouette scales,
 * varied PBR roughness/metalness, grounded bottom-center pivot).
 */
export function createArabTaxi(city: ArabCity = 'cairo', isHired: boolean = false): TaxiVehicleNodes {
  const taxiGroup = new THREE.Group();
  const config = ARAB_CITIES[city];

  // 1. Materials
  const paintColor = new THREE.Color(config.taxiColors.primary);
  const secondaryColor = new THREE.Color(config.taxiColors.secondary || '#1e293b');

  // Car Body Paint Material (Glossy automotive clearcoat)
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: paintColor,
    roughness: 0.18,
    metalness: 0.65,
    envMapIntensity: 1.2,
  });

  // Secondary paint / roof or accent
  const secondaryMaterial = new THREE.MeshStandardMaterial({
    color: secondaryColor,
    roughness: 0.22,
    metalness: 0.55,
  });

  // Chrome / Metallic trim
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.08,
    metalness: 0.95,
  });

  // Matte black chassis / underbody
  const underbodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.2,
  });

  // Tinted glass
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111c24,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.7,
    transparent: true,
    opacity: 0.85,
    ior: 1.5,
  });

  // Rubber tires
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x222225,
    roughness: 0.9,
    metalness: 0.1,
  });

  // Headlight glass / reflector
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff3d1,
    emissiveIntensity: 0.9,
    roughness: 0.1,
    metalness: 0.8,
  });

  // Taillights
  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0x990000,
    emissive: 0xff0000,
    emissiveIntensity: 0.4,
    roughness: 0.3,
  });

  // Reverse lights
  const reverseLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x000000,
    emissiveIntensity: 0,
    roughness: 0.2,
  });

  // Roof Sign
  const roofSignTex = createTaxiRoofSignTexture(config.taxiColors.roofSignText, isHired);
  const roofSignMaterial = new THREE.MeshBasicMaterial({
    map: roofSignTex,
  });

  // License plate textures
  const plateTex = createLicensePlateTexture(city);
  const plateMaterial = new THREE.MeshStandardMaterial({
    map: plateTex,
    roughness: 0.4,
  });

  // --- Silhouette 1: Primary Silhouette (Main Chassis & Body) ---
  const bodyGroup = new THREE.Group();

  // Lower chassis
  const chassisGeo = new THREE.BoxGeometry(1.9, 0.45, 4.4);
  const chassisMesh = new THREE.Mesh(chassisGeo, underbodyMaterial);
  chassisMesh.position.y = 0.4;
  chassisMesh.castShadow = true;
  chassisMesh.receiveShadow = true;
  bodyGroup.add(chassisMesh);

  // Main lower body shell
  const lowerBodyGeo = new THREE.BoxGeometry(1.92, 0.55, 4.3);
  const lowerBodyMesh = new THREE.Mesh(lowerBodyGeo, bodyMaterial);
  lowerBodyMesh.position.y = 0.65;
  lowerBodyMesh.castShadow = true;
  lowerBodyMesh.receiveShadow = true;
  bodyGroup.add(lowerBodyMesh);

  // Hood taper & bevel
  const hoodGeo = new THREE.BoxGeometry(1.86, 0.18, 1.35);
  const hoodMesh = new THREE.Mesh(hoodGeo, bodyMaterial);
  hoodMesh.position.set(0, 0.82, 1.45);
  hoodMesh.rotation.x = -0.05;
  hoodMesh.castShadow = true;
  bodyGroup.add(hoodMesh);

  // Trunk taper & bevel
  const trunkGeo = new THREE.BoxGeometry(1.86, 0.18, 1.05);
  const trunkMesh = new THREE.Mesh(trunkGeo, bodyMaterial);
  trunkMesh.position.set(0, 0.82, -1.6);
  trunkMesh.rotation.x = 0.04;
  trunkMesh.castShadow = true;
  bodyGroup.add(trunkMesh);

  // Front bumper
  const frontBumperGeo = new THREE.BoxGeometry(1.98, 0.22, 0.3);
  const frontBumperMesh = new THREE.Mesh(frontBumperGeo, secondaryMaterial);
  frontBumperMesh.position.set(0, 0.42, 2.22);
  bodyGroup.add(frontBumperMesh);

  // Rear bumper
  const rearBumperGeo = new THREE.BoxGeometry(1.98, 0.22, 0.3);
  const rearBumperMesh = new THREE.Mesh(rearBumperGeo, secondaryMaterial);
  rearBumperMesh.position.set(0, 0.42, -2.22);
  bodyGroup.add(rearBumperMesh);

  // --- Silhouette 2: Secondary Read (Cabin, Roof, Windows) ---
  const cabinGroup = new THREE.Group();

  // Cabin roof
  const roofGeo = new THREE.BoxGeometry(1.68, 0.56, 2.1);
  const roofMesh = new THREE.Mesh(roofGeo, secondaryMaterial);
  roofMesh.position.set(0, 1.18, -0.15);
  roofMesh.castShadow = true;
  cabinGroup.add(roofMesh);

  // Windshield (Front Glass)
  const windshieldGeo = new THREE.PlaneGeometry(1.6, 0.72);
  const windshieldMesh = new THREE.Mesh(windshieldGeo, glassMaterial);
  windshieldMesh.position.set(0, 1.15, 0.95);
  windshieldMesh.rotation.x = -Math.PI / 3.4;
  cabinGroup.add(windshieldMesh);

  // Rear window
  const rearWindowGeo = new THREE.PlaneGeometry(1.6, 0.65);
  const rearWindowMesh = new THREE.Mesh(rearWindowGeo, glassMaterial);
  rearWindowMesh.position.set(0, 1.16, -1.24);
  rearWindowMesh.rotation.x = Math.PI / 3.2;
  rearWindowMesh.rotation.y = Math.PI;
  cabinGroup.add(rearWindowMesh);

  // Side windows (Left & Right)
  const sideWindowGeo = new THREE.PlaneGeometry(1.95, 0.46);
  const leftWindow = new THREE.Mesh(sideWindowGeo, glassMaterial);
  leftWindow.position.set(0.85, 1.18, -0.15);
  leftWindow.rotation.y = Math.PI / 2;
  cabinGroup.add(leftWindow);

  const rightWindow = new THREE.Mesh(sideWindowGeo, glassMaterial);
  rightWindow.position.set(-0.85, 1.18, -0.15);
  rightWindow.rotation.y = -Math.PI / 2;
  cabinGroup.add(rightWindow);

  // Roof Taxi Sign Box
  const roofSignBoxGeo = new THREE.BoxGeometry(0.85, 0.22, 0.32);
  const roofSignBase = new THREE.Mesh(roofSignBoxGeo, chromeMaterial);
  roofSignBase.position.set(0, 1.52, -0.1);
  cabinGroup.add(roofSignBase);

  // Glowing Taxi sign face (Front & Back)
  const signFaceGeo = new THREE.PlaneGeometry(0.8, 0.18);
  const signFaceFront = new THREE.Mesh(signFaceGeo, roofSignMaterial);
  signFaceFront.position.set(0, 1.52, 0.065);
  cabinGroup.add(signFaceFront);

  const signFaceBack = new THREE.Mesh(signFaceGeo, roofSignMaterial);
  signFaceBack.position.set(0, 1.52, -0.265);
  signFaceBack.rotation.y = Math.PI;
  cabinGroup.add(signFaceBack);

  // Taxi roof sign light bulb inside
  const signLight = new THREE.PointLight(isHired ? 0xef4444 : 0xf59e0b, 1.2, 3);
  signLight.position.set(0, 1.52, -0.1);
  cabinGroup.add(signLight);

  bodyGroup.add(cabinGroup);

  // --- Silhouette 3: Accent Details (Grille, Lights, Mirrors, Interior) ---
  // Front Grille
  const grilleGeo = new THREE.BoxGeometry(1.2, 0.26, 0.08);
  const grilleMesh = new THREE.Mesh(grilleGeo, chromeMaterial);
  grilleMesh.position.set(0, 0.65, 2.18);
  bodyGroup.add(grilleMesh);

  // Headlights
  const headlightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16);
  headlightGeo.rotateX(Math.PI / 2);

  const leftHeadlight = new THREE.Mesh(headlightGeo, headlightMaterial);
  leftHeadlight.position.set(0.72, 0.68, 2.16);
  bodyGroup.add(leftHeadlight);

  const rightHeadlight = new THREE.Mesh(headlightGeo, headlightMaterial);
  rightHeadlight.position.set(-0.72, 0.68, 2.16);
  bodyGroup.add(rightHeadlight);

  // Spotlight beams onto the road
  const leftSpot = new THREE.SpotLight(0xfff4db, 6.0, 38, Math.PI / 6, 0.35, 1.5);
  leftSpot.position.set(0.72, 0.7, 2.1);
  leftSpot.target.position.set(0.72, 0, 18);
  bodyGroup.add(leftSpot);
  bodyGroup.add(leftSpot.target);

  const rightSpot = new THREE.SpotLight(0xfff4db, 6.0, 38, Math.PI / 6, 0.35, 1.5);
  rightSpot.position.set(-0.72, 0.7, 2.1);
  rightSpot.target.position.set(-0.72, 0, 18);
  bodyGroup.add(rightSpot);
  bodyGroup.add(rightSpot.target);

  // Taillights
  const taillightGeo = new THREE.BoxGeometry(0.28, 0.16, 0.06);
  const leftTaillight = new THREE.Mesh(taillightGeo, taillightMaterial);
  leftTaillight.position.set(0.72, 0.68, -2.16);
  bodyGroup.add(leftTaillight);

  const rightTaillight = new THREE.Mesh(taillightGeo, taillightMaterial);
  rightTaillight.position.set(-0.72, 0.68, -2.16);
  bodyGroup.add(rightTaillight);

  // License plates (Front & Rear)
  const plateGeo = new THREE.PlaneGeometry(0.55, 0.22);
  const frontPlate = new THREE.Mesh(plateGeo, plateMaterial);
  frontPlate.position.set(0, 0.42, 2.38);
  bodyGroup.add(frontPlate);

  const rearPlate = new THREE.Mesh(plateGeo, plateMaterial);
  rearPlate.position.set(0, 0.42, -2.38);
  rearPlate.rotation.y = Math.PI;
  bodyGroup.add(rearPlate);

  // Side mirrors
  const mirrorGeo = new THREE.BoxGeometry(0.18, 0.1, 0.12);
  const leftMirror = new THREE.Mesh(mirrorGeo, secondaryMaterial);
  leftMirror.position.set(1.02, 1.05, 0.65);
  bodyGroup.add(leftMirror);

  const rightMirror = new THREE.Mesh(mirrorGeo, secondaryMaterial);
  rightMirror.position.set(-1.02, 1.05, 0.65);
  bodyGroup.add(rightMirror);

  // Exhaust pipe
  const exhaustGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12);
  exhaustGeo.rotateX(Math.PI / 2);
  const exhaustMesh = new THREE.Mesh(exhaustGeo, chromeMaterial);
  exhaustMesh.position.set(0.55, 0.28, -2.25);
  bodyGroup.add(exhaustMesh);

  // Interior: Steering wheel & Dashboard
  const dashGeo = new THREE.BoxGeometry(1.6, 0.35, 0.5);
  const dashMesh = new THREE.Mesh(dashGeo, underbodyMaterial);
  dashMesh.position.set(0, 0.88, 0.55);
  bodyGroup.add(dashMesh);

  // Steering wheel (Torus + column)
  const steeringGroup = new THREE.Group();
  steeringGroup.position.set(0.42, 0.96, 0.38);
  steeringGroup.rotation.x = -Math.PI / 4;

  const steerWheelGeo = new THREE.TorusGeometry(0.18, 0.025, 8, 24);
  const steerWheelMesh = new THREE.Mesh(steerWheelGeo, underbodyMaterial);
  steeringGroup.add(steerWheelMesh);

  const steerCenterGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 12);
  steerCenterGeo.rotateX(Math.PI / 2);
  const steerCenterMesh = new THREE.Mesh(steerCenterGeo, chromeMaterial);
  steeringGroup.add(steerCenterMesh);
  bodyGroup.add(steeringGroup);

  // Rear-view mirror with dangling prayer beads (سبحة) or dice (Iconic Arab Taxi touch!)
  const mirrorMountGeo = new THREE.BoxGeometry(0.18, 0.06, 0.04);
  const rearViewMirror = new THREE.Mesh(mirrorMountGeo, chromeMaterial);
  rearViewMirror.position.set(0, 1.34, 0.62);
  bodyGroup.add(rearViewMirror);

  const prayerBeads = new THREE.Group();
  prayerBeads.position.set(0, 1.31, 0.62);
  // String of colored glass prayer beads
  const beadMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Emerald green prayer beads
    roughness: 0.2,
    metalness: 0.3,
  });
  const beadGeo = new THREE.SphereGeometry(0.016, 8, 8);
  for (let b = 0; b < 6; b++) {
    const bead = new THREE.Mesh(beadGeo, beadMaterial);
    bead.position.y = -b * 0.024;
    prayerBeads.add(bead);
  }
  bodyGroup.add(prayerBeads);

  // --- Wheel Helper Factory ---
  function buildWheel(): THREE.Group {
    const wheelGroup = new THREE.Group();

    // Rubber Tire with tread
    const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.24, 24);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeo, tireMaterial);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    // Chrome Rim
    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 18);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, chromeMaterial);
    wheelGroup.add(rimMesh);

    // Hub center cap
    const hubGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.27, 12);
    hubGeo.rotateZ(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeo, underbodyMaterial);
    wheelGroup.add(hubMesh);

    return wheelGroup;
  }

  // 4 Wheels
  const frontLeftWheel = buildWheel();
  frontLeftWheel.position.set(0.96, 0.35, 1.35);

  const frontRightWheel = buildWheel();
  frontRightWheel.position.set(-0.96, 0.35, 1.35);

  const rearLeftWheel = buildWheel();
  rearLeftWheel.position.set(0.96, 0.35, -1.35);

  const rearRightWheel = buildWheel();
  rearRightWheel.position.set(-0.96, 0.35, -1.35);

  taxiGroup.add(bodyGroup);
  taxiGroup.add(frontLeftWheel);
  taxiGroup.add(frontRightWheel);
  taxiGroup.add(rearLeftWheel);
  taxiGroup.add(rearRightWheel);

  // Ground contact shadow disc
  const shadowGeo = new THREE.PlaneGeometry(2.3, 4.8);
  const shadowTex = createGroundShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.02;
  taxiGroup.add(shadowMesh);

  return {
    group: taxiGroup,
    frontLeftWheel,
    frontRightWheel,
    rearLeftWheel,
    rearRightWheel,
    steeringWheel: steerWheelMesh,
    prayerBeads,
    headlights: [leftSpot, rightSpot],
    taillightMaterial,
    reverseLightMaterial,
    roofSignMaterial,
    bodyMaterial,
    cabinGroup,
  };
}

/**
 * Creates authentic civilian cars (Sedan, iconic Arab Microbus 'ميكروباص', Pickup truck)
 */
export function createCivilianVehicle(type: 'sedan' | 'microbus' | 'pickup' = 'sedan', colorHex: number = 0x3b82f6): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.25,
    metalness: 0.6,
  });

  const underMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.9,
    metalness: 0.1,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    metalness: 0.9,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.1,
    metalness: 0.9,
  });

  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.9,
  });

  function addWheels(y: number, zFront: number, zRear: number, width: number, radius: number) {
    const wheelGeo = new THREE.CylinderGeometry(radius, radius, 0.22, 16);
    wheelGeo.rotateZ(Math.PI / 2);

    const positions = [
      [width, y, zFront],
      [-width, y, zFront],
      [width, y, zRear],
      [-width, y, zRear],
    ];

    positions.forEach(([x, py, pz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(x, py, pz);
      group.add(w);
    });
  }

  if (type === 'microbus') {
    // Iconic Arab Microbus (ميكروباص - Cairo / Baghdad / Damascus / Casablanca style)
    // Main van body
    const vanBodyGeo = new THREE.BoxGeometry(2.1, 1.45, 4.8);
    const vanBody = new THREE.Mesh(vanBodyGeo, bodyMat);
    vanBody.position.y = 1.15;
    vanBody.castShadow = true;
    group.add(vanBody);

    // Decorative side stripe (red or blue typical for Arab microbuses)
    const stripeGeo = new THREE.BoxGeometry(2.14, 0.18, 4.75);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.y = 0.95;
    group.add(stripeMesh);

    // Windows band
    const winGeo = new THREE.BoxGeometry(2.12, 0.52, 4.2);
    const winMesh = new THREE.Mesh(winGeo, glassMat);
    winMesh.position.set(0, 1.38, -0.2);
    group.add(winMesh);

    // Roof luggage rack (شبكة سقف)
    const rackGeo = new THREE.BoxGeometry(1.8, 0.15, 3.2);
    const rackMesh = new THREE.Mesh(rackGeo, chromeMat);
    rackMesh.position.set(0, 1.95, -0.4);
    group.add(rackMesh);

    addWheels(0.38, 1.5, -1.5, 1.05, 0.38);
  } else if (type === 'pickup') {
    // Arab delivery pickup truck (Toyota Hilux style)
    const cabGeo = new THREE.BoxGeometry(1.9, 0.95, 2.0);
    const cab = new THREE.Mesh(cabGeo, bodyMat);
    cab.position.set(0, 0.95, 0.8);
    cab.castShadow = true;
    group.add(cab);

    // Bed cargo box
    const bedGeo = new THREE.BoxGeometry(1.85, 0.6, 2.2);
    const bed = new THREE.Mesh(bedGeo, bodyMat);
    bed.position.set(0, 0.75, -1.2);
    group.add(bed);

    // Cargo crates
    const crateGeo = new THREE.BoxGeometry(0.7, 0.5, 0.8);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
    const crate1 = new THREE.Mesh(crateGeo, crateMat);
    crate1.position.set(0.35, 1.25, -1.1);
    group.add(crate1);

    addWheels(0.36, 1.3, -1.3, 0.98, 0.36);
  } else {
    // Standard civilian sedan
    const bodyGeo = new THREE.BoxGeometry(1.85, 0.55, 4.2);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    body.castShadow = true;
    group.add(body);

    const cabinGeo = new THREE.BoxGeometry(1.6, 0.55, 2.1);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 1.15, -0.1);
    cabin.castShadow = true;
    group.add(cabin);

    addWheels(0.35, 1.35, -1.35, 0.94, 0.35);
  }

  // Headlights
  const hlGeo = new THREE.BoxGeometry(0.25, 0.15, 0.05);
  const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeedd, emissiveIntensity: 0.8 });
  const hlLeft = new THREE.Mesh(hlGeo, hlMat);
  hlLeft.position.set(0.68, 0.65, 2.15);
  group.add(hlLeft);

  const hlRight = new THREE.Mesh(hlGeo, hlMat);
  hlRight.position.set(-0.68, 0.65, 2.15);
  group.add(hlRight);

  // Taillights
  const tlMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xdd0000, emissiveIntensity: 0.6 });
  const tlLeft = new THREE.Mesh(hlGeo, tlMat);
  tlLeft.position.set(0.68, 0.65, -2.15);
  group.add(tlLeft);

  const tlRight = new THREE.Mesh(hlGeo, tlMat);
  tlRight.position.set(-0.68, 0.65, -2.15);
  group.add(tlRight);

  return group;
}

/**
 * Procedural radial gradient contact shadow
 */
function createGroundShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 128, 10, 64, 128, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.4)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
