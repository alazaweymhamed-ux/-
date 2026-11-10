import { ARAB_CITIES, ArabCity, DailyObjective } from '../types/game';

/**
 * Generates realistic Daily Objectives tailored to the current Arab city
 */
export function generateDailyObjectives(city: ArabCity): DailyObjective[] {
  const cityConfig = ARAB_CITIES[city];
  const mult = city === 'baghdad' ? 100 : 1; // Iraqi dinar multiplier

  const cityNamesMap: Record<ArabCity, { airport: string; oldQuarter: string }> = {
    cairo: {
      airport: 'مطار القاهرة الدولي',
      oldQuarter: 'شوارع القاهرة القديمة وخان الخليلي',
    },
    baghdad: {
      airport: 'مطار بغداد الدولي',
      oldQuarter: 'شارع الرشيد والمتنبي التراثي',
    },
    riyadh: {
      airport: 'مطار الملك خالد الدولي',
      oldQuarter: 'منطقة قصر الحكم والدرعية',
    },
    casablanca: {
      airport: 'مطار محمد الخامس',
      oldQuarter: 'أزقة المدينة القديمة وباب مراكش',
    },
    dubai: {
      airport: 'مطار دبي الدولي T3',
      oldQuarter: 'منطقة البستكية وخور دبي',
    },
  };

  const localNames = cityNamesMap[city];

  return [
    {
      id: `obj_airport_${city}`,
      titleAr: 'توصيلات المطار الدولية',
      descriptionAr: `أكمل 3 مشاوير لنقل المسافرين إلى ${localNames.airport}`,
      category: 'airport',
      targetValue: 3,
      currentValue: 0,
      isCompleted: false,
      rewardCurrency: 180 * mult,
      rewardXp: 120,
      icon: '✈️',
      claimed: false,
    },
    {
      id: `obj_distance_${city}`,
      titleAr: `جولة ${cityConfig.nameAr}`,
      descriptionAr: `اقطع مسافة 5 كم في ${localNames.oldQuarter}`,
      category: 'distance',
      targetValue: 5, // 5 km
      currentValue: 0,
      isCompleted: false,
      rewardCurrency: 120 * mult,
      rewardXp: 90,
      icon: '🛣️',
      claimed: false,
    },
    {
      id: `obj_night_${city}`,
      titleAr: 'وردية الليل الساهرة',
      descriptionAr: 'أنجز مشوارين بنجاح خلال أجواء الليل وأضواء النيون',
      category: 'night_shift',
      targetValue: 2,
      currentValue: 0,
      isCompleted: false,
      rewardCurrency: 140 * mult,
      rewardXp: 100,
      icon: '🌙',
      claimed: false,
    },
    {
      id: `obj_earnings_${city}`,
      titleAr: 'حصيلة السائق المتميز',
      descriptionAr: `اجمع إجمالي أرباح بقيمة ${Math.round(cityConfig.baseFare * 8)} ${cityConfig.currencySymbol}`,
      category: 'earnings',
      targetValue: Math.round(cityConfig.baseFare * 8),
      currentValue: 0,
      isCompleted: false,
      rewardCurrency: 100 * mult,
      rewardXp: 75,
      icon: '💰',
      claimed: false,
    },
  ];
}
