export type ArabCity = 'cairo' | 'baghdad' | 'riyadh' | 'casablanca' | 'dubai';

export interface CityConfig {
  id: ArabCity;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  currencyAr: string;
  currencySymbol: string;
  baseFare: number;
  perKmRate: number;
  plateRegionAr: string;
  taxiColors: {
    primary: string; // Hex color for car paint
    secondary?: string; // Roof or lower band color
    roofSignText: string;
  };
  landmarks: string[];
  descriptionAr: string;
}

export const ARAB_CITIES: Record<ArabCity, CityConfig> = {
  cairo: {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    countryAr: 'مصر 🇪🇬',
    currencyAr: 'جنيه مصري',
    currencySymbol: 'ج.م',
    baseFare: 10,
    perKmRate: 4,
    plateRegionAr: 'م ص ر | القاهرة',
    taxiColors: {
      primary: '#ffffff',
      secondary: '#111827', // Black & white / modern Cairo taxi
      roofSignText: 'أجرة - القاهرة',
    },
    landmarks: ['ميدان التحرير', 'شارع طلعت حرب', 'كورنيش النيل', 'شارع المعز', 'كوبري قصر النيل'],
    descriptionAr: 'شوارع المحروسة الحيوية والمقاهي الشعبية وأجواء النيل العريقة',
  },
  baghdad: {
    id: 'baghdad',
    nameAr: 'بغداد',
    nameEn: 'Baghdad',
    countryAr: 'العراق 🇮🇶',
    currencyAr: 'دينار عراقي',
    currencySymbol: 'د.ع',
    baseFare: 2000,
    perKmRate: 1000,
    plateRegionAr: 'العراق | بغداد',
    taxiColors: {
      primary: '#f59e0b', // Yellow taxi
      secondary: '#ea580c', // Orange stripe
      roofSignText: 'أجرة بغداد',
    },
    landmarks: ['شارع الرشيد', 'ساحة التحرير', 'شارع المتنبي', 'منطقة الكرادة', 'جسر الصرافية'],
    descriptionAr: 'عراقة دجلة وشوارع بغداد التراثية مع الشاي العراقي المهيل',
  },
  riyadh: {
    id: 'riyadh',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    countryAr: 'السعودية 🇸🇦',
    currencyAr: 'ريال سعودي',
    currencySymbol: 'ر.س',
    baseFare: 15,
    perKmRate: 5,
    plateRegionAr: 'السعودية | الرياض',
    taxiColors: {
      primary: '#ffffff',
      secondary: '#059669', // Modern green accent
      roofSignText: 'أجرة الرياض - TAXI',
    },
    landmarks: ['طريق الملك فهد', 'برج المملكة', 'حي المربع', 'بوليفارد سيتي', 'شارع العليا'],
    descriptionAr: 'أبراج شاهقة وطرق سريعة واسعة مع النخيل وأصالة نجد الحديثة',
  },
  casablanca: {
    id: 'casablanca',
    nameAr: 'الدار البيضاء',
    nameEn: 'Casablanca',
    countryAr: 'المغرب 🇲🇦',
    currencyAr: 'درهم مغربي',
    currencySymbol: 'د.م',
    baseFare: 8,
    perKmRate: 3.5,
    plateRegionAr: 'المغرب | كازا',
    taxiColors: {
      primary: '#dc2626', // Iconic red "Petit Taxi"
      secondary: '#ffffff',
      roofSignText: 'PETIT TAXI كازا',
    },
    landmarks: ['شارع محمد الخامس', 'ساحة الأمم المتحدة', 'كورنيش عين الذئاب', 'مسجد الحسن الثاني', 'المدينة القديمة'],
    descriptionAr: 'سحر البيتي تاكسي الأحمر وأزقة المدينة البيضاء ونسيم المحيط',
  },
  dubai: {
    id: 'dubai',
    nameAr: 'دبي',
    nameEn: 'Dubai',
    countryAr: 'الإمارات 🇦🇪',
    currencyAr: 'درهم إماراتي',
    currencySymbol: 'د.إ',
    baseFare: 12,
    perKmRate: 4.5,
    plateRegionAr: 'دبي | DUBAI',
    taxiColors: {
      primary: '#f3e8d2', // Cream / Sand gold
      secondary: '#dc2626', // Red roof cab
      roofSignText: 'تاكسي دبي - DUBAI TAXI',
    },
    landmarks: ['شارع الشيخ زايد', 'ميدان داون تاون', 'ممشى دبي مارينا', 'دبي مول', 'شاطئ جميرا'],
    descriptionAr: 'طرق حديثة وأبراج عالمية وبريق العمارة المستقبلية',
  },
};

export type TimeOfDay = 'day' | 'sunset' | 'night';

export type CameraViewMode = 'chase' | 'cockpit' | 'hood' | 'orbit';

export type ArabicDialect = 'egyptian' | 'iraqi' | 'saudi' | 'moroccan' | 'emirati' | 'levantine';

export interface DialectConfig {
  id: ArabicDialect;
  nameAr: string;
  flag: string;
  regionDescriptionAr: string;
}

export const ARABIC_DIALECTS: Record<ArabicDialect, DialectConfig> = {
  egyptian: {
    id: 'egyptian',
    nameAr: 'المصرية',
    flag: '🇪🇬',
    regionDescriptionAr: 'لهجة أهل مصر وأم الدنيا، خفيفة الدم وسريعة البديهة',
  },
  iraqi: {
    id: 'iraqi',
    nameAr: 'العراقية',
    flag: '🇮🇶',
    regionDescriptionAr: 'لهجة بلاد الرافدين، حنين ودفء مع كلمات التقدير والمحبة',
  },
  saudi: {
    id: 'saudi',
    nameAr: 'السعودية والخليجية',
    flag: '🇸🇦',
    regionDescriptionAr: 'لهجة أهل نجد والخليج، أصالة وكرم وعبارات الترحيب والرجولة',
  },
  moroccan: {
    id: 'moroccan',
    nameAr: 'الدارجة المغربية',
    flag: '🇲🇦',
    regionDescriptionAr: 'دارجة المغرب العربي الأصيلة، نغمة فريدة وعبارات تراثية عميقة',
  },
  emirati: {
    id: 'emirati',
    nameAr: 'الإماراتية',
    flag: '🇦🇪',
    regionDescriptionAr: 'لهجة ساحل الخليج والإمارات، نبرة هادئة وكلمات الاحترام واللباقة',
  },
  levantine: {
    id: 'levantine',
    nameAr: 'الشامية',
    flag: '🇸🇾',
    regionDescriptionAr: 'لهجة بلاد الشام العريقة، ذوق ولطافة مع كلمات الدعاء والترحيب',
  },
};

export type PassengerPersona =
  | 'elderly'
  | 'hurried_worker'
  | 'university_student'
  | 'shopper_family'
  | 'chatty_local'
  | 'tourist';

export type PassengerMood = 'thrilled' | 'happy' | 'neutral' | 'nervous' | 'angry';

export type DrivingStyleType = 'smooth' | 'normal' | 'aggressive' | 'erratic';

export type RequestType = 'ac_toggle' | 'radio_station' | 'speed_up' | 'slow_down' | 'scenic_tip';

export interface PassengerRequest {
  id: string;
  type: RequestType;
  promptAr: string;
  targetState?: boolean | number | string;
  timeoutSeconds: number;
  remainingSeconds: number;
  rewardTipPercent: number;
  fulfilled: boolean;
  expired: boolean;
  actionLabelAr: string;
  dialectTag: string;
}

export interface DialogueOption {
  id: string;
  textAr: string;
  replyAr: string;
  tone: 'polite' | 'humorous' | 'reassuring' | 'professional';
  effectOnSatisfaction: number;
  tipBonus: number;
}

export interface DialogueMessage {
  id: string;
  sender: 'passenger' | 'driver';
  textAr: string;
  timestamp: number;
  moodIndicator?: string;
  options?: DialogueOption[];
}

export interface Passenger {
  id: string;
  name: string;
  avatarIcon: string;
  dialect: ArabicDialect;
  dialectNameAr: string;
  dialectFlag: string;
  persona: PassengerPersona;
  personaTitleAr: string;
  pickupPos: { x: number; z: number };
  dropoffPos: { x: number; z: number };
  destinationName: string;
  greetingAr: string;
  fareEstimate: number;
  distanceKm: number;
  tipMultiplier: number;
  urgency: 'normal' | 'rush';
  satisfaction: number; // 0 - 100
  currentMood: PassengerMood;
  activeRequest: PassengerRequest | null;
  completedRequestsCount: number;
  conversationHistory: DialogueMessage[];
  lastReactionText?: string;
  lastReactionTime?: number;
}

export interface DailyObjective {
  id: string;
  titleAr: string;
  descriptionAr: string;
  category: 'trips' | 'distance' | 'earnings' | 'city' | 'night_shift' | 'airport';
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  rewardCurrency: number;
  rewardXp: number;
  icon: string;
  claimed: boolean;
}

export interface TaxiState {
  speedKmh: number;
  rpm: number;
  gear: 'D' | 'R' | 'N' | 'P';
  steeringAngle: number;
  headlightsOn: boolean;
  hazardLightsOn: boolean;
  meterHired: boolean;
  meterDistanceKm: number;
  currentFare: number;
  totalEarnings: number;
  tripsCompleted: number;
  customerRating: number;
  posX: number;
  posZ: number;
  heading: number;
  driverXp: number;
  driverLevel: number;
  acActive: boolean;
  drivingStyle: DrivingStyleType;
  comfortScore: number; // 0-100
  totalSatisfiedPassengers: number;
}

