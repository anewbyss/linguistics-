import { P, Q, A, C, M, T } from './helpers.mjs';
import * as more from './arabic-more.mjs';
import * as kitaab from './arabic-kitaab.mjs';

const categories = [
  {
    id: 'ar-greet', title: 'Greetings & Introductions', nativeTitle: 'التحيات والتعارف',
    icon: 'hand.wave', emoji: '👋',
    summary: 'Say hello, ask how people are, and introduce yourself.',
    lessons: [
      {
        id: 'ar-greet-1', title: 'Everyday Greetings', level: 'A1',
        summary: 'Greeting pairs and talking to men vs. women.',
        grammar: {
          title: 'Addressing a man vs. a woman',
          body: [
            "Arabic marks gender in 'you'. Many phrases change their ending depending on who you're talking to: -ka for a man, -ki for a woman.",
            'In everyday speech the endings shorten: kayfa ḥāluk? (to a man) vs. kayfa ḥāluki? (to a woman).',
            "Greetings come in pairs. The reply often mirrors or 'upgrades' the greeting: 'morning of goodness' is answered with 'morning of light'.",
          ],
          table: T(['Greeting', 'Reply', 'Meaning'],
            ['السلام عليكم', 'وعليكم السلام', 'Peace be upon you / And upon you peace'],
            ['صباح الخير', 'صباح النور', 'Good morning (of goodness / of light)'],
            ['مساء الخير', 'مساء النور', 'Good evening'],
            ['كيف حالك؟', 'الحمد لله، بخير', 'How are you? / Thank God, well'],
            ['مرحبا', 'أهلاً / مرحبتين', 'Hello / Hi! (Levantine: "two hellos")']),
        },
        vocab: [
          P('مرحبا', 'marḥaban', 'Hello'),
          P('أهلاً', 'ahlan', 'Hi / welcome'),
          P('السلام عليكم', 'as-salāmu ʿalaykum', 'Peace be upon you (hello)'),
          P('وعليكم السلام', 'wa-ʿalaykum as-salām', 'And upon you peace (reply)'),
          P('صباح الخير', 'ṣabāḥ al-khayr', 'Good morning'),
          P('صباح النور', 'ṣabāḥ an-nūr', 'Good morning (reply)'),
          P('كيف حالك؟', 'kayfa ḥāluk?', 'How are you?'),
          P('بخير، الحمد لله', 'bi-khayr, al-ḥamdu lillāh', "I'm well, thank God"),
          P('مع السلامة', 'maʿa as-salāma', 'Goodbye'),
        ],
        examples: [
          P('مرحبا يا سارة! كيف حالكِ؟', 'marḥaban yā Sāra! kayfa ḥāluki?', 'Hi Sara! How are you?', 'ḥāluki: talking to a woman.'),
          P('صباح الخير يا أستاذ.', 'ṣabāḥ al-khayr yā ustādh.', 'Good morning, sir.', 'Ustādh is a respectful title for men, not only teachers.'),
          P('أنا بخير، شكراً. وأنت؟', 'ana bi-khayr, shukran. wa-anta?', "I'm fine, thanks. And you?"),
        ],
        culture: {
          title: 'Greeting etiquette',
          body: [
            'As-salāmu ʿalaykum is used across the Arab world by people of all faiths. The person arriving greets first.',
            'Greet the eldest or most senior person first, and shake hands with your right hand.',
            'Between men and women, wait to see whether a hand is offered. Some people prefer to place a hand on their heart instead.',
            'Asking about health and family is part of the greeting. Jumping straight to business can feel abrupt.',
          ],
        },
        quiz: [
          Q("How do you reply to 'صباح الخير'?", ['صباح النور', 'مساء الخير', 'مع السلامة', 'عفواً'], 'Morning of goodness is answered with morning of light.'),
          Q('Which question would you ask a woman?', ['كيف حالكِ؟ (kayfa ḥāluki)', 'كيف حالكَ؟ (kayfa ḥāluka)', 'كيف حالكم؟ (kayfa ḥālukum)', 'ما اسمه؟ (mā ismuhu)'], '-ki addresses a woman, -ka a man, -kum a group.'),
          Q("What does 'مع السلامة' mean?", ['Goodbye', 'Good morning', 'Thank you', 'Welcome']),
          Q('Who usually greets first?', ['The person arriving', 'The oldest person present', 'The host', 'Whoever is youngest'], 'The person arriving greets those already there.'),
        ],
      },
      {
        id: 'ar-greet-2', title: 'Introducing Yourself', level: 'A1',
        summary: "Sentences without 'is', pronouns and nationalities.",
        grammar: {
          title: "Sentences without 'is'",
          body: [
            "In the present tense Arabic has no word for 'am / is / are'. You put the subject next to its description: أنا طالب (ana ṭālib) = I [am a] student.",
            'This is called a nominal sentence (jumla ismiyya).',
            'Nationality adjectives (nisba) add -ī for a man and -iyya for a woman: Miṣr (Egypt) → miṣrī / miṣriyya.',
          ],
          table: T(['Pronoun', 'Arabic', 'Example'],
            ['I', 'أنا ana', 'أنا من أمريكا: I’m from America'],
            ['you (m)', 'أنتَ anta', 'أنتَ مصري: You’re Egyptian'],
            ['you (f)', 'أنتِ anti', 'أنتِ لبنانية: You’re Lebanese'],
            ['he', 'هو huwa', 'هو طبيب: He’s a doctor'],
            ['she', 'هي hiya', 'هي مهندسة: She’s an engineer'],
            ['we', 'نحن naḥnu', 'نحن طلاب: We’re students']),
        },
        vocab: [
          P('اسمي...', 'ismī…', 'My name is…'),
          P('ما اسمك؟', 'mā ismuk?', "What's your name?"),
          P('أنا من...', 'ana min…', "I'm from…"),
          P('من أين أنت؟', 'min ayna anta?', 'Where are you from? (to a man)'),
          P('تشرفنا', 'tasharrafnā', 'Nice to meet you (lit. we are honored)'),
          P('طالب / طالبة', 'ṭālib / ṭāliba', 'student (m / f)'),
          P('أمريكي / أمريكية', 'amrīkī / amrīkiyya', 'American (m / f)'),
        ],
        examples: [
          P('اسمي علي، أنا من الأردن.', 'ismī ʿAlī, ana min al-Urdun.', "My name is Ali, I'm from Jordan."),
          P('هي مصرية وهو سوري.', 'hiya miṣriyya wa-huwa sūrī.', 'She is Egyptian and he is Syrian.'),
          P('تشرفنا!', 'tasharrafnā!', 'Nice to meet you!'),
        ],
        culture: {
          title: 'Names and titles',
          body: [
            'People are often addressed by a title plus first name: ustādh Aḥmad, duktūra Layla.',
            'Parents are often called after their eldest child: Abū Karīm (father of Karim), Umm Karīm (mother of Karim). It is a warm, respectful nickname.',
            "Expect friendly questions about where you're from, your family and whether you're married. That's normal small talk, not prying.",
          ],
        },
        quiz: [
          Q("How do you say 'I am a student' (male)?", ['أنا طالب', 'أنا طالبة', 'أنا الطالب هو', 'هو طالب'], "No verb 'to be' is needed. طالبة is the feminine form."),
          Q('A woman from Egypt is…', ['مصرية (miṣriyya)', 'مصري (miṣrī)', 'مصر (Miṣr)', 'مصريون (miṣriyyūn)']),
          Q("What does 'Umm Karīm' mean?", ['Mother of Karim', "Karim's aunt", "Karim's wife", "Karim's grandmother"]),
          Q("'تشرفنا' is said…", ['when meeting someone', 'when leaving', 'before eating', 'when apologizing']),
        ],
      },
    ],
  },
  {
    id: 'ar-noun', title: 'Nouns & the Article', nativeTitle: 'الأسماء وأداة التعريف',
    icon: 'textformat', emoji: '📘',
    summary: "'The', sun and moon letters, gender and adjectives.",
    lessons: [
      {
        id: 'ar-noun-1', title: 'The Article al- & Sun Letters', level: 'A1',
        summary: 'How ال changes its sound.',
        grammar: {
          title: "Saying 'the'",
          body: [
            "'The' in Arabic is al- (ال), attached to the front of the word: كتاب kitāb (a book) → الكتاب al-kitāb (the book).",
            "Before the 14 'sun letters' the l of al- isn't pronounced. The next consonant doubles instead: الشمس = ash-shams, not al-shams.",
            "Before the 14 'moon letters' the l is pronounced: القمر al-qamar.",
            'Sun letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن. They are all made with the tip of the tongue.',
          ],
          table: T(['Word', 'Pronounced', 'Type'],
            ['الشمس', 'ash-shams (the sun)', '☀️ sun'],
            ['القمر', 'al-qamar (the moon)', '🌙 moon'],
            ['النور', 'an-nūr (the light)', '☀️ sun'],
            ['الباب', 'al-bāb (the door)', '🌙 moon'],
            ['السوق', 'as-sūq (the market)', '☀️ sun'],
            ['الكتاب', 'al-kitāb (the book)', '🌙 moon']),
        },
        vocab: [
          P('شمس', 'shams', 'sun'), P('قمر', 'qamar', 'moon'), P('باب', 'bāb', 'door'),
          P('بيت', 'bayt', 'house'), P('سوق', 'sūq', 'market'), P('نور', 'nūr', 'light'), P('ولد', 'walad', 'boy'),
        ],
        examples: [
          P('الباب كبير.', 'al-bābu kabīr.', 'The door is big.'),
          P('الشمس حارة اليوم.', 'ash-shamsu ḥārra al-yawm.', 'The sun is hot today.'),
          P('أين السوق؟', 'ayna as-sūq?', 'Where is the market?'),
        ],
        culture: {
          title: "Why 'sun' and 'moon'?",
          body: [
            'Arab grammarians named the two groups after الشمس and القمر, two words that show each rule neatly.',
            'Many English words borrowed from Arabic still carry the article: algebra (al-jabr), alcohol (al-kuḥl), alcove (al-qubba).',
          ],
        },
        quiz: [
          Q('How is الشمس pronounced?', ['ash-shams', 'al-shams', 'a-shams', 'el-shamis']),
          Q('Which word starts with a moon letter after al-?', ['القمر', 'الشمس', 'النور', 'السوق']),
          Q("How do you say 'the house'?", ['البيت', 'بيت', 'بيتي', 'بيوت']),
          Q("Which English word comes from Arabic 'al-jabr'?", ['algebra', 'alphabet', 'album', 'allergy']),
        ],
      },
      {
        id: 'ar-noun-2', title: 'Gender & Adjectives', level: 'A2',
        summary: 'ة, agreement and the possessive iḍāfa.',
        grammar: {
          title: 'Agreement and iḍāfa',
          body: [
            'Most feminine nouns end in ة (tāʾ marbūṭa), pronounced -a: مدينة madīna (city), سيارة sayyāra (car).',
            'Adjectives come after the noun and agree in gender: بيت كبير bayt kabīr (a big house), مدينة كبيرة madīna kabīra (a big city).',
            'They also agree in definiteness: البيت الكبير al-bayt al-kabīr = the big house. But البيت كبير al-bayt kabīr = the house is big, which is a full sentence.',
            'Two nouns side by side make a possessive (iḍāfa): باب البيت bāb al-bayt = the door of the house.',
          ],
          table: T(['English', 'Arabic', 'Note'],
            ['a big house', 'بيت كبير', 'indefinite + indefinite'],
            ['the big house', 'البيت الكبير', 'both take al-'],
            ['The house is big.', 'البيت كبير', 'only the noun takes al-'],
            ['a beautiful city', 'مدينة جميلة', 'feminine agreement -a'],
            ['the door of the house', 'باب البيت', 'iḍāfa: only the last word takes al-']),
        },
        vocab: [
          P('كبير / كبيرة', 'kabīr / kabīra', 'big (m / f)'),
          P('صغير / صغيرة', 'ṣaghīr / ṣaghīra', 'small (m / f)'),
          P('جديد / جديدة', 'jadīd / jadīda', 'new (m / f)'),
          P('قديم / قديمة', 'qadīm / qadīma', 'old (m / f)'),
          P('جميل / جميلة', 'jamīl / jamīla', 'beautiful (m / f)'),
          P('مدينة', 'madīna', 'city'),
          P('سيارة', 'sayyāra', 'car'),
        ],
        examples: [
          P('سيارة جديدة', 'sayyāra jadīda', 'a new car'),
          P('المدينة القديمة جميلة.', 'al-madīna al-qadīma jamīla.', 'The old city is beautiful.'),
          P('مفتاح السيارة', 'miftāḥ as-sayyāra', 'the car key'),
        ],
        culture: {
          title: 'The old city',
          body: [
            "Many Arab cities have an 'old city' (al-madīna al-qadīma) of narrow lanes, souqs and courtyards beside a modern center.",
            'The old cities of Fes, Damascus, Jerusalem, Cairo and Tunis are UNESCO World Heritage sites, and good places to practice asking for directions and prices.',
          ],
        },
        quiz: [
          Q("'A big city' is…", ['مدينة كبيرة', 'مدينة كبير', 'المدينة كبيرة', 'كبيرة مدينة']),
          Q('What does البيت كبير mean?', ['The house is big.', 'the big house', 'a big house', "the house's size"]),
          Q('Which ending usually marks a feminine noun?', ['ة (tāʾ marbūṭa)', 'ي (yāʾ)', 'ون (-ūn)', 'ا (alif)']),
          Q("'The door of the house' is…", ['باب البيت', 'الباب البيت', 'باب بيت', 'البيت الباب'], 'In iḍāfa only the last noun takes al-.'),
        ],
      },
    ],
  },
  {
    id: 'ar-num', title: 'Numbers, Time & Money', nativeTitle: 'الأرقام والوقت',
    icon: 'clock', emoji: '🕰️',
    summary: 'Count, read Eastern Arabic digits, and tell the time.',
    lessons: [
      {
        id: 'ar-num-1', title: 'Numbers 0–10', level: 'A1',
        summary: 'Two digit systems and asking prices.',
        grammar: {
          title: 'Two sets of digits',
          body: [
            'In the Middle East you will see Eastern Arabic digits: ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩. North Africa mostly uses 0–9.',
            'Arabic text runs right to left, but numbers with several digits are read left to right: ٢٥ = 25.',
            'Counting rule (simplified): 3–10 take a plural noun, 11 and up take a singular. The currency comes after the number: خمسة دنانير (five dinars).',
          ],
          table: T(['#', 'Eastern', 'Arabic', 'Say'],
            ['0', '٠', 'صفر', 'ṣifr'], ['1', '١', 'واحد', 'wāḥid'], ['2', '٢', 'اثنان', 'ithnān'],
            ['3', '٣', 'ثلاثة', 'thalātha'], ['4', '٤', 'أربعة', 'arbaʿa'], ['5', '٥', 'خمسة', 'khamsa'],
            ['6', '٦', 'ستة', 'sitta'], ['7', '٧', 'سبعة', 'sabʿa'], ['8', '٨', 'ثمانية', 'thamāniya'],
            ['9', '٩', 'تسعة', 'tisʿa'], ['10', '١٠', 'عشرة', 'ʿashara']),
        },
        vocab: [
          P('واحد', 'wāḥid', 'one'), P('اثنان', 'ithnān', 'two'), P('ثلاثة', 'thalātha', 'three'),
          P('خمسة', 'khamsa', 'five'), P('عشرة', 'ʿashara', 'ten'),
          P('كم؟', 'kam?', 'how many?'), P('بكم؟', 'bikam?', 'how much? (price)'),
        ],
        examples: [
          P('عندي ثلاثة إخوة.', 'ʿindī thalāthat ikhwa.', 'I have three brothers.'),
          P('رقم الغرفة ٢٤.', 'raqm al-ghurfa arbaʿa wa-ʿishrūn.', 'The room number is 24.', "Literally 'four and twenty': units come before tens."),
          P('بكم هذا؟ — بخمسة.', 'bikam hādhā? — bi-khamsa.', 'How much is this? — Five.'),
        ],
        culture: {
          title: 'Reading prices',
          body: [
            "Eastern '0' is a dot (٠) and '5' is a small circle (٥). Don't mix them up with Western 0 and 5.",
            "English calls 0–9 'Arabic numerals' because Europe learned them from Arab mathematicians, who had adopted them from India.",
            'Sellers often show prices on a calculator. Knowing the Eastern digits saves confusion.',
          ],
        },
        quiz: [
          Q('Which Eastern Arabic digit is 5?', ['٥', '٠', '٢', '٧']),
          Q('How is ٢٥ read?', ['25', '52', '205', '7']),
          Q("'Three' in Arabic is…", ['ثلاثة (thalātha)', 'ثمانية (thamāniya)', 'ستة (sitta)', 'اثنان (ithnān)']),
          Q('بكم؟ asks…', ['how much it costs', 'what time it is', 'how many people', 'where it is']),
        ],
      },
      {
        id: 'ar-num-2', title: 'Days & Telling Time', level: 'A2',
        summary: 'Days of the week, clock times and the Arab weekend.',
        grammar: {
          title: 'Hours and days',
          body: [
            "Ask the time with كم الساعة؟ (kam as-sāʿa?), literally 'how much is the hour?'",
            'Answer with الساعة plus an ordinal: الساعة الثالثة (as-sāʿa ath-thālitha) = three o’clock. One o’clock is الساعة الواحدة.',
            'Add والنصف (wa-n-niṣf) for half past, والربع (wa-r-rubʿ) for quarter past, and إلا ربعاً (illā rubʿan) for quarter to.',
            'Most day names come from numbers: al-aḥad (the first) = Sunday, al-ithnayn (the second) = Monday, and so on. Al-jumʿa (the gathering) = Friday.',
          ],
          table: T(['Day', 'Arabic', 'Origin'],
            ['Sunday', 'الأحد al-aḥad', 'one'], ['Monday', 'الاثنين al-ithnayn', 'two'],
            ['Tuesday', 'الثلاثاء ath-thulāthāʾ', 'three'], ['Wednesday', 'الأربعاء al-arbiʿāʾ', 'four'],
            ['Thursday', 'الخميس al-khamīs', 'five'], ['Friday', 'الجمعة al-jumʿa', 'gathering'],
            ['Saturday', 'السبت as-sabt', 'sabbath / rest']),
        },
        vocab: [
          P('كم الساعة؟', 'kam as-sāʿa?', 'What time is it?'),
          P('الساعة الثالثة', 'as-sāʿa ath-thālitha', "three o'clock"),
          P('والنصف', 'wa-n-niṣf', 'and a half'),
          P('اليوم', 'al-yawm', 'today'), P('غداً', 'ghadan', 'tomorrow'), P('أمس', 'ams', 'yesterday'),
          P('الأسبوع', 'al-usbūʿ', 'the week'),
        ],
        examples: [
          P('الساعة الثامنة والنصف.', 'as-sāʿa ath-thāmina wa-n-niṣf.', "It's half past eight."),
          P('المتحف مغلق يوم الجمعة.', 'al-matḥaf mughlaq yawm al-jumʿa.', 'The museum is closed on Friday.'),
          P('نلتقي غداً إن شاء الله.', 'naltaqī ghadan in shāʾa llāh.', "We'll meet tomorrow, God willing."),
        ],
        culture: {
          title: "Weekends and 'inshallah' time",
          body: [
            'Friday is the main day off in most of the Arab world, with congregational prayers at midday. Many countries take Friday–Saturday as the weekend. The UAE moved to Saturday–Sunday (with a half-day Friday) in 2022.',
            'Ramadan shifts the clock: work hours shrink and life carries on late into the night after iftar.',
            "إن شاء الله ('God willing') goes with any future plan. It can mean a sincere yes, a hopeful maybe, or a polite no. Tone and context tell you which.",
          ],
        },
        quiz: [
          Q('How do you ask the time?', ['كم الساعة؟', 'بكم الساعة؟', 'أين الساعة؟', 'متى الساعة؟']),
          Q('الساعة الثالثة والنصف means…', ['3:30', '3:15', '2:30', '3:45']),
          Q('Which day is الجمعة?', ['Friday', 'Thursday', 'Sunday', 'Saturday']),
          Q('الاثنين (Monday) comes from the number…', ['two', 'one', 'five', 'seven']),
        ],
      },
    ],
  },
  {
    id: 'ar-food', title: 'Food & Hospitality', nativeTitle: 'الطعام والضيافة',
    icon: 'cup.and.saucer', emoji: '☕',
    summary: 'Order, praise the cook, and be a good guest.',
    lessons: [
      {
        id: 'ar-food-1', title: 'Ordering at a Café', level: 'A1',
        summary: "Present-tense prefixes with 'I want'.",
        grammar: {
          title: 'The present tense: I want, you want',
          body: [
            'Present-tense verbs add a prefix for the person: أ a- (I), تـ ta- (you / she), يـ ya- (he), نـ na- (we).',
            'From the root r-w-d (to want): أريد urīdu (I want), تريد turīdu (you want, m), تريدين turīdīna (you want, f), يريد yurīdu (he wants).',
            "Add من فضلك (min faḍlak, to a man) or من فضلكِ (min faḍliki, to a woman) for 'please'.",
          ],
          table: T(['Person', 'Arabic', 'Meaning'],
            ['I', 'أريد urīdu', 'I want'], ['you (m)', 'تريد turīdu', 'you want'],
            ['you (f)', 'تريدين turīdīna', 'you want'], ['he', 'يريد yurīdu', 'he wants'],
            ['she', 'تريد turīdu', 'she wants'], ['we', 'نريد nurīdu', 'we want']),
        },
        vocab: [
          P('قهوة', 'qahwa', 'coffee'), P('شاي', 'shāy', 'tea'), P('ماء', 'māʾ', 'water'),
          P('عصير', 'ʿaṣīr', 'juice'), P('سكر', 'sukkar', 'sugar'), P('بدون', 'bidūn', 'without'),
          P('الحساب', 'al-ḥisāb', 'the bill'),
        ],
        examples: [
          P('أريد شاي بالنعناع من فضلك.', 'urīdu shāy bi-n-naʿnāʿ min faḍlak.', "I'd like mint tea, please."),
          P('قهوة بدون سكر.', 'qahwa bidūn sukkar.', 'Coffee without sugar.'),
          P('ماذا تريد؟', 'mādhā turīd?', 'What would you like?'),
        ],
        culture: {
          title: 'Coffee culture',
          body: [
            'Arabic coffee (qahwa ʿarabiyya) is light, spiced with cardamom and served in tiny cups. It is a sign of welcome, especially in the Gulf and the Levant.',
            "Hold the cup in your right hand. When you've had enough, gently shake the cup from side to side. Otherwise the host will keep refilling it.",
            'Turkish-style coffee (qahwa turkiyya) is thick and sweet and common in Egypt and the Levant. In Morocco, mint tea rules.',
          ],
        },
        quiz: [
          Q("'I want' is…", ['أريد (urīdu)', 'يريد (yurīdu)', 'تريد (turīdu)', 'نريد (nurīdu)']),
          Q("How do you signal you've had enough Arabic coffee?", ['Gently shake the cup', 'Turn the cup upside down', 'Leave a little in the cup', "Say 'khalāṣ' loudly"]),
          Q("'بدون سكر' means…", ['without sugar', 'with sugar', 'more sugar', 'a little sugar']),
          Q('The prefix نـ (na-) on a present verb means…', ['we', 'he', 'you', 'I']),
        ],
      },
      {
        id: 'ar-food-2', title: 'Possessives & Compliments', level: 'A2',
        summary: 'My, your, his, her, and praising the cook.',
        grammar: {
          title: 'My, your, his, her',
          body: [
            'Possession is shown with endings on the noun: كتاب kitāb (book) → كتابي kitābī (my book).',
            'With ة words, the ة becomes a regular ت: سيارة sayyāra → سيارتي sayyāratī (my car).',
            "The same endings attach to prepositions: عندي ʿindī (I have, lit. 'at me'), معك maʿak (with you).",
          ],
          table: T(['', 'Ending', 'Example'],
            ['my', '-ī', 'كتابي kitābī'], ['your (m)', '-ka / -ak', 'كتابك kitābuk'],
            ['your (f)', '-ki / -ik', 'كتابكِ kitābuki'], ['his', '-hu', 'كتابه kitābuhu'],
            ['her', '-hā', 'كتابها kitābuhā'], ['our', '-nā', 'كتابنا kitābunā']),
        },
        vocab: [
          P('عندي', 'ʿindī', 'I have'), P('بيتي', 'baytī', 'my house'), P('أمي', 'ummī', 'my mother'),
          P('لذيذ', 'ladhīdh', 'delicious'),
          P('سلمت يداك', 'salimat yadāk', 'bless your hands (to the cook)'),
          P('صحتين', 'ṣaḥtayn', "bon appétit (Lev./Egy., 'two healths')"),
          P('ما شاء الله', 'mā shāʾa llāh', 'wonderful! (admiration)'),
        ],
        examples: [
          P('الأكل لذيذ! سلمت يداكِ.', 'al-akl ladhīdh! salimat yadāki.', 'The food is delicious! Bless your hands.'),
          P('عندي سؤال.', 'ʿindī suʾāl.', 'I have a question.'),
          P('بيتكم جميل، ما شاء الله!', 'baytukum jamīl, mā shāʾa llāh!', 'Your home is lovely!'),
        ],
        culture: {
          title: 'Being a good guest',
          body: [
            "Hosts will urge you to eat more. It's polite to accept a second helping, and to decline a few times before you finally stop.",
            "Praise the cook with سلمت يداك (salimat yadāk): 'may your hands be safe'.",
            'Say ما شاء الله when admiring something (a baby, a house, a success). It expresses admiration while warding off envy.',
            'Eat and pass food with your right hand, and take your shoes off if you see a pile of them by the door.',
          ],
        },
        quiz: [
          Q("'My car' is…", ['سيارتي', 'سيارة', 'سيارتها', 'سيارته'], 'ة becomes ت before an ending.'),
          Q('كتابها means…', ['her book', 'his book', 'my book', 'our book']),
          Q('What do you say to praise the cook?', ['سلمت يداك', 'مع السلامة', 'إن شاء الله', 'عفواً']),
          Q('عندي literally means…', ['at me (= I have)', 'for me', 'from me', 'to me']),
        ],
      },
    ],
  },
  {
    id: 'ar-verb', title: 'Verbs & Roots', nativeTitle: 'الأفعال والجذور',
    icon: 'pencil.and.outline', emoji: '✍️',
    summary: 'The root system, past, present, future and negation.',
    lessons: [
      {
        id: 'ar-verb-1', title: 'Roots & the Past Tense', level: 'A2',
        summary: 'Three-letter roots and past-tense endings.',
        grammar: {
          title: 'One root, many words',
          body: [
            'Most Arabic words are built from a three-letter root that carries a core meaning. k-t-b (ك ت ب) is about writing: kataba (he wrote), kitāb (book), kātib (writer), maktab (office), maktaba (library).',
            'The past tense adds endings to the stem katab-: katabtu (I wrote), katabta (you, m), katabti (you, f), kataba (he), katabat (she), katabnā (we), katabū (they).',
            'Dictionaries are organized by root, so finding the root unlocks a whole family of words.',
          ],
          table: T(['Person', 'Arabic', 'Say'],
            ['I', 'كتبتُ', 'katabtu'], ['you (m)', 'كتبتَ', 'katabta'], ['you (f)', 'كتبتِ', 'katabti'],
            ['he', 'كتبَ', 'kataba'], ['she', 'كتبتْ', 'katabat'], ['we', 'كتبنا', 'katabnā'], ['they', 'كتبوا', 'katabū']),
        },
        vocab: [
          P('كتب', 'kataba', 'he wrote'), P('كتاب', 'kitāb', 'book'), P('كاتب', 'kātib', 'writer'),
          P('مكتب', 'maktab', 'office / desk'), P('مكتبة', 'maktaba', 'library / bookshop'),
          P('درس', 'darasa', 'he studied'), P('مدرسة', 'madrasa', 'school'),
        ],
        examples: [
          P('كتبتُ رسالة لأمي.', 'katabtu risāla li-ummī.', 'I wrote a letter to my mother.'),
          P('درسنا العربية في الجامعة.', 'darasnā al-ʿarabiyya fī al-jāmiʿa.', 'We studied Arabic at the university.'),
          P('ذهبتْ إلى المكتبة.', 'dhahabat ilā al-maktaba.', 'She went to the library.'),
        ],
        culture: {
          title: 'Roots everywhere',
          body: [
            "The root s-l-m (peace, safety) gives salām (peace), islām (submission), muslim, and salāma, as in maʿa as-salāma: 'go with safety'.",
            'The root d-r-s gives madrasa. English borrowed it for religious schools, but in Arabic it means any school.',
            'When you meet a new word, look for three consonants you already know. Roots make guessing meanings much easier.',
          ],
        },
        quiz: [
          Q('Which word shares a root with كتاب?', ['مكتبة', 'مدرسة', 'مدينة', 'سيارة']),
          Q("'We wrote' is…", ['كتبنا', 'كتبوا', 'كتبتُ', 'كتبتْ']),
          Q('مدرسة comes from the root meaning…', ['study', 'write', 'sit', 'peace']),
          Q('كاتب means…', ['writer', 'book', 'office', 'written']),
        ],
      },
      {
        id: 'ar-verb-2', title: 'Present Tense & Negation', level: 'B1',
        summary: 'Present, future, and the three negatives لا / لم / لن.',
        grammar: {
          title: 'Saying what you do, did not do, and will do',
          body: [
            'The present tense combines a prefix (and sometimes a suffix) with a vowelled stem: aktubu (I write), taktubu (you, m), taktubīna (you, f), yaktubu (he), taktubu (she), naktubu (we), yaktubūna (they).',
            'Negate the present with لا: لا أفهم lā afham (I don’t understand).',
            'In MSA, negate the past with لم + the jussive form: لم أذهب lam adhhab (I didn’t go). Negate the future with لن: لن أذهب lan adhhaba (I won’t go).',
            'For the future, put سـ (sa-) or سوف (sawfa) before the present: سأكتب sa-aktubu (I will write).',
          ],
          table: T(['English', 'Arabic', 'Say'],
            ["I don't write", 'لا أكتب', 'lā aktubu'], ["I didn't write", 'لم أكتب', 'lam aktub'],
            ["I won't write", 'لن أكتب', 'lan aktuba'], ['I will write', 'سأكتب', 'sa-aktubu'],
            ["Don't write! (m)", 'لا تكتب!', 'lā taktub']),
        },
        vocab: [
          P('أفهم', 'afhamu', 'I understand'), P('لا أعرف', 'lā aʿrif', "I don't know"),
          P('أسكن', 'askunu', 'I live'), P('أعمل', 'aʿmalu', 'I work'), P('أتكلم', 'atakallamu', 'I speak'),
          P('سوف', 'sawfa', 'will (future)'),
        ],
        examples: [
          P('أسكن في عمّان وأعمل في بنك.', 'askunu fī ʿAmmān wa-aʿmalu fī bank.', 'I live in Amman and work in a bank.'),
          P('لم أفهم السؤال.', 'lam afham as-suʾāl.', "I didn't understand the question."),
          P('سأسافر إلى المغرب الشهر القادم.', 'sa-usāfiru ilā al-Maghrib ash-shahr al-qādim.', "I'll travel to Morocco next month."),
        ],
        culture: {
          title: 'The rhythm of the day',
          body: [
            'The five daily prayers (fajr, ẓuhr, ʿaṣr, maghrib, ʿishāʾ) shape the day in many places. Shops may close briefly for prayer, especially at Friday noon.',
            'Lunch is often the main meal, eaten mid-afternoon. Dinner can be light and late.',
            "People often set meetings with 'after ʿaṣr' or 'after maghrib'.",
          ],
        },
        quiz: [
          Q("'I didn't go' (MSA) is…", ['لم أذهب', 'لا أذهب', 'لن أذهب', 'سأذهب']),
          Q('سأكتب means…', ['I will write', 'I wrote', "I didn't write", "I won't write"]),
          Q('Which word negates the future?', ['لن', 'لم', 'لا', 'سوف']),
          Q('The prefix يـ in يكتب marks…', ['he', 'I', 'we', 'you (f)']),
        ],
      },
    ],
  },
  {
    id: 'ar-dir', title: 'Getting Around', nativeTitle: 'التنقل والاتجاهات',
    icon: 'map', emoji: '🗺️',
    summary: 'Directions, questions, taxis and shopping.',
    lessons: [
      {
        id: 'ar-dir-1', title: 'Where Is…? Directions', level: 'A2',
        summary: 'أين, prepositions and commands.',
        grammar: {
          title: 'Asking the way',
          body: [
            'Ask with أين (ayna, where): أين المحطة؟ ayna al-maḥaṭṭa? (Where is the station?)',
            'Commands to a man have no ending; to a woman add -ī: امشِ imshi / امشي imshī (walk), خذ khudh / خذي khudhī (take).',
            'Key prepositions: في fī (in), على ʿalā (on), قرب qurba (near), أمام amāma (in front of), وراء warāʾa (behind), بين bayna (between).',
          ],
          table: T(['English', 'Arabic', 'Say'],
            ['right', 'يمين', 'yamīn'], ['left', 'يسار', 'yasār'], ['straight ahead', 'على طول', 'ʿalā ṭūl'],
            ['near', 'قريب', 'qarīb'], ['far', 'بعيد', 'baʿīd'], ['turn (MSA / colloquial)', 'انعطف / لِف', 'inʿaṭif / liff']),
        },
        vocab: [
          P('أين؟', 'ayna?', 'where?'), P('المحطة', 'al-maḥaṭṭa', 'the station'),
          P('الشارع', 'ash-shāriʿ', 'the street'), P('على اليمين', 'ʿalā al-yamīn', 'on the right'),
          P('على اليسار', 'ʿalā al-yasār', 'on the left'), P('قريب من هنا', 'qarīb min hunā', 'near here'),
          P('خريطة', 'kharīṭa', 'map'),
        ],
        examples: [
          P('عفواً، أين الفندق؟', 'ʿafwan, ayna al-funduq?', "Excuse me, where's the hotel?"),
          P('امشِ على طول ثم خذ أول شارع على اليمين.', 'imshi ʿalā ṭūl thumma khudh awwal shāriʿ ʿalā al-yamīn.', 'Walk straight, then take the first street on the right.'),
          P('هل هو بعيد؟ — لا، قريب جداً.', 'hal huwa baʿīd? — lā, qarīb jiddan.', 'Is it far? — No, very close.'),
        ],
        culture: {
          title: 'Landmarks over street names',
          body: [
            "Directions are usually given by landmarks ('past the mosque, opposite the pharmacy') rather than street names or numbers.",
            'In Levantine cities, shared taxis called servees (سرفيس) run fixed routes for a set fare.',
            "If the meter isn't running, agree on a taxi fare before you get in. Ride-hailing apps are common in big cities.",
          ],
        },
        quiz: [
          Q("'On the left' is…", ['على اليسار', 'على اليمين', 'على طول', 'أمام']),
          Q('أين المحطة؟ means…', ['Where is the station?', 'When is the train?', 'Is the station far?', 'Take me to the station']),
          Q("How do you tell a woman 'take'?", ['خذي (khudhī)', 'خذ (khudh)', 'خذوا (khudhū)', 'أخذ (akhadha)']),
          Q('In Arab cities, directions are usually given by…', ['landmarks', 'postal codes', 'compass points', 'house numbers']),
        ],
      },
      {
        id: 'ar-dir-2', title: 'Questions & the Souq', level: 'A2',
        summary: "Question words, 'this/that', and bargaining.",
        grammar: {
          title: "Question words and 'this / that'",
          body: [
            'Question words: ما / ماذا mā / mādhā (what), من man (who), متى matā (when), كيف kayfa (how), لماذا limādhā (why), كم kam (how many), بكم bikam (for how much).',
            'Yes/no questions start with هل (hal): هل عندك ماء؟ hal ʿindak māʾ? (Do you have water?)',
            'Demonstratives agree in gender: هذا hādhā (this, m), هذه hādhihi (this, f), ذلك dhālika (that, m), تلك tilka (that, f).',
          ],
          table: T(['English', 'Arabic', 'Say'],
            ['what', 'ماذا', 'mādhā'], ['who', 'من', 'man'], ['when', 'متى', 'matā'],
            ['how', 'كيف', 'kayfa'], ['why', 'لماذا', 'limādhā'], ['how much (price)', 'بكم', 'bikam']),
        },
        vocab: [
          P('بكم هذا؟', 'bikam hādhā?', 'How much is this?'), P('غالي', 'ghālī', 'expensive'),
          P('رخيص', 'rakhīṣ', 'cheap'), P('آخر سعر', 'ākhir siʿr', 'final price'),
          P('هذه', 'hādhihi', 'this (f)'), P('هل عندك...؟', 'hal ʿindak…?', 'Do you have…?'),
          P('أريد هذا', 'urīdu hādhā', 'I want this'),
        ],
        examples: [
          P('بكم هذه الحقيبة؟', 'bikam hādhihi al-ḥaqība?', 'How much is this bag?'),
          P('هذا غالٍ جداً!', 'hādhā ghālin jiddan!', 'This is very expensive!'),
          P('هل عندك لون آخر؟', 'hal ʿindak lawn ākhar?', 'Do you have another color?'),
        ],
        culture: {
          title: 'The art of bargaining',
          body: [
            'In traditional souqs, bargaining is expected for crafts, textiles and souvenirs, but not for basic food or in fixed-price shops.',
            'Start at about half to two-thirds of the first price, smile, and be ready to walk away politely. The seller often calls you back.',
            "Accepting a glass of tea from a shopkeeper doesn't oblige you to buy, but it's a friendly start to the conversation.",
          ],
        },
        quiz: [
          Q("'How much is this?' is…", ['بكم هذا؟', 'كم الساعة؟', 'ما هذا؟', 'أين هذا؟']),
          Q("Which is 'this' for a feminine noun?", ['هذه', 'هذا', 'ذلك', 'هؤلاء']),
          Q('Yes/no questions often start with…', ['هل', 'ماذا', 'لماذا', 'متى']),
          Q('Where is bargaining NOT usually expected?', ['Fixed-price shops and basic food', 'Craft stalls', 'Carpet sellers', 'Souvenir stands']),
        ],
      },
    ],
  },
  {
    id: 'ar-cult', title: 'Culture & Dialects', nativeTitle: 'الثقافة واللهجات',
    icon: 'globe.europe.africa', emoji: '🌍',
    summary: 'Standard Arabic vs. dialects, set phrases, Ramadan and Eid.',
    lessons: [
      {
        id: 'ar-cult-1', title: 'Standard Arabic vs. Dialects', level: 'B1',
        summary: 'Diglossia and the same phrase across the Arab world.',
        grammar: {
          title: 'Diglossia: two registers',
          body: [
            'Arabic speakers use Modern Standard Arabic (fuṣḥā) for writing, news, speeches and formal settings, and a regional dialect (ʿāmmiyya) for everyday conversation.',
            'Dialects share most of their vocabulary with MSA but simplify the grammar (for example, they drop case endings) and replace some very common words.',
            'MSA first lets you read anywhere. Adding a dialect makes conversation natural; Egyptian and Levantine are the most widely understood.',
          ],
          table: T(['English', 'MSA', 'Egyptian', 'Levantine', 'Gulf'],
            ['How are you?', 'كيف حالك؟ kayfa ḥāluk', 'إزيك؟ izzayyak', 'كيفك؟ kīfak', 'شلونك؟ shlōnak'],
            ['I want', 'أريد urīdu', 'عايز ʿāyiz', 'بدّي biddī', 'أبغى abghā'],
            ['What?', 'ماذا؟ mādhā', 'إيه؟ ēh', 'شو؟ shū', 'إيش؟ ēsh'],
            ['now', 'الآن al-ān', 'دلوقتي dilwaʾti', 'هلّق hallaʾ', 'الحين al-ḥīn'],
            ['good', 'جيد jayyid', 'كويس kwayyis', 'منيح mnīḥ', 'زين zēn']),
        },
        vocab: [
          P('فصحى', 'fuṣḥā', 'Standard Arabic'), P('عامية', 'ʿāmmiyya', 'colloquial dialect'),
          P('لهجة', 'lahja', 'dialect / accent'), P('مصري', 'miṣrī', 'Egyptian'),
          P('شامي', 'shāmī', 'Levantine'), P('خليجي', 'khalījī', 'Gulf'),
        ],
        examples: [
          P('أريد أن أذهب إلى البيت.', 'urīdu an adhhaba ilā al-bayt.', 'I want to go home. (MSA)'),
          P('أنا عايز أروح البيت.', 'ana ʿāyiz arūḥ il-bēt.', 'I want to go home. (Egyptian)'),
          P('بدّي روح عالبيت.', 'biddī rūḥ ʿal-bēt.', 'I want to go home. (Levantine)'),
        ],
        culture: {
          title: "Which Arabic is 'right'?",
          body: [
            "Every variety is real Arabic. Egyptian is widely understood because of decades of Egyptian film, TV and music.",
            'Maghrebi dialects (Morocco, Algeria, Tunisia) mix in Amazigh (Berber) and French words, and Eastern Arabs can find them hard to follow.',
            "If you speak MSA in a shop you'll be understood perfectly. People may smile because you sound like a newsreader, and they'll usually reply in a mix.",
          ],
        },
        quiz: [
          Q('Which register is used for news broadcasts?', ['MSA (fuṣḥā)', 'Egyptian dialect', 'Gulf dialect', 'Maghrebi dialect']),
          Q('بدّي (biddī) is Levantine for…', ['I want', 'I must go', 'I know', 'I have']),
          Q('Why is Egyptian Arabic so widely understood?', ['Its film, TV and music industry', 'It is the same as MSA', 'It is the language of the Quran', 'It has no dialect words']),
          Q('Maghrebi dialects show strong influence from…', ['Amazigh and French', 'Persian and Turkish', 'Hindi and English', 'Greek and Latin']),
        ],
      },
      {
        id: 'ar-cult-2', title: "Expressions You'll Hear Every Day", level: 'B1',
        summary: 'Set phrases and their replies, Ramadan and Eid.',
        grammar: {
          title: 'Fixed expressions and their replies',
          body: [
            'Many everyday expressions have a fixed reply. Learning them in pairs makes you sound natural.',
            'Many of them mention God (Allāh), but Muslims, Christians and secular people all use them as ordinary cultural phrases.',
          ],
          table: T(['Situation', 'Say', 'Reply'],
            ['Someone returns from a trip', 'الحمد لله على السلامة al-ḥamdu lillāh ʿala s-salāma', 'الله يسلمك allāh ysallmak'],
            ['After a haircut or shower', 'نعيماً naʿīman', 'الله ينعم عليك allāh yinʿim ʿalēk'],
            ['Ramadan begins', 'رمضان كريم ramaḍān karīm', 'الله أكرم allāhu akram'],
            ['Eid', 'عيد مبارك ʿīd mubārak', 'علينا وعليك ʿalēna w-ʿalēk'],
            ['Someone sneezes (after they say al-ḥamdu lillāh)', 'يرحمك الله yarḥamuka llāh', 'يهدينا ويهديكم الله yahdīnā wa-yahdīkum allāh']),
        },
        vocab: [
          P('يلا', 'yallā', "come on / let's go"), P('خلاص', 'khalāṣ', 'enough / done'),
          P('معلش', 'maʿlesh', 'never mind / sorry'), P('تمام', 'tamām', 'perfect / OK'),
          P('يعني', 'yaʿnī', 'I mean / like (filler)'), P('والله', 'wallāh', 'really / I swear'),
          P('حبيبي', 'ḥabībī', 'my dear (to a man)'),
        ],
        examples: [
          P('يلا نروح!', 'yallā nrūḥ!', "Come on, let's go!"),
          P('معلش، مش مشكلة.', 'maʿlesh, mish mushkila.', 'Never mind, no problem.'),
          P('والله؟ ما كنت أعرف.', 'wallāh? mā kunt aʿrif.', "Really? I didn't know."),
        ],
        culture: {
          title: 'Ramadan & Eid',
          body: [
            'During Ramadan, Muslims fast from dawn to sunset. As a visitor, avoid eating or drinking in public during the day in conservative areas.',
            'Iftar, the meal that breaks the fast, traditionally starts with dates and water at the sunset call to prayer. An invitation to iftar is a real honor.',
            'Eid al-Fitr ends Ramadan, and Eid al-Adha follows about 70 days later. Both bring new clothes, family visits, desserts, and gifts of money (ʿīdiyya) for children.',
          ],
        },
        quiz: [
          Q("Reply to 'رمضان كريم':", ['الله أكرم', 'عيد مبارك', 'وعليكم السلام', 'مع السلامة']),
          Q('نعيماً is said after…', ['a haircut or shower', 'a sneeze', 'a meal', 'a long trip']),
          Q('معلش means…', ['never mind / sorry', 'hurry up', 'congratulations', 'I promise']),
          Q('Iftar traditionally starts with…', ['dates and water', 'coffee and cake', 'soup and bread', 'tea and desserts']),
        ],
      },
    ],
  },
  {
    id: 'ar-adv', title: 'Advanced Grammar', nativeTitle: 'قواعد متقدمة',
    icon: 'graduationcap', emoji: '🎓',
    summary: 'Verb forms, case endings, kāna and inna.',
    lessons: [
      {
        id: 'ar-adv-1', title: 'Verb Forms (Awzān)', level: 'B2',
        summary: 'Forms I–X and how they shift meaning.',
        grammar: {
          title: 'Patterns that shift meaning',
          body: [
            'Arabic verbs come in patterns called forms (I–X). Each form applies to a root and shifts its meaning in a predictable way.',
            "Form II (faʿʿala) doubles the middle letter and often means 'make someone do': darasa (study) → darrasa (teach).",
            'Form III (fāʿala) means doing something with someone: kataba (write) → kātaba (correspond with).',
            'Form V (tafaʿʿala) is the reflexive of II: ʿallama (teach) → taʿallama (learn).',
            'Form X (istafʿala) means seeking or considering: khadama (serve) → istakhdama (use); ʿalima (know) → istaʿlama (inquire).',
          ],
          table: T(['Form', 'Pattern', 'Example', 'Meaning'],
            ['I', 'فَعَلَ faʿala', 'درس darasa', 'to study'],
            ['II', 'فَعَّلَ faʿʿala', 'درّس darrasa', 'to teach'],
            ['III', 'فاعَلَ fāʿala', 'كاتب kātaba', 'to correspond with'],
            ['V', 'تَفَعَّلَ tafaʿʿala', 'تعلّم taʿallama', 'to learn'],
            ['VI', 'تَفاعَلَ tafāʿala', 'تعاون taʿāwana', 'to cooperate'],
            ['X', 'اِسْتَفْعَلَ istafʿala', 'استخدم istakhdama', 'to use']),
        },
        vocab: [
          P('درّس', 'darrasa', 'to teach'), P('تعلّم', 'taʿallama', 'to learn'),
          P('استخدم', 'istakhdama', 'to use'), P('تعاون', 'taʿāwana', 'to cooperate'),
          P('استقبل', 'istaqbala', 'to receive (guests)'),
        ],
        examples: [
          P('تعلّمتُ العربية في القاهرة.', 'taʿallamtu al-ʿarabiyya fī al-Qāhira.', 'I learned Arabic in Cairo.'),
          P('يدرّس أبي الرياضيات.', 'yudarrisu abī ar-riyāḍiyyāt.', 'My father teaches mathematics.'),
          P('هل تستخدم هذا التطبيق؟', 'hal tastakhdimu hādhā at-taṭbīq?', 'Do you use this app?'),
        ],
        culture: {
          title: 'A grammar tradition',
          body: [
            'Arabic grammar was written down in the 8th century in Basra and Kufa. The best-known early grammarian is Sībawayh, whose book is still studied.',
            'Because of the root-and-pattern system, rhyme and pattern carry a lot of meaning in Arabic poetry and wordplay.',
          ],
        },
        quiz: [
          Q('Form II often means…', ['causing someone to do', 'doing with someone', 'seeking', 'becoming']),
          Q('تعلّم (taʿallama) means…', ['to learn', 'to teach', 'to know', 'to inform']),
          Q('Which verb is Form X?', ['استخدم', 'درّس', 'كاتب', 'تعاون']),
          Q('كاتب (kātaba, to correspond with) is Form…', ['III', 'II', 'V', 'X']),
        ],
      },
      {
        id: 'ar-adv-2', title: 'Kāna, Inna & Case Endings', level: 'B2',
        summary: 'Nominative, accusative and genitive in formal Arabic.',
        grammar: {
          title: 'Words that change case',
          body: [
            'MSA nouns have case endings: -u (nominative), -a (accusative), -i (genitive). Speech often drops them, but they matter in formal reading.',
            "كان (kāna, 'was') and its 'sisters' (ليس laysa 'is not', أصبح aṣbaḥa 'became', ما زال mā zāla 'still') keep the subject nominative and make the predicate accusative: كان الجوُّ جميلاً kāna al-jawwu jamīlan (The weather was beautiful).",
            "إنّ (inna, 'indeed') and its sisters (أنّ anna 'that', لكنّ lākinna 'but', لأنّ li-anna 'because') do the opposite and make the subject accusative: إنّ الجوَّ جميلٌ inna al-jawwa jamīlun.",
          ],
          table: T(['Sentence', 'Subject', 'Predicate'],
            ['الجوُّ جميلٌ: The weather is beautiful.', '-u (nominative)', '-un (nominative)'],
            ['كان الجوُّ جميلاً: The weather was beautiful.', '-u (nominative)', '-an (accusative)'],
            ['إنّ الجوَّ جميلٌ: Indeed, the weather is beautiful.', '-a (accusative)', '-un (nominative)'],
            ['ليس الجوُّ جميلاً: The weather isn’t beautiful.', '-u (nominative)', '-an (accusative)']),
        },
        vocab: [
          P('كان', 'kāna', 'was'), P('ليس', 'laysa', 'is not'), P('أصبح', 'aṣbaḥa', 'became'),
          P('ما زال', 'mā zāla', 'still'), P('إنّ', 'inna', 'indeed'), P('لأنّ', 'li-anna', 'because'),
        ],
        examples: [
          P('أصبح الطالبُ معلّماً.', 'aṣbaḥa aṭ-ṭālibu muʿalliman.', 'The student became a teacher.'),
          P('أحب القاهرة لأنّ الناسَ لطفاء.', 'uḥibbu al-Qāhira li-anna an-nāsa luṭafāʾ.', 'I love Cairo because the people are kind.'),
          P('ما زال الجوُّ حاراً.', 'mā zāla al-jawwu ḥārran.', 'The weather is still hot.'),
        ],
        culture: {
          title: 'Grammar out loud',
          body: [
            'Case endings are fully pronounced in Quran recitation, classical poetry and formal speeches. Reading aloud correctly is a respected skill.',
            "Newsreaders are judged on their iʿrāb (case inflection), and a slip on air can become a talking point.",
          ],
        },
        quiz: [
          Q('After كان, the predicate is…', ['accusative (-a / -an)', 'nominative (-u / -un)', 'genitive (-i / -in)', 'unchanged']),
          Q('After إنّ, the subject is…', ['accusative', 'nominative', 'genitive', 'jussive']),
          Q("'The weather was beautiful' is…", ['كان الجوُّ جميلاً', 'كان الجوَّ جميلٌ', 'إنّ الجوُّ جميلاً', 'كان الجوُّ جميلٍ']),
          Q('لأنّ means…', ['because', 'but', 'although', 'still']),
        ],
      },
    ],
  },
];

const L = (char, name, tr, sound, connects, example) => ({ char, name, tr, sound, connects, example });

const reading = {
  title: 'Reading & Writing Arabic',
  intro: [
    'Arabic is written right to left in a joined-up script with 28 letters. Most letters connect to the next one, so each letter has up to four shapes: isolated, initial, medial and final.',
    'Six letters (ا د ذ ر ز و) never connect to the letter after them, so they leave small gaps inside words.',
    "Short vowels are small marks (ḥarakāt) above or below letters. Everyday texts leave them out; beginners' books include them, and so does this app.",
  ],
  letters: [
    L('ا', 'alif', 'ā / ʾ', "Long 'aa' as in 'father'. Also a seat for hamza (a glottal stop).", false, P('أسد', 'asad', 'lion')),
    L('ب', 'bāʾ', 'b', "b as in 'boy'.", true, P('باب', 'bāb', 'door')),
    L('ت', 'tāʾ', 't', "t as in 'tea', tongue touching the teeth.", true, P('تمر', 'tamr', 'dates')),
    L('ث', 'thāʾ', 'th', "th as in 'think'.", true, P('ثلج', 'thalj', 'snow')),
    L('ج', 'jīm', 'j', "j as in 'jam' (hard g as in 'go' in Egypt).", true, P('جمل', 'jamal', 'camel')),
    L('ح', 'ḥāʾ', 'ḥ', 'A breathy h from deep in the throat, like fogging a mirror.', true, P('حب', 'ḥubb', 'love')),
    L('خ', 'khāʾ', 'kh', "kh as in Scottish 'loch' or German 'Bach'.", true, P('خبز', 'khubz', 'bread')),
    L('د', 'dāl', 'd', "d as in 'door'.", false, P('دار', 'dār', 'house')),
    L('ذ', 'dhāl', 'dh', "th as in 'this'.", false, P('ذهب', 'dhahab', 'gold')),
    L('ر', 'rāʾ', 'r', "A tapped or rolled r, as in Spanish 'pero'.", false, P('رجل', 'rajul', 'man')),
    L('ز', 'zāy', 'z', "z as in 'zoo'.", false, P('زيت', 'zayt', 'oil')),
    L('س', 'sīn', 's', "s as in 'sun'.", true, P('سمك', 'samak', 'fish')),
    L('ش', 'shīn', 'sh', "sh as in 'shop'.", true, P('شمس', 'shams', 'sun')),
    L('ص', 'ṣād', 'ṣ', 'Emphatic s: a deep, heavy s with the tongue pulled back.', true, P('صديق', 'ṣadīq', 'friend')),
    L('ض', 'ḍād', 'ḍ', "Emphatic d. Arabic is called 'the language of ḍād' because this sound is so distinctive.", true, P('ضوء', 'ḍawʾ', 'light')),
    L('ط', 'ṭāʾ', 'ṭ', 'Emphatic t: a deep, heavy t.', true, P('طفل', 'ṭifl', 'child')),
    L('ظ', 'ẓāʾ', 'ẓ', "Emphatic th (as in 'this').", true, P('ظهر', 'ẓuhr', 'noon')),
    L('ع', 'ʿayn', 'ʿ', 'A voiced sound squeezed from the throat. English has no equivalent; it is a hallmark of Arabic.', true, P('عين', 'ʿayn', 'eye')),
    L('غ', 'ghayn', 'gh', 'A gargled sound like the French or German r.', true, P('غرفة', 'ghurfa', 'room')),
    L('ف', 'fāʾ', 'f', "f as in 'fun'.", true, P('فيل', 'fīl', 'elephant')),
    L('ق', 'qāf', 'q', 'A k made far back in the throat. In Cairo, Beirut and Damascus it is often a glottal stop.', true, P('قلب', 'qalb', 'heart')),
    L('ك', 'kāf', 'k', "k as in 'kite'.", true, P('كلب', 'kalb', 'dog')),
    L('ل', 'lām', 'l', "l as in 'love'.", true, P('ليل', 'layl', 'night')),
    L('م', 'mīm', 'm', "m as in 'moon'.", true, P('ماء', 'māʾ', 'water')),
    L('ن', 'nūn', 'n', "n as in 'noon'.", true, P('نور', 'nūr', 'light')),
    L('ه', 'hāʾ', 'h', "h as in 'hello'. It is pronounced at the end of words too.", true, P('هدية', 'hadiyya', 'gift')),
    L('و', 'wāw', 'w / ū', "w as in 'wow', or a long 'oo' as in 'food'.", false, P('ورد', 'ward', 'roses')),
    L('ي', 'yāʾ', 'y / ī', "y as in 'yes', or a long 'ee' as in 'see'.", true, P('يد', 'yad', 'hand')),
  ],
  marks: [
    { symbol: 'بَ', name: 'Fatḥa', body: "Short 'a': a small diagonal stroke above the letter.", example: P('كَتَبَ', 'kataba', 'he wrote') },
    { symbol: 'بِ', name: 'Kasra', body: "Short 'i': a small stroke below the letter.", example: P('بِنْت', 'bint', 'girl') },
    { symbol: 'بُ', name: 'Ḍamma', body: "Short 'u': a small wāw shape above the letter.", example: P('كُتُب', 'kutub', 'books') },
    { symbol: 'بْ', name: 'Sukūn', body: 'No vowel: a small circle shows the consonant is followed directly by another.', example: P('مَكْتَب', 'maktab', 'office') },
    { symbol: 'بّ', name: 'Shadda', body: "Doubles the consonant: a small 'w' shape above.", example: P('مُدَرِّس', 'mudarris', 'teacher') },
    { symbol: 'بٌ بً بٍ', name: 'Tanwīn', body: 'Doubled marks add -un, -an or -in (indefinite case endings).', example: P('شُكْرًا', 'shukran', 'thank you') },
    { symbol: 'ء أ إ ؤ ئ', name: 'Hamza', body: "A glottal stop, like the catch in 'uh-oh'. It sits alone or on an alif, wāw or yāʾ.", example: P('سُؤَال', 'suʾāl', 'question') },
    { symbol: 'آ', name: 'Madda', body: "A long 'ā' that starts with a glottal stop.", example: P('آسِف', 'āsif', 'sorry') },
    { symbol: 'ة', name: 'Tāʾ marbūṭa', body: 'A feminine ending pronounced -a (or -at when another noun follows).', example: P('مَدِينَة', 'madīna', 'city') },
    { symbol: 'ى', name: 'Alif maqṣūra', body: "Looks like yāʾ without dots and is pronounced 'ā' at the end of a word.", example: P('مُسْتَشْفَى', 'mustashfā', 'hospital') },
    { symbol: 'لا', name: 'Lām-alif', body: 'ل followed by ا joins into this special shape.', example: P('لَا', 'lā', 'no') },
  ],
  words: [
    P('بَاب', 'bāb', 'door'), P('بَيْت', 'bayt', 'house'), P('كِتَاب', 'kitāb', 'book'),
    P('قَلَم', 'qalam', 'pen'), P('مَاء', 'māʾ', 'water'), P('شَمْس', 'shams', 'sun'),
    P('قَمَر', 'qamar', 'moon'), P('وَلَد', 'walad', 'boy'), P('بِنْت', 'bint', 'girl'),
    P('سَيَّارَة', 'sayyāra', 'car'), P('مَدْرَسَة', 'madrasa', 'school'), P('قَهْوَة', 'qahwa', 'coffee'),
    P('خُبْز', 'khubz', 'bread'), P('صَدِيق', 'ṣadīq', 'friend'), P('مَدِينَة', 'madīna', 'city'),
    P('سُوق', 'sūq', 'market'), P('بَحْر', 'baḥr', 'sea'), P('شُكْرًا', 'shukran', 'thank you'),
    P('مَرْحَبًا', 'marḥaban', 'hello'), P('نَعَم', 'naʿam', 'yes'), P('أُمّ', 'umm', 'mother'),
    P('عَرَبِيّ', 'ʿarabiyy', 'Arabic / Arab'),
  ],
  writing: [
    { en: 'door', answer: 'باب', hint: 'b-ā-b' }, { en: 'house', answer: 'بيت', hint: 'b-y-t' },
    { en: 'book', answer: 'كتاب', hint: 'k-t-ā-b' }, { en: 'sun', answer: 'شمس', hint: 'sh-m-s' },
    { en: 'moon', answer: 'قمر', hint: 'q-m-r' }, { en: 'pen', answer: 'قلم', hint: 'q-l-m' },
    { en: 'water', answer: 'ماء', hint: 'm-ā-ʾ (ends with hamza)' }, { en: 'bread', answer: 'خبز', hint: 'kh-b-z' },
    { en: 'tea', answer: 'شاي', hint: 'sh-ā-y' }, { en: 'market', answer: 'سوق', hint: 's-ū-q' },
    { en: 'friend', answer: 'صديق', hint: 'ṣ-d-ī-q' }, { en: 'hello', answer: 'مرحبا', alts: ['مرحباً'], hint: 'm-r-ḥ-b-ā' },
    { en: 'thank you', answer: 'شكرا', alts: ['شكراً'], hint: 'sh-k-r-ā' }, { en: 'yes', answer: 'نعم', hint: 'n-ʿ-m' },
    { en: 'no', answer: 'لا', hint: 'l-ā' }, { en: 'city', answer: 'مدينة', hint: 'm-d-ī-n-a (ends with ة)' },
  ],
  tips: [
    { title: 'Right to left, numbers left to right', body: 'Words flow right to left, but numbers with several digits are written left to right.' },
    { title: 'Dots matter', body: 'ب ت ث ن ي share a single base shape and differ only in their dots. Read the dots first.' },
    { title: 'Body first, dots last', body: 'When writing, draw the joined body of the whole word, then add the dots and vowel marks.' },
    { title: 'Unvowelled text', body: 'Real-world texts leave out short vowels. Knowing roots and patterns lets you fill them in, the way you read "txt msgs".' },
  ],
  keyboard: ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ذ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'د', 'أ', 'إ', 'آ', 'ئ'],
};

const step = (speaker, line, prompt, choices, mode) => {
  const s = {};
  if (speaker) s.speaker = speaker;
  if (line) s.line = line;
  if (prompt) s.prompt = prompt;
  if (choices) s.choices = choices;
  if (mode) s.mode = mode;
  return s;
};
const U = (en, correct, feedback) => C('', '', en, correct, feedback);

const scenarios = [
  {
    id: 'ar-sc-cafe', title: 'Coffee in Amman', level: 'A1', emoji: '☕', icon: 'cup.and.saucer',
    setting: 'A busy café in downtown Amman, Jordan.', goal: 'Order a drink and pay.',
    steps: [
      step('Waiter', P('أهلاً وسهلاً! تفضّل.', 'ahlan wa-sahlan! tafaḍḍal.', 'Welcome! Please, go ahead.'), 'Greet him and order a coffee.', [
        C('مرحباً، أريد قهوة من فضلك.', 'marḥaban, urīdu qahwa min faḍlak.', "Hello, I'd like a coffee, please.", true, 'Perfect: polite and clear.'),
        C('مع السلامة.', 'maʿa as-salāma.', 'Goodbye.', false, "That's 'goodbye', and you just arrived!"),
        C('أنا قهوة.', 'ana qahwa.', 'I am coffee.', false, "Without a verb, 'ana qahwa' means 'I am coffee'. Use أريد (urīdu), 'I want'."),
      ]),
      step('Waiter', P('قهوة عربية أو تركية؟', 'qahwa ʿarabiyya aw turkiyya?', 'Arabic or Turkish coffee?'), 'Choose one.', [
        C('عربية، من فضلك.', 'ʿarabiyya, min faḍlak.', 'Arabic, please.', true, 'Great choice: light coffee with cardamom.'),
        C('تركية، من فضلك.', 'turkiyya, min faḍlak.', 'Turkish, please.', true, 'Great choice: thick and strong.'),
        C('نعم.', 'naʿam.', 'Yes.', false, "It's an either/or question, so pick one."),
      ]),
      step('Waiter', P('مع سكر؟', 'maʿa sukkar?', 'With sugar?'), 'Answer him.', [
        C('بدون سكر، شكراً.', 'bidūn sukkar, shukran.', 'Without sugar, thanks.', true, 'بدون = without.'),
        C('سكر قليل، من فضلك.', 'sukkar qalīl, min faḍlak.', 'A little sugar, please.', true, "قليل = a little. In Jordan you'll also hear 'wasaṭ' (medium)."),
        C('أين السكر؟', 'ayna as-sukkar?', 'Where is the sugar?', false, "He's offering to add it. Just answer yes or no."),
      ]),
      step('Waiter', P('تفضّل، قهوتك.', 'tafaḍḍal, qahwatak.', 'Here you are, your coffee.'), 'Thank him.', [
        C('شكراً جزيلاً!', 'shukran jazīlan!', 'Thank you very much!', true, "He'll probably answer 'ʿafwan' or 'ahlan'."),
        C('عفواً.', 'ʿafwan.', "You're welcome.", false, 'ʿAfwan is the reply to thanks. That line is his, not yours.'),
        C('صباح النور.', 'ṣabāḥ an-nūr.', 'Good morning (reply).', false, "That only answers 'ṣabāḥ al-khayr'."),
      ]),
      step(null, null, "You're ready to pay. Ask for the bill.", [
        C('الحساب، من فضلك.', 'al-ḥisāb, min faḍlak.', 'The bill, please.', true, "Exactly. You'll also hear 'il-ḥsāb law samaḥt'."),
        C('كم الساعة؟', 'kam as-sāʿa?', 'What time is it?', false, 'That asks the time, not for the bill.'),
        C('أين الحمام؟', 'ayna al-ḥammām?', "Where's the bathroom?", false, 'Useful, but not for paying!'),
      ]),
      step('Waiter', P('دينار ونص.', 'dīnār w-nuṣṣ.', 'One and a half dinars.'), 'How much is it?', [
        U('1.5 dinars', true, 'نص (nuṣṣ) is the colloquial form of نصف (niṣf), half.'),
        U('5 dinars', false, "Listen for نص: 'half'."),
        U('15 dinars', false, "That would be 'khamstaʿsh dīnār'."),
      ], 'understand'),
    ],
  },
  {
    id: 'ar-sc-taxi', title: 'Taxi in Cairo', level: 'A2', emoji: '🚕', icon: 'car',
    setting: 'Hailing a taxi near your hotel in Cairo, Egypt.', goal: 'Give your destination, agree on a fare, and stop at the right place.',
    steps: [
      step('Driver', P('على فين يا باشا؟', 'ʿala fēn yā bāsha?', 'Where to, boss?', 'Egyptian: fēn = where (MSA: ayna).'), 'Tell him: Tahrir Square, please.', [
        C('إلى ميدان التحرير، من فضلك.', 'ilā maydān at-taḥrīr, min faḍlak.', 'To Tahrir Square, please.', true, "He'll understand MSA perfectly. In Egyptian: 'ʿala midān it-taḥrīr, law samaḥt'."),
        C('أنا من التحرير.', 'ana min at-taḥrīr.', "I'm from Tahrir.", false, 'من = from. For "to", use إلى (ilā) or على (ʿala).'),
        C('أين التحرير؟', 'ayna at-taḥrīr?', 'Where is Tahrir?', false, "He's asking where YOU want to go."),
      ]),
      step(null, null, 'Ask how much it costs before you set off.', [
        C('بكم؟', 'bikam?', 'How much?', true, "If there's no meter, always agree on the fare first."),
        C('كم عمرك؟', 'kam ʿumruk?', 'How old are you?', false, "That's 'how old are you?'. Awkward!"),
        C('متى؟', 'matā?', 'When?', false, 'متى = when. You want بكم, for how much.'),
      ]),
      step('Driver', P('مية جنيه.', 'miyya ginēh.', 'A hundred pounds.', 'Egyptians say ج as g: ginēh.'), "That's too much. Bargain.", [
        C('غالي! خمسين؟', 'ghālī! khamsīn?', 'Expensive! Fifty?', true, "A classic opening offer. He'll come back with another price."),
        C('حاضر.', 'ḥāḍir.', 'Certainly / OK.', true, "Accepting is fine, but you could have bargained."),
        C('مية؟ شكراً جزيلاً!', 'miyya? shukran jazīlan!', 'A hundred? Thank you very much!', false, "Thanking him for a high price won't bring it down!"),
      ]),
      step('Driver', P('خلاص، سبعين.', 'khalāṣ, sabʿīn.', 'Fine, seventy.'), 'What did he offer?', [
        U('70 pounds, final', true, 'خلاص = done, settled. سبعين = seventy.'),
        U('17 pounds', false, "Seventeen would be 'sabaʿtāshar'."),
        U('No deal', false, "Here خلاص means 'OK, settled'."),
      ], 'understand'),
      step(null, null, "You're near the square. Ask him to stop here.", [
        C('هنا، من فضلك.', 'hunā, min faḍlak.', 'Here, please.', true, "In Egyptian: 'hena, law samaḥt' or 'ʿala gamb' (pull over)."),
        C('على طول.', 'ʿalā ṭūl.', 'Straight ahead.', false, 'That means keep going!'),
        C('يمين.', 'yamīn.', 'Right.', false, "That's a direction, not 'stop'."),
      ]),
      step('Driver', P('حمد الله على السلامة!', 'ḥamdillāh ʿas-salāma!', 'Thank God you arrived safely!'), 'Reply.', [
        C('الله يسلمك.', 'allāh ysallmak.', 'May God keep you safe.', true, 'The standard reply. Nicely done!'),
        C('صباح النور.', 'ṣabāḥ an-nūr.', 'Good morning (reply).', false, "That answers 'good morning'."),
        C('بكم؟', 'bikam?', 'How much?', false, 'You already agreed on the fare!'),
      ]),
    ],
  },
  {
    id: 'ar-sc-souq', title: 'Bargaining in the Souq', level: 'A2', emoji: '🧣', icon: 'bag',
    setting: 'A textile stall in an old-city souq in the Levant. The seller speaks Levantine Arabic.', goal: 'Buy a scarf at a fair price.',
    steps: [
      step('Seller', P('أهلاً! تفضّلي، شو بدّك؟', 'ahlan! tfaḍḍalī, shū biddik?', 'Welcome! Come in. What would you like?', 'Levantine, speaking to a woman: shū = what, biddik = you want.'), 'Point at a scarf and ask the price.', [
        C('بكم هذا الشال؟', 'bikam hādhā ash-shāl?', 'How much is this scarf?', true, 'Clear and polite.'),
        C('أنا شال.', 'ana shāl.', 'I am a scarf.', false, 'Careful! Use بكم (how much) + هذا (this).'),
        C('ما اسمك؟', 'mā ismuk?', "What's your name?", false, "Friendly, but you're here to shop."),
      ]),
      step('Seller', P('هذا حرير، بخمسين دينار.', 'hādhā ḥarīr, bi-khamsīn dīnār.', "It's silk. Fifty dinars."), 'What did he say?', [
        U("It's silk, 50 dinars", true, 'حرير = silk; خمسين = fifty.'),
        U("It's cotton, 15 dinars", false, 'Cotton would be قطن (quṭn), and fifteen is خمستعش.'),
        U("It's silk, 5 dinars", false, 'Five would be خمسة.'),
      ], 'understand'),
      step(null, null, 'Make a counter-offer.', [
        C('غالي كتير! بعشرين؟', 'ghālī ktīr! bi-ʿishrīn?', 'Too expensive! Twenty?', true, 'Starting at around 40–60% of the first price is normal.'),
        C('طيب، خمسين.', 'ṭayyib, khamsīn.', 'OK, fifty.', true, "You can, but bargaining is expected here."),
        C('لا أفهم.', 'lā afham.', "I don't understand.", false, 'You did understand. Now bargain!'),
      ]),
      step('Seller', P('والله ما بيصير! أربعين، آخر سعر.', 'wallāh mā bīṣīr! arbaʿīn, ākhir siʿr.', "I swear, I can't! Forty, final price."), 'Respond.', [
        C('ثلاثين وبشتري هلّق.', 'thalāthīn w-bishtrī hallaʾ.', "Thirty and I'll buy it now.", true, 'Offering to buy on the spot is a strong move.'),
        C('لا شكراً، مع السلامة.', 'lā shukran, maʿa as-salāma.', 'No thanks, goodbye.', true, 'Walking away politely often gets you a better price.'),
        C('أربعين؟ ممتاز، خمسين!', 'arbaʿīn? mumtāz, khamsīn!', 'Forty? Excellent. Fifty!', false, 'You just offered more than he asked for!'),
      ]),
      step('Seller', P('ماشي، خمسة وثلاثين، كرمالك.', 'māshī, khamsa w-thalāthīn, karmālik.', 'OK, thirty-five, just for you.'), 'Close the deal.', [
        C('تمام، اتفقنا. شكراً!', 'tamām, ittafaqnā. shukran!', "Great, it's a deal. Thanks!", true, 'اتفقنا = we agreed. Enjoy your scarf!'),
        C('بكم؟', 'bikam?', 'How much?', false, 'He just told you: 35.'),
        C('عيد مبارك!', 'ʿīd mubārak!', 'Happy Eid!', false, 'Wrong occasion!'),
      ]),
    ],
  },
  {
    id: 'ar-sc-family', title: 'Dinner with a Jordanian Family', level: 'A2', emoji: '🏠', icon: 'house',
    setting: "Your friend Rami has invited you to dinner at his family's home. They speak Levantine Arabic.", goal: 'Greet the family, accept their hospitality, and praise the food.',
    steps: [
      step("Rami's father", P('أهلاً وسهلاً! نوّرت البيت.', 'ahlan wa-sahlan! nawwart il-bēt.', "Welcome! You've lit up the house."), 'Reply warmly.', [
        C('البيت منوّر بأهله.', 'il-bēt mnawwar b-ahlo.', 'The house is lit up by its family.', true, "The perfect set reply. He'll be delighted."),
        C('شكراً، أهلاً فيك.', 'shukran, ahlan fīk.', 'Thanks, welcome to you too.', true, "Polite. The classic reply is 'il-bēt mnawwar b-ahlo'."),
        C('مساء النور.', 'masāʾ an-nūr.', 'Good evening (reply).', false, "That answers 'masāʾ al-khayr', not this."),
      ]),
      step("Rami's mother", P('كيف حالك يا ابني؟', 'kīf ḥālak yā ibnī?', 'How are you, my son?', "Elders often affectionately call young guests 'my son' or 'my daughter'."), 'Answer and ask her in return.', [
        C('الحمد لله، وإنتِ كيفك؟', 'il-ḥamdu lillāh, w-inti kīfik?', 'Thank God. And how are you?', true, 'Asking her back (inti, -ik) is just right.'),
        C('أنا ابنك.', 'ana ibnik.', 'I am your son.', false, "It's a term of affection, so there's no need to confirm it!"),
        C('مع السلامة.', 'maʿa s-salāma.', 'Goodbye.', false, 'You just arrived!'),
      ]),
      step("Rami's mother", P('تفضّل، كُل! هاي مقلوبة.', 'tfaḍḍal, kul! hāy maqlūba.', 'Please, eat! This is maqlūba.', "Maqlūba ('upside-down') is rice, vegetables and meat cooked in a pot and flipped onto the platter."), 'Praise the food.', [
        C('سلمت إيديكِ، كتير طيبة!', 'salmit īdēki, ktīr ṭayyba!', "Bless your hands, it's delicious!", true, 'Exactly what a good guest says to the cook.'),
        C('لا، شكراً.', 'lā, shukran.', 'No, thanks.', false, 'Turning down the main dish can offend. At least taste it!'),
        C('بكم هذا؟', 'bikam hādha?', 'How much is this?', false, "You're a guest, not a customer!"),
      ]),
      step("Rami's father", P('كُل كمان! ما أكلت شي!', 'kul kamān! mā akalt ishī!', "Eat more! You haven't eaten anything!"), "What's going on?", [
        U("He's insisting you eat more. It's normal hospitality.", true, "Hosts insist. Take a little more, or say 'shbiʿt, il-ḥamdu lillāh' (I'm full, thank God) a few times."),
        U("He's upset that you ate too much", false, 'Quite the opposite!'),
        U("He's asking you to cook", false, 'كُل = eat! (a command).'),
      ], 'understand'),
      step(null, null, "You're really full. Decline politely.", [
        C('شبعت، الحمد لله. دايماً عامرة!', 'shbiʿt, il-ḥamdu lillāh. dāyman ʿāmra!', "I'm full, thank God. May your table always be full!", true, "'Dāyman ʿāmra' is a lovely blessing for the host's table."),
        C('الأكل مش طيب.', 'il-akl mish ṭayyib.', "The food isn't good.", false, 'Ouch! Never say that.'),
        C('أريد الحساب.', 'urīd il-ḥisāb.', 'I want the bill.', false, "You're in someone's home!"),
      ]),
    ],
  },
  {
    id: 'ar-sc-directions', title: 'Finding the Museum', level: 'A2', emoji: '🏛️', icon: 'building.columns',
    setting: "You're near the old city in Tunis and stop a student to ask the way. She answers slowly in Standard Arabic for you.", goal: 'Ask the way, understand the directions, and find out how far it is.',
    steps: [
      step(null, null, 'Politely get her attention and ask where the museum is.', [
        C('عفواً، أين المتحف؟', 'ʿafwan, ayna al-matḥaf?', 'Excuse me, where is the museum?', true, "عفواً also works as 'excuse me'."),
        C('المتحف!', 'al-matḥaf!', 'The museum!', false, 'A bit abrupt. Add عفواً and أين.'),
        C('أنا المتحف.', 'ana al-matḥaf.', 'I am the museum.', false, 'Use أين (where).'),
      ]),
      step('Student', P('امشِ على طول، ثم خذ الشارع الثاني على اليسار.', 'imshi ʿalā ṭūl, thumma khudh ash-shāriʿ ath-thānī ʿalā al-yasār.', 'Walk straight, then take the second street on the left.'), 'What should you do?', [
        U('Go straight, then take the 2nd street on the left', true, 'الثاني = second; اليسار = left.'),
        U('Turn right at the first street', false, 'اليسار is left, and الثاني is second.'),
        U('Take a taxi to the second museum', false, 'No taxi needed: امشِ means walk.'),
      ], 'understand'),
      step(null, null, 'Ask if it is far.', [
        C('هل هو بعيد؟', 'hal huwa baʿīd?', 'Is it far?', true, 'هل starts a yes/no question.'),
        C('هل هو كبير؟', 'hal huwa kabīr?', 'Is it big?', false, 'كبير = big. Far is بعيد.'),
        C('متى هو؟', 'matā huwa?', 'When is it?', false, 'متى = when.'),
      ]),
      step('Student', P('لا، قريب جداً، خمس دقائق تقريباً.', 'lā, qarīb jiddan, khams daqāʾiq taqrīban.', 'No, very close, about five minutes.'), 'How far is it?', [
        U('About 5 minutes, very close', true, 'قريب = near; دقائق = minutes.'),
        U('About 15 minutes', false, 'خمس = five.'),
        U('Very far', false, 'قريب is the opposite of بعيد.'),
      ], 'understand'),
      step(null, null, 'Thank her.', [
        C('شكراً جزيلاً!', 'shukran jazīlan!', 'Thank you very much!', true, "She'll reply 'ʿafwan' or 'lā shukr ʿalā wājib' (no thanks needed for a duty)."),
        C('عفواً.', 'ʿafwan.', "You're welcome.", false, "That's her line!"),
        C('إن شاء الله.', 'in shāʾa llāh.', 'God willing.', false, 'Nice phrase, wrong moment.'),
      ]),
    ],
  },
  {
    id: 'ar-sc-iftar', title: 'An Iftar Invitation', level: 'B1', emoji: '🌙', icon: 'moon.stars',
    setting: 'During Ramadan, your neighbor Umm Khalid greets you in the stairwell.', goal: 'Return the greeting, accept her invitation, and be a gracious guest at iftar.',
    steps: [
      step('Umm Khalid', P('رمضان كريم!', 'ramaḍān karīm!', 'Ramadan Kareem!'), 'Reply.', [
        C('الله أكرم!', 'allāhu akram!', 'God is more generous!', true, 'The standard reply.'),
        C('عيد مبارك!', 'ʿīd mubārak!', 'Happy Eid!', false, 'That one is for Eid, at the end of Ramadan.'),
        C('صحتين!', 'ṣaḥtēn!', 'Bon appétit!', false, "Not while she's fasting!"),
      ]),
      step('Umm Khalid', P('تفضّل عندنا على الفطور اليوم.', 'tfaḍḍal ʿindnā ʿal-fuṭūr il-yōm.', 'Please join us for iftar today.'), 'Accept and ask what time.', [
        C('يسعدني! متى الإفطار؟', 'yusʿidunī! matā al-ifṭār?', "I'd be delighted! When is iftar?", true, 'Gracious and practical.'),
        C('لا أريد.', 'lā urīd.', "I don't want to.", false, "Very blunt! If you can't go, say 'yā rēt, bas…' (I wish, but…)."),
        C('أنا صائم؟', 'ana ṣāʾim?', 'Am I fasting?', false, 'Not quite the question to ask.'),
      ]),
      step('Umm Khalid', P('مع أذان المغرب، الساعة سبعة تقريباً.', 'maʿ adhān il-maghrib, is-sāʿa sabʿa taqrīban.', 'At the sunset call to prayer, around seven.'), 'When should you arrive?', [
        U('A little before the sunset call to prayer (about 7)', true, 'Arrive a bit early. Everyone starts eating the moment the adhān sounds.'),
        U('At dawn', false, 'Dawn (fajr) is when the fast begins, not when it ends.'),
        U('After midnight', false, 'That is closer to suḥūr, the meal eaten before dawn.'),
      ], 'understand'),
      step(null, null, 'The call to prayer sounds and your host passes you dates. What do you say before eating?', [
        C('بسم الله.', 'bismillāh.', 'In the name of God.', true, 'Many people say this before eating. It is a gracious touch from a guest.'),
        C('الحساب من فضلك.', 'al-ḥisāb min faḍlak.', 'The bill, please.', false, 'Not at an iftar in someone’s home!'),
        C('تصبحون على خير.', 'tuṣbiḥūn ʿalā khayr.', 'Good night.', false, 'Too early for that.'),
      ]),
      step('Umm Khalid', P('صحتين! كُل كمان من الشوربة.', 'ṣaḥtēn! kul kamān min ish-shōrba.', 'Bon appétit! Have some more soup.'), 'Thank her and praise the food.', [
        C('سلمت إيديكِ، الأكل لذيذ!', 'salmit īdēki, il-akl ladhīdh!', 'Bless your hands, the food is delicious!', true, "Beautiful. You're a model guest."),
        C('على قلبك.', 'ʿala qalbik.', '(May it be) on your heart, too.', true, "The usual reply to 'ṣaḥtēn'. Adding 'salmit īdēki' praises the cook as well."),
        C('لا أحب الشوربة.', 'lā uḥibb ash-shūrba.', "I don't like soup.", false, 'Better to take a little and compliment it.'),
      ]),
    ],
  },
  {
    id: 'ar-sc-pharmacy', title: 'At the Pharmacy', level: 'B1', emoji: '💊', icon: 'cross.case',
    setting: "You've had a headache since yesterday, so you stop at a pharmacy.", goal: 'Describe your symptoms and understand the instructions.',
    steps: [
      step('Pharmacist', P('مساء الخير، كيف أستطيع أن أساعدك؟', 'masāʾ al-khayr, kayfa astaṭīʿu an usāʿidak?', 'Good evening, how can I help you?'), 'Explain that you have a headache.', [
        C('مساء النور. عندي صداع.', 'masāʾ an-nūr. ʿindī ṣudāʿ.', 'Good evening. I have a headache.', true, "عندي = I have (literally 'at me')."),
        C('أنا صداع.', 'ana ṣudāʿ.', 'I am a headache.', false, "Use عندي for 'I have'."),
        C('عندي صديق.', 'ʿindī ṣadīq.', 'I have a friend.', false, 'صديق (ṣadīq) = friend; صداع (ṣudāʿ) = headache!'),
      ]),
      step('Pharmacist', P('منذ متى؟', 'mundhu matā?', 'Since when?'), 'Say: since yesterday.', [
        C('منذ أمس.', 'mundhu ams.', 'Since yesterday.', true, 'أمس = yesterday.'),
        C('منذ غداً.', 'mundhu ghadan.', 'Since tomorrow.', false, "غداً = tomorrow. That can't be right!"),
        C('الساعة خمسة.', 'as-sāʿa khamsa.', "Five o'clock.", false, 'He asked how long, not what time.'),
      ]),
      step('Pharmacist', P('هل عندك حساسية من أي دواء؟', 'hal ʿindak ḥassāsiyya min ayy dawāʾ?', 'Are you allergic to any medicine?'), 'Answer: no.', [
        C('لا، ليس عندي حساسية.', 'lā, laysa ʿindī ḥassāsiyya.', "No, I don't have any allergies.", true, "ليس عندي = I don't have."),
        C('نعم، عندي دواء.', 'naʿam, ʿindī dawāʾ.', 'Yes, I have medicine.', false, 'He asked about allergies (ḥassāsiyya).'),
        C('لا أعرف الدواء.', 'lā aʿrif ad-dawāʾ.', "I don't know the medicine.", false, "That isn't what he asked."),
      ]),
      step('Pharmacist', P('خذ حبة كل ست ساعات بعد الأكل.', 'khudh ḥabba kull sitt sāʿāt baʿd al-akl.', 'Take one pill every six hours, after food.'), 'How should you take it?', [
        U('One pill every 6 hours, after eating', true, 'كل = every; ست = six; بعد = after.'),
        U('Six pills once a day', false, 'ست ساعات = six hours.'),
        U('One pill before eating', false, 'بعد = after. Before would be قبل.'),
      ], 'understand'),
      step(null, null, 'Ask how much it costs.', [
        C('بكم الدواء؟', 'bikam ad-dawāʾ?', 'How much is the medicine?', true, 'Done! Get well soon: salāmtak!'),
        C('أين الدواء؟', 'ayna ad-dawāʾ?', 'Where is the medicine?', false, "He's holding it. Ask the price."),
        C('متى الدواء؟', 'matā ad-dawāʾ?', 'When is the medicine?', false, 'متى = when.'),
      ]),
    ],
  },
];

const aptitude = [
  A('A1', 'vocabulary', "What does 'شكراً' mean?", ['Thank you', 'Hello', 'Please', 'Sorry']),
  A('A1', 'reading', 'Which letter is bāʾ (b)?', ['ب', 'ت', 'ث', 'ن'], 'ب has one dot below; ت has two above; ث has three; ن has one above.'),
  A('A1', 'vocabulary', 'ماء means…', ['water', 'bread', 'house', 'sun']),
  A('A1', 'grammar', "Complete: 'I am a student (m).'", ['طالب', 'طالبة', 'أكتب', 'الطلاب'], 'No verb "to be" is needed, and طالبة is feminine.', 'أنا ___'),
  A('A1', 'culture', "What's the correct reply to 'السلام عليكم'?", ['وعليكم السلام', 'صباح النور', 'مع السلامة', 'عفواً']),
  A('A2', 'grammar', 'In which word is the l of al- NOT pronounced?', ['الشمس', 'القمر', 'الباب', 'الكتاب'], 'ش is a sun letter: ash-shams.'),
  A('A2', 'grammar', "'My book' is…", ['كتابي', 'كتابك', 'كتابه', 'كتابها']),
  A('A2', 'reading', 'What does this question mean?', ['Where is the station?', 'When does the train leave?', 'How much is the ticket?', 'Is the station big?'], null, 'أين المحطة؟'),
  A('A2', 'grammar', "Complete: 'a big city'", ['كبيرة', 'كبير', 'الكبيرة', 'كبار'], 'Feminine nouns take feminine adjectives.', 'مدينة ___'),
  A('A2', 'culture', 'In most Arab countries, the main weekly day off is…', ['Friday', 'Sunday', 'Monday', 'Wednesday']),
  A('B1', 'grammar', "'We wrote' is…", ['كتبنا', 'كتبتُ', 'كتبوا', 'نكتب']),
  A('B1', 'reading', 'What did the person buy?', ['bread', 'fruit', 'meat', 'a book'], null, 'ذهبتُ إلى السوق واشتريتُ خبزاً.'),
  A('B1', 'grammar', "'He didn't go' in MSA is…", ['لم يذهب', 'لا ذهب', 'لن يذهب', 'ليس ذهب'], 'لم + jussive negates the past.'),
  A('B1', 'vocabulary', "Which word from the root ك-ت-ب means 'library'?", ['مكتبة', 'كاتب', 'كتاب', 'مكتوب']),
  A('B1', 'culture', 'نعيماً is said to someone who has just…', ['had a haircut or shower', 'sneezed', 'got back from a trip', 'got married']),
  A('B2', 'grammar', 'After إنّ, the subject takes which case?', ['accusative (manṣūb)', 'nominative (marfūʿ)', 'genitive (majrūr)', 'jussive (majzūm)']),
  A('B2', 'grammar', 'Form X verbs (istafʿala) often mean…', ['seeking or requesting', 'doing something together', 'causing', 'the passive']),
  A('B2', 'grammar', "Complete: 'The weather was beautiful.'", ['جميلاً', 'جميلٌ', 'جميلٍ', 'الجميل'], 'كان makes its predicate accusative.', 'كان الجوُّ ___'),
  A('B2', 'reading', 'What does this sentence mean?', ['Despite the difficulties, the project succeeded.', 'Because of the difficulties, the project failed.', 'The project caused many difficulties.', 'After the difficulties, the project began.'], null, 'على الرغم من الصعوبات، نجح المشروع.'),
  A('B2', 'culture', "The Egyptian word عايز (ʿāyiz) corresponds to which MSA word?", ['أريد (want)', 'أعرف (know)', 'أحب (love)', 'أذهب (go)']),
];

// [Arabic, transliteration, English]. English alternatives are separated by ';'.
const dictionary = [
  ['مرحبا', 'marḥaban', 'hello; hi'], ['أهلا', 'ahlan', 'welcome; hi'], ['أهلا وسهلا', 'ahlan wa-sahlan', 'welcome'],
  ['السلام عليكم', 'as-salāmu ʿalaykum', 'peace be upon you; hello (formal)'], ['وعليكم السلام', 'wa-ʿalaykum as-salām', 'and upon you peace'],
  ['صباح الخير', 'ṣabāḥ al-khayr', 'good morning'], ['صباح النور', 'ṣabāḥ an-nūr', 'good morning (reply)'],
  ['مساء الخير', 'masāʾ al-khayr', 'good evening; good afternoon'], ['مساء النور', 'masāʾ an-nūr', 'good evening (reply)'],
  ['كيف حالك', 'kayfa ḥāluk', 'how are you'], ['الحمد لله', 'al-ḥamdu lillāh', 'thank God; praise God'],
  ['بخير', 'bi-khayr', 'well; fine'], ['شكرا', 'shukran', 'thank you; thanks'], ['شكرا جزيلا', 'shukran jazīlan', 'thank you very much'],
  ['عفوا', 'ʿafwan', "you're welcome; excuse me"], ['من فضلك', 'min faḍlak', 'please'], ['لو سمحت', 'law samaḥt', 'excuse me; if you please'],
  ['مع السلامة', 'maʿa as-salāma', 'goodbye; bye'], ['إلى اللقاء', 'ilā al-liqāʾ', 'see you later; see you'], ['تصبح على خير', 'tuṣbiḥ ʿalā khayr', 'good night'],
  ['نعم', 'naʿam', 'yes'], ['لا', 'lā', 'no; not'], ['آسف', 'āsif', 'sorry'], ['إن شاء الله', 'in shāʾa llāh', 'God willing; hopefully'],
  ['ما شاء الله', 'mā shāʾa llāh', 'wonderful (admiration)'], ['تفضل', 'tafaḍḍal', 'please go ahead; here you are'],
  ['اسمي', 'ismī', 'my name is; my name'], ['ما اسمك', 'mā ismuk', 'what is your name'], ['أنا من', 'ana min', 'I am from'],
  ['أين الحمام', 'ayna al-ḥammām', 'where is the bathroom'], ['بكم هذا', 'bikam hādhā', 'how much is this'],
  ['لا أفهم', 'lā afham', "I don't understand; I do not understand"], ['لا أعرف', 'lā aʿrif', "I don't know; I do not know"],
  ['هل تتكلم الإنجليزية', 'hal tatakallamu al-injlīziyya', 'do you speak English'],
  ['أتكلم العربية قليلا', 'atakallamu al-ʿarabiyya qalīlan', 'I speak a little Arabic'],
  ['الحساب من فضلك', 'al-ḥisāb min faḍlak', 'the bill please; the check please'], ['ساعدني', 'sāʿidnī', 'help me'], ['تشرفنا', 'tasharrafnā', 'nice to meet you'],
  ['أنا', 'ana', 'I; me'], ['أنت', 'anta / anti', 'you'], ['هو', 'huwa', 'he; it'], ['هي', 'hiya', 'she; it'],
  ['نحن', 'naḥnu', 'we; us'], ['هم', 'hum', 'they; them'], ['أنتم', 'antum', 'you (plural)'],
  ['ماذا', 'mādhā', 'what'], ['ما', 'mā', 'what; not'], ['من', 'man / min', 'who; from'], ['أين', 'ayna', 'where'], ['متى', 'matā', 'when'],
  ['كيف', 'kayfa', 'how'], ['لماذا', 'limādhā', 'why'], ['كم', 'kam', 'how many; how much'], ['بكم', 'bikam', 'how much (price)'], ['هل', 'hal', '(yes/no question)'],
  ['أب', 'ab', 'father'], ['أم', 'umm', 'mother'], ['أخ', 'akh', 'brother'], ['أخت', 'ukht', 'sister'], ['ابن', 'ibn', 'son'],
  ['بنت', 'bint', 'girl; daughter'], ['ولد', 'walad', 'boy; child'], ['عائلة', 'ʿāʾila', 'family'], ['زوج', 'zawj', 'husband'],
  ['زوجة', 'zawja', 'wife'], ['جد', 'jadd', 'grandfather'], ['جدة', 'jadda', 'grandmother'], ['صديق', 'ṣadīq', 'friend'], ['رجل', 'rajul / rijl', 'man; leg'], ['امرأة', 'imraʾa', 'woman'],
  ['قهوة', 'qahwa', 'coffee'], ['شاي', 'shāy', 'tea'], ['ماء', 'māʾ', 'water'], ['خبز', 'khubz', 'bread'], ['حليب', 'ḥalīb', 'milk'],
  ['سكر', 'sukkar', 'sugar'], ['لحم', 'laḥm', 'meat'], ['دجاج', 'dajāj', 'chicken'], ['سمك', 'samak', 'fish'], ['أرز', 'aruzz', 'rice'],
  ['فاكهة', 'fākiha', 'fruit'], ['تفاح', 'tuffāḥ', 'apple; apples'], ['برتقال', 'burtuqāl', 'orange; oranges'], ['خضار', 'khuḍār', 'vegetables'],
  ['ملح', 'milḥ', 'salt'], ['طعام', 'ṭaʿām', 'food'], ['أكل', 'akl / akala', 'food; ate; eat'], ['مطعم', 'maṭʿam', 'restaurant'], ['فطور', 'fuṭūr', 'breakfast; iftar meal'],
  ['غداء', 'ghadāʾ', 'lunch'], ['عشاء', 'ʿashāʾ', 'dinner'], ['حمص', 'ḥummuṣ', 'hummus; chickpeas'], ['فلافل', 'falāfil', 'falafel'],
  ['تمر', 'tamr', 'dates (fruit)'], ['عصير', 'ʿaṣīr', 'juice'], ['لذيذ', 'ladhīdh', 'delicious; tasty'],
  ['بيت', 'bayt', 'house; home'], ['مدرسة', 'madrasa', 'school'], ['جامعة', 'jāmiʿa', 'university'], ['سوق', 'sūq', 'market; souq'],
  ['مستشفى', 'mustashfā', 'hospital'], ['صيدلية', 'ṣaydaliyya', 'pharmacy'], ['فندق', 'funduq', 'hotel'], ['مطار', 'maṭār', 'airport'],
  ['محطة', 'maḥaṭṭa', 'station'], ['شارع', 'shāriʿ', 'street'], ['مدينة', 'madīna', 'city'], ['قرية', 'qarya', 'village'],
  ['مسجد', 'masjid', 'mosque'], ['كنيسة', 'kanīsa', 'church'], ['مكتب', 'maktab', 'office; desk'], ['مكتبة', 'maktaba', 'library; bookstore'],
  ['بنك', 'bank', 'bank'], ['حمام', 'ḥammām', 'bathroom'], ['غرفة', 'ghurfa', 'room'], ['باب', 'bāb', 'door'], ['نافذة', 'nāfidha', 'window'],
  ['بحر', 'baḥr', 'sea'], ['صحراء', 'ṣaḥrāʾ', 'desert'], ['جبل', 'jabal', 'mountain'], ['متحف', 'matḥaf', 'museum'],
  ['سيارة', 'sayyāra', 'car'], ['تاكسي', 'tāksī', 'taxi'], ['حافلة', 'ḥāfila', 'bus'], ['قطار', 'qiṭār', 'train'], ['طائرة', 'ṭāʾira', 'airplane; plane'], ['تذكرة', 'tadhkira', 'ticket'],
  ['يمين', 'yamīn', 'right'], ['يسار', 'yasār', 'left'], ['على طول', 'ʿalā ṭūl', 'straight ahead'], ['قريب', 'qarīb', 'near; close'],
  ['بعيد', 'baʿīd', 'far'], ['هنا', 'hunā', 'here'], ['هناك', 'hunāka', 'there'], ['أمام', 'amāma', 'in front of'], ['وراء', 'warāʾa', 'behind'], ['بجانب', 'bi-jānib', 'next to'],
  ['في', 'fī', 'in; at'], ['على', 'ʿalā', 'on'], ['إلى', 'ilā', 'to'], ['مع', 'maʿa', 'with'], ['بدون', 'bidūn', 'without'], ['عند', 'ʿinda', 'at; by'],
  ['عندي', 'ʿindī', 'I have'], ['و', 'wa', 'and'], ['أو', 'aw', 'or'], ['لكن', 'lākin', 'but'], ['جدا', 'jiddan', 'very'],
  ['يوم', 'yawm', 'day'], ['اليوم', 'al-yawm', 'today'], ['غدا', 'ghadan', 'tomorrow'], ['أمس', 'ams', 'yesterday'], ['الآن', 'al-ān', 'now'],
  ['ساعة', 'sāʿa', 'hour; clock; watch'], ['دقيقة', 'daqīqa', 'minute'], ['أسبوع', 'usbūʿ', 'week'], ['شهر', 'shahr', 'month'], ['سنة', 'sana', 'year'],
  ['صباح', 'ṣabāḥ', 'morning'], ['مساء', 'masāʾ', 'evening'], ['ليل', 'layl', 'night'],
  ['الأحد', 'al-aḥad', 'Sunday'], ['الاثنين', 'al-ithnayn', 'Monday'], ['الثلاثاء', 'ath-thulāthāʾ', 'Tuesday'], ['الأربعاء', 'al-arbiʿāʾ', 'Wednesday'],
  ['الخميس', 'al-khamīs', 'Thursday'], ['الجمعة', 'al-jumʿa', 'Friday'], ['السبت', 'as-sabt', 'Saturday'],
  ['صفر', 'ṣifr', 'zero'], ['واحد', 'wāḥid', 'one'], ['اثنان', 'ithnān', 'two'], ['ثلاثة', 'thalātha', 'three'], ['أربعة', 'arbaʿa', 'four'],
  ['خمسة', 'khamsa', 'five'], ['ستة', 'sitta', 'six'], ['سبعة', 'sabʿa', 'seven'], ['ثمانية', 'thamāniya', 'eight'], ['تسعة', 'tisʿa', 'nine'],
  ['عشرة', 'ʿashara', 'ten'], ['عشرون', 'ʿishrūn', 'twenty'], ['ثلاثون', 'thalāthūn', 'thirty'], ['خمسون', 'khamsūn', 'fifty'], ['مئة', 'miʾa', 'hundred; one hundred'], ['ألف', 'alf', 'thousand'],
  ['كبير', 'kabīr', 'big; large'], ['صغير', 'ṣaghīr', 'small; little'], ['جميل', 'jamīl', 'beautiful; nice'], ['جديد', 'jadīd', 'new'],
  ['قديم', 'qadīm', 'old'], ['جيد', 'jayyid', 'good'], ['سيئ', 'sayyiʾ', 'bad'], ['حار', 'ḥārr', 'hot'], ['بارد', 'bārid', 'cold'],
  ['غالي', 'ghālī', 'expensive'], ['رخيص', 'rakhīṣ', 'cheap'], ['سهل', 'sahl', 'easy'], ['صعب', 'ṣaʿb', 'difficult; hard'],
  ['سعيد', 'saʿīd', 'happy'], ['حزين', 'ḥazīn', 'sad'], ['تعبان', 'taʿbān', 'tired'], ['جائع', 'jāʾiʿ', 'hungry'], ['عطشان', 'ʿaṭshān', 'thirsty'],
  ['مريض', 'marīḍ', 'sick; ill'], ['كثير', 'kathīr', 'a lot; many; much'], ['قليل', 'qalīl', 'a little; few'], ['طويل', 'ṭawīl', 'tall; long'], ['قصير', 'qaṣīr', 'short'],
  ['كتب', 'kataba', 'wrote; write'], ['أكتب', 'aktubu', 'I write'], ['ذهب', 'dhahaba / dhahab', 'went; go; gold'], ['أذهب', 'adhhabu', 'I go'],
  ['شرب', 'shariba', 'drank; drink'], ['أشرب', 'ashrabu', 'I drink'], ['آكل', 'ākulu', 'I eat'], ['أريد', 'urīdu', 'I want; want'], ['يريد', 'yurīdu', 'he wants; wants'],
  ['أحب', 'uḥibbu', 'I love; I like; love; like'], ['أعرف', 'aʿrifu', 'I know; know'], ['فهم', 'fahima', 'understood; understand'], ['أفهم', 'afhamu', 'I understand'],
  ['قرأ', 'qaraʾa', 'read'], ['أقرأ', 'aqraʾu', 'I read'], ['تكلم', 'takallama', 'spoke; speak'], ['أتكلم', 'atakallamu', 'I speak'],
  ['أسكن', 'askunu', 'I live'], ['عمل', 'ʿamal / ʿamila', 'work; job; worked'], ['أعمل', 'aʿmalu', 'I work'], ['درس', 'darasa / dars', 'studied; study; lesson'], ['أدرس', 'adrusu', 'I study'],
  ['جاء', 'jāʾa', 'came; come'], ['اشترى', 'ishtarā', 'bought; buy'], ['أشتري', 'ashtarī', 'I buy'], ['نام', 'nāma', 'slept; sleep'],
  ['رأى', 'raʾā', 'saw; see'], ['أرى', 'arā', 'I see'], ['فتح', 'fataḥa', 'opened; open'], ['سافر', 'sāfara', 'traveled; travel'],
  ['ساعد', 'sāʿada', 'helped; help'], ['دفع', 'dafaʿa', 'paid; pay'], ['انتظر', 'intaẓara', 'waited; wait'], ['تعلم', 'taʿallama', 'learned; learn'],
  ['كتاب', 'kitāb', 'book'], ['قلم', 'qalam', 'pen'], ['ورقة', 'waraqa', 'paper; sheet'], ['هاتف', 'hātif', 'phone; telephone'], ['مال', 'māl', 'money'],
  ['فلوس', 'fulūs', 'money (colloquial)'], ['شمس', 'shams', 'sun'], ['قمر', 'qamar', 'moon'], ['طقس', 'ṭaqs', 'weather'], ['لغة', 'lugha', 'language'],
  ['العربية', 'al-ʿarabiyya', 'Arabic'], ['الإنجليزية', 'al-injlīziyya', 'English'], ['الإسبانية', 'al-isbāniyya', 'Spanish'], ['كلمة', 'kalima', 'word'],
  ['سؤال', 'suʾāl', 'question'], ['جواب', 'jawāb', 'answer'], ['اسم', 'ism', 'name'], ['طبيب', 'ṭabīb', 'doctor'], ['معلم', 'muʿallim', 'teacher'],
  ['طالب', 'ṭālib', 'student'], ['دواء', 'dawāʾ', 'medicine'], ['صداع', 'ṣudāʿ', 'headache'], ['ألم', 'alam', 'pain'], ['عمر', 'ʿumr', 'age'],
  ['سعر', 'siʿr', 'price'], ['سلام', 'salām', 'peace'], ['حب', 'ḥubb', 'love'], ['هدية', 'hadiyya', 'gift; present'], ['عيد', 'ʿīd', 'holiday; feast; Eid'],
  ['رمضان', 'ramaḍān', 'Ramadan'], ['عيد مبارك', 'ʿīd mubārak', 'happy Eid; Eid Mubarak'], ['رمضان كريم', 'ramaḍān karīm', 'Ramadan Kareem; happy Ramadan'],
  ['هذا', 'hādhā', 'this (m)'], ['هذه', 'hādhihi', 'this (f)'], ['ذلك', 'dhālika', 'that (m)'], ['تلك', 'tilka', 'that (f)'],
  ['يلا', 'yallā', "let's go; come on"], ['خلاص', 'khalāṣ', 'enough; done; finished'], ['معلش', 'maʿlesh', "never mind; it's okay"],
  ['تمام', 'tamām', 'okay; great; perfect'], ['كويس', 'kwayyis', 'good; fine (Egy./Lev.)'], ['شو', 'shū', 'what (Levantine)'], ['ليش', 'lēsh', 'why (Lev./Gulf)'],
  ['ازيك', 'izzayyak', 'how are you (Egyptian)'], ['كيفك', 'kīfak', 'how are you (Levantine)'], ['بدي', 'biddī', 'I want (Levantine)'],
  ['عايز', 'ʿāyiz', 'I want (Egyptian)'], ['حبيبي', 'ḥabībī', 'my dear; darling; habibi'], ['والله', 'wallāh', 'really; I swear'],
];

const media = [
  M('A1', 'Book', 'Alif Baa: Introduction to Arabic Letters and Sounds', 'Brustad, Al-Batal & Al-Tonsi', 'The standard university introduction to the script, with audio for every letter and sound.', 'Georgetown University Press', ['reading', 'writing']),
  M('A1', 'TV', 'Iftah Ya Simsim (افتح يا سمسم)', 'Arabic Sesame Street', 'Simple, clear Modern Standard Arabic for children. Great for your first listening practice.', 'YouTube / regional TV', ['listening']),
  M('A1', 'Web', 'Al Jazeera Learning Arabic', 'Al Jazeera', 'Free graded MSA lessons built around news topics, with audio.', 'learning.aljazeera.net', ['reading', 'listening']),
  M('A2', 'Book', 'Al-Kitaab fii Taʿallum al-ʿArabiyya, Part 1', 'Brustad, Al-Batal & Al-Tonsi', 'A widely used course that builds MSA and Egyptian or Levantine colloquial side by side.', 'Georgetown University Press', ['grammar', 'reading']),
  M('A2', 'TV', 'Detective Conan (المحقق كونان), Arabic dub', 'Arabic dub', 'A cult favorite with learners: crisp MSA dialogue, with lots of repeated phrases.', 'Streaming / YouTube', ['listening']),
  M('A2', 'Music', 'Fairuz: "Nassam Alayna el Hawa" (نسم علينا الهوا)', 'Fairuz', 'A slow, clearly sung Lebanese classic. Look up the lyrics and sing along.', 'Music streaming', ['listening', 'culture']),
  M('B1', 'Film', 'Wadjda (2012)', 'Haifaa al-Mansour', 'The first feature film shot entirely in Saudi Arabia: a girl saving up for a bicycle. Gulf dialect with subtitles.', 'Streaming / DVD', ['listening', 'culture']),
  M('B1', 'TV', 'AlRawabi School for Girls (2021)', 'Netflix, Jordan', 'A teen drama in natural Levantine Arabic, a good step into dialect.', 'Netflix', ['listening']),
  M('B1', 'News', 'BBC News Arabic (بي بي سي عربي)', 'BBC', 'Short MSA news articles and videos. Read a story, then watch the video version.', 'bbc.com/arabic', ['reading', 'listening']),
  M('B1', 'Book', 'Kalila wa Dimna (كليلة ودمنة), simplified editions', 'Ibn al-Muqaffaʿ (8th century)', 'Classic animal fables. Simplified editions are ideal first "real" reading.', 'Bookshops / libraries', ['reading', 'culture']),
  M('B2', 'Film', 'Theeb (2014)', 'Naji Abu Nowar', 'An Oscar-nominated Jordanian Bedouin adventure set during WWI.', 'Streaming / DVD', ['listening', 'culture']),
  M('B2', 'Film', 'Capernaum (2018)', 'Nadine Labaki', 'A powerful Lebanese drama in fast, real Beirut street dialect.', 'Streaming', ['listening']),
  M('B2', 'TV', 'Paranormal (ما وراء الطبيعة) (2020)', 'Netflix, Egypt', "Egyptian dialect thriller based on Ahmed Khaled Tawfik's bestselling novels.", 'Netflix', ['listening']),
  M('B2', 'Book', 'Ma Waraa al-Tabiaa novels', 'Ahmed Khaled Tawfik', 'Gripping, accessible modern MSA prose, much loved by young Arab readers.', 'Bookshops / e-book', ['reading']),
  M('C1', 'Book', 'Midaq Alley (زقاق المدق)', 'Naguib Mahfouz', 'A novel by the Nobel laureate about one Cairo alley. Rich, literary MSA.', 'Bookshops', ['reading', 'culture']),
  M('C1', 'Book', 'Season of Migration to the North (موسم الهجرة إلى الشمال)', 'Tayeb Salih', 'A landmark Sudanese novel about identity and colonialism.', 'Bookshops', ['reading']),
  M('C1', 'Music', 'Umm Kulthum: "Enta Omri" (أنت عمري)', 'Umm Kulthum', 'An hour-long masterpiece in elevated Egyptian Arabic, the voice of the 20th century.', 'Music streaming', ['listening', 'culture']),
  M('C1', 'TV', 'Al Jazeera Documentary (الجزيرة الوثائقية)', 'Al Jazeera', 'Long-form MSA narration on history, science and society.', 'YouTube / satellite', ['listening']),
];

function orderCategories(list, order) {
  return order.map((id) => {
    const c = list.find((x) => x.id === id);
    if (!c) throw new Error(`missing category ${id}`);
    return c;
  });
}

// Later lists only add words the earlier ones don't already have.
function mergeDictionary(...lists) {
  const seen = new Set();
  return lists.flat().filter(([t]) => !seen.has(t) && seen.add(t));
}

export default {
  id: 'ar',
  name: 'Arabic',
  nativeName: 'العربية',
  subtitle: 'Modern Standard Arabic with everyday Egyptian & Levantine',
  symbol: 'ع',
  dir: 'rtl',
  speech: 'ar-SA',
  accent: '#0f766e',
  translateSkipEn: ['a', 'an', 'the', 'is', 'am', 'are'],
  categories: orderCategories([...categories, ...more.categories, ...kitaab.categories], ["ar-greet", "ar-noun", "ar-num", "ar-food", "ar-health", "ar-verb", "ar-dir", "ar-egy", "ar-lev", "ar-cult", "ar-work", "ar-kitaab", "ar-story", "ar-adv", "ar-news"]),
  reading, aptitude,
  media: [...media, ...kitaab.media],
  scenarios: [...scenarios, ...more.scenarios, ...kitaab.scenarios],
  dictionary: mergeDictionary(dictionary, more.dictionary, kitaab.dictionary),
  writingPrompts: [...more.writingPrompts, ...kitaab.writingPrompts],
  speakingPrompts: [...more.speakingPrompts, ...kitaab.speakingPrompts],
  levelHours: more.levelHours,
};
