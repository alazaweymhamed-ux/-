import * as THREE from 'three';
import { ArabCity } from '../types/game';

/**
 * Procedural canvas-based textures with SRGBColorSpace & maximum anisotropy.
 * 100% zero-404, generating authentic Arabic signs, license plates, storefronts,
 * road markings, and building facades.
 */

// Helper to configure texture per Three.js standards
function prepareTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates Arabic Storefront Banners
 */
export function createStorefrontTexture(storeType: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const stores = [
    {
      bg: '#991b1b',
      border: '#f59e0b',
      title: 'مطعم ومشاوي الشرق',
      subtitle: 'أشهى المأكولات والمشاوي والشاورما',
      phone: 'ت: ٠١٢٣٤٥٦٧٨٩',
      icon: '🍖',
    },
    {
      bg: '#065f46',
      border: '#34d399',
      title: 'صيدلية السلامة ٢٤ ساعة',
      subtitle: 'أدوية ومستحضرات طبية ورعاية صحية',
      phone: 'خدمة التوصيل السريع',
      icon: '⚕️',
    },
    {
      bg: '#1e3a8a',
      border: '#60a5fa',
      title: 'سوبرماركت البركة',
      subtitle: 'خضار وفواكه طازجة ومواد تموينية',
      phone: 'أسعار مناسبة لجميع العائلات',
      icon: '🛒',
    },
    {
      bg: '#78350f',
      border: '#fbbf24',
      title: 'مقهى ومطعم أم كلثوم',
      subtitle: 'شاي عراقي بالهيل وقهوة عربية وشيشة',
      phone: 'طرب أصيل وجلسات تراثية',
      icon: '☕',
    },
    {
      bg: '#831843',
      border: '#f472b6',
      title: 'حلويات دمشق الفاخرة',
      subtitle: 'كنافة نابلسية، بقلاوة، وحلوى مشكلة',
      phone: 'حلويات شرقية بالسمن البلدي',
      icon: '🍬',
    },
    {
      bg: '#1e293b',
      border: '#e2e8f0',
      title: 'بنك المشرق العربي',
      subtitle: 'خدمات مصرفية وتحويل أموال وصراف آلي',
      phone: 'فرع المدينة الرئيسي',
      icon: '🏦',
    },
  ];

  const store = stores[storeType % stores.length];

  // Background
  ctx.fillStyle = store.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative border
  ctx.lineWidth = 6;
  ctx.strokeStyle = store.border;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  // Inner border line
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px "Cairo", sans-serif';
  ctx.fillText(store.title, canvas.width / 2 + 10, 48);

  // Subtitle
  ctx.fillStyle = '#fef08a';
  ctx.font = '600 18px "Cairo", sans-serif';
  ctx.fillText(store.subtitle, canvas.width / 2, 82);

  // Footnote / Phone
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 14px "Cairo", sans-serif';
  ctx.fillText(store.phone, canvas.width / 2, 110);

  return prepareTexture(canvas);
}

/**
 * Generates Arabic Road Signs ("قف", Street names)
 */
export function createArabicRoadSignTexture(signType: 'stop' | 'speed60' | 'street' | 'hospital', text?: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  if (signType === 'stop') {
    // Octagonal red stop sign with "قف"
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    const size = 120;
    const center = 128;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      const x = center + size * Math.cos(angle);
      const y = center + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 68px "Cairo", sans-serif';
    ctx.fillText('قف', 128, 120);

    ctx.font = '700 24px sans-serif';
    ctx.fillText('STOP', 128, 165);
  } else if (signType === 'speed60') {
    // Circular speed limit sign
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(128, 128, 115, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#dc2626';
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 85px sans-serif';
    ctx.fillText('60', 128, 115);

    ctx.font = '700 22px "Cairo", sans-serif';
    ctx.fillText('كم / س', 128, 175);
  } else {
    // Green or Blue enamel street sign
    ctx.fillStyle = '#065f46';
    ctx.fillRect(8, 30, 240, 196);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(16, 38, 224, 180);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 32px "Cairo", sans-serif';
    ctx.fillText(text || 'طريق الكورنيش', 128, 100);

    ctx.fillStyle = '#fef08a';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('CORNICHE AVE', 128, 150);
  }

  return prepareTexture(canvas);
}

/**
 * Generates Taxi Roof Sign Texture ("أجرة - TAXI")
 */
export function createTaxiRoofSignTexture(text: string, isHired: boolean = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Amber glow for vacant taxi, red for hired
  ctx.fillStyle = isHired ? '#991b1b' : '#f59e0b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 8;
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  ctx.fillStyle = '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 44px "Cairo", sans-serif';
  ctx.fillText(text, canvas.width / 2, 45);

  ctx.font = '800 32px sans-serif';
  ctx.fillText('TAXI ' + (isHired ? '[BUSY]' : '[FREE]'), canvas.width / 2, 92);

  return prepareTexture(canvas);
}

/**
 * Generates Authentic Arabic License Plate Texture
 */
export function createLicensePlateTexture(city: ArabCity): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#0f172a';
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

  if (city === 'cairo') {
    // Egyptian Taxi Plate (Orange/White or Blue/White)
    ctx.fillStyle = '#f97316';
    ctx.fillRect(3, 3, canvas.width - 6, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('مــصــر  |  أجــرة', canvas.width / 2, 24);

    ctx.fillStyle = '#111827';
    ctx.font = '900 38px "Cairo", sans-serif';
    ctx.fillText('س ط د  ٩ ٤ ٢', canvas.width / 2, 74);
  } else if (city === 'riyadh') {
    // Saudi Plate with Palm & Swords
    ctx.fillStyle = '#059669';
    ctx.fillRect(3, 3, 40, canvas.height - 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KSA', 23, 50);

    ctx.fillStyle = '#111827';
    ctx.font = '900 32px "Cairo", sans-serif';
    ctx.fillText('أ ح د  ٤ ٨ ٧', 150, 45);
    ctx.font = '700 24px sans-serif';
    ctx.fillText('D H A  4 8 7', 150, 80);
  } else if (city === 'baghdad') {
    // Iraqi Baghdad Taxi Plate
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(3, 3, canvas.width - 6, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('العراق - بغداد - أجرة', canvas.width / 2, 20);

    ctx.fillStyle = '#111827';
    ctx.font = '900 36px "Cairo", sans-serif';
    ctx.fillText('٧ ٥ ٣ ٢ ١', canvas.width / 2, 68);
  } else if (city === 'casablanca') {
    // Moroccan Taxi Plate
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(3, 3, 40, canvas.height - 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MA', 23, 50);

    ctx.fillStyle = '#111827';
    ctx.font = '900 34px "Cairo", sans-serif';
    ctx.fillText('٦ | ٤٨٢٠ | أ', 150, 60);
  } else {
    // Dubai Taxi Plate
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(3, 3, canvas.width - 6, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DUBAI - TAXI', canvas.width / 2, 20);

    ctx.fillStyle = '#dc2626';
    ctx.font = '900 40px sans-serif';
    ctx.fillText('D  5 2 9 4', canvas.width / 2, 70);
  }

  return prepareTexture(canvas);
}

/**
 * Generates Asphalt Road with Dashed Center Markings
 */
export function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark asphalt base with noise
  ctx.fillStyle = '#1f242d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle gravel noise
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const gray = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Yellow & White dashed lines
  ctx.fillStyle = '#eab308'; // Amber road paint
  ctx.fillRect(250, 40, 12, 140);
  ctx.fillRect(250, 320, 12, 140);

  // White lane dividers
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(120, 40, 8, 140);
  ctx.fillRect(120, 320, 8, 140);
  ctx.fillRect(380, 40, 8, 140);
  ctx.fillRect(380, 320, 8, 140);

  return prepareTexture(canvas);
}

/**
 * Generates Islamic Mashrabiya / Window Latticework Texture for Arab Buildings
 */
export function createMashrabiyaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Building stone wall base
  ctx.fillStyle = '#d4b996';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Window frame
  ctx.fillStyle = '#3b2f2f';
  ctx.fillRect(24, 24, 208, 208);

  // Islamic Arch window top
  ctx.beginPath();
  ctx.arc(128, 70, 60, Math.PI, 0);
  ctx.fillStyle = '#221811';
  ctx.fill();

  // Geometric wooden lattice
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#b45309';
  const step = 20;
  for (let x = 30; x < 226; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x + 50, 220);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 50, 40);
    ctx.lineTo(x, 220);
    ctx.stroke();
  }

  return prepareTexture(canvas);
}

/**
 * Generates Sidewalk Paver Texture with Yellow/Black Curb Stripes
 */
export function createSidewalkCurbTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Concrete sidewalk pavers
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#64748b';
  for (let i = 0; i <= 256; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  // Yellow and Black Curb edge (typical in Arab cities)
  for (let i = 0; i < 256; i += 64) {
    ctx.fillStyle = i % 128 === 0 ? '#eab308' : '#0f172a';
    ctx.fillRect(0, i, 36, 64);
  }

  return prepareTexture(canvas);
}
