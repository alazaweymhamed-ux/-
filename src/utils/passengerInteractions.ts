import {
  ARAB_CITIES,
  ArabCity,
  ArabicDialect,
  ARABIC_DIALECTS,
  DialogueMessage,
  DialogueOption,
  DrivingStyleType,
  Passenger,
  PassengerMood,
  PassengerPersona,
  PassengerRequest,
  RequestType,
  TimeOfDay,
} from '../types/game';

/**
 * Authentic Arabic Passenger Dialect Database
 * Includes Egyptian, Iraqi, Saudi/Najdi, Moroccan Darija, Emirati, and Levantine (Shami)
 */

interface DialectCorpus {
  greetings: {
    elderly: string[];
    hurried_worker: string[];
    university_student: string[];
    shopper_family: string[];
    chatty_local: string[];
    tourist: string[];
  };
  reactions: {
    hardBrake: string[];
    recklessSwerve: string[];
    speeding: {
      hurried: string[];
      general: string[];
    };
    curbBump: string[];
    hornSpam: string[];
    smoothDriving: string[];
    trafficJam: string[];
  };
  requests: {
    turnOnAc: { prompt: string; actionLabel: string; fulfilledThanks: string };
    turnOffAc: { prompt: string; actionLabel: string; fulfilledThanks: string };
    changeRadio: { prompt: string; actionLabel: string; fulfilledThanks: string };
    speedUp: { prompt: string; actionLabel: string; fulfilledThanks: string };
    slowDown: { prompt: string; actionLabel: string; fulfilledThanks: string };
  };
  destinationComments: Record<string, string[]>;
  timeOfDayComments: {
    day: string[];
    sunset: string[];
    night: string[];
  };
  conversations: Array<{
    id: string;
    topicAr: string;
    promptAr: string;
    options: DialogueOption[];
  }>;
}

export const ARABIC_PASSENGER_DATA: Record<ArabicDialect, DialectCorpus> = {
  egyptian: {
    greetings: {
      elderly: [
        'السلام عليكم يا بني، ربنا يرزقك بالحلال ويجعله مشوار مبروك.. وديني لو تكرمت',
        'صباحك سكر يا باشا، خذني على مهلك عظمي ما بيتحملش المطبات',
      ],
      hurried_worker: [
        'يا أسطى والنبي طيران عندي اجتماع في الشركة والمدير حيطردني!',
        'يا كابتن بالله عليك بسرعة المترو عطلان ومستعجل جداً!',
      ],
      university_student: [
        'ألو يا أسطى، وديني الجامعة ورايا محاضرة دكتور مفترس!',
        'يا ريس شغلنا الراديو كده على الصبح نعدل المزاج..',
      ],
      shopper_family: [
        'يا أسطى افتح الشنطة الله يخليك معايا كراتين وأكياس خضار تقيلة',
        'السلام عليكم، بس حاسب على الأكياس عشان فيها بيض وفاكهة',
      ],
      chatty_local: [
        'إيه يا هندسة منور الشارع! قولي شفت ماتش الأهلي والزمالك إمبارح؟',
        'يا أسطى البلد زحمة موت اليومين دول.. ربنا يعينكم على السواقة في القاهرة',
      ],
      tourist: [
        'مساء الخير يا فندم، أول مرة أزور القاهرة وديني للمعلم ده لو سمحت',
        'السلام عليكم، قالولي تاكسي القاهرة أصيل وممتع، دلني على المكان الحلو ده',
      ],
    },
    reactions: {
      hardBrake: [
        'أي راسي! حاسب يا أسطى ضربتني بالتابلوه!',
        'يا ساتر يا رب! هو في إيه فرملة مفاجئة ليه كده؟',
        'بالراحة على الفرامات يا عمنا كنا هنطلع من الإزاز!',
      ],
      recklessSwerve: [
        'حاسب يا باشا حنقلب! إنت بتسوق في فورمولا وان؟! ',
        'إيه الغرزة دي يا ريس؟! قلبي وقف والله!',
        'على مهلك يا كابتن ترانا مش في ملاهي دريم بارك!',
      ],
      speeding: {
        hurried: [
          'عاش يا وحش! طيارة والله بس فتح عينك للرادار!',
          'تسلم رجلك يا بطل، كده هنوصل في الميعاد بالظبط!',
        ],
        general: [
          'يا أسطى خفف شوية والنبي مش طايرين ورا الجنازة!',
          'براحة يا عمنا الرادارات هنا ما بترحمش والسرعة خطر!',
        ],
      },
      curbBump: [
        'حاسب الرصيف يا ريس! كواتش التاكسي هيضرب!',
        'يا ساتر! طلعت على الرصيف ليه يا كابتن؟!',
      ],
      hornSpam: [
        'إيه يا أسطى الزامور معلق عندك ولا إيه؟ هدي أعصابك!',
        'الكلاكس هيفرقع في ودانا يا عمنا، وسّع صدرك!',
      ],
      smoothDriving: [
        'ما شاء الله عليك يا أسطى، سواقتك حرير ورايقة تسلم إيدك',
        'أول مرة أركب مع سواق هادي ومحترم كده، ربنا يباركلك في رزقك',
      ],
      trafficJam: [
        'القاهرة دي عمرها ما بتهدى، الزحمة دي مفيش مهرب منها!',
      ],
    },
    requests: {
      turnOnAc: {
        prompt: 'الجو حر نار يا أسطى، ممكن تشغل التكييف الله يباركلك؟',
        actionLabel: 'تشغيل التكييف ❄️',
        fulfilledThanks: 'الله ينور عليك يا برنس! كده المزاج اتعدل 🙏',
      },
      turnOffAc: {
        prompt: 'الجو برد والرياح ضربت صدري، طفي التكييف شوية يا ريس',
        actionLabel: 'إيقاف التكييف 🛑',
        fulfilledThanks: 'تسلم يا غالي، كده الدفا أحسن بكتير',
      },
      changeRadio: {
        prompt: 'يا أسطى ممكن تعلي على الراديو أو تحط لنا أغنية حلوة لأم كلثوم؟',
        actionLabel: 'ضبط الراديو 📻',
        fulfilledThanks: 'يا سيدي على السلطنة! ذوقك عالي والله 🎵',
      },
      speedUp: {
        prompt: 'يا كابتن الوقت بيجري، ادعس بنزين شوية لو الطريق سالك!',
        actionLabel: 'زيادة السرعة ⚡',
        fulfilledThanks: 'عاش يا وحش! إنت سواق معلم بجد',
      },
      slowDown: {
        prompt: 'بالراحة يا أسطى على مهلك، مش مستعجلين خالص',
        actionLabel: 'تهدئة السرعة 🛡️',
        fulfilledThanks: 'تسلم إيدك، في التأني السلامة',
      },
    },
    destinationComments: {
      'ميدان التحرير': ['ميدان التحرير قلب البلد، مفيش أحلى من لفة وسط البلد'],
      'شارع طلعت حرب': ['شارع طلعت حرب وريحة القهاوي ومكتبة مدبولي ذكريات زمان'],
      'كورنيش النيل': ['يا سلام على كورنيش النيل وقت المغرب، الهوا هناك يرد الروح'],
      'شارع المعز': ['المعز لدين الله الفاطمي وأصالة القاهرة التاريخية وعمارة المساجد'],
      'كوبري قصر النيل': ['كوبري قصر النيل وأسوده الشامخة، منظر النيل ساحر الليلة'],
    },
    timeOfDayComments: {
      day: ['صباح الرزق والخير يا أسطى، ربنا يفتحها في وشك اليوم'],
      sunset: ['وقت الغروب في القاهرة له سحر خاص، خصوصاً جنب النيل والمآذن بتأذن'],
      night: ['سهرة القاهرة وسحر لياليها، التاكسي بالليل متعة مفيش زيها'],
    },
    conversations: [
      {
        id: 'cairo_football',
        topicAr: 'ماتش الأهلي والزمالك ⚽',
        promptAr: 'قولي يا أسطى، إنت أهلاوي ولا زملكاوي؟ شفت الجول الأخير إمبارح؟',
        options: [
          {
            id: 'c1_op1',
            textAr: 'أهلاوي صميم طبعاً! البطولات في الجزيرة يا باشا',
            replyAr: 'جدع! نادي القرن ما يتقارنش، فرحت قلبي والله!',
            tone: 'polite',
            effectOnSatisfaction: 15,
            tipBonus: 10,
          },
          {
            id: 'c1_op2',
            textAr: 'زملكاوي مخلص، مدرسة الفن والهندسة والأبيض بخطين حمر!',
            replyAr: 'يا راجل يا فنان! الزمالك عشق لا ينتهي وجمهوره وفيّ جداً',
            tone: 'humorous',
            effectOnSatisfaction: 15,
            tipBonus: 10,
          },
          {
            id: 'c1_op3',
            textAr: 'والله بنشجع اللعبة الحلوة وروح المنافسة الشريفة بين ولاد البلد',
            replyAr: 'عين العقل يا أسطى! أهم حاجة الروح الرياضية',
            tone: 'professional',
            effectOnSatisfaction: 10,
            tipBonus: 5,
          },
        ],
      },
      {
        id: 'cairo_food',
        topicAr: 'أكلة كشري شعبية 🍲',
        promptAr: 'جعان موت يا أسطى! بتعرف محل كشري أصلي ومظبوط قريب من هنا؟',
        options: [
          {
            id: 'c2_op1',
            textAr: 'عليك وعلى كشري أبو طارق أو التحرير، دقة وشطة وصلصة مظبوطة بالمللي!',
            replyAr: 'الله يجبر بخاطرك! ده إنت خبير شوارع بجد',
            tone: 'reassuring',
            effectOnSatisfaction: 12,
            tipBonus: 8,
          },
          {
            id: 'c2_op2',
            textAr: 'في محل شعبي صغير في الحارة دي سري، بس بياخد العقل!',
            replyAr: 'يا سلام على أسرار الأسطوات! هو ده اللي بدور عليه بالظبط',
            tone: 'humorous',
            effectOnSatisfaction: 15,
            tipBonus: 12,
          },
        ],
      },
    ],
  },

  iraqi: {
    greetings: {
      elderly: [
        'السلام عليكم يابه، الله يرزقك ويفتحها بوجهك يا وليدي.. وصلني برحمتك',
        'مرحبا عمي، على كيفك ويانا الطريق مو مسباق والشايب ما يتحمل خضات',
      ],
      hurried_worker: [
        'أخوية الذهب فدوة لعينك استعجل، الدوام رح يبدي والمدير عصبي حيل!',
        'حبيبي أبو التكسي دوسلهة بنزين فدوة، عندي شغلة مستعجلة بالشورجة!',
      ],
      university_student: [
        'هلو عيني أسطى، للجامعة فدوة الك وراية امتحان وميت قهر!',
        'أخوية الغالي شغلنا تسجيل عراقي حلو يوسع الصدر على الصبحية..',
      ],
      shopper_family: [
        'أخوية عيني، افتح الجطة مال السيارة فدوة، مشترين مسواك هواية من الكرادة',
        'سلام عليكم كابتن، حاسب على الغراض بيها كزاز ومواعين',
      ],
      chatty_local: [
        'شلونك أخوية الغالي؟ شلونهة سياقة بغداد وياك اليوم؟ الازدحام مو طبيعي!',
        'يابه منور دجلة وبغداد كلها! صاير الطريق واكف عند الجسور كالعادة؟',
      ],
      tourist: [
        'مرحبا يا أهل النخوة، جاي زيارة لبغداد الحبيبة ودليني على هذا المعلم',
        'سلام عليكم كابتن، سمعت عن كرم أهل العراق ودقة سواقين التكسي!',
      ],
    },
    reactions: {
      hardBrake: [
        'أخ راسي! دير بالك عمي كسرت عظامنا بالبريك!',
        'يا ساتر يا رب! شبيك أخوية دست البريك بقوة وطفرتنا ليغاد؟!',
        'على كيفك فدوة! بعد شوية ونطب بالجامة مالت السيارة!',
      ],
      recklessSwerve: [
        'دير بالك يا معود رح نقلب! هيج لوية سريعة بالشارع؟! ',
        'شنو هاي الهورنات واللويات يا عيني؟ مو طايرين للجنة!',
        'على كيفك ويانا أخوية الغالي، بعدنا شباب ونريد نعيش!',
      ],
      speeding: {
        hurried: [
          'عاشت إيدك يا بطل! طيارة والله هيج سياقة تخبل!',
          'فدوة لرجلك أخوية، هيج نوصل بالوقت التمام!',
        ],
        general: [
          'يابه على كيفك مو طايرين! الكاميرات صايدة والرادار ما يرحم!',
          'اهدى عمي، إحنا بغداد مو بحلبة سباق سيارات!',
        ],
      },
      curbBump: [
        'دير بالك الرصيف عمي! التايرات رح ينفجرن والسيارة خطية!',
        'يا علي! صعدت على الرصيف شبيك يا طيب؟!',
      ],
      hornSpam: [
        'يابه شبيك دايس على الهورن؟ هدي أعصابك وخل بالك مرتاح!',
        'صكعتنا بالزامور عيني، الشارع كله عرف إحنا هنا!',
      ],
      smoothDriving: [
        'عاشت إيدك أخوية، سياقة راقية وهادئة وترد الروح والله',
        'ما شاء الله عليك، سواق محترم ومرتب الله يبارك برزقك وعيالك',
      ],
      trafficJam: [
        'هاية بغداد وزحمتها التخبل، بس دجلة ينسيك كل التعب!',
      ],
    },
    requests: {
      turnOnAc: {
        prompt: 'حبيبي الجو صيف حار نار، شغل التبريد فدوة لعينك برّد علينا',
        actionLabel: 'تشغيل التبريد ❄️',
        fulfilledThanks: 'الله يبرّد عليك دنيا وآخرة يا وردة! عاشت إيدك 🙏',
      },
      turnOffAc: {
        prompt: 'أخوية طفي التبريد شوية الهوا البارد ضرب بلاعيمي',
        actionLabel: 'إطفاء التبريد 🛑',
        fulfilledThanks: 'ممنون منك يا طيب، هسه صار الجو تمام',
      },
      changeRadio: {
        prompt: 'أخوية الغالي ممكن تشغلنا ناظم الغزالي أو سعدون جابر يونسنا؟',
        actionLabel: 'تبديل الراديو 📻',
        fulfilledThanks: 'الله عليك وعلى ذوقك البغدادي الأصيل! طرب أصيل 🎵',
      },
      speedUp: {
        prompt: 'فدوة دوسلهة شوية الطريق فارغ كدامك ومستعجل!',
        actionLabel: 'زيادة السرعة ⚡',
        fulfilledThanks: 'سبع والله وسواق معدل، عاشت إيدك!',
      },
      slowDown: {
        prompt: 'على كيفك يا غالي، الشارع بي مطبات وما مستعجلين',
        actionLabel: 'تهدئة السرعة 🛡️',
        fulfilledThanks: 'تسلم أخوية، في التأني السلامة',
      },
    },
    destinationComments: {
      'شارع الرشيد': ['شارع الرشيد والشناشيل التراثية، عطر بغداد وتاريخها'],
      'ساحة التحرير': ['نصب الحرية العظيم لجواد سليم في ساحة التحرير، فخر العراق'],
      'شارع المتنبي': ['ريحة الكتب وجاي الشابندر بشارع المتنبي، ملتقى الثقافة والأدب'],
      'منطقة الكرادة': ['الكرادة وأسواقها وأهلها الطيبين، أطيب مطاعم كباب وكص هناك'],
      'جسر الصرافية': ['جسر الصرافية الحديدي العريق على دجلة، يا محلى المنظر'],
    },
    timeOfDayComments: {
      day: ['صباح الخير والبركة يا أهل النخوة، الله يوفقك برزقك اليوم'],
      sunset: ['شمس الغروب على دجلة تسحر العيون، ماكو أحلى من بغداد بالعصرية'],
      night: ['سهرات بغداد والشاي العراقي المهيل، ليل بغداد أمان وعافية'],
    },
    conversations: [
      {
        id: 'baghdad_tea',
        topicAr: 'استكان الجاي العراقي ☕',
        promptAr: 'أخوية، وين ألكى أطيب استكان جاي مهيل مخدر على الفحم بهالمنطقة؟',
        options: [
          {
            id: 'b1_op1',
            textAr: 'مقهى الشابندر بالمتنبي أو كهوة المعقدين، جاي معدل يفتح المخ!',
            replyAr: 'أي والله هو هذا الكلام الزين! فدوة لذوقك العراقي الأصيل',
            tone: 'reassuring',
            effectOnSatisfaction: 15,
            tipBonus: 10,
          },
          {
            id: 'b1_op2',
            textAr: 'أقرب كهوة شعبية على شارع الرشيد، الهيل يفحفح من بعيد!',
            replyAr: 'عاشت إيدك كابتن، هسه نروح ونشرب استكان يعدل الراس',
            tone: 'polite',
            effectOnSatisfaction: 12,
            tipBonus: 8,
          },
        ],
      },
    ],
  },

  saudi: {
    greetings: {
      elderly: [
        'السلام عليكم ورحمة الله، حيّاك الله يا ولدي والله يرزقك الرزق الحلال الوفير',
        'مرحبا يا كابتن، على مهلك تراني شايب وتعبان وما فينا حيل رجرجة ومطبات',
      ],
      hurried_worker: [
        'يا كابتن تكفى استعجل، عندي اجتماع بالشركة مع الإدارة ومتأخر ربع ساعة!',
        'تكفى يا رجال ادعس، البصمة بتقفل وراح يخصمون يوم كامل!',
      ],
      university_student: [
        'هلا والله يا كابتن، للجامعة لاهنت اختباري النهائي باقي عليه عشر دقايق!',
        'يا غالي عطنا إذاعة روقان نعدل المزاج مع فنجال قهوة سعودية..',
      ],
      shopper_family: [
        'يا كابتن افتح الشنطة لاهنت، معنا أغراض ومقاضي من المول ثقيلة شوي',
        'السلام عليكم، حاسب لاهنت على الأكياس والمشتريات',
      ],
      chatty_local: [
        'يا هلا والله بالنشامى! كيف الزحمة معك اليوم بطريق الملك فهد؟ الرياض صايرة حريقة!',
        'مرحبا يا كابتن، شفت مباراة الديربي أمس بين الهلال والنصر؟ ولعت!',
      ],
      tourist: [
        'مرحبا يا طيب، جاي زيارة لمدينة الرياض وحاب أشوف أهم معالمها الفخمة',
        'السلام عليكم، أول مرة أركب تاكسي بالرياض وما شاء الله الشوارع تشرح الصدر',
      ],
    },
    reactions: {
      hardBrake: [
        'أي راسي! اهدى يا كابتن الفرامل قوية بغينا نندفع بالزجاج!',
        'لا حول ولا قوة إلا بالله! سلامات يا خوي وش صار فجأة؟!',
        'على مهلك تكفى، رقبتي وجعتني من الفرمطة المفاجئة!',
      ],
      recklessSwerve: [
        'حاسب يا رجال بغينا نقلب! لا تسوي درفت وسواقة طيش بشوارع المدينة!',
        'وش هاللفة الصاروخية يا خوي؟! اهدى بارك الله فيك ترانا بأمانتك!',
        'على هونك يا كابتن، والله قلبي طاح ببطني!',
      ],
      speeding: {
        hurried: [
          'كفو والله يا الذيب! طيارة ما شاء الله بس انتبه من ساهر!',
          'تسلم يمناك يا بطل، كذا بنوصل بالوقت المضبوط وعز الله ما قصرت!',
        ],
        general: [
          'يا كابتن خفف شوي ساهر يرصد السرعة وما ورانا شي يطير!',
          'على هونك يا رجال، السرعة ما وراها إلا الندامة!',
        ],
      },
      curbBump: [
        'انتبه الرصيف يا غالي! جنوط السيارة بتنعدم والكاوتش بيضرب!',
        'يا ساتر! وش طلعك فوق الرصيف يا طيب؟!',
      ],
      hornSpam: [
        'يا كابتن البوري أزعج الشارع كله، وسّع صدرك وخل بالك وسيع!',
        'ما له داعي البوري كل ثانية يا خوي، روق وأنا أخوك!',
      ],
      smoothDriving: [
        'ما شاء الله تبارك الله، سواقتك راكدة وهادية وعز الله إنك محترف',
        'بيض الله وجهك يا كابتن، سواقة مريحة ونفس زكية الله يبارك برزقك',
      ],
      trafficJam: [
        'الرياض مدينة حية وتكبر كل يوم، والزحمة تدل على الخير والتطور!',
      ],
    },
    requests: {
      turnOnAc: {
        prompt: 'يا كابتن حر الرياض يطبخ طبخ، تكفى برّد علينا بالمكيف!',
        actionLabel: 'تشغيل المكيف ❄️',
        fulfilledThanks: 'بيض الله وجهك يا الأمير! الحين نقدر نتنفس براحة 🙏',
      },
      turnOffAc: {
        prompt: 'يا غالي المكيف ثلج علينا وبردنا، قصّر عليه شوي لاهنت',
        actionLabel: 'إيقاف المكيف 🛑',
        fulfilledThanks: 'تسلم يا بعدي، كذا الجو صار معتدل وممتاز',
      },
      changeRadio: {
        prompt: 'يا كابتن لاهنت ودنا بإذاعة القرآن أو شيلة حماسية تعدل الجو',
        actionLabel: 'تغيير الإذاعة 📻',
        fulfilledThanks: 'كفو والله على هالذوق الطيب! يسعد جوك 🎵',
      },
      speedUp: {
        prompt: 'تكفى يا الذيب ادعس شوي الطريق واسع ومفتوح قدامك!',
        actionLabel: 'زيادة السرعة ⚡',
        fulfilledThanks: 'كفو يا كابتن! عز الله إنك ذيب وسواق شاطر',
      },
      slowDown: {
        prompt: 'على هونك يا كابتن، ترى السرعة خطر ومو مستعجلين أبد',
        actionLabel: 'تهدئة السرعة 🛡️',
        fulfilledThanks: 'الله يسلمك، في التأني السلامة وفي العجلة الندامة',
      },
    },
    destinationComments: {
      'طريق الملك فهد': ['طريق الملك فهد شريان الرياض، والأبراج على اليمين واليسار تشرح الصدر'],
      'برج المملكة': ['برج المملكة ومطعمه المعلق، إطلالة الرياض من فوق ساحرة خيال'],
      'حي المربع': ['المربع وقصر المربع التاريخي، أصالة التاريخ وتراث المؤسس'],
      'بوليفارد سيتي': ['البوليفارد وفعاليات موسم الرياض، أجواء عالمية ووناسة ما تنتهي'],
      'شارع العليا': ['شارع العليا وأسواقه الفخمة، قلب التجارة والأناقة بالرياض'],
    },
    timeOfDayComments: {
      day: ['صباح الخير والرزق المبارك، يوم جميل بإذن الله'],
      sunset: ['وقت مغرب الرياض روعة مع نسمة نجد العليلة وأذان المساجد'],
      night: ['ليل الرياض فخم وأضواء الأبراج تتلألأ بالسما، جو ولا أروع'],
    },
    conversations: [
      {
        id: 'riyadh_coffee',
        topicAr: 'القهوة السعودية والقدوع ☕',
        promptAr: 'يا كابتن، مع هالروقان ودنا بفنجال قهوة شقرا مع تمر سكري، وش تنصحنا؟',
        options: [
          {
            id: 's1_op1',
            textAr: 'قهوة نجدية بالزعفران والهيل مع سكري القصيم المكنوز، هذا كيف النشامى!',
            replyAr: 'عز الله إنك قرم وخبير كيف! تسلم يمناك على هالذوق',
            tone: 'reassuring',
            effectOnSatisfaction: 15,
            tipBonus: 12,
          },
          {
            id: 's1_op2',
            textAr: 'في مقهى ومحمص تراثي قريب يضبط الحمسة والمسمار على أصولها!',
            replyAr: 'كفو والله يا الأمير، عطنا وصفه وأنا خوك بنمر عليه',
            tone: 'polite',
            effectOnSatisfaction: 12,
            tipBonus: 8,
          },
        ],
      },
    ],
  },

  moroccan: {
    greetings: {
      elderly: [
        'السلام عليكم أ ولدي، الله يسهل عليك ويرزقك بالحلال، وصلني عافاك بشوية',
        'صباح الخير يا الشاف، سير غير دقة دقة راني كبير ومكنقدش على الزعزيع',
      ],
      hurried_worker: [
        'خويا عافاك سربي شوية عندي اجتماع فالمكتب ومبغيتش نتعطل!',
        'الشاف طلقنا الله يرحم الوالدين، البوص غادي يطيرني من الخدمة!',
      ],
      university_student: [
        'ألو خويا، للجامعة عافاك راه عندي امتحان ومخاصنيش نتأخر!',
        'خويا دير لينا الراديو نتمزكوا شوية ونبدلوا الجو..',
      ],
      shopper_family: [
        'خويا حل لينا الكوفر عافاك، شرينا السخرة من المارشي وثقيلة بزاف',
        'السلام عليكم، حظي مع الخناشي والتقدية عافاك فيها الحوايج د الدار',
      ],
      chatty_local: [
        'أهلا بسي الشيفور! كيدايرة الطريق فكازا اليوم؟ الزحمة خانقة كيف العادة!',
        'مساء الخير خويا، تفرجتي فالديربي بين الوداد والرجاء؟ حماق الشارع!',
      ],
      tourist: [
        'سلام عليكم، جيت نزور الدار البيضاء وسمعت على البيتي طاكسي الحمر الزوين',
        'مرحبا يا خويا، وصلني لهاد البلاصة المشهورة عافاك ونشوفو كازا الزوينة',
      ],
    },
    reactions: {
      hardBrake: [
        'أي راسي! حاسب أ الشاف واش باغي تخرجنا من الزجاج بالفرانات؟!',
        'يا لطيف أ ربي! مالك فراميتي بالجهد هكا؟!',
        'بشوية عليك عافاك، عظامنا تفرتكو بهاد الفراميل الفجائي!',
      ],
      recklessSwerve: [
        'حضي راسك أ خويا غادي نقلبو الطاكسي! واش كتسوق فالكارتينغ؟! ',
        'واش تسطيتي ولا مالك؟ هاد الدورة صعيبة بزاف أ الشاف!',
        'سير بشوية الله يرحم الوالدين، راه باغيين نوصلو سالمين لوليداتنا!',
      ],
      speeding: {
        hurried: [
          'تبارك الله عليك يا النمر! طيارة هادي ولكن حضي مع الرادار!',
          'الله يعطيك الصحة، هكا غادي نوصلو فالوقت نيشان تبارك الله!',
        ],
        general: [
          'خفف السرعة شوية أ خويا، الرادارات هنا راهم كيدقو البخوش!',
          'سير غير دقة دقة، السلامة هي الأولى وما ورانا والو يطير!',
        ],
      },
      curbBump: [
        'حضي مع الطروطوار أ خويا! البنوات غادي يطرطقو والطاكسي مسكين!',
        'وايلي! طلعتي فوق الطروطوار مالك أ الشاف؟!',
      ],
      hornSpam: [
        'مالك مورك على الكلاكصون أ خويا؟ وسع خاطرك الشارع مامرش غير ليك بوحدك!',
        'صدعتينا بالكلاكصون أ الشاف، روق وخدم عقلك!',
      ],
      smoothDriving: [
        'تبارك الله عليك، سياقة نقية ومهدنة الله يحفظك ويوسع عليك فالرزق',
        'أحسن شيفور ركبت معاه فكازا، محترم وسياقتك كتحمق تبارك الله',
      ],
      trafficJam: [
        'هادي كازا البيضاء وديما عامرة وناشطة، الصبر مفتاح الفرج!',
      ],
    },
    requests: {
      turnOnAc: {
        prompt: 'الصهد قهرنا أ الشاف، شعل لينا لاكليم الله يرحم الوالدين برّد علينا',
        actionLabel: 'تشغيل المكيف ❄️',
        fulfilledThanks: 'الله يرحم الوالدين أ خويا! دابا برد علينا القلب 🙏',
      },
      turnOffAc: {
        prompt: 'خويا البرد قصحني بزاف، طفي لاكليم شوية عافاك',
        actionLabel: 'إيقاف المكيف 🛑',
        fulfilledThanks: 'الله يعطيك الخير، دابا مزيان ومريح',
      },
      changeRadio: {
        prompt: 'أ الشاف دير لينا الراديو نتمزكوا بشي شعبي مغربي ولا عبد الوهاب الدكالي',
        actionLabel: 'تغيير الراديو 📻',
        fulfilledThanks: 'يا سلام على النشاط والتفويجة! ذوقك غزال أ خويا 🎵',
      },
      speedUp: {
        prompt: 'خويا زير معانا الموطور شوية الطريق خاوية ومزير فالوقت!',
        actionLabel: 'زيادة السرعة ⚡',
        fulfilledThanks: 'تبارك الله عليك يا الشاف، شيفور حقيقي!',
      },
      slowDown: {
        prompt: 'سير غير بشوية عليك أ خويا، ما زربانينش وخلينا مرتاحين',
        actionLabel: 'تهدئة السرعة 🛡️',
        fulfilledThanks: 'شكراً بزاف، الصبر والمهل كيطيب بيه اللحم والمسائل',
      },
    },
    destinationComments: {
      'شارع محمد الخامس': ['شارع محمد الخامس وقلب المدينة وعمارة الآرت ديكو العريقة'],
      'ساحة الأمم المتحدة': ['ساحة الأمم المتحدة والكرة الأرضية والترامواي الحمر المشهور'],
      'كورنيش عين الذئاب': ['عين الذئاب والمحيط الأطلسي والنسيم د البحر كيرد الروح'],
      'مسجد الحسن الثاني': ['صومعة مسجد الحسن الثاني الشامخة فوق ماء المحيط، فخر المغرب'],
      'المدينة القديمة': ['المدينة القديمة وباب مراكش والصناع التقليديين وسحر الأصالة'],
    },
    timeOfDayComments: {
      day: ['صباح الخير والرباح والرزق الميسر أ خويا'],
      sunset: ['وقت الغروب فكازا مع ريحة البحر كتحمق، ما كاين ما حسن منها'],
      night: ['ليالي كازا الساهرة والضواو شاعلة، أجواء واعرة'],
    },
    conversations: [
      {
        id: 'casa_tea',
        topicAr: 'براد أتاي مغربي مشحر 🫖',
        promptAr: 'خويا فين كاين أحسن مقهى يطيب براد أتاي بالنعناع والشيبة مشحر ومكشكش؟',
        options: [
          {
            id: 'm1_op1',
            textAr: 'قهاوي عين الذئاب أو قبالة البحر، أتاي مشحر مع رزة القاضي والنسيم!',
            replyAr: 'صافي هذا هو الكلام المنعنع! الله يعطيك الصحة أ الشاف',
            tone: 'reassuring',
            effectOnSatisfaction: 15,
            tipBonus: 10,
          },
          {
            id: 'm1_op2',
            textAr: 'مقهى شعبي فالمدينة القديمة، نكهة تقليدية ورزيزة أصيلة!',
            replyAr: 'تبارك الله عليك! هذاك هو الأتاي ديال بصح',
            tone: 'polite',
            effectOnSatisfaction: 12,
            tipBonus: 8,
          },
        ],
      },
    ],
  },

  emirati: {
    greetings: {
      elderly: [
        'مرحبا الساع يا ولدي، ربي يحفظك ويوفقك برزقك.. ودنا للوجهة بهدوء طال عمرك',
        'السلام عليكم يا طيب، شوي شوي علينا ترانا كبار وما نتحمل ركضة الشوارع',
      ],
      hurried_worker: [
        'يا كابتن مستعجلين فديتك، رحلة الطيارة بمطار دبي وباقي وقت قصير!',
        'أخوي الغالي عجل علينا شوي، البصمة والاجتماع بداون تاون بينتهي!',
      ],
      university_student: [
        'هلا والله كابتن، للجامعة لاهنت اختباري الصباحي بدا!',
        'أخوي عطنا راديو ونغم خليجي رايق يوسع الصدر..',
      ],
      shopper_family: [
        'افتح الدبة فديتك، معنا أكياس ومشتريات من دبي مول وما نقدر نشيلها',
        'مرحبا يا كابتن، دير بالك ع الأغراض فيها هدايا وأشياء تنكسر',
      ],
      chatty_local: [
        'حيّاك الله يا خوي! كيف شارع الشيخ زايد اليوم؟ دبي ما تنام ما شاء الله!',
        'يا هلا بالطيب، الأبراج والطرق السريعة كل يوم فيها شي جديد يدهش العالم!',
      ],
      tourist: [
        'مرحبا كابتن، أول مرة أركب تاكسي بدبي ومتحمس أشوف المعالم الفخمة',
        'السلام عليكم، ودنا لأجمل نقطة سياحية وتصوير بالمدينة لو تكرمت',
      ],
    },
    reactions: {
      hardBrake: [
        'أي راسي! اهدى يا كابتن البريك قوي بغينا ندخل بالزجاج!',
        'لا حول ولا قوة إلا بالله! شو يا خوي هالفرملة المفاجئة؟!',
        'على هونك فديتك، رقبتنا تشنجت من الوقفة القوية!',
      ],
      recklessSwerve: [
        'حاسب يا ريال بننقلب! شو هاللفة الحادة بشارع سريع؟! ',
        'وين طاير يا خوي؟ الشارع به قوانين وكاميرات ورادارات!',
        'على مهلك طال عمرك، التأني زين والسلامة هي الغاية!',
      ],
      speeding: {
        hurried: [
          'كفو والله يا الشيخ! سرعة ممتازة بس انتبه للرادار والخطوط!',
          'تسلم يمناك يا بطل، كذا بنوصل بالدقيقة والساعة!',
        ],
        general: [
          'يا كابتن هدي شوي الرادارات ترصد كل متر والغرامة ما تسوى!',
          'على هونك يا ريال، دبي حلوة وودنا نشوف جمالها بهدوء!',
        ],
      },
      curbBump: [
        'انتبه للرصيف يا خوي! التاير والرنجات بتخترب!',
        'يا ساتر! طلعت ع الرصيف ليش يا الحبيب؟!',
      ],
      hornSpam: [
        'يا كابتن الهرن ممنوع بهالشكل، هدي أعصابك وخل بالك مرتاح!',
        'ما له داعي الهرن كل لحظة، الناس فاهمة ومؤدبة بالشارع!',
      ],
      smoothDriving: [
        'ما شاء الله تبارك الرحمن، سواقتك ممتازة وراقية جداً بيض الله ويهك',
        'أشهد إنك دريول محترف وأصيل، ربي يبارك برزقك وصحتك',
      ],
      trafficJam: [
        'هذي دبي مدينة حيوية وعالمية، وكل العالم يزورها بحب!',
      ],
    },
    requests: {
      turnOnAc: {
        prompt: 'يا كابتن رطوبة وحر الصيف قوية، شغل المكيف وبرد علينا فديتك',
        actionLabel: 'تشغيل المكيف ❄️',
        fulfilledThanks: 'بيض الله ويهك طال عمرك! الحين الجو استوى بارد ومرتب 🙏',
      },
      turnOffAc: {
        prompt: 'يا غالي المكيف بارد وايد، قصر عليه شوي لاهنت',
        actionLabel: 'إيقاف المكيف 🛑',
        fulfilledThanks: 'مشكور يا خوي، الحين الحرارة صارت مناسبة',
      },
      changeRadio: {
        prompt: 'يا كابتن عطنا إذاعة القرآن أو أغنية ميحد حمد وأهل الدار',
        actionLabel: 'تغيير الإذاعة 📻',
        fulfilledThanks: 'يا سلام عليك وعلى الذوق الرفيع! تسلم يمناك 🎵',
      },
      speedUp: {
        prompt: 'يا الذيب زيد السرعة شوي الشارع مفتوح وسالك قدامنا!',
        actionLabel: 'زيادة السرعة ⚡',
        fulfilledThanks: 'كفو يا كابتن! سرعة ممتازة وسواقة واثقة',
      },
      slowDown: {
        prompt: 'على مهلك يا الحبيب، ما ورانا شي مستعجل والشارع رايق',
        actionLabel: 'تهدئة السرعة 🛡️',
        fulfilledThanks: 'يزاك الله خير، في التأني السلامة',
      },
    },
    destinationComments: {
      'شارع الشيخ زايد': ['شارع الشيخ زايد وأبراجه الشاهقة وقطار المترو المعلق، منظر خيالي'],
      'ميدان داون تاون': ['داون تاون وبرج خليفة ونافورة دبي الراقصة، قلب العالم الحديث'],
      'ممشى دبي مارينا': ['ممشى المارينا واليخوت الفارهة، الهواء البحري والجمال العصري'],
      'دبي مول': ['دبي مول وأكبر حوض أسماك ووجهة التسوق العالمية الأولى'],
      'شاطئ جميرا': ['شاطئ جميرا وبرج العرب ومياه الخليج الزرقاء الصافية'],
    },
    timeOfDayComments: {
      day: ['صباح التوفيق والرزق الواسع، يوم مشرق على بلاد الخير'],
      sunset: ['غروب دبي وانعكاس الشمس الذهبية على زجاج الأبراج منظر مبهر'],
      night: ['ليل دبي وأضواء الليزر على برج خليفة وشوارعها المتلألئة، ساحرة'],
    },
    conversations: [
      {
        id: 'dubai_karak',
        topicAr: 'كوب شاي كرك ساخن 🧋',
        promptAr: 'يا كابتن، وين أحصل أطيب كوب كرك هيل وزعفران بهالشارع نعدل فيه الراس؟',
        options: [
          {
            id: 'e1_op1',
            textAr: 'كافتيريا شعبية بشارع جميرا أو السطوة، كرك خاثر وسكره موزون بالمللي!',
            replyAr: 'حيّاك الله! هذا هو الكرك الصح اللي يدور عليه البال',
            tone: 'reassuring',
            effectOnSatisfaction: 15,
            tipBonus: 12,
          },
          {
            id: 'e1_op2',
            textAr: 'عندنا استراحة قريبة تضبط جباتي وكرك ساخن على أصوله!',
            replyAr: 'كفو والله، تسلم يا الشيخ الحين بنوقف ناخذ لنا ولكم',
            tone: 'polite',
            effectOnSatisfaction: 12,
            tipBonus: 8,
          },
        ],
      },
    ],
  },

  levantine: {
    greetings: {
      elderly: [
        'يسعد صباحك ومساك يا بني، الله يفتحها بوجهك ويرزقك.. وعلى مهلك ع الدرب',
        'يعطيك العافية يا كابتن، شوي شوي الله يخليك عظامي ما بتحمل مطبات وهزات',
      ],
      hurried_worker: [
        'دخيل عينك يا معلم استعجل، عندي موعد وما بدي أتأخر والزحمة خانقة!',
        'يا طيب بالله عليك دعسة بنزين صغيرة، الوقت عم يسرقنا!',
      ],
      university_student: [
        'مرحبا يا معلم، ع الجامعة تكرّم عندي تسليم مشروع ومستعجل!',
        'حبيبنا روقلنا الجو براديو أو فيروزية حلوة على الصبحية..',
      ],
      shopper_family: [
        'يا معلم افتح الباكاج لو سمحت، معنا أغراض ومشتريات تقيلة',
        'يسعد مساك يا كابتن، دير بالك ع الأغراض فيها صحون وزجاج',
      ],
      chatty_local: [
        'يعطيك ألف عافية يا غالي! كيف الشوارع معك اليوم؟ الزحمة عم تاكل النهار!',
        'منور يا معلم! شو هالشوارع الحلوة اليوم؟ الله يقويكم على هالشغل المتعب',
      ],
      tourist: [
        'مرحبا يا أخي، أول مرة بركب تاكسي هون وما شاء الله الاستقبال بيفتح النفس',
        'يسعد مساك، حابب أروح لهاد المكان التراثي ودلني ع الطريق الحلو',
      ],
    },
    reactions: {
      hardBrake: [
        'أي راسي! شو صار يا معلم فرملت فجأة وكنا رح نخبط بالتابلوه!',
        'يا ساتر يا رب! دخيل عينك طول بالك ع الفرامل شوية!',
        'على مهلك يا طيب، والله عظام رقبتي طقت من الوقفة المفاجئة!',
      ],
      recklessSwerve: [
        'حاسب يا معلم رح نقلب! شو هالكوع السريع هاد؟!',
        'طول بالك يا غالي، مو عم نتسابق مع الريح ترانا بأمانتك!',
        'على مهلك دخيلك، بعدنا حابين نرجع ع بيوتنا سالمين!',
      ],
      speeding: {
        hurried: [
          'يسلمو هالإيدين يا بطل! طيارة ما شاء الله وعيني عليك باردة!',
          'كفو يا معلم، هيك منوصل ع الوقت بالتمام وما منتأخر!',
        ],
        general: [
          'روق يا كابتن شوي شوي، الرادارات شغالة وما ورانا طيارة طايرة!',
          'على مهلك يا طيب، في التأني السلامة وفي العجلة الندامة!',
        ],
      },
      curbBump: [
        'انتبه ع الرصيف يا معلم! الدواليب بتنخزق والسيارة خطي حرام!',
        'يا ساتر! شو طلعك ع الرصيف يا طيب؟!',
      ],
      hornSpam: [
        'يا معلم الزمور وجعلنا راسنا، وسّع صدرك وطول بالك ع العالم!',
        'ما في داعي للزمور كل ثانية يا طيب، روق وخل قلبك أبيض!',
      ],
      smoothDriving: [
        'ما شاء الله عليك، سياقتك رايقة وكلاس وبتشرح القلب تسلم إيديك',
        'أول مرة بركب مع شوفير بهالهدوء والذوق، الله يبارك برزقك وعيلتك',
      ],
      trafficJam: [
        'الزحمة بتهد الحيل بس الصبر طيب والرزق على الله!',
      ],
    },
    requests: {
      turnOnAc: {
        prompt: 'الشوَب هلكنا يا معلم، شغّل المكيف برّد علينا دخيل عينك',
        actionLabel: 'تشغيل المكيف ❄️',
        fulfilledThanks: 'الله يبرد عليك دنيا وآخرة يا أصيل! هيك ارتحنا ع الآخر 🙏',
      },
      turnOffAc: {
        prompt: 'يا كابتن الهوا صار بارد ولفحني، طفيلنا المكيف شوي لو تكرمت',
        actionLabel: 'إيقاف المكيف 🛑',
        fulfilledThanks: 'يسلمو إيديك يا غالي، هيك الدفا أحسن بكتير',
      },
      changeRadio: {
        prompt: 'يا معلم حطيلنا فيروز ولا صباح فخري نروق البال ع الدرب',
        actionLabel: 'تغيير الراديو 📻',
        fulfilledThanks: 'يا سلام ع الرواق والسلطنة! ذوقك بيجنن والله 🎵',
      },
      speedUp: {
        prompt: 'يا طيب دوس شوية بنزين الطريق فاضي ومستعجلين كتير!',
        actionLabel: 'زيادة السرعة ⚡',
        fulfilledThanks: 'يسلملي إيدك، عنجد معلم وسواق شاطر!',
      },
      slowDown: {
        prompt: 'على مهلك يا معلم، الطريق فيه كوع ومطبات وما ورانا شي',
        actionLabel: 'تهدئة السرعة 🛡️',
        fulfilledThanks: 'تسلم يا غالي، السلامة أحسن من ألف مشوار سريع',
      },
    },
    destinationComments: {
      'شارع المعز': ['المعز والأزهر والتاريخ العريق، ريحة الياسمين والتراث'],
      'ميدان التحرير': ['وسط البلد والميدان الكبير وروح المدينة الحية'],
      'شارع طلعت حرب': ['شوارع زمان والقهوة والمحلات الأثرية الحلوة'],
      'كورنيش النيل': ['كورنيش النيل ونسمة العصرية، منظر بيسحر العيون'],
      'كوبري قصر النيل': ['الكوبري المشهور والتماثيل الشامخة، متعة المشوار عليه'],
    },
    timeOfDayComments: {
      day: ['صباح الخير والرزق، الله يفتحلك أبواب الخير يا طيب'],
      sunset: ['وقت الغروب سبحان الخالق، نسمة عليلة بترد الروح'],
      night: ['سهرات الشوارع وأضواء المدينة، مشوار الليل بالتاكسي متعة'],
    },
    conversations: [
      {
        id: 'levant_music',
        topicAr: 'صوت فيروز على الصبح ☕',
        promptAr: 'يا معلم، شو رأيك بفيروز مع الصبح؟ صوتها لحاله بغير مزاج اليوم كله، صح؟',
        options: [
          {
            id: 'l1_op1',
            textAr: 'صوت فيروز مع فنجان قهوة الصبح بيغسل الهموم، ما بيبدأ النهار بدونه!',
            replyAr: 'دخيل عينك! هاد الذوق الراقي اللي بيفهم بالأصول',
            tone: 'reassuring',
            effectOnSatisfaction: 15,
            tipBonus: 10,
          },
          {
            id: 'l1_op2',
            textAr: 'يا سيدي طرب زمان وفيروز وصباح فخري ما بيتعوضوا بهالجيل!',
            replyAr: 'يسلم تمك يا معلم! أصيل وابن أصول والله',
            tone: 'polite',
            effectOnSatisfaction: 12,
            tipBonus: 8,
          },
        ],
      },
    ],
  },
};

/**
 * Passenger Archetype Personas
 */
export const PASSENGER_PERSONAS: Record<
  PassengerPersona,
  {
    titleAr: string;
    avatar: string;
    basePatience: number; // seconds
    generosityMultiplier: number;
    speedPreference: 'normal' | 'fast' | 'cautious';
  }
> = {
  elderly: {
    titleAr: 'حاج كبير في السن 👵👴',
    avatar: '👵',
    basePatience: 40,
    generosityMultiplier: 1.4,
    speedPreference: 'cautious',
  },
  hurried_worker: {
    titleAr: 'موظف متأخر ومستعجل 💼⏱️',
    avatar: '👨‍💼',
    basePatience: 20,
    generosityMultiplier: 1.5,
    speedPreference: 'fast',
  },
  university_student: {
    titleAr: 'طالب جامعي 🎓🎧',
    avatar: '🎓',
    basePatience: 35,
    generosityMultiplier: 1.15,
    speedPreference: 'normal',
  },
  shopper_family: {
    titleAr: 'عائلة ومتسوق مع أكياس 🛍️📦',
    avatar: '🧕',
    basePatience: 30,
    generosityMultiplier: 1.3,
    speedPreference: 'cautious',
  },
  chatty_local: {
    titleAr: 'ابن البلد الحكواتي 🗣️☕',
    avatar: '🧔',
    basePatience: 45,
    generosityMultiplier: 1.35,
    speedPreference: 'normal',
  },
  tourist: {
    titleAr: 'سائح زائر 📷🗺️',
    avatar: '👳‍♂️',
    basePatience: 38,
    generosityMultiplier: 1.45,
    speedPreference: 'normal',
  },
};

const PASSENGER_NAMES_BY_DIALECT: Record<ArabicDialect, string[]> = {
  egyptian: [
    'الحاج إبراهيم الشناوي',
    'المهندس أحمد بدوي',
    'أم أحمد وكريم',
    'الأستاذ محمود كمال',
    'الدكتورة سارة شريف',
    'المعلم فتحي الجزار',
    'سلوى ونور',
  ],
  iraqi: [
    'الحاج أبو سنان',
    'الأستاذ حيدر العراقي',
    'المهندسة ريم البغدادي',
    'العم أبو سجاد',
    'أم كرار',
    'الكابتن عمر الفتلاوي',
    'مصطفى وعلي',
  ],
  saudi: [
    'الشيخ أبو خالد التميمي',
    'المهندس فهد الدوسري',
    'أم مشعل العتيبي',
    'سلطان بن عبد العزيز',
    'الدكتورة نورة القحطاني',
    'سعود وفيصل',
    'العم صالح الشمري',
  ],
  moroccan: [
    'الحاج المكي الفاسي',
    'السي يوسف التازي',
    'فاطمة الزهراء وخديجة',
    'أمين المرابط',
    'السيدة لطيفة العلمي',
    'المهندس حمزة الرباطي',
    'طارق وكريم',
  ],
  emirati: [
    'السيد راشد بن محمد',
    'المهندس سلطان الشامسي',
    'أم حمدان الكعبي',
    'مروان بن هزاع',
    'شمسة وميثاء',
    'العم جمعة المزروعي',
    'سالم وذياب',
  ],
  levantine: [
    'العم أبو عمر الدمشقي',
    'المهندس زياد طرابلسي',
    'أم شادي وجنى',
    'الدكتور رامي الحلبي',
    'سمر وليان',
    'الأستاذ باسل الشامي',
    'كريم وتيسير',
  ],
};

/**
 * Maps cities to their natural native dialect
 */
export const CITY_DEFAULT_DIALECT: Record<ArabCity, ArabicDialect> = {
  cairo: 'egyptian',
  baghdad: 'iraqi',
  riyadh: 'saudi',
  casablanca: 'moroccan',
  dubai: 'emirati',
};

/**
 * Generate a new authentic passenger with diverse dialects, personality, and journey
 */
export function generateRealisticPassenger(
  city: ArabCity,
  currentZ: number,
  preferredDialect: ArabicDialect | 'auto' = 'auto'
): Passenger {
  const cityConfig = ARAB_CITIES[city];

  // 1. Determine Dialect: 70% city native dialect, 30% cosmopolitan traveler from another Arab country
  let dialect: ArabicDialect;
  if (preferredDialect !== 'auto') {
    dialect = preferredDialect;
  } else {
    const isLocal = Math.random() < 0.72;
    if (isLocal) {
      dialect = CITY_DEFAULT_DIALECT[city];
    } else {
      const allDialects: ArabicDialect[] = ['egyptian', 'iraqi', 'saudi', 'moroccan', 'emirati', 'levantine'];
      dialect = allDialects[Math.floor(Math.random() * allDialects.length)];
    }
  }

  const dialectInfo = ARABIC_DIALECTS[dialect];
  const dialectCorpus = ARABIC_PASSENGER_DATA[dialect];

  // 2. Persona Archetype
  const personas: PassengerPersona[] = [
    'elderly',
    'hurried_worker',
    'university_student',
    'shopper_family',
    'chatty_local',
    'tourist',
  ];
  const persona = personas[Math.floor(Math.random() * personas.length)];
  const personaMeta = PASSENGER_PERSONAS[persona];

  // 3. Name & Avatar
  const names = PASSENGER_NAMES_BY_DIALECT[dialect];
  const name = names[Math.floor(Math.random() * names.length)];

  // 4. Greeting in exact dialect and persona
  const greetingsList = dialectCorpus.greetings[persona];
  const greetingAr = greetingsList[Math.floor(Math.random() * greetingsList.length)];

  // 5. Destination & Coordinates
  const landmark = cityConfig.landmarks[Math.floor(Math.random() * cityConfig.landmarks.length)];
  const isRightSide = Math.random() > 0.5;
  const pickupZ = currentZ + (Math.random() > 0.5 ? 65 : -65) + (Math.random() * 40 - 20);
  const tripDirection = pickupZ > 0 ? -1 : 1;
  const dropoffDistance = 140 + Math.random() * 120; // 140m to 260m
  const dropoffZ = pickupZ + tripDirection * dropoffDistance;

  const distKm = Number((dropoffDistance / 1000).toFixed(2));
  const fare = Math.round(cityConfig.baseFare + distKm * cityConfig.perKmRate);

  // Initial dialogue history with greeting
  const initialHistory: DialogueMessage[] = [
    {
      id: Math.random().toString(),
      sender: 'passenger',
      textAr: greetingAr,
      timestamp: Date.now(),
      moodIndicator: '👋 مرحب',
    },
  ];

  return {
    id: Math.random().toString(),
    name,
    avatarIcon: personaMeta.avatar,
    dialect,
    dialectNameAr: dialectInfo.nameAr,
    dialectFlag: dialectInfo.flag,
    persona,
    personaTitleAr: personaMeta.titleAr,
    pickupPos: { x: isRightSide ? 14.5 : -14.5, z: pickupZ },
    dropoffPos: { x: isRightSide ? -14.5 : 14.5, z: dropoffZ },
    destinationName: landmark,
    greetingAr,
    fareEstimate: fare,
    distanceKm: distKm,
    tipMultiplier: personaMeta.generosityMultiplier,
    urgency: persona === 'hurried_worker' ? 'rush' : 'normal',
    satisfaction: 92, // Starts high!
    currentMood: 'happy',
    activeRequest: null,
    completedRequestsCount: 0,
    conversationHistory: initialHistory,
  };
}

/**
 * Generates an in-ride passenger request (e.g. AC, Radio, Speed)
 */
export function generatePassengerRequest(
  passenger: Passenger,
  taxiState: { acActive: boolean; speedKmh: number }
): PassengerRequest {
  const corpus = ARABIC_PASSENGER_DATA[passenger.dialect];
  const availableTypes: RequestType[] = [];

  if (!taxiState.acActive) {
    availableTypes.push('ac_toggle');
  }
  availableTypes.push('radio_station');

  if (passenger.persona === 'hurried_worker' && taxiState.speedKmh < 45) {
    availableTypes.push('speed_up');
  } else if (passenger.persona === 'elderly' && taxiState.speedKmh > 55) {
    availableTypes.push('slow_down');
  }

  const chosenType = availableTypes[Math.floor(Math.random() * availableTypes.length)] || 'ac_toggle';

  let promptAr = '';
  let actionLabelAr = '';

  switch (chosenType) {
    case 'ac_toggle':
      if (!taxiState.acActive) {
        promptAr = corpus.requests.turnOnAc.prompt;
        actionLabelAr = corpus.requests.turnOnAc.actionLabel;
      } else {
        promptAr = corpus.requests.turnOffAc.prompt;
        actionLabelAr = corpus.requests.turnOffAc.actionLabel;
      }
      break;
    case 'radio_station':
      promptAr = corpus.requests.changeRadio.prompt;
      actionLabelAr = corpus.requests.changeRadio.actionLabel;
      break;
    case 'speed_up':
      promptAr = corpus.requests.speedUp.prompt;
      actionLabelAr = corpus.requests.speedUp.actionLabel;
      break;
    case 'slow_down':
      promptAr = corpus.requests.slowDown.prompt;
      actionLabelAr = corpus.requests.slowDown.actionLabel;
      break;
    default:
      promptAr = corpus.requests.turnOnAc.prompt;
      actionLabelAr = corpus.requests.turnOnAc.actionLabel;
  }

  return {
    id: Math.random().toString(),
    type: chosenType,
    promptAr,
    timeoutSeconds: 25,
    remainingSeconds: 25,
    rewardTipPercent: 15,
    fulfilled: false,
    expired: false,
    actionLabelAr,
    dialectTag: passenger.dialectFlag,
  };
}

/**
 * Generates an interactive conversation prompt with authentic Arabic driver choices
 */
export function getAvailableConversation(
  passenger: Passenger
): { id: string; topicAr: string; promptAr: string; options: DialogueOption[] } | null {
  const corpus = ARABIC_PASSENGER_DATA[passenger.dialect];
  if (!corpus.conversations || corpus.conversations.length === 0) return null;

  // Pick conversation not yet in history
  const usedTopics = new Set(
    passenger.conversationHistory
      .filter((m) => m.options)
      .map((m) => m.textAr)
  );

  const available = corpus.conversations.filter((c) => !usedTopics.has(c.promptAr));
  if (available.length === 0) {
    return corpus.conversations[Math.floor(Math.random() * corpus.conversations.length)];
  }
  return available[0];
}

/**
 * Calculates updated mood based on satisfaction score
 */
export function getMoodFromSatisfaction(score: number): PassengerMood {
  if (score >= 88) return 'thrilled';
  if (score >= 70) return 'happy';
  if (score >= 50) return 'neutral';
  if (score >= 30) return 'nervous';
  return 'angry';
}
