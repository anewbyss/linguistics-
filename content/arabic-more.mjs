// Arabic expansion: B1–C1 lessons, Egyptian and Levantine dialect track, more scenarios,
// a larger dictionary, free-writing and free-speaking prompts.
import { P, Q, C, T } from './helpers.mjs';

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

export const categories = [
  {
    id: 'ar-health', title: 'Health & the Body', nativeTitle: 'الصحة والجسم',
    icon: 'cross.case', emoji: '🩺',
    summary: 'Body parts, the dual, saying what hurts, and visiting the sick.',
    lessons: [
      {
        id: 'ar-health-1', title: 'The Body & Feeling Unwell', level: 'A2',
        summary: 'The dual form and describing symptoms.',
        grammar: {
          title: 'The dual: two hands, two eyes',
          body: [
            'Arabic has a special form for exactly two of something, the dual (al-muthannā). Add -ān (or -ayn after prepositions and in speech): yad (hand) → yadān / yadayn.',
            'Many body parts come in pairs: عين ʿayn (eye) → عينان ʿaynān; أذن udhun (ear) → أذنان udhunān.',
            "To say something hurts, MSA uses يؤلمني (yuʾlimunī, 'it hurts me'): رأسي يؤلمني raʾsī yuʾlimunī (my head hurts). عندي صداع ʿindī ṣudāʿ (I have a headache) is understood everywhere.",
          ],
          table: T(['Singular', 'Dual', 'Meaning'],
            ['يد yad', 'يدان yadān', 'two hands'], ['عين ʿayn', 'عينان ʿaynān', 'two eyes'],
            ['أذن udhun', 'أذنان udhunān', 'two ears'], ['رِجل rijl', 'رِجلان rijlān', 'two legs / feet'],
            ['كتاب kitāb', 'كتابان kitābān', 'two books']),
        },
        vocab: [
          P('رأس', 'raʾs', 'head'), P('بطن', 'baṭn', 'stomach / belly'), P('ظهر', 'ẓahr', 'back'),
          P('سنّ', 'sinn', 'tooth'), P('حرارة', 'ḥarāra', 'fever / temperature'), P('زكام', 'zukām', 'a cold'),
          P('يؤلمني', 'yuʾlimunī', 'it hurts me'),
        ],
        examples: [
          P('رأسي يؤلمني منذ الصباح.', 'raʾsī yuʾlimunī mundhu aṣ-ṣabāḥ.', 'My head has been hurting since the morning.'),
          P('عندي حرارة وزكام.', 'ʿindī ḥarāra wa-zukām.', 'I have a fever and a cold.'),
          P('سلامتك! — الله يسلمك.', 'salāmtak! — allāh ysallmak.', 'Get well soon! — Thank you (God keep you safe).'),
        ],
        culture: {
          title: 'Visiting the sick',
          body: [
            'Visiting someone who is ill (ʿiyādat al-marīḍ) is an important social duty. Visitors bring fruit, juice or sweets.',
            "Wish a sick person سلامتك (salāmtak to a man, salāmtik to a woman), literally 'your safety'. The reply is الله يسلمك.",
            'Pharmacists are often the first stop for minor illnesses and give advice freely.',
          ],
        },
        quiz: [
          Q("'Two eyes' is…", ['عينان', 'عين', 'عيون', 'عيني'], 'عيون is the plural (eyes in general); عينان is exactly two.'),
          Q('رأسي يؤلمني means…', ['My head hurts', 'I have a fever', 'My back hurts', "I'm tired"]),
          Q('What do you say to someone who is ill?', ['سلامتك', 'مبروك', 'نعيماً', 'صحتين']),
          Q('The dual ending -ān means…', ['exactly two', 'many', 'one', 'none']),
        ],
      },
    ],
  },
  {
    id: 'ar-work', title: 'Work & Opinions', nativeTitle: 'العمل والآراء',
    icon: 'briefcase', emoji: '💼',
    summary: 'The workplace, linking verbs with أن, comparisons and giving opinions.',
    lessons: [
      {
        id: 'ar-work-1', title: 'Jobs & the Workplace', level: 'B1',
        summary: "أن + subjunctive and talking about work.",
        grammar: {
          title: 'أن + subjunctive: I want to…',
          body: [
            "To say 'I want to work', Arabic links two verbs with أن (an) and puts the second in the subjunctive, which ends in -a: أريد أن أعمل urīdu an aʿmala.",
            'The same pattern follows يجب أن (yajibu an, must), أحب أن (uḥibbu an, I like to) and أستطيع أن (astaṭīʿu an, I can).',
            'Instead of أن + verb you can use a verbal noun (maṣdar): أحب العمل هنا uḥibbu al-ʿamala hunā (I love working here).',
          ],
          table: T(['English', 'Arabic', 'Say'],
            ['I want to work', 'أريد أن أعمل', 'urīdu an aʿmala'], ['I must travel', 'يجب أن أسافر', 'yajibu an usāfira'],
            ['I can come', 'أستطيع أن آتي', 'astaṭīʿu an ātiya'], ['I like reading', 'أحب القراءة', 'uḥibbu al-qirāʾa'],
            ['I hope to succeed', 'أتمنى أن أنجح', 'atamannā an anjaḥa']),
        },
        vocab: [
          P('وظيفة', 'waẓīfa', 'job / position'), P('شركة', 'sharika', 'company'), P('مدير', 'mudīr', 'manager'),
          P('زميل / زميلة', 'zamīl / zamīla', 'colleague (m / f)'), P('راتب', 'rātib', 'salary'),
          P('اجتماع', 'ijtimāʿ', 'meeting'), P('مقابلة عمل', 'muqābalat ʿamal', 'job interview'),
        ],
        examples: [
          P('أعمل مهندساً في شركة كبيرة.', 'aʿmalu muhandisan fī sharika kabīra.', 'I work as an engineer in a big company.', 'After أعمل the job title takes -an (accusative).'),
          P('عندي اجتماع مع المدير الساعة العاشرة.', 'ʿindī ijtimāʿ maʿa al-mudīr as-sāʿa al-ʿāshira.', 'I have a meeting with the manager at ten.'),
          P('أريد أن أغيّر وظيفتي.', 'urīdu an ughayyira waẓīfatī.', 'I want to change my job.'),
        ],
        culture: {
          title: 'Work culture',
          body: [
            "Relationships matter: expect coffee and small talk before business, and don't rush to the agenda.",
            'واسطة (wāsṭa), personal connections or influence, is a widely discussed part of getting things done in many Arab countries.',
            'Work weeks differ: Sunday to Thursday is common (for example in Saudi Arabia, Egypt and Jordan), while the UAE moved to Monday to Friday in 2022.',
            'Titles are used at work as forms of address: ustādh, duktūr, muhandis (engineer).',
          ],
        },
        quiz: [
          Q("'I want to work' (MSA) is…", ['أريد أن أعمل', 'أريد أعمل', 'أريد عمل أن', 'أعمل أريد']),
          Q('راتب means…', ['salary', 'office', 'meeting', 'colleague']),
          Q('واسطة refers to…', ['personal connections / influence', 'a type of contract', 'a meeting room', 'overtime']),
          Q('After أن the verb is…', ['subjunctive (-a)', 'past tense', 'jussive', 'always a noun']),
        ],
      },
      {
        id: 'ar-work-2', title: 'Opinions & Comparisons', level: 'B1',
        summary: 'أفعل comparatives, superlatives and polite disagreement.',
        grammar: {
          title: 'Comparatives and giving opinions',
          body: [
            'Comparatives use the pattern أفعل (afʿal): كبير kabīr → أكبر akbar (bigger), صغير → أصغر aṣghar, جميل → أجمل ajmal, جيد → أفضل afḍal (better).',
            'Add من (min, than): القاهرة أكبر من عمّان al-Qāhira akbar min ʿAmmān (Cairo is bigger than Amman). The form does not change for gender.',
            'With al- it becomes a superlative: الأكبر al-akbar (the biggest). Before a noun: أكبر مدينة akbar madīna (the biggest city).',
            'Give opinions with أعتقد أنّ (aʿtaqidu anna, I think that), في رأيي (fī raʾyī, in my opinion) and أوافق / لا أوافق (uwāfiqu / lā uwāfiqu, I agree / disagree).',
          ],
          table: T(['Adjective', 'Comparative', 'Superlative'],
            ['كبير big', 'أكبر bigger', 'الأكبر the biggest'], ['صغير small', 'أصغر smaller', 'الأصغر the smallest'],
            ['جميل beautiful', 'أجمل more beautiful', 'الأجمل the most beautiful'], ['جيد good', 'أفضل better', 'الأفضل the best'],
            ['سهل easy', 'أسهل easier', 'الأسهل the easiest']),
        },
        vocab: [
          P('في رأيي', 'fī raʾyī', 'in my opinion'), P('أعتقد أنّ', 'aʿtaqidu anna', 'I think that'),
          P('أوافق', 'uwāfiqu', 'I agree'), P('لا أوافق', 'lā uwāfiqu', 'I disagree'),
          P('من ناحية', 'min nāḥiya', 'on one hand'), P('ومن ناحية أخرى', 'wa-min nāḥiya ukhrā', 'on the other hand'),
          P('أفضل', 'afḍal', 'better / best'),
        ],
        examples: [
          P('في رأيي، الحياة في القرية أهدأ من المدينة.', 'fī raʾyī, al-ḥayāh fī al-qarya ahdaʾ min al-madīna.', 'In my opinion, life in the village is calmer than in the city.'),
          P('أعتقد أنّ العربية أصعب من الإسبانية.', 'aʿtaqidu anna al-ʿarabiyya aṣʿab min al-isbāniyya.', 'I think Arabic is harder than Spanish.'),
          P('مع احترامي، لا أوافق.', 'maʿa iḥtirāmī, lā uwāfiq.', 'With respect, I disagree.'),
        ],
        culture: {
          title: 'Disagreeing politely',
          body: [
            'Soften disagreement: start with مع احترامي (maʿa iḥtirāmī, with respect) or معك حق، بس… (maʿak ḥaqq, bas…, you\'re right, but…).',
            'Directly criticising someone senior in public can cause loss of face, so disagreement is often expressed privately or indirectly.',
            'Lively debate among friends, though, is a favourite pastime, especially about football, politics and food.',
          ],
        },
        quiz: [
          Q("'Bigger' is…", ['أكبر', 'كبيرة', 'الكبير', 'كبار']),
          Q("'The best' is…", ['الأفضل', 'أفضل من', 'جيد جداً', 'الجيدة']),
          Q("'In my opinion' is…", ['في رأيي', 'من فضلك', 'إن شاء الله', 'على طول']),
          Q('Which phrase softens a disagreement?', ['مع احترامي', 'لا أبداً', 'خلاص', 'يلا']),
        ],
      },
    ],
  },
  {
    id: 'ar-story', title: 'Storytelling', nativeTitle: 'الحكايات',
    icon: 'book', emoji: '📜',
    summary: 'Past continuous, time words, relative clauses and proverbs.',
    lessons: [
      {
        id: 'ar-story-1', title: 'Telling a Story', level: 'B1',
        summary: 'Background with كان, events with the past, and time words.',
        grammar: {
          title: 'Background and events',
          body: [
            'كان + a present-tense verb describes what was going on or used to happen: كنتُ أدرس kuntu adrusu (I was studying / I used to study).',
            'The simple past moves the story forward: ثم رنّ الهاتف thumma ranna al-hātif (then the phone rang).',
            'Time words: عندما ʿindamā (when), بينما baynamā (while), ثمّ thumma (then), بعد أن baʿda an + past (after), قبل أن qabla an + subjunctive (before).',
          ],
          table: T(['English', 'Arabic', 'Say'],
            ['I was studying', 'كنتُ أدرس', 'kuntu adrusu'], ['We used to live in Beirut', 'كنّا نسكن في بيروت', 'kunnā naskunu fī Bayrūt'],
            ['When I arrived', 'عندما وصلتُ', 'ʿindamā waṣaltu'], ['While she was reading', 'بينما كانت تقرأ', 'baynamā kānat taqraʾ'],
            ['After we ate', 'بعد أن أكلنا', 'baʿda an akalnā'], ['Before you leave', 'قبل أن تذهب', 'qabla an tadhhaba']),
        },
        vocab: [
          P('كان يا ما كان', 'kān yā mā kān', 'once upon a time'), P('عندما', 'ʿindamā', 'when'), P('بينما', 'baynamā', 'while'),
          P('ثمّ', 'thumma', 'then'), P('فجأة', 'fajʾatan', 'suddenly'), P('في النهاية', 'fī an-nihāya', 'in the end'),
          P('قصة', 'qiṣṣa', 'story'),
        ],
        examples: [
          P('عندما كنتُ صغيراً، كنتُ ألعب في الشارع كل يوم.', 'ʿindamā kuntu ṣaghīran, kuntu alʿabu fī ash-shāriʿ kulla yawm.', 'When I was little, I used to play in the street every day.'),
          P('بينما كنتُ أمشي، بدأ المطر فجأةً.', 'baynamā kuntu amshī, badaʾa al-maṭar fajʾatan.', 'While I was walking, it suddenly started to rain.'),
          P('وفي النهاية، عاشوا في سعادة.', 'wa-fī an-nihāya, ʿāshū fī saʿāda.', 'And in the end, they lived happily.'),
        ],
        culture: {
          title: "The storyteller's art",
          body: [
            'The ḥakawātī (حكواتي), a professional storyteller, once performed epic tales in coffeehouses, and the tradition has been revived in some cafés in Damascus and elsewhere.',
            "Folk tales often open with كان يا ما كان، في قديم الزمان (kān yā mā kān, fī qadīm az-zamān): 'there was, or there was not, in olden times'.",
            'The Thousand and One Nights (ألف ليلة وليلة, alf layla wa-layla) is the most famous story collection, framed by Shahrazad telling stories to save her life.',
          ],
        },
        quiz: [
          Q('كنتُ أدرس means…', ['I was studying / used to study', 'I studied once', 'I will study', 'I am studying']),
          Q("'Suddenly' is…", ['فجأة', 'ثمّ', 'بينما', 'عندما']),
          Q('Folk tales often begin with…', ['كان يا ما كان', 'مع السلامة', 'إن شاء الله', 'يا حبيبي']),
          Q('بعد أن is followed by…', ['the past tense', 'the subjunctive', 'a noun only', 'the future']),
        ],
      },
      {
        id: 'ar-story-2', title: 'Relative Clauses & Proverbs', level: 'B2',
        summary: 'الذي / التي / اللي and the proverbs people quote.',
        grammar: {
          title: 'Who, which, that',
          body: [
            'Relative pronouns agree with a definite noun: الذي alladhī (m), التي allatī (f), الذين alladhīna (m pl), اللواتي allawātī (f pl).',
            'If the noun is indefinite, leave the pronoun out: رأيتُ رجلاً يبيع الخبز raʾaytu rajulan yabīʿu al-khubz (I saw a man selling bread).',
            'Arabic repeats the noun as a pronoun inside the clause: الكتاب الذي قرأتُه al-kitāb alladhī qaraʾtuhu (the book that I read [it]).',
            'Everyday dialects use one form for everything: اللي (illī).',
          ],
          table: T(['English', 'Arabic'],
            ['the man who came', 'الرجل الذي جاء'], ['the woman who works here', 'المرأة التي تعمل هنا'],
            ['the students who passed', 'الطلاب الذين نجحوا'], ['the book I read', 'الكتاب الذي قرأتُه'],
            ['a city I love', 'مدينة أحبّها'], ['(dialect) the one who came', 'اللي إجا illi ija (Lev.) / اللي جه illi geh (Egy.)']),
        },
        vocab: [
          P('الذي', 'alladhī', 'who / which (m)'), P('التي', 'allatī', 'who / which (f)'), P('الذين', 'alladhīna', 'who (m pl)'),
          P('اللي', 'illī', 'who / which (dialects)'), P('مَثَل', 'mathal', 'proverb'), P('الصبر', 'aṣ-ṣabr', 'patience'),
        ],
        examples: [
          P('هذا هو الفيلم الذي حدّثتُك عنه.', 'hādhā huwa al-film alladhī ḥaddathtuka ʿanhu.', 'This is the film I told you about.'),
          P('الصبر مفتاح الفرج.', 'aṣ-ṣabru miftāḥu al-faraj.', 'Patience is the key to relief.', 'A much-loved proverb.'),
          P('من جدّ وجد.', 'man jadda wajada.', 'Whoever strives, succeeds.'),
        ],
        culture: {
          title: 'Proverbs in daily life',
          body: [
            'Proverbs (amthāl) are woven into conversation to give advice or comfort, and quoting one well is admired.',
            "Others you'll hear: اللي فات مات (illī fāt māt, 'what's past is dead': let it go) and العين بصيرة واليد قصيرة (al-ʿayn baṣīra wa-l-yad qaṣīra, 'the eye sees but the hand is short': I'd like to, but I can't afford it).",
          ],
        },
        quiz: [
          Q("'The woman who works here' is…", ['المرأة التي تعمل هنا', 'المرأة الذي تعمل هنا', 'المرأة الذين تعمل هنا', 'المرأة تعمل التي هنا']),
          Q('With an indefinite noun, the relative pronoun is…', ['left out', 'always الذي', 'always التي', 'replaced by أنّ']),
          Q('الصبر مفتاح الفرج means…', ['Patience is the key to relief', 'Time is money', 'Knowledge is power', 'Haste makes waste']),
          Q('اللي is…', ['the dialect relative pronoun', 'a question word', 'a preposition', 'a verb']),
        ],
      },
    ],
  },
  {
    id: 'ar-news', title: 'News & Formal Arabic', nativeTitle: 'الأخبار والفصحى',
    icon: 'newspaper', emoji: '📰',
    summary: 'The passive voice, reporting language, connectors and conditionals.',
    lessons: [
      {
        id: 'ar-news-1', title: 'Reading the News', level: 'B2',
        summary: 'Passive verbs, تمّ + verbal noun, and reporting phrases.',
        grammar: {
          title: 'The passive voice',
          body: [
            'News Arabic often uses the passive, formed by changing the vowels: كَتَبَ kataba (he wrote) → كُتِبَ kutiba (it was written); يَكتُب yaktubu → يُكتَب yuktabu (it is written).',
            "Headlines love تمّ + verbal noun (tamma, 'was completed'): تمّ افتتاح المعرض tamma iftitāḥ al-maʿraḍ (the exhibition was opened).",
            'Reporting phrases: صرّح ṣarraḥa (declared), أعلن aʿlana (announced), وفقاً لـ wifqan li- (according to), أفادت مصادر afādat maṣādir (sources reported).',
          ],
          table: T(['Active', 'Passive'],
            ['كتب kataba (wrote)', 'كُتب kutiba (was written)'], ['أعلن aʿlana (announced)', 'أُعلن uʿlina (was announced)'],
            ['انتخب intakhaba (elected)', 'انتُخب intukhiba (was elected)'], ['يقول yaqūlu (says)', 'يُقال yuqālu (it is said)'],
            ['افتتح iftataḥa (opened)', 'تمّ افتتاح tamma iftitāḥ (was opened)']),
        },
        vocab: [
          P('حكومة', 'ḥukūma', 'government'), P('رئيس', 'raʾīs', 'president / head'), P('انتخابات', 'intikhābāt', 'elections'),
          P('اقتصاد', 'iqtiṣād', 'economy'), P('مؤتمر صحفي', 'muʾtamar ṣuḥufī', 'press conference'),
          P('وفقاً لـ', 'wifqan li-', 'according to'), P('أعلن', 'aʿlana', 'announced'),
        ],
        examples: [
          P('أعلنت الحكومة عن خطة اقتصادية جديدة.', 'aʿlanat al-ḥukūma ʿan khuṭṭa iqtiṣādiyya jadīda.', 'The government announced a new economic plan.'),
          P('انتُخب رئيس جديد للبلدية.', 'intukhiba raʾīs jadīd li-l-baladiyya.', 'A new mayor was elected.'),
          P('وفقاً للتقرير، ارتفعت الأسعار بنسبة خمسة في المئة.', 'wifqan li-t-taqrīr, irtafaʿat al-asʿār bi-nisbat khamsa fī al-miʾa.', 'According to the report, prices rose by five percent.'),
        ],
        culture: {
          title: 'News Arabic',
          body: [
            'Broadcast news is in MSA across the Arab world, which makes it the best shared listening practice for learners.',
            'Headlines often start with a verb and drop small words: يلتقي الوزير… (the minister meets…).',
            'Big pan-Arab channels include Al Jazeera, Al Arabiya, Sky News Arabia and BBC News Arabic, each with its own editorial perspective, so compare sources.',
          ],
        },
        quiz: [
          Q('كُتِبَ means…', ['it was written', 'he wrote', 'he writes', 'write!']),
          Q('تمّ افتتاح المعرض means…', ['The exhibition was opened', 'The exhibition will open', 'Open the exhibition', 'The exhibition is closed']),
          Q('وفقاً لـ means…', ['according to', 'despite', 'because of', 'instead of']),
          Q('انتخابات means…', ['elections', 'economy', 'government', 'conference']),
        ],
      },
      {
        id: 'ar-news-2', title: 'Formal Writing & Conditionals', level: 'C1',
        summary: 'Connectors, إذا vs. لو, and formal letter formulas.',
        grammar: {
          title: "Connectors and 'if'",
          body: [
            'Formal Arabic links ideas with connectors: بالإضافة إلى bi-l-iḍāfa ilā (in addition to), علاوة على ذلك ʿilāwatan ʿalā dhālika (moreover), لذلك li-dhālika (therefore), ومع ذلك wa-maʿa dhālika (nevertheless), نظراً لـ naẓaran li- (given / due to).',
            "Real conditions use إذا (idhā) + past with present meaning: إذا درستَ نجحتَ idhā darasta najaḥta (if you study, you'll succeed).",
            'Unreal conditions use لو (law) + past, and the result often takes لـ (la-): لو درستُ لنجحتُ law darastu la-najaḥtu (if I had studied, I would have passed).',
            "Formal letters open with تحية طيبة وبعد (taḥiyya ṭayyiba wa-baʿd, 'kind greetings, and then…') and close with وتفضلوا بقبول فائق الاحترام (please accept my highest respect).",
          ],
          table: T(['English', 'Arabic'],
            ['in addition to', 'بالإضافة إلى'], ['moreover', 'علاوة على ذلك'], ['therefore', 'لذلك'],
            ['nevertheless', 'ومع ذلك'], ['due to', 'نظراً لـ'], ["If you study, you'll succeed", 'إذا درستَ نجحتَ'],
            ["If I had studied, I'd have passed", 'لو درستُ لنجحتُ']),
        },
        vocab: [
          P('بالإضافة إلى', 'bi-l-iḍāfa ilā', 'in addition to'), P('علاوة على ذلك', 'ʿilāwatan ʿalā dhālika', 'moreover'),
          P('لذلك', 'li-dhālika', 'therefore'), P('ومع ذلك', 'wa-maʿa dhālika', 'nevertheless'),
          P('إذا', 'idhā', 'if (real)'), P('لو', 'law', 'if (unreal)'), P('تحية طيبة وبعد', 'taḥiyya ṭayyiba wa-baʿd', 'kind greetings (letter opening)'),
        ],
        examples: [
          P('تحية طيبة وبعد، أكتب إليكم بخصوص طلبي.', 'taḥiyya ṭayyiba wa-baʿd, aktubu ilaykum bi-khuṣūṣ ṭalabī.', 'Kind greetings. I am writing to you regarding my application.'),
          P('لو كنتُ أعرف، لأخبرتُك.', 'law kuntu aʿrif, la-akhbartuk.', 'If I had known, I would have told you.'),
          P('الخطة جيدة، ومع ذلك تحتاج إلى وقت.', 'al-khuṭṭa jayyida, wa-maʿa dhālika taḥtāju ilā waqt.', 'The plan is good; nevertheless, it needs time.'),
        ],
        culture: {
          title: 'Eloquence',
          body: [
            'Rhetoric (balāgha) is prized: good formal Arabic varies its connectors and avoids repeating the same word.',
            'Official letters, speeches and sermons open with set formulas, and skipping them can seem abrupt.',
            'Newspaper opinion columns (maqālāt ar-raʾy) are a great way to absorb formal style.',
          ],
        },
        quiz: [
          Q("'Nevertheless' is…", ['ومع ذلك', 'لذلك', 'بالإضافة إلى', 'إذا']),
          Q('لو درستُ لنجحتُ means…', ['If I had studied, I would have passed', "If you study, you'll pass", 'I studied and passed', 'I will study to pass']),
          Q('Which word starts a real (possible) condition?', ['إذا', 'لو', 'لكنّ', 'لأنّ']),
          Q('تحية طيبة وبعد is used…', ['to open a formal letter', 'to say goodbye', 'to congratulate someone', 'to apologise']),
        ],
      },
    ],
  },
  {
    id: 'ar-egy', title: 'Dialect: Egyptian Arabic', nativeTitle: 'اللهجة المصرية',
    icon: 'bubble.left', emoji: '🇪🇬',
    summary: 'The most widely understood dialect: sounds, question words and verbs.',
    lessons: [
      {
        id: 'ar-egy-1', title: 'Egyptian Sounds & Basics', level: 'A2',
        summary: 'How Egyptian differs from MSA, and everyday words.',
        grammar: {
          title: 'What changes in Egyptian',
          body: [
            'ج is pronounced g: جميل gamīl, جديد gidīd.',
            'ق usually becomes a glottal stop (ʾ) in Cairo: قهوة → ʾahwa, قلب → ʾalb.',
            "Negate with ma-…-sh around the verb: ماعرفش maʿrafsh (I don't know), مافيش mafīsh (there isn't).",
            'Demonstratives follow the noun: البيت ده il-bēt da (this house), العربية دي il-ʿarabiyya di (this car).',
          ],
          table: T(['English', 'MSA', 'Egyptian'],
            ['How are you?', 'كيف حالك؟', 'إزيك؟ izzayyak / izzayyik'], ['What?', 'ماذا؟', 'إيه؟ ēh'],
            ['Where?', 'أين؟', 'فين؟ fēn'], ['When?', 'متى؟', 'إمتى؟ imta'], ['Why?', 'لماذا؟', 'ليه؟ lēh'],
            ['now', 'الآن', 'دلوقتي dilwaʾti'], ['tomorrow', 'غداً', 'بكرة bukra'],
            ["I don't know", 'لا أعرف', 'مش عارف / ماعرفش mish ʿārif / maʿrafsh']),
        },
        vocab: [
          P('إزيك', 'izzayyak', 'how are you? (to a man)'), P('كويس', 'kwayyis', 'good / fine'),
          P('عايز / عايزة', 'ʿāyiz / ʿayza', 'want (m / f)'), P('فين', 'fēn', 'where'), P('دلوقتي', 'dilwaʾti', 'now'),
          P('بكرة', 'bukra', 'tomorrow'), P('ماشي', 'māshi', 'OK'),
        ],
        examples: [
          P('إزيك؟ — الحمد لله، كويس.', 'izzayyak? — il-ḥamdu li-llāh, kwayyis.', 'How are you? — Fine, thank God.'),
          P('أنا عايز قهوة، لو سمحت.', 'ana ʿāyiz ʾahwa, law samaḥt.', "I'd like a coffee, please."),
          P('المحطة فين؟', 'il-maḥaṭṭa fēn?', "Where's the station?", 'Question words often come at the end in Egyptian.'),
        ],
        culture: {
          title: "Egypt's voice",
          body: [
            "Egyptian Arabic is the most widely understood dialect, spread by Cairo's film, TV and music industry since the 1930s.",
            'Friendly titles are everywhere: يا باشا yā bāsha (boss), يا أستاذ yā ustāz (sir), يا حاجة yā ḥagga (to an older woman).',
            'Egyptians are famous for their humour: jokes (nukat) and wordplay are part of everyday life.',
          ],
        },
        quiz: [
          Q('In Cairo, قهوة sounds like…', ['ʾahwa', 'qahwa', 'gahwa', 'kahwa']),
          Q("'Where?' in Egyptian is…", ['فين', 'شو', 'وين', 'أين']),
          Q('ماعرفش means…', ["I don't know", 'I know', "I didn't go", 'I want']),
          Q("'This house' in Egyptian is…", ['البيت ده', 'ده البيت', 'هذا بيت', 'بيت الده']),
        ],
      },
      {
        id: 'ar-egy-2', title: 'Egyptian Verbs: Now, Later, Before', level: 'B1',
        summary: 'b- for the present, ḥa- for the future, and the past.',
        grammar: {
          title: 'b- for now, ḥa- for later',
          body: [
            'The present adds b- (bi-) to the verb: باكتب baktib (I write / I\'m writing), بتكتب bitiktib (you write).',
            'The future adds ḥa- (or ha-): حاكتب ḥaktib (I will write), حنروح ḥanrūḥ (we will go).',
            'The past is close to MSA without the final vowels: كتبت katabt (I wrote), كتب katab (he wrote), كتبت katabit (she wrote).',
          ],
          table: T(['Person', 'Present', 'Past'],
            ['I', 'باكتب baktib', 'كتبت katabt'], ['you (m)', 'بتكتب bitiktib', 'كتبت katabt'],
            ['you (f)', 'بتكتبي bitiktibi', 'كتبتي katabti'], ['he', 'بيكتب biyiktib', 'كتب katab'],
            ['she', 'بتكتب bitiktib', 'كتبت katabit'], ['we', 'بنكتب biniktib', 'كتبنا katabna'],
            ['they', 'بيكتبوا biyiktibu', 'كتبوا katabu']),
        },
        vocab: [
          P('باروح', 'barūḥ', "I go / I'm going"), P('حاروح', 'ḥarūḥ', "I'll go"), P('رحت', 'ruḥt', 'I went'),
          P('حاضر', 'ḥāḍir', 'certainly / right away'), P('طب', 'ṭab', 'OK then / so'), P('خلاص', 'khalāṣ', 'done / enough'),
          P('مش', 'mish', 'not'),
        ],
        examples: [
          P('أنا باشتغل في بنك.', 'ana bashtaghal fi bank.', 'I work in a bank.'),
          P('حنروح السينما بكرة.', 'ḥanrūḥ is-sinima bukra.', "We'll go to the cinema tomorrow."),
          P('امبارح رحت السوق.', 'imbāriḥ ruḥt is-sūʾ.', 'Yesterday I went to the market.'),
        ],
        culture: {
          title: 'Everyday Cairo',
          body: [
            "حاضر (ḥāḍir), 'present / ready', is the polite way to say 'yes, right away', from waiters to children answering their parents.",
            'Life is lived late: cafés (ʾahāwi) and street-food stalls stay busy well past midnight.',
            'Koshari (كشري), a mix of rice, lentils, pasta, chickpeas, tomato sauce and fried onions, is the beloved national street food.',
          ],
        },
        quiz: [
          Q('حاروح means…', ["I'll go", 'I went', "I'm going now", 'Go!']),
          Q("'He writes / is writing' in Egyptian is…", ['بيكتب', 'كتب', 'حيكتب', 'اكتب']),
          Q('حاضر is used to say…', ['yes, right away (politely)', 'goodbye', "I'm sorry", 'how much?']),
          Q('Koshari is…', ['a street-food dish', 'a type of coffee', 'a café', 'a dance']),
        ],
      },
    ],
  },
  {
    id: 'ar-lev', title: 'Dialect: Levantine Arabic', nativeTitle: 'اللهجة الشامية',
    icon: 'bubble.right', emoji: '🌿',
    summary: 'Syria, Lebanon, Jordan and Palestine: basics, courtesy and verbs.',
    lessons: [
      {
        id: 'ar-lev-1', title: 'Levantine Basics', level: 'A2',
        summary: 'بدّي, شو, قدّيش and everyday courtesy.',
        grammar: {
          title: 'What changes in Levantine',
          body: [
            'In cities, ق also becomes a glottal stop: قلب → ʾalb. In villages and Bedouin areas you may hear g instead.',
            "'Want' takes possessive endings: بدّي biddi (I want), بدّك biddak (you want), بدّو biddo (he wants).",
            "Negate verbs with ما (mā) and other words with مش (mish): ما بعرف mā baʿrif (I don't know), مش منيح mish mnīḥ (not good).",
            "'This' is هيدا / هيدي (hayda / haydi) in Lebanon and هاد (hād) in Syria and Jordan. هال- (hal-) attaches to a noun: هالبيت hal-bēt (this house).",
          ],
          table: T(['English', 'MSA', 'Levantine'],
            ['How are you?', 'كيف حالك؟', 'كيفك؟ kīfak / kīfik'], ['What?', 'ماذا؟', 'شو؟ shū'],
            ['Where?', 'أين؟', 'وين؟ wēn'], ['How much?', 'بكم؟', 'قدّيش؟ ʾaddēsh'],
            ['now', 'الآن', 'هلّق hallaʾ'], ['I want', 'أريد', 'بدّي biddi'], ['there is', 'يوجد', 'في fī']),
        },
        vocab: [
          P('كيفك', 'kīfak', 'how are you? (to a man)'), P('منيح', 'mnīḥ', 'good / fine'), P('بدّي', 'biddi', 'I want'),
          P('قدّيش', 'ʾaddēsh', 'how much'), P('تكرم', 'tikram', "of course / you're welcome"),
          P('يعطيك العافية', 'yaʿṭīk il-ʿāfye', 'thanks for your hard work'), P('كمان', 'kamān', 'also / more'),
        ],
        examples: [
          P('مرحبا، كيفك؟ — منيح، الحمد لله.', 'marḥaba, kīfak? — mnīḥ, il-ḥamdu li-llāh.', 'Hi, how are you? — Good, thank God.'),
          P('قدّيش هاد؟', 'ʾaddēsh hād?', 'How much is this?'),
          P('يعطيك العافية! — الله يعافيك.', 'yaʿṭīk il-ʿāfye! — alla yʿāfīk.', 'Thanks for your hard work! — God give you health.', 'Said to anyone working: shopkeepers, drivers, cooks.'),
        ],
        culture: {
          title: 'Levantine courtesy',
          body: [
            'يعطيك العافية greets anyone who is working or has made an effort. The reply is الله يعافيك.',
            "تكرم / تكرمي (tikram / tikrami, 'be honoured') answers a request: 'of course, with pleasure'.",
            'Mornings often start with Fairuz on the radio, and coffee is offered to every guest.',
          ],
        },
        quiz: [
          Q("'How much?' in Levantine is…", ['قدّيش', 'بكم', 'كم الساعة', 'إيش']),
          Q('بدّي means…', ['I want', 'I must', 'I have', 'I know']),
          Q('What do you say to someone who is working hard?', ['يعطيك العافية', 'صحتين', 'نعيماً', 'مبروك']),
          Q('ما بعرف means…', ["I don't know", 'I know', "I didn't go", "Don't know!"]),
        ],
      },
      {
        id: 'ar-lev-2', title: 'Levantine Verbs & Daily Life', level: 'B1',
        summary: 'b- present, عم for right now, رح for the future.',
        grammar: {
          title: 'b-, ʿam and raḥ',
          body: [
            'The present adds b-: بكتب biktob (I write), بتكتب btiktob (you write). In the "we" form it becomes m-: منكتب mniktob (we write).',
            "عم (ʿam) before the verb means right now: عم بكتب ʿam biktob (I'm writing).",
            "The future uses رح (raḥ) + the verb without b-: رح اكتب raḥ iktob (I'll write), رح نروح raḥ nrūḥ (we'll go).",
            'The past is like Egyptian: كتبت katabt (I wrote), كتب katab (he wrote), كتبت katabet (she wrote).',
          ],
          table: T(['Person', 'Present', 'Future'],
            ['I', 'بكتب biktob', 'رح اكتب raḥ iktob'], ['you (m)', 'بتكتب btiktob', 'رح تكتب raḥ tiktob'],
            ['you (f)', 'بتكتبي btiktobi', 'رح تكتبي raḥ tiktobi'], ['he', 'بيكتب byiktob', 'رح يكتب raḥ yiktob'],
            ['we', 'منكتب mniktob', 'رح نكتب raḥ niktob'], ['they', 'بيكتبوا byiktobu', 'رح يكتبوا raḥ yiktobu']),
        },
        vocab: [
          P('عم', 'ʿam', '-ing (right now)'), P('رح', 'raḥ', 'will'), P('هلّق', 'hallaʾ', 'now'), P('بكرا', 'bukra', 'tomorrow'),
          P('مبارح', 'mbāreḥ', 'yesterday'), P('ع راسي', 'ʿa rāsi', 'with pleasure (lit. on my head)'),
          P('صحتين', 'ṣaḥtēn', 'enjoy your meal'),
        ],
        examples: [
          P('شو عم تعمل؟ — عم بطبخ.', 'shū ʿam taʿmel? — ʿam boṭbokh.', "What are you doing? — I'm cooking."),
          P('رح نروح ع البحر بكرا.', 'raḥ nrūḥ ʿal-baḥr bukra.', "We'll go to the sea tomorrow."),
          P('صحتين! — ع قلبك.', 'ṣaḥtēn! — ʿa-albak.', 'Enjoy your meal! — And to your heart.'),
        ],
        culture: {
          title: 'The mezze table',
          body: [
            'Levantine meals are shared: hummus, mutabbal, tabbouleh, fattoush and warm bread are passed around for everyone.',
            "صحتين (ṣaḥtēn, 'two healths') is answered with ع قلبك (ʿa-albak, 'on your heart').",
            "Phrases like ع راسي ('on my head') show you'll gladly do something.",
          ],
        },
        quiz: [
          Q('عم بطبخ means…', ["I'm cooking (right now)", 'I cooked', "I'll cook", "I don't cook"]),
          Q('The Levantine future marker is…', ['رح', 'عم', 'ب', 'ما']),
          Q("Reply to 'صحتين':", ['ع قلبك', 'وعليكم السلام', 'مبروك', 'الله أكرم']),
          Q('منكتب means…', ['we write', 'I write', 'they write', 'you write']),
        ],
      },
    ],
  },
];

export const scenarios = [
  {
    id: 'ar-sc-doctor', title: 'At the Doctor', level: 'B1', emoji: '🩺', icon: 'stethoscope',
    setting: "You've had stomach pain since last night and see a doctor at a clinic.", goal: 'Describe your symptoms, answer questions and understand the advice.',
    steps: [
      step('Doctor', P('ما المشكلة؟ ممّ تشكو؟', 'mā al-mushkila? mimmā tashkū?', "What's the problem? What are you suffering from?"), 'Say your stomach hurts and you have a fever.', [
        C('بطني يؤلمني وعندي حرارة.', 'baṭnī yuʾlimunī wa-ʿindī ḥarāra.', 'My stomach hurts and I have a fever.', true, 'Clear and complete.'),
        C('أنا بطن وحرارة.', 'ana baṭn wa-ḥarāra.', 'I am stomach and fever.', false, 'Use بطني يؤلمني (my stomach hurts) and عندي (I have).'),
        C('عندي بطن جديد.', 'ʿindī baṭn jadīd.', 'I have a new stomach.', false, "That's 'I have a new stomach'!"),
      ]),
      step('Doctor', P('منذ متى؟', 'mundhu matā?', 'Since when?'), 'Say: for two days.', [
        C('منذ يومين.', 'mundhu yawmayn.', 'For two days.', true, 'يومين is the dual of يوم (day).'),
        C('بعد يومين.', 'baʿda yawmayn.', 'In two days.', false, 'بعد = after. He asked since when.'),
        C('كل يوم.', 'kull yawm.', 'Every day.', false, "That doesn't say how long."),
      ]),
      step('Doctor', P('هل أكلتَ شيئاً غريباً؟', 'hal akalta shayʾan gharīban?', 'Did you eat anything unusual?'), 'Answer him.', [
        C('نعم، أكلتُ في مطعم جديد أمس.', 'naʿam, akaltu fī maṭʿam jadīd ams.', 'Yes, I ate at a new restaurant yesterday.', true, 'Useful detail for the doctor.'),
        C('لا، لم آكل شيئاً غريباً.', 'lā, lam ākul shayʾan gharīban.', "No, I didn't eat anything unusual.", true, 'لم + jussive: a correct past negative.'),
        C('سآكل غداً.', 'sa-ākulu ghadan.', "I'll eat tomorrow.", false, "He's asking about the past."),
      ]),
      step('Doctor', P('اشرب الكثير من الماء، وكُلْ طعاماً خفيفاً، واسترحْ يومين.', 'ishrab al-kathīr min al-māʾ, wa-kul ṭaʿāman khafīfan, wa-istariḥ yawmayn.', 'Drink plenty of water, eat light food and rest for two days.'), 'What does he advise?', [
        U('Drink lots of water, eat light food and rest for two days', true, 'Three commands: اشرب (drink), كُل (eat), استرح (rest).'),
        U("Don't drink water for two days", false, 'اشرب الكثير = drink a lot.'),
        U('Eat a big meal and go back to work', false, 'خفيف = light.'),
      ], 'understand'),
      step(null, null, 'Thank the doctor.', [
        C('شكراً يا دكتور.', 'shukran yā duktūr.', 'Thank you, doctor.', true, 'He may reply سلامتك (get well soon).'),
        C('عفواً يا دكتور.', 'ʿafwan yā duktūr.', "You're welcome, doctor.", false, "That's his line."),
        C('سلامتك يا دكتور.', 'salāmtak yā duktūr.', 'Get well soon, doctor.', false, "He's not the one who's ill!"),
      ]),
    ],
  },
  {
    id: 'ar-sc-interview', title: 'A Job Interview in Dubai', level: 'B2', emoji: '💼', icon: 'briefcase',
    setting: 'A formal interview, in Standard Arabic, for a marketing role at a company in Dubai.', goal: 'Present yourself formally and answer interview questions.',
    steps: [
      step('Interviewer', P('أهلاً بكِ. حدّثينا عن نفسكِ.', 'ahlan biki. ḥaddithīnā ʿan nafsiki.', 'Welcome. Tell us about yourself.'), 'Describe your experience.', [
        C('اسمي سارة، وعملتُ ثلاث سنوات في التسويق.', 'ismī Sāra, wa-ʿamiltu thalāth sanawāt fī at-taswīq.', 'My name is Sara, and I worked in marketing for three years.', true, 'Clear and formal.'),
        C('أنا سارة وسأعمل أمس.', 'ana Sāra wa-sa-aʿmalu ams.', "I'm Sara and I will work yesterday.", false, 'سـ (future) clashes with أمس (yesterday).'),
        C('يلا، شو بدّك؟', 'yalla, shū biddak?', 'Come on, what do you want?', false, 'Far too informal for an interview!'),
      ]),
      step('Interviewer', P('لماذا تريدين العمل معنا؟', 'limādhā turīdīna al-ʿamal maʿanā?', 'Why do you want to work with us?'), 'Give a strong reason.', [
        C('لأنّ شركتكم رائدة في مجالها، وأريد أن أتطوّر مهنياً.', 'li-anna sharikatakum rāʾida fī majālihā, wa-urīdu an ataṭawwara mihniyyan.', 'Because your company leads its field, and I want to grow professionally.', true, 'لأنّ + accusative and أن + subjunctive. Excellent.'),
        C('لأنّ الراتب كبير فقط.', 'li-anna ar-rātib kabīr faqaṭ.', 'Only because the salary is big.', false, 'Honest, but not persuasive.'),
        C('لا أعرف.', 'lā aʿrif.', "I don't know.", false, 'Prepare an answer to this one!'),
      ]),
      step('Interviewer', P('ما هي نقاط قوّتكِ؟', 'mā hiya nuqāṭ quwwatiki?', 'What are your strengths?'), 'Name two strengths.', [
        C('أنا منظّمة، وأعمل جيداً ضمن فريق.', 'ana munaẓẓama, wa-aʿmalu jayyidan ḍimna farīq.', "I'm organised and I work well in a team.", true, 'Specific and positive.'),
        C('ليس عندي نقاط.', 'laysa ʿindī nuqāṭ.', "I don't have any points.", false, 'Too modest, and a bit confusing.'),
        C('نقطة قوّتي هي النوم.', 'nuqṭat quwwatī hiya an-nawm.', 'My strength is sleeping.', false, 'Ha! Not for an interview.'),
      ]),
      step('Interviewer', P('سنتواصل معكِ خلال أسبوع.', 'sa-natawāṣalu maʿaki khilāla usbūʿ.', "We'll contact you within a week."), 'What did they say?', [
        U("They'll contact you within a week", true, 'سـ + present = future; خلال = within.'),
        U('You start next week', false, "They'll contact you; you haven't been hired yet."),
        U('Call them in a month', false, 'أسبوع = week.'),
      ], 'understand'),
      step(null, null, 'Thank them formally.', [
        C('شكراً لكم على وقتكم، وأتطلّع إلى سماع ردّكم.', 'shukran lakum ʿalā waqtikum, wa-ataṭallaʿu ilā samāʿ raddikum.', 'Thank you for your time; I look forward to hearing from you.', true, 'A polished, formal close.'),
        C('باي!', 'bāy!', 'Bye!', false, 'Too casual.'),
        C('مع السلامة يا حبيبي.', 'maʿa as-salāma yā ḥabībī.', 'Goodbye, my dear.', false, 'Definitely not in an interview!'),
      ]),
    ],
  },
  {
    id: 'ar-sc-news', title: 'Talking About the News', level: 'B2', emoji: '📰', icon: 'newspaper',
    setting: 'A friend brings up a news story over coffee.', goal: 'Understand the story, give your opinion and disagree politely.',
    steps: [
      step('Friend', P('هل سمعتَ أنّ الحكومة قرّرت رفع أسعار الوقود؟', 'hal samiʿta anna al-ḥukūma qarrarat rafʿ asʿār al-wuqūd?', 'Did you hear the government decided to raise fuel prices?'), 'What is the news?', [
        U('The government decided to raise fuel prices', true, 'رفع = raising; الوقود = fuel.'),
        U('Fuel prices fell', false, 'رفع means raising, not lowering.'),
        U("There's a new government", false, 'The government made a decision; it is not new.'),
      ], 'understand'),
      step(null, null, 'Give your opinion.', [
        C('أعتقد أنّ هذا القرار سيؤثّر على الفقراء أكثر.', 'aʿtaqidu anna hādhā al-qarār sa-yuʾaththiru ʿalā al-fuqarāʾ akthar.', 'I think this decision will affect the poor more.', true, 'أعتقد أنّ + a full sentence. Well argued.'),
        C('في رأيي، كان القرار ضرورياً للاقتصاد.', 'fī raʾyī, kāna al-qarār ḍarūriyyan li-l-iqtiṣād.', 'In my opinion, the decision was necessary for the economy.', true, 'Note ضرورياً: accusative after كان.'),
        C('أعتقد الوقود.', 'aʿtaqidu al-wuqūd.', 'I think fuel.', false, 'Incomplete. Use أعتقد أنّ + a sentence.'),
      ]),
      step('Friend', P('لكنّ الحكومة تقول إنّ الأسعار سترتفع قليلاً فقط.', 'lākinna al-ḥukūma taqūlu inna al-asʿār sa-tartafiʿu qalīlan faqaṭ.', 'But the government says prices will rise only a little.'), 'Disagree politely.', [
        C('مع احترامي، لا أوافق، لأنّ كلّ شيء سيغلو.', 'maʿa iḥtirāmī, lā uwāfiq, li-anna kulla shayʾ sa-yaghlū.', 'With respect, I disagree, because everything will get more expensive.', true, 'Polite, with a reason.'),
        C('أنت غبي.', 'anta ghabī.', "You're stupid.", false, "That's not polite disagreement!"),
        C('خلاص.', 'khalāṣ.', 'Enough.', false, 'That ends the conversation rather than disagreeing.'),
      ]),
      step(null, null, 'Suggest checking another source.', [
        C('لنقرأ الخبر في مصدر آخر أيضاً.', 'li-naqraʾ al-khabar fī maṣdar ākhar ayḍan.', "Let's read the story in another source too.", true, 'لـ + subjunctive: "let\'s…".'),
        C('لن أقرأ أبداً.', 'lan aqraʾa abadan.', 'I will never read.', false, 'The opposite of what you want.'),
        C('لنأكل الخبر.', 'li-naʾkul al-khabar.', "Let's eat the news.", false, 'خبر (news) vs. خبز (bread)!'),
      ]),
    ],
  },
  {
    id: 'ar-sc-koshari', title: 'Koshari in Cairo', level: 'A2', emoji: '🍲', icon: 'takeoutbag.and.cup.and.straw',
    setting: 'A busy koshari shop in downtown Cairo. Everyone speaks Egyptian Arabic.', goal: 'Order, choose how spicy, and pay the Egyptian way.',
    steps: [
      step('Server', P('أهلاً يا باشا، تحب إيه؟', 'ahlan yā bāsha, tiḥibb ēh?', 'Welcome, boss. What would you like?'), 'Order a medium koshari.', [
        C('عايز طبق كشري وسط، لو سمحت.', 'ʿāyiz ṭabaʾ koshari wasaṭ, law samaḥt.', "I'd like a medium plate of koshari, please.", true, 'Perfect Egyptian: عايز, and طبق pronounced ṭabaʾ.'),
        C('أنا كشري.', 'ana koshari.', 'I am koshari.', false, 'Use عايز (I want).'),
        C('فين الكشري؟', 'fēn il-koshari?', "Where's the koshari?", false, "You're standing in front of it!"),
      ]),
      step('Server', P('عايزه حرّاق ولا لأ؟', 'ʿāyzu ḥarrāʾ walla laʾ?', 'Do you want it spicy or not?'), 'Answer him.', [
        C('حرّاق شوية بس.', 'ḥarrāʾ shwayya bas.', 'Just a little spicy.', true, 'شوية = a little; بس = only.'),
        C('لأ، من غير شطّة.', 'laʾ, min ghēr shaṭṭa.', 'No, without hot sauce.', true, 'من غير = without; شطة = hot sauce.'),
        C('أيوه، لأ.', 'aywa, laʾ.', 'Yes, no.', false, 'Pick one!'),
      ]),
      step('Server', P('هنا ولا تيك أواي؟', 'hena walla tēk awāy?', 'For here or takeaway?'), 'Choose.', [
        C('هنا.', 'hena.', 'Here.', true, 'هنا is pronounced hena in Egyptian.'),
        C('تيك أواي، لو سمحت.', 'tēk awāy, law samaḥt.', 'Takeaway, please.', true, 'Egyptians use the English word.'),
        C('بكرة.', 'bukra.', 'Tomorrow.', false, 'Koshari is for now!'),
      ]),
      step('Server', P('الحساب خمسة وتلاتين جنيه.', 'il-ḥisāb khamsa w-talātīn ginēh.', "That's thirty-five pounds."), 'How much is it?', [
        U('35 pounds', true, 'تلاتين = thirty (Egyptian ث → t).'),
        U('53 pounds', false, 'Units come first: five and thirty.'),
        U('15 pounds', false, 'خمستاشر would be fifteen.'),
      ], 'understand'),
      step(null, null, 'Thank him the Egyptian way.', [
        C('تسلم إيدك!', 'tislam īdak!', 'Bless your hand!', true, 'A warm Egyptian thank-you to whoever served you.'),
        C('شكراً يا باشا.', 'shukran yā bāsha.', 'Thanks, boss.', true, 'Friendly and natural.'),
        C('عفواً.', 'ʿafwan.', "You're welcome.", false, "That's his line."),
      ]),
    ],
  },
  {
    id: 'ar-sc-manoushe', title: 'Breakfast at a Beirut Bakery', level: 'A2', emoji: '🫓', icon: 'sun.max',
    setting: 'A neighbourhood bakery in Beirut early in the morning. The baker speaks Lebanese Arabic.', goal: "Order a za'atar manoushe and pay politely.",
    steps: [
      step('Baker', P('صباح الخير! شو بتحب؟', 'ṣabāḥ il-khēr! shū btḥebb?', 'Good morning! What would you like?'), "Order a za'atar manoushe.", [
        C('صباح النور، بدّي منقوشة زعتر لو سمحت.', 'ṣabāḥ in-nūr, biddi manʾūshe zaʿtar law samaḥt.', "Good morning, I'd like a za'atar manoushe, please.", true, 'بدّي = I want. Very natural.'),
        C('أنا زعتر.', 'ana zaʿtar.', "I am za'atar.", false, 'Use بدّي (I want).'),
        C('مع السلامة.', 'maʿ is-salāme.', 'Goodbye.', false, 'You just arrived!'),
      ]),
      step('Baker', P('بدّك ياها مع خضرا؟', 'biddak yāha maʿ khuḍra?', 'Do you want it with vegetables?'), 'Answer him.', [
        C('إيه، مع بندورة ونعنع.', 'ēh, maʿ banadōra w-naʿnaʿ.', 'Yes, with tomato and mint.', true, 'بندورة = tomato in the Levant.'),
        C('لا، بس زعتر.', 'lā, bas zaʿtar.', "No, just za'atar.", true, 'بس = only.'),
        C('قدّيش الساعة؟', 'ʾaddēsh is-sēʿa?', 'What time is it?', false, 'He asked about vegetables.'),
      ]),
      step(null, null, 'Ask how much it is.', [
        C('قدّيش حقها؟', 'ʾaddēsh ḥaʾʾa?', 'How much is it?', true, 'حقها = its price (lit. its right).'),
        C('وين حقها؟', 'wēn ḥaʾʾa?', 'Where is its price?', false, 'وين = where. Use قدّيش.'),
        C('شو اسمها؟', 'shū isma?', "What's its name?", false, 'You know its name: manoushe!'),
      ]),
      step('Baker', P('تكرم، مية وخمسين ألف.', 'tikram, miyye w-khamsīn alf.', 'Of course, a hundred and fifty thousand.'), 'How much did he say?', [
        U('150,000 (Lebanese pounds)', true, 'مية = hundred, خمسين = fifty, ألف = thousand. Lebanese prices run into the thousands.'),
        U('1,500', false, 'Listen for ألف (thousand).'),
        U('15', false, 'Much more than that!'),
      ], 'understand'),
      step(null, null, 'Thank him for his work as you leave.', [
        C('يعطيك العافية!', 'yaʿṭīk il-ʿāfye!', 'Thanks for your hard work!', true, 'He will reply الله يعافيك.'),
        C('شكراً كتير.', 'shukran ktīr.', 'Thanks a lot.', true, 'Simple and friendly.'),
        C('صحتين.', 'ṣaḥtēn.', 'Enjoy your meal.', false, "He isn't the one eating!"),
      ]),
    ],
  },
];

// [Arabic, transliteration, English]
export const dictionary = [
  // body & health
  ['رأس', 'raʾs', 'head'], ['وجه', 'wajh', 'face'], ['عين', 'ʿayn', 'eye; spring (of water)'], ['أذن', 'udhun', 'ear'],
  ['أنف', 'anf', 'nose'], ['فم', 'fam', 'mouth'], ['سن', 'sinn', 'tooth'], ['يد', 'yad', 'hand'], ['قلب', 'qalb', 'heart'],
  ['بطن', 'baṭn', 'stomach; belly'], ['ظهر', 'ẓahr / ẓuhr', 'back; noon'], ['دم', 'dam', 'blood'], ['جسم', 'jism', 'body'],
  ['حرارة', 'ḥarāra', 'fever; temperature; heat'], ['زكام', 'zukām', 'cold (illness)'], ['سعال', 'suʿāl', 'cough'],
  ['ممرضة', 'mumarriḍa', 'nurse'], ['صحة', 'ṣiḥḥa', 'health'], ['سلامتك', 'salāmtak', 'get well soon'], ['يؤلمني', 'yuʾlimunī', 'it hurts me'],
  // work
  ['وظيفة', 'waẓīfa', 'job; position'], ['شركة', 'sharika', 'company'], ['مدير', 'mudīr', 'manager; director'],
  ['زميل', 'zamīl', 'colleague'], ['راتب', 'rātib', 'salary'], ['اجتماع', 'ijtimāʿ', 'meeting'], ['مقابلة', 'muqābala', 'interview'],
  ['مشروع', 'mashrūʿ', 'project'], ['عقد', 'ʿaqd', 'contract'], ['مهندس', 'muhandis', 'engineer'], ['محامي', 'muḥāmī', 'lawyer'],
  ['موظف', 'muwaẓẓaf', 'employee'], ['تاجر', 'tājir', 'merchant; trader'], ['فلاح', 'fallāḥ', 'farmer'],
  // opinions & feelings
  ['رأي', 'raʾy', 'opinion'], ['في رأيي', 'fī raʾyī', 'in my opinion'], ['أعتقد', 'aʿtaqidu', 'I think; I believe'],
  ['أوافق', 'uwāfiqu', 'I agree'], ['لا أوافق', 'lā uwāfiqu', 'I disagree'], ['خائف', 'khāʾif', 'afraid; scared'],
  ['غاضب', 'ghāḍib', 'angry'], ['متحمس', 'mutaḥammis', 'excited'], ['قلق', 'qalaq', 'worry; anxious'], ['فخور', 'fakhūr', 'proud'],
  ['ممل', 'mumill', 'boring'], ['مهم', 'muhimm', 'important'], ['ممكن', 'mumkin', 'possible; maybe'], ['مستحيل', 'mustaḥīl', 'impossible'],
  ['صحيح', 'ṣaḥīḥ', 'correct; true'], ['خطأ', 'khaṭaʾ', 'mistake; wrong'], ['أفضل', 'afḍal', 'better; best'], ['أكبر', 'akbar', 'bigger; biggest'],
  ['أصغر', 'aṣghar', 'smaller; smallest'], ['أجمل', 'ajmal', 'more beautiful'],
  // nature & weather
  ['مطر', 'maṭar', 'rain'], ['ثلج', 'thalj', 'snow; ice'], ['ريح', 'rīḥ', 'wind'], ['غيوم', 'ghuyūm', 'clouds'], ['سماء', 'samāʾ', 'sky'],
  ['شجرة', 'shajara', 'tree'], ['نهر', 'nahr', 'river'], ['وردة', 'warda', 'flower; rose'], ['حيوان', 'ḥayawān', 'animal'],
  ['قطة', 'qiṭṭa', 'cat'], ['كلب', 'kalb', 'dog'], ['حصان', 'ḥiṣān', 'horse'], ['جمل', 'jamal', 'camel'], ['طائر', 'ṭāʾir', 'bird'],
  ['حية', 'ḥayya', 'snake'], ['أفعى', 'afʿā', 'snake; viper'], ['صيف', 'ṣayf', 'summer'], ['شتاء', 'shitāʾ', 'winter'],
  ['ربيع', 'rabīʿ', 'spring (season)'], ['خريف', 'kharīf', 'autumn; fall'],
  // home, clothes, colours
  ['مطبخ', 'maṭbakh', 'kitchen'], ['سرير', 'sarīr', 'bed'], ['كرسي', 'kursī', 'chair'], ['طاولة', 'ṭāwila', 'table'],
  ['مفتاح', 'miftāḥ', 'key'], ['ملابس', 'malābis', 'clothes'], ['قميص', 'qamīṣ', 'shirt'], ['حذاء', 'ḥidhāʾ', 'shoe; shoes'],
  ['أحمر', 'aḥmar', 'red'], ['أزرق', 'azraq', 'blue'], ['أخضر', 'akhḍar', 'green'], ['أصفر', 'aṣfar', 'yellow'], ['أبيض', 'abyaḍ', 'white'],
  ['أسود', 'aswad', 'black'], ['لون', 'lawn', 'colour; color'],
  // verbs
  ['قال', 'qāla', 'said; say'], ['أقول', 'aqūlu', 'I say'], ['سأل', 'saʾala', 'asked; ask'], ['أجاب', 'ajāba', 'answered'],
  ['فكر', 'fakkara', 'thought; think'], ['تذكر', 'tadhakkara', 'remembered; remember'], ['نسي', 'nasiya', 'forgot; forget'],
  ['بدأ', 'badaʾa', 'began; start'], ['انتهى', 'intahā', 'ended; finish'], ['وصل', 'waṣala', 'arrived; arrive'],
  ['خرج', 'kharaja', 'went out; leave'], ['دخل', 'dakhala', 'entered; enter'], ['جلس', 'jalasa', 'sat; sit'],
  ['وقف', 'waqafa', 'stood; stop'], ['لعب', 'laʿiba', 'played; play'], ['طبخ', 'ṭabakha', 'cooked; cook'], ['غسل', 'ghasala', 'washed; wash'],
  ['يجب', 'yajibu', 'must; have to'], ['أستطيع', 'astaṭīʿu', 'I can'], ['أحتاج', 'aḥtāju', 'I need; need'], ['أعطى', 'aʿṭā', 'gave; give'],
  ['أخذ', 'akhadha', 'took; take'], ['أرسل', 'arsala', 'sent; send'], ['اتصل', 'ittaṣala', 'called (on the phone); call'],
  ['ضحك', 'ḍaḥika', 'laughed; laugh'], ['بكى', 'bakā', 'cried; cry'], ['أتمنى', 'atamannā', 'I hope; I wish'],
  // news & society
  ['حكومة', 'ḥukūma', 'government'], ['رئيس', 'raʾīs', 'president; head'], ['وزير', 'wazīr', 'minister'],
  ['انتخابات', 'intikhābāt', 'elections'], ['اقتصاد', 'iqtiṣād', 'economy'], ['سياسة', 'siyāsa', 'politics; policy'], ['حرب', 'ḥarb', 'war'],
  ['مشكلة', 'mushkila', 'problem'], ['حل', 'ḥall', 'solution'], ['خبر', 'khabar', 'news item'], ['أخبار', 'akhbār', 'news'],
  ['صحيفة', 'ṣaḥīfa', 'newspaper'], ['مؤتمر', 'muʾtamar', 'conference'], ['تقرير', 'taqrīr', 'report'], ['قانون', 'qānūn', 'law'],
  ['مجتمع', 'mujtamaʿ', 'society'], ['تاريخ', 'tārīkh', 'history; date'], ['ثقافة', 'thaqāfa', 'culture'], ['تعليم', 'taʿlīm', 'education'],
  ['بيئة', 'bīʾa', 'environment'], ['تكنولوجيا', 'tiknūlūjiyā', 'technology'], ['إنترنت', 'intirnit', 'internet'],
  ['وفقا لـ', 'wifqan li-', 'according to'],
  // connectors & time
  ['لأن', 'li-anna', 'because'], ['إذا', 'idhā', 'if'], ['لو', 'law', 'if (hypothetical)'], ['أيضا', 'ayḍan', 'also; too'],
  ['فقط', 'faqaṭ', 'only'], ['ربما', 'rubbamā', 'maybe; perhaps'], ['دائما', 'dāʾiman', 'always'], ['أبدا', 'abadan', 'never; ever'],
  ['أحيانا', 'aḥyānan', 'sometimes'], ['بعد', 'baʿda', 'after'], ['قبل', 'qabla', 'before'], ['ثم', 'thumma', 'then'],
  ['عندما', 'ʿindamā', 'when'], ['بينما', 'baynamā', 'while'], ['لذلك', 'li-dhālika', 'therefore; so'], ['ومع ذلك', 'wa-maʿa dhālika', 'nevertheless; however'],
  ['فجأة', 'fajʾatan', 'suddenly'], ['بعد غد', 'baʿda ghad', 'the day after tomorrow'], ['الأسبوع القادم', 'al-usbūʿ al-qādim', 'next week'],
  ['السنة الماضية', 'as-sana al-māḍiya', 'last year'], ['قصة', 'qiṣṣa', 'story'],
  // dialect
  ['دلوقتي', 'dilwaʾti', 'now (Egyptian)'], ['بكرة', 'bukra', 'tomorrow (Egyptian / Levantine)'], ['فين', 'fēn', 'where (Egyptian)'],
  ['إيه', 'ēh', 'what (Egyptian)'], ['إمتى', 'imta', 'when (Egyptian)'], ['ليه', 'lēh', 'why (Egyptian)'], ['مش', 'mish', 'not (Egyptian / Levantine)'],
  ['عشان', 'ʿashān', 'because; for (Egyptian)'], ['أوي', 'awi', 'very (Egyptian)'], ['حاضر', 'ḥāḍir', 'certainly; right away'],
  ['ماشي', 'māshi', 'OK; fine'], ['أيوه', 'aywa', 'yes (Egyptian)'], ['لأ', 'laʾ', 'no (dialect)'], ['طب', 'ṭab', 'OK then; so (Egyptian)'],
  ['وين', 'wēn', 'where (Levantine / Gulf)'], ['قديش', 'ʾaddēsh', 'how much (Levantine)'], ['هلق', 'hallaʾ', 'now (Levantine)'],
  ['منيح', 'mnīḥ', 'good; fine (Levantine)'], ['كتير', 'ktīr', 'very; a lot (Levantine)'], ['هيك', 'hēk', 'like this; so (Levantine)'],
  ['تكرم', 'tikram', "of course; you're welcome (Levantine)"], ['يعطيك العافية', 'yaʿṭīk il-ʿāfye', 'thanks for your hard work (Levantine)'],
  ['زين', 'zēn', 'good (Gulf)'], ['الحين', 'al-ḥīn', 'now (Gulf)'], ['شلونك', 'shlōnak', 'how are you (Gulf / Iraqi)'], ['وايد', 'wāyid', 'a lot (Gulf)'],
  ['يلا نروح', 'yalla nrūḥ', "let's go"], ['تسلم إيدك', 'tislam īdak', 'bless your hand (thank you)'],
];

// Free-writing prompts. Each requirement is met if the text contains any of the listed words or phrases.
const R = (label, any) => ({ label, any });

export const writingPrompts = [
  {
    id: 'ar-w-intro', level: 'A1', prompt: 'Introduce yourself: your name, where you are from, and what you do.', minWords: 8,
    requirements: [R('your name (اسمي…)', ['اسمي']), R('where you are from (أنا من…)', ['أنا من', 'انا من']), R('what you do (طالب، أعمل، أدرس…)', ['طالب', 'طالبة', 'أعمل', 'أدرس', 'مهندس', 'معلم', 'طبيب', 'موظف'])],
    model: P('اسمي سام. أنا من كندا. أنا طالب وأدرس العربية في الجامعة.', 'ismī Sām. ana min Kanadā. ana ṭālib wa-adrusu al-ʿarabiyya fī al-jāmiʿa.', "My name is Sam. I'm from Canada. I'm a student and I study Arabic at university."),
  },
  {
    id: 'ar-w-family', level: 'A2', prompt: 'Describe your family: who is in it and one thing about each person.', minWords: 12,
    requirements: [R('family members (أبي، أمي، أخي…)', ['أبي', 'أمي', 'أخي', 'أختي', 'عائلتي', 'زوجي', 'زوجتي', 'ابني', 'بنتي']), R('"I have" (عندي)', ['عندي']), R('a describing word (كبير، لطيف…)', ['كبير', 'كبيرة', 'صغير', 'صغيرة', 'جميل', 'جميلة', 'لطيف', 'لطيفة', 'طويل', 'طويلة', 'سعيد', 'سعيدة'])],
    model: P('عندي عائلة صغيرة. أبي طبيب وأمي معلمة. عندي أخ واحد، هو طويل ولطيف.', 'ʿindī ʿāʾila ṣaghīra. abī ṭabīb wa-ummī muʿallima. ʿindī akh wāḥid, huwa ṭawīl wa-laṭīf.', 'I have a small family. My father is a doctor and my mother is a teacher. I have one brother; he is tall and kind.'),
  },
  {
    id: 'ar-w-day', level: 'A2', prompt: 'Describe your daily routine from morning to evening, in the present tense.', minWords: 15,
    requirements: [R('present-tense verbs (أذهب، أشرب، أعمل…)', ['أذهب', 'أشرب', 'آكل', 'أعمل', 'أدرس', 'أنام', 'أستيقظ', 'أقرأ']), R('times of day (الساعة، في الصباح…)', ['الساعة', 'في الصباح', 'صباحا', 'في المساء', 'مساء', 'بعد الظهر']), R('sequence words (ثم، بعد ذلك)', ['ثم', 'بعد ذلك', 'بعدها'])],
    model: P('أستيقظ في الساعة السابعة وأشرب القهوة. ثم أذهب إلى العمل. في المساء أقرأ كتاباً وأنام في الساعة الحادية عشرة.', 'astayqiẓu fī as-sāʿa as-sābiʿa wa-ashrabu al-qahwa. thumma adhhabu ilā al-ʿamal. fī al-masāʾ aqraʾu kitāban wa-anāmu fī as-sāʿa al-ḥādiya ʿashra.', 'I wake up at seven and drink coffee. Then I go to work. In the evening I read a book and sleep at eleven.'),
  },
  {
    id: 'ar-w-past', level: 'B1', prompt: 'Write about your last holiday or weekend, in the past tense.', minWords: 15,
    requirements: [R('past-tense verbs (ذهبتُ، زرتُ، أكلتُ…)', ['ذهبت', 'زرت', 'أكلت', 'رأيت', 'سافرت', 'شربت', 'لعبت', 'قرأت', 'شاهدت']), R('a time expression (أمس، الأسبوع الماضي…)', ['أمس', 'الأسبوع الماضي', 'السنة الماضية', 'في العطلة', 'نهاية الأسبوع']), R('how it was (جميل، رائع، ممتع…)', ['جميل', 'جميلة', 'رائع', 'رائعة', 'ممتع', 'ممتعة', 'ممل', 'مملة'])],
    model: P('في نهاية الأسبوع ذهبتُ إلى البحر مع أصدقائي. سبحنا وأكلنا سمكاً في مطعم صغير. كانت الرحلة ممتعة جداً.', 'fī nihāyat al-usbūʿ dhahabtu ilā al-baḥr maʿa aṣdiqāʾī. sabaḥnā wa-akalnā samakan fī maṭʿam ṣaghīr. kānat ar-riḥla mumtiʿa jiddan.', 'At the weekend I went to the sea with my friends. We swam and ate fish in a small restaurant. The trip was a lot of fun.'),
  },
  {
    id: 'ar-w-opinion', level: 'B1', prompt: 'City or village: which is better to live in? Give your opinion, compare them, and give a reason.', minWords: 22,
    requirements: [R('an opinion phrase (في رأيي، أعتقد أنّ)', ['في رأيي', 'أعتقد أن', 'أظن أن']), R('a comparative (أفضل، أهدأ، أكبر…)', ['أفضل', 'أهدأ', 'أكبر', 'أجمل', 'أصغر', 'أسهل', 'أصعب', 'أغلى', 'أرخص']), R('a reason (لأنّ، لذلك)', ['لأن', 'لذلك'])],
    model: P('في رأيي، الحياة في القرية أفضل من المدينة لأنّ القرية أهدأ والهواء أنظف. لكنّ المدينة أكبر وفيها عمل أكثر، لذلك يفضّل الشباب المدينة.', 'fī raʾyī, al-ḥayāh fī al-qarya afḍal min al-madīna li-anna al-qarya ahdaʾ wa-l-hawāʾ anẓaf. lākinna al-madīna akbar wa-fīhā ʿamal akthar, li-dhālika yufaḍḍilu ash-shabāb al-madīna.', 'In my opinion, village life is better than city life because the village is calmer and the air is cleaner. But the city is bigger and has more work, so young people prefer it.'),
  },
  {
    id: 'ar-w-story', level: 'B1', prompt: "Tell a short story that begins 'One day…' (في يوم من الأيام).", minWords: 28,
    requirements: [R('background with كان (كنتُ، كان، كانت…)', ['كنت', 'كان', 'كانت', 'كانوا']), R('time connectors (عندما، بينما، ثم، فجأة)', ['عندما', 'بينما', 'ثم', 'فجأة']), R('an ending (في النهاية، أخيراً)', ['في النهاية', 'أخيرا'])],
    model: P('في يوم من الأيام، كنتُ أمشي في السوق القديم. فجأةً رأيتُ قطة صغيرة تبكي. عندما اقتربتُ منها، ركضت إلى بيت قديم. ثم خرجت امرأة وشكرتني. في النهاية، أخذتُ القطة إلى بيتي.', 'fī yawm min al-ayyām, kuntu amshī fī as-sūq al-qadīm. fajʾatan raʾaytu qiṭṭa ṣaghīra tabkī. ʿindamā iqtarabtu minhā, rakaḍat ilā bayt qadīm. thumma kharajat imraʾa wa-shakaratnī. fī an-nihāya, akhadhtu al-qiṭṭa ilā baytī.', 'One day I was walking in the old market. Suddenly I saw a small cat crying. When I came close, it ran to an old house. Then a woman came out and thanked me. In the end, I took the cat home.'),
  },
  {
    id: 'ar-w-email', level: 'B2', prompt: 'Write a formal email asking a language school for information about an Arabic course.', minWords: 22,
    requirements: [R('a formal opening (تحية طيبة، السيد…)', ['تحية طيبة', 'السيد', 'السيدة', 'حضرة']), R('a polite request (أودّ أن، أرجو، هل يمكن)', ['أود أن', 'أرجو', 'هل يمكن', 'أريد أن']), R('a formal closing (شكراً، مع الاحترام)', ['شكرا', 'مع الاحترام', 'تفضلوا بقبول'])],
    model: P('تحية طيبة وبعد، أودّ أن أسأل عن دورة اللغة العربية للمبتدئين. هل يمكن أن ترسلوا لي مواعيد الدروس والأسعار؟ شكراً لكم مسبقاً، ومع الاحترام.', 'taḥiyya ṭayyiba wa-baʿd, awaddu an asʾala ʿan dawrat al-lugha al-ʿarabiyya li-l-mubtadiʾīn. hal yumkin an tursilū lī mawāʿīd ad-durūs wa-l-asʿār? shukran lakum musbaqan, wa-maʿa al-iḥtirām.', 'Kind greetings. I would like to ask about the Arabic course for beginners. Could you send me the class times and prices? Thank you in advance, with respect.'),
  },
  {
    id: 'ar-w-news', level: 'C1', prompt: 'Summarise a news story you read recently and give your view. Use reporting language and connectors.', minWords: 40,
    requirements: [R('reporting or passive (تمّ، أعلن، وفقاً لـ…)', ['تم', 'أعلن', 'أعلنت', 'وفقا', 'صرح', 'يقال']), R('connectors (بالإضافة إلى، ومع ذلك، لذلك…)', ['بالإضافة', 'علاوة على ذلك', 'ومع ذلك', 'لذلك', 'على الرغم']), R('your view (في رأيي، أرى أنّ…)', ['في رأيي', 'أعتقد أن', 'أرى أن'])],
    model: P('أعلنت وزارة التعليم أمس عن خطة لتدريس البرمجة في المدارس الابتدائية. ووفقاً للوزارة، سيتمّ تدريب ألف معلم هذا العام. بالإضافة إلى ذلك، ستحصل المدارس على أجهزة جديدة. في رأيي، الفكرة ممتازة، ومع ذلك يجب ألّا ننسى المدارس في القرى، لذلك أتمنى أن تكون الخطة عادلة.', 'aʿlanat wizārat at-taʿlīm ams ʿan khuṭṭa li-tadrīs al-barmaja fī al-madāris al-ibtidāʾiyya. wa-wifqan li-l-wizāra, sa-yatimmu tadrīb alf muʿallim hādhā al-ʿām. bi-l-iḍāfa ilā dhālika, sa-taḥṣulu al-madāris ʿalā ajhiza jadīda. fī raʾyī, al-fikra mumtāza, wa-maʿa dhālika yajibu allā nansā al-madāris fī al-qurā, li-dhālika atamannā an takūna al-khuṭṭa ʿādila.', 'Yesterday the Ministry of Education announced a plan to teach programming in primary schools. According to the ministry, a thousand teachers will be trained this year. In addition, schools will get new devices. In my opinion, the idea is excellent; nevertheless, we must not forget village schools, so I hope the plan will be fair.'),
  },
];

export const speakingPrompts = [
  {
    id: 'ar-s-intro', level: 'A1', prompt: 'Introduce yourself out loud: your name and where you are from.', starter: 'اسمي… أنا من…', minWords: 5,
    requirements: [R('your name (اسمي…)', ['اسمي']), R('where you are from (أنا من…)', ['أنا من', 'انا من'])],
    model: P('مرحباً، اسمي سام، أنا من كندا.', 'marḥaban, ismī Sām, ana min Kanadā.', "Hello, my name is Sam, I'm from Canada."),
  },
  {
    id: 'ar-s-order', level: 'A1', prompt: 'Order a drink and something to eat at a café.', starter: 'أريد… من فضلك', minWords: 4,
    requirements: [R('I want (أريد، عايز، بدّي)', ['أريد', 'عايز', 'بدي']), R('please (من فضلك، لو سمحت)', ['من فضلك', 'لو سمحت']), R('a drink or food', ['قهوة', 'شاي', 'ماء', 'عصير', 'خبز', 'حمص', 'فلافل'])],
    model: P('أريد قهوة وخبزاً من فضلك.', 'urīdu qahwa wa-khubzan min faḍlak.', "I'd like coffee and bread, please."),
  },
  {
    id: 'ar-s-day', level: 'A2', prompt: 'Say three things you do every day.', starter: 'كلّ يوم أنا…', minWords: 8,
    requirements: [R('present-tense verbs', ['أذهب', 'آكل', 'أشرب', 'أعمل', 'أدرس', 'أنام', 'أقرأ']), R('a time expression (كلّ يوم، في الصباح…)', ['كل يوم', 'صباحا', 'في الصباح', 'مساء', 'في المساء'])],
    model: P('كلّ يوم أشرب القهوة في الصباح، ثم أذهب إلى العمل، وفي المساء أقرأ.', 'kulla yawm ashrabu al-qahwa fī aṣ-ṣabāḥ, thumma adhhabu ilā al-ʿamal, wa-fī al-masāʾ aqraʾ.', 'Every day I drink coffee in the morning, then go to work, and in the evening I read.'),
  },
  {
    id: 'ar-s-weekend', level: 'A2', prompt: 'What did you do last weekend?', starter: 'في نهاية الأسبوع…', minWords: 8,
    requirements: [R('past-tense verbs', ['ذهبت', 'زرت', 'أكلت', 'شاهدت', 'سافرت', 'لعبت', 'قرأت']), R('a time expression', ['أمس', 'نهاية الأسبوع', 'السبت', 'الجمعة'])],
    model: P('في نهاية الأسبوع زرتُ جدتي وأكلنا معاً، ثم شاهدتُ فيلماً.', 'fī nihāyat al-usbūʿ zurtu jaddatī wa-akalnā maʿan, thumma shāhadtu filman.', 'At the weekend I visited my grandmother and we ate together, then I watched a film.'),
  },
  {
    id: 'ar-s-opinion', level: 'B1', prompt: 'Which is better, summer or winter? Say why.', starter: 'في رأيي…', minWords: 10,
    requirements: [R('an opinion (في رأيي، أعتقد، أحبّ)', ['في رأيي', 'أعتقد', 'أظن', 'أحب']), R('a comparative (أفضل، أجمل)', ['أفضل', 'أجمل', 'أحسن']), R('a reason (لأنّ)', ['لأن'])],
    model: P('في رأيي، الشتاء أفضل من الصيف لأنّ الجو بارد وأحبّ المطر.', 'fī raʾyī, ash-shitāʾ afḍal min aṣ-ṣayf li-anna al-jaww bārid wa-uḥibbu al-maṭar.', 'In my opinion, winter is better than summer because the weather is cool and I love the rain.'),
  },
  {
    id: 'ar-s-plans', level: 'B1', prompt: 'Talk about your plans for next year.', starter: 'في السنة القادمة سوف…', minWords: 12,
    requirements: [R('future or wishes (سوف، سأ…، أريد أن، أتمنى أن)', ['سوف', 'سأسافر', 'سأدرس', 'سأعمل', 'سأذهب', 'أريد أن', 'أتمنى أن']), R('a future time (السنة القادمة…)', ['السنة القادمة', 'العام القادم', 'في المستقبل'])],
    model: P('في السنة القادمة سوف أسافر إلى الأردن، وأتمنى أن أتكلّم العربية بطلاقة.', 'fī as-sana al-qādima sawfa usāfiru ilā al-Urdun, wa-atamannā an atakallama al-ʿarabiyya bi-ṭalāqa.', 'Next year I will travel to Jordan, and I hope to speak Arabic fluently.'),
  },
];

// Rough cumulative study hours per level (FSI and guided-learning-hour estimates for English speakers).
export const levelHours = { A1: 200, A2: 450, B1: 900, B2: 1500, C1: 2200 };
