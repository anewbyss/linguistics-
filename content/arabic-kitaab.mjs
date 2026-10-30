// Al-Kitaab Part Two companion: original lessons that follow the themes and grammar of
// Al-Kitaab fii Taʿallum al-ʿArabiyya, Part Two (3rd ed.), Lessons 1–4. No text, exercises or
// dialogues are reproduced from the book; vocabulary notes give Levantine / Egyptian equivalents.
import { P, Q, C, M, T } from './helpers.mjs';

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
const R = (label, any) => ({ label, any });

export const categories = [
  {
    id: 'ar-kitaab', title: 'Al-Kitaab Part Two Companion', nativeTitle: 'رفيق «الكتاب» – الجزء الثاني',
    icon: 'books.vertical', emoji: '📘',
    summary: 'Practice that follows Al-Kitaab Part Two, Lessons 1–4: housing, Arabs in America, the market, occasions and calendars. Vocabulary notes give the Levantine and Egyptian words. Written for this app; not affiliated with the publisher.',
    lessons: [
      {
        id: 'ar-kit-1', title: 'Housing & Settling Down', level: 'B1',
        summary: 'Verb patterns (أوزان), nouns of place and describing where things are. Goes with Al-Kitaab 2, Lesson 1.',
        grammar: {
          title: 'Verb patterns, nouns of place, and "the house has…"',
          body: [
            'Almost every Arabic word is a three-letter root (جذر) poured into a pattern (وزن). Learn the ten verb patterns once and you can predict the shape, and often the meaning, of thousands of words.',
            'Patterns shift meaning in typical directions. Form II often acts on someone else (درس to study → درّس to teach); Form V is often its reflexive partner (ذكّر to remind → تذكّر to remember); Form X often means seeking or taking (أجر wage, rent → استأجر to rent).',
            'The examples in the table: كتب to write, درّس to teach, ساعد to help, أرسل to send, تذكّر to remember, تعاون to cooperate, انكسر to break (by itself), انتقل to move house, استأجر to rent.',
            'Nouns of place use مَفعَل or مَفعِل, plural مَفاعِل: مطبخ kitchen (from طبخ to cook), مكتب office, مسبح swimming pool, منزل residence. Plurals: مطابخ، مكاتب، منازل.',
            'To say what a place has, put the place first and use في, not عند: في الشقة ثلاث غرف (the apartment has three rooms), أمام البيت حديقة (there is a garden in front of the house). An indefinite noun cannot start the sentence, so the place phrase comes first.',
          ],
          table: T(['Form', 'Past', 'Present', 'Verbal noun', 'Example'],
            ['I', 'فَعَلَ', 'يفعَل', '(varies)', 'كتب'],
            ['II', 'فعّل', 'يُفعّل', 'تفعيل', 'درّس'],
            ['III', 'فاعَل', 'يُفاعِل', 'مُفاعَلة', 'ساعد'],
            ['IV', 'أفعَل', 'يُفعِل', 'إفعال', 'أرسل'],
            ['V', 'تفعّل', 'يتفعّل', 'تفعُّل', 'تذكّر'],
            ['VI', 'تفاعَل', 'يتفاعَل', 'تفاعُل', 'تعاون'],
            ['VII', 'انفعَل', 'ينفعِل', 'انفعال', 'انكسر'],
            ['VIII', 'افتعَل', 'يفتعِل', 'افتعال', 'انتقل'],
            ['X', 'استفعَل', 'يستفعِل', 'استفعال', 'استأجر']),
        },
        vocab: [
          P('شقة', 'shaqqa', 'apartment', 'Plural شقق. The same word in Levantine and Egyptian.'),
          P('طابق', 'ṭābiq', 'floor, story', 'Egyptian: دور dōr.'),
          P('مطبخ', 'maṭbakh', 'kitchen', 'A noun of place from طبخ (to cook).'),
          P('استأجر', 'istaʾjara', 'to rent', 'Egyptian: أجّر aggar.'),
          P('الإيجار', 'al-ījār', 'the rent'),
          P('حديقة', 'ḥadīqa', 'garden, park', 'Levantine and Egyptian: جنينة.'),
          P('بجانب', 'bi-jānib', 'next to', 'Spoken: جنب janb (Egyptian gamb).'),
          P('وراء', 'warāʾ', 'behind', 'Spoken: ورا wara.'),
          P('ترك', 'taraka', 'to leave (someone or something)', 'Egyptian: ساب sāb.'),
          P('الخصوصية', 'al-khuṣūṣiyya', 'privacy'),
          P('الاستقلال', 'al-istiqlāl', 'independence'),
          P('سمسار', 'simsār', 'property agent, middleman'),
        ],
        examples: [
          P('في شقتنا غرفتا نوم ومطبخ صغير.', 'fī shaqqatinā ghurfatā nawm wa-maṭbakh ṣaghīr.', 'Our apartment has two bedrooms and a small kitchen.', 'The place phrase comes first: في شقتنا…'),
          P('أمام البناية حديقة عامة.', 'amāma al-bināya ḥadīqa ʿāmma.', 'There is a public park in front of the building.'),
          P('نستأجر شقة في الطابق الثالث، والإيجار معقول.', 'nastaʾjiru shaqqa fī aṭ-ṭābiq ath-thālith, wa-l-ījār maʿqūl.', 'We rent an apartment on the third floor, and the rent is reasonable.'),
          P('بدّي شقة قريبة من الجامعة.', 'biddī shaʾʾa ʾarībe mn ij-jāmʿa.', 'I want an apartment near the university. (Levantine)'),
        ],
        culture: {
          title: 'Finding an apartment and "establishing a home"',
          body: [
            'In many Arab cities people find apartments through a سمسار (simsār), an informal agent paid a commission, or by asking the بوّاب (bawwāb), the building caretaker common in Egypt, who knows which apartments are empty.',
            'Word of mouth matters: ask friends, colleagues and shopkeepers in the neighborhood before you search online.',
            'تأسيس بيت (taʾsīs bayt, establishing a household) is traditionally a key step before marriage: the couple, often with family help, prepares a permanent, fully furnished home. High housing costs make this hard for many young people, so some newlyweds live with the husband\'s family in بيت العائلة (the family house), at least at first.',
            'Someone with news to share may open with خير؟ (khēr?), literally "good?", meaning "I hope it\'s good news?"',
          ],
        },
        quiz: [
          Q('مطبخ (kitchen) comes from طبخ (to cook). Which pattern makes nouns of place?', ['مَفعَل', 'فاعِل', 'تفعيل', 'مفعول'], 'مَفعَل / مَفعِل: مكتب، مسبح، منزل.'),
          Q("Which sentence says 'The house has a garden'?", ['في البيت حديقة.', 'عند البيت حديقة.', 'البيت حديقة.', 'حديقة البيت في.'], 'Places "have" things with في, and the place phrase comes first.'),
          Q('استأجر (to rent) is which verb form?', ['Form X (استفعل)', 'Form II (فعّل)', 'Form V (تفعّل)', 'Form VIII (افتعل)']),
          Q("In Egyptian Arabic, 'floor, story' is…", ['دور', 'طابق', 'سطح', 'بيت']),
          Q('A سمسار is…', ['an informal property agent', 'a building caretaker', 'a landlord', 'a removal van'], 'The caretaker is the بوّاب.'),
        ],
      },
      {
        id: 'ar-kit-2', title: 'Arabs in America', level: 'B1',
        summary: 'Relative clauses (الذي، التي، الذين / اللي) and negation in formal and spoken Arabic. Goes with Al-Kitaab 2, Lesson 2.',
        grammar: {
          title: 'Relative clauses, and negation in formal and spoken Arabic',
          body: [
            'An indefinite noun is described by a whole sentence with no linking word: عندي صديق يسكن في ديترويت (I have a friend who lives in Detroit).',
            'A definite noun needs a relative pronoun that agrees with it: الذي (masculine), التي (feminine and non-human plurals), الذين (human masculine plural). الطالبة التي تجلس بجانبي = the student who sits next to me.',
            'When the noun is the object, or follows a preposition, the clause repeats it as a pronoun: الكتاب الذي قرأتُهُ (the book that I read [it]); الشارع الذي أسكن فيه (the street I live on [in it]).',
            'Spoken Arabic uses one word for all of them: اللي (illi). الناس اللي بيسكنوا هون = the people who live here.',
            'ما (what, whatever) and مَن (who, whoever) need no noun before them: افعل ما تريد (do what you want); مَن يعرف؟ (who knows?).',
            'Formal Arabic negates each tense differently (table below). In speech, ما and مش (Levantine also مو) do most of the work.',
          ],
          table: T(['Time', 'Formal (فصحى)', 'Levantine', 'Egyptian'],
            ['Past', 'لم + jussive: لم أذهب', 'ما رحت', 'ما رُحتش'],
            ['Present', 'لا + present: لا أعرف', 'ما بعرف', 'ما بعرفش'],
            ['Future', 'لن + subjunctive: لن أسافر', 'ما رح سافر', 'مش حسافر'],
            ['No verb', 'ليس: لستُ مصرياً', 'مو مصري', 'مش مصري']),
        },
        vocab: [
          P('هاجر', 'hājara', 'to emigrate, immigrate', 'Verbal noun الهجرة.'),
          P('مهاجر', 'muhājir', 'immigrant, emigrant'),
          P('جالية', 'jāliya', 'expatriate or immigrant community', 'Plural جاليات.'),
          P('هوية', 'huwiyya', 'identity; ID card'),
          P('بحث عن', 'baḥatha ʿan', 'to look for', 'Levantine and Egyptian: دوّر على dawwar ʿala.'),
          P('بقي', 'baqiya', 'to stay, remain', 'Egyptian: قعد ʾaʿad.'),
          P('ملابس', 'malābis', 'clothes', 'Levantine: تياب tyāb; Egyptian: هدوم hdūm.'),
          P('حرية', 'ḥurriyya', 'freedom'),
          P('أجنبي', 'ajnabī', 'foreign; foreigner', 'Plural أجانب.'),
          P('شمال', 'shamāl', 'north', 'In Levantine and Egyptian speech شمال also means "left".'),
          P('جنوب', 'janūb', 'south'),
          P('غضب', 'ghaḍiba', 'to get angry', 'Spoken: زعل zaʿil.'),
        ],
        examples: [
          P('هاجر جدّي من لبنان إلى أمريكا سنة ١٩٢٠.', 'hājara jaddī min Lubnān ilā Amrīkā sanat alf wa-tisʿumiʾa wa-ʿishrīn.', 'My grandfather emigrated from Lebanon to America in 1920.'),
          P('المدينة التي أسكن فيها فيها جالية عربية كبيرة.', 'al-madīna allatī askunu fīhā fīhā jāliya ʿarabiyya kabīra.', 'The city I live in has a large Arab community.', 'The first فيها points back to the city; the second means "it has".'),
          P('لم أجد العمل الذي كنتُ أبحث عنه.', 'lam ajid al-ʿamal alladhī kuntu abḥathu ʿanhu.', "I didn't find the job I was looking for."),
          P('الناس اللي بيحكوا عربي هون كتار.', 'in-nās illi biḥku ʿarabi hōn ktār.', 'Lots of people here speak Arabic. (Levantine)'),
        ],
        culture: {
          title: 'Arab Americans',
          body: [
            'Arabic-speaking immigrants began arriving in the United States in large numbers in the late 1800s, mostly Christians from Mount Lebanon and Ottoman Syria. Later waves came from Palestine, Iraq, Yemen, Egypt and elsewhere.',
            'Dearborn, Michigan, next to Detroit, has one of the best-known Arab American communities, with Arabic shop signs and the Arab American National Museum. Southern California and the New York area also have large communities.',
            'Writers of the early 20th-century مهجر (diaspora), such as Kahlil Gibran (جبران خليل جبران) and Mikhail Naimy (ميخائيل نعيمة), founded the Pen League in New York and helped shape modern Arabic literature.',
            'Younger Arab Americans often describe their هوية (identity) in layers: Arab, American, both, or tied to a particular country or faith. It is a frequent theme in Arabic media about the diaspora.',
          ],
        },
        quiz: [
          Q("'The woman who lives next to us' needs…", ['التي', 'الذي', 'الذين', 'no relative word'], 'المرأة is definite and feminine.'),
          Q("Which is correct for 'I have a friend who speaks Arabic'?", ['عندي صديق يتكلم العربية.', 'عندي صديق الذي يتكلم العربية.', 'عندي الصديق يتكلم العربية.', 'عندي صديق التي يتكلم العربية.'], 'صديق is indefinite, so no relative pronoun.'),
          Q('In spoken Arabic, الذي / التي / الذين are all…', ['اللي', 'ما', 'مش', 'إنّو']),
          Q("Formal 'I did not go' is…", ['لم أذهب', 'لن أذهب', 'لا ذهبتُ', 'ليس أذهب']),
          Q('جالية means…', ['an immigrant community', 'a passport', 'a mosque', 'a neighborhood market']),
        ],
      },
      {
        id: 'ar-kit-3', title: 'From Home to the Market', level: 'B1',
        summary: 'Form II and V pairs, colors, كان and its sisters, and "it is … to". Goes with Al-Kitaab 2, Lesson 3.',
        grammar: {
          title: 'Form II / V pairs, colors, and كان and its sisters',
          body: [
            'Form II (فعّل) usually does something to someone or something; Form V (تفعّل) is its reflexive partner: غيّر to change something → تغيّر to change (itself); علّم to teach → تعلّم to learn; عرّف to introduce → تعرّف على to get to know.',
            'Basic colors have their own patterns (table below): masculine أفعل, feminine فعلاء, human plural فُعل. Other colors are nisba adjectives ending in ـي: بنّي brown (from بُنّ, coffee beans), برتقالي orange, رمادي gray, وردي pink.',
            'كان and its "sisters", ليس (is not), ما زال (still) and أصبح / صار (became), put their predicate in the accusative: أصبح الجوّ بارداً (the weather became cold).',
            'Followed by a present-tense verb they describe habits and changes: كنتُ أشتري الخبز كل يوم (I used to buy bread every day); ما زلتُ أبحث (I am still looking).',
            '"It is … to …" is من الـ + adjective + أن: من الصعب أن أجد… (it is hard to find…), من السهل أن، من الممكن أن، من المهم أن. Spoken Arabic drops من: صعب إنّي لاقي…',
          ],
          table: T(['Masculine', 'Feminine', 'Plural (people)', 'Meaning'],
            ['أحمر', 'حمراء', 'حُمر', 'red'], ['أزرق', 'زرقاء', 'زُرق', 'blue'],
            ['أخضر', 'خضراء', 'خُضر', 'green'], ['أصفر', 'صفراء', 'صُفر', 'yellow'],
            ['أبيض', 'بيضاء', 'بِيض', 'white'], ['أسود', 'سوداء', 'سُود', 'black']),
        },
        vocab: [
          P('اشترى', 'ishtarā', 'to buy', 'Present يشتري.'),
          P('باع', 'bāʿa', 'to sell', 'Present يبيع.'),
          P('سعر', 'siʿr', 'price', 'Plural أسعار.'),
          P('رخيص', 'rakhīṣ', 'cheap'),
          P('غالي', 'ghālī', 'expensive', 'Formal Arabic writes غالٍ without the ي when indefinite.'),
          P('أصلح', 'aṣlaḥa', 'to repair', 'Spoken: صلّح ṣallaḥ.'),
          P('غسل', 'ghasala', 'to wash (something)'),
          P('مفروشات', 'mafrūshāt', 'furniture', 'Levantine: فرش farsh; Egyptian: عفش ʿafsh.'),
          P('خزانة', 'khizāna', 'wardrobe, closet', 'Egyptian: دولاب dulāb.'),
          P('ثلاجة', 'thallāja', 'refrigerator', 'Levantine: برّاد barrād; Egyptian: تلاجة tallāga.'),
          P('لون', 'lawn', 'color', 'Plural ألوان.'),
          P('يسار', 'yasār', 'left', 'Spoken: شمال shmāl.'),
        ],
        examples: [
          P('اشتريتُ قميصاً أزرق وتنورة حمراء.', 'ishtaraytu qamīṣan azraq wa-tannūra ḥamrāʾ.', 'I bought a blue shirt and a red skirt.', 'The color agrees with its noun: أزرق (masculine), حمراء (feminine).'),
          P('ما زالت الأسعار غالية.', 'mā zālat al-asʿār ghāliya.', 'Prices are still high.'),
          P('من الصعب أن أجد ثلاجة رخيصة.', 'min aṣ-ṣaʿb an ajida thallāja rakhīṣa.', "It's hard to find a cheap fridge."),
          P('قدّيش حقّو؟ — المحلّ محلّك!', 'ʾaddēsh ḥaʾʾo? — il-maḥall maḥallak!', 'How much is it? — The shop is yours! (a polite welcome, not a gift)'),
        ],
        culture: {
          title: 'The traditional souq',
          body: [
            'A traditional Arab souq is a network of smaller markets, each specializing in one kind of goods: spices, gold, fabric, copper. Lanes are often named after what they sell, and the main market usually sits beside the city\'s great mosque.',
            'Damascus\'s Souq al-Hamidiyya (سوق الحميدية), a long covered market from the Ottoman era named after Sultan Abdul Hamid, leads to the Umayyad Mosque. Nearby are specialized markets such as al-Buzuriyya (البزورية) for spices and candy.',
            'Prices for many goods are agreed by bargaining. Shopkeepers selling the same goods sit side by side and often send customers to each other rather than compete.',
            'Many old markets have a حمّام, a public steam bath with several rooms. It is still part of everyday life in parts of North Africa and a popular experience in old Damascus, Aleppo and Cairo.',
            'Shop phrases: يعطيك العافية (said to someone working; reply: الله يعافيك), مبروك (said on a purchase too; reply: الله يبارك فيك), تكرم عينك (with pleasure, Levantine).',
          ],
        },
        quiz: [
          Q('تعلّم (to learn) is the Form V partner of…', ['علّم (to teach)', 'عَلِم (to know)', 'معلّم (teacher)', 'استعلم (to inquire)']),
          Q("'A red car' (سيارة is feminine) is…", ['سيارة حمراء', 'سيارة أحمر', 'سيارة حُمر', 'سيارة أحمرة']),
          Q('ما زلتُ أبحث عن شقة means…', ["I'm still looking for an apartment", 'I stopped looking for an apartment', 'I will look for an apartment', 'I never looked for an apartment']),
          Q('After أصبح, a predicate adjective is…', ['accusative (-an)', 'nominative (-un)', 'genitive (-in)', 'always a verb']),
          Q("In Levantine and Egyptian speech, 'left' is…", ['شمال', 'يسار', 'يمين', 'جنوب']),
        ],
      },
      {
        id: 'ar-kit-4', title: 'Occasions & Preparations', level: 'B2',
        summary: 'Case endings (الإعراب), the genitive and the five nouns, with wishes for every occasion. Goes with Al-Kitaab 2, Lesson 4.',
        grammar: {
          title: 'Case endings (الإعراب) and the genitive',
          body: [
            'Formal Arabic marks a noun\'s role with short-vowel endings, written only in fully vowelled texts (the Quran, poetry, children\'s books) and heard in formal speeches and the news: nominative (مرفوع) -u, accusative (منصوب) -a, genitive (مجرور) -i.',
            'Indefinite nouns double the vowel (tanwīn): -un, -an, -in. Only accusative -an is normally visible, written with an extra alif: كتاباً.',
            'The genitive marks (1) nouns after a preposition: في البيتِ، منذ الصباحِ; and (2) every noun of an iḍāfa after the first: بطاقةُ دعوةٍ، كتابُ الطالبِ.',
            'Masculine human plurals have two forms: -ūna (nominative) and -īna (accusative and genitive): المهندسون / المهندسين. Spoken Arabic uses only -īn.',
            'Five special nouns, including أب and أخ, lengthen the case vowel when they are possessed: هذا أبو خالد، رأيتُ أبا خالد، مع أبي خالد. That is why kunyas change in formal sentences.',
          ],
          table: T(['Case', 'Definite', 'Indefinite', 'Used for'],
            ['Nominative مرفوع', 'الطالبُ', 'طالبٌ', 'subjects and predicates'],
            ['Accusative منصوب', 'الطالبَ', 'طالباً', 'objects, the predicate of كان, adverbs'],
            ['Genitive مجرور', 'الطالبِ', 'طالبٍ', 'after prepositions and in iḍāfa']),
        },
        vocab: [
          P('حفلة', 'ḥafla', 'party, celebration', 'Plural حفلات.'),
          P('عرس', 'ʿurs', 'wedding', 'Egyptian: فرح faraḥ.'),
          P('دعا', 'daʿā', 'to invite; to call; to pray', 'Present يدعو. Spoken: عزم ʿazam.'),
          P('بطاقة دعوة', 'biṭāqat daʿwa', 'invitation card', 'Levantine: كرت دعوة kart daʿwe.'),
          P('صام', 'ṣāma', 'to fast', 'Present يصوم.'),
          P('أفطر', 'afṭara', 'to break a fast; to have breakfast'),
          P('السحور', 'as-saḥūr', 'the meal before dawn in Ramadan'),
          P('رحلة', 'riḥla', 'trip, flight'),
          P('قلق', 'qalaq', 'anxiety, worry'),
          P('اعتاد على', 'iʿtāda ʿalā', 'to get used to', 'Spoken: تعوّد على tʿawwad ʿala.'),
          P('اجتمع مع', 'ijtamaʿa maʿa', 'to meet with'),
          P('اختلف عن', 'ikhtalafa ʿan', 'to differ from', 'اختلف مع = to disagree with.'),
        ],
        examples: [
          P('كل عام وأنتم بخير!', 'kull ʿām wa-antum bi-khayr!', 'Happy holidays! (literally: every year, and may you be well)', 'Reply: وأنتم بخير. Levantine: كل سنة وانتو سالمين; Egyptian: كل سنة وانتو طيبين.'),
          P('دعانا أصدقاؤنا إلى حفلة عرس ابنتهم.', 'daʿānā aṣdiqāʾunā ilā ḥaflat ʿurs ibnatihim.', "Our friends invited us to their daughter's wedding party."),
          P('في رمضان نصوم من الفجر إلى المغرب.', 'fī Ramaḍān naṣūmu min al-fajr ilā al-maghrib.', 'In Ramadan we fast from dawn to sunset.'),
          P('مبروك! — الله يبارك فيك، عقبال عندك!', 'mabrūk! — aḷḷa ybārik fīk, ʿuʾbāl ʿandak!', 'Congratulations! — Thank you, may it be your turn next!'),
        ],
        culture: {
          title: 'A wish for every occasion, and the kunya',
          body: [
            'For holidays and birthdays say كل عام وأنتم بخير (or a spoken version). For weddings, graduations, a new baby or a new car say مبروك, answered with الله يبارك فيك. After a wedding مبروك, the reply often adds عقبالك / عقبال عندك (may you be next!).',
            'In Ramadan, Muslims fast from dawn to sunset, eat سحور before dawn and break the fast at إفطار. Evenings are social: family visits, special desserts, and TV series (مسلسلات) made for the month. Greet people with رمضان كريم (reply: الله أكرم) or رمضان مبارك.',
            'Many people are called by a kunya (كنية): أبو or أم plus the name of their eldest son, or daughter if there are no sons, as in أبو خالد and أم خالد. It sounds warm and respectful. Some names come with a traditional kunya: a man named حسين is often called أبو علي.',
          ],
        },
        quiz: [
          Q('In which phrase is the first word listed genitive (مجرور)?', ['البيت in في البيت', 'الطالب in جاء الطالب', 'كتاباً in قرأتُ كتاباً', 'جميلاً in كان الجوّ جميلاً'], 'After the preposition في, البيت is genitive: في البيتِ.'),
          Q('In مع أبي خالد, the word أبي is…', ['genitive, after مع', 'accusative', 'nominative', "'my father'"], 'Before a name in an iḍāfa, أب takes a long vowel: أبو / أبا / أبي.'),
          Q("Someone says 'كل عام وأنتم بخير'. You reply…", ['وأنتم بخير', 'الله يعافيك', 'سلامتك', 'تكرم عينك']),
          Q('Egyptians call a wedding…', ['فرح', 'عرس', 'حفلة', 'سحور']),
          Q('السحور is…', ['the meal before dawn in Ramadan', 'the meal at sunset', 'a wedding dinner', 'a kind of sweet']),
        ],
      },
      {
        id: 'ar-kit-5', title: 'Calendars: Three Sets of Months', level: 'A2',
        summary: 'Egyptian, Levantine and Hijri month names, and why Ramadan moves. Goes with the calendar section of Al-Kitaab 2, Lesson 4.',
        grammar: {
          title: 'Three ways to name the months',
          body: [
            'Egypt, Sudan and Morocco use month names borrowed from European languages: يناير، فبراير، مارس… (Tunisia and Algeria use French-style جانفي، فيفري…).',
            'Syria, Lebanon, Jordan, Palestine and Iraq use older names of Syriac origin: كانون الثاني (January), شباط (February), آذار (March)… Newspapers often print both: آذار (مارس).',
            'The Islamic (Hijri) calendar is lunar: twelve months of 29 or 30 days, about 11 days shorter than the solar year. Year 1 began with the Prophet\'s migration (الهجرة) from Mecca to Medina in 622 CE.',
            'Dates are often marked هـ (Hijri) or م (ميلادي, Gregorian), and Gulf countries use both calendars side by side.',
          ],
          table: T(['No.', 'Egypt & Morocco', 'Levant & Iraq', 'Hijri months, in order'],
            ['1', 'يناير', 'كانون الثاني', 'مُحرّم'], ['2', 'فبراير', 'شباط', 'صفر'],
            ['3', 'مارس', 'آذار', 'ربيع الأول'], ['4', 'أبريل', 'نيسان', 'ربيع الآخر'],
            ['5', 'مايو', 'أيار', 'جمادى الأولى'], ['6', 'يونيو', 'حزيران', 'جمادى الآخرة'],
            ['7', 'يوليو', 'تموز', 'رجب'], ['8', 'أغسطس', 'آب', 'شعبان'],
            ['9', 'سبتمبر', 'أيلول', 'رمضان'], ['10', 'أكتوبر', 'تشرين الأول', 'شوّال'],
            ['11', 'نوفمبر', 'تشرين الثاني', 'ذو القعدة'], ['12', 'ديسمبر', 'كانون الأول', 'ذو الحجة']),
        },
        vocab: [
          P('شهر', 'shahr', 'month', 'Plural أشهر or شهور.'),
          P('السنة الهجرية', 'as-sana al-hijriyya', 'the Hijri (Islamic) year'),
          P('السنة الميلادية', 'as-sana al-mīlādiyya', 'the Gregorian year'),
          P('رمضان', 'Ramaḍān', 'Ramadan, the month of fasting'),
          P('عيد الفطر', 'ʿīd al-fiṭr', 'Eid al-Fitr, the feast after Ramadan', 'On Shawwal 1.'),
          P('عيد الأضحى', 'ʿīd al-aḍḥā', 'Eid al-Adha, the Feast of the Sacrifice', 'On Dhu al-Hijja 10, during the Hajj.'),
          P('الهلال', 'al-hilāl', 'the crescent moon'),
          P('عيدية', 'ʿīdiyya', 'Eid money given to children'),
        ],
        examples: [
          P('وُلدتُ في شهر آذار.', 'wulidtu fī shahr Ādhār.', 'I was born in March. (Levantine month name)'),
          P('يبدأ العام الدراسي في سبتمبر.', 'yabdaʾu al-ʿām ad-dirāsī fī Sibtambar.', 'The school year starts in September.'),
          P('يصوم المسلمون شهر رمضان، ثم يحتفلون بعيد الفطر.', 'yaṣūmu al-muslimūna shahr Ramaḍān, thumma yaḥtafilūna bi-ʿīd al-fiṭr.', 'Muslims fast the month of Ramadan, then celebrate Eid al-Fitr.'),
          P('عيد مبارك! — علينا وعليك!', 'ʿīd mubārak! — ʿalēna w-ʿalēk!', 'Blessed Eid! — To us and to you!'),
        ],
        culture: {
          title: 'Why Ramadan moves',
          body: [
            'Because the Hijri year is about 11 days shorter, Ramadan starts about 11 days earlier each Gregorian year and moves through every season in roughly 33 years. A summer Ramadan means long, hot fasting days.',
            'Each Hijri month begins when the new crescent (الهلال) is sighted, so the start of Ramadan or Eid can differ by a day between countries.',
            'Both Eids are public holidays: families visit, children get new clothes and عيدية (Eid money), and people greet each other with عيد مبارك or كل عام وأنتم بخير.',
          ],
        },
        quiz: [
          Q("In Damascus, 'April' is…", ['نيسان', 'أبريل', 'آذار', 'أيار']),
          Q("In Cairo, 'August' is…", ['أغسطس', 'آب', 'أيلول', 'يوليو']),
          Q('The Hijri year is…', ['lunar, about 11 days shorter than the solar year', 'solar, like the Gregorian year', 'longer than the Gregorian year', 'used only in Egypt']),
          Q('Eid al-Fitr falls on the first day of…', ['شوّال', 'رمضان', 'مُحرّم', 'ذو الحجة']),
        ],
      },
    ],
  },
];

export const scenarios = [
  {
    id: 'ar-sc-flat', title: 'Renting an Apartment in Damascus', level: 'B1', emoji: '🏢', icon: 'building.2',
    setting: 'You need an apartment for a year of study. A simsar (agent) meets you near the university.', goal: 'Ask about the rooms, the floor, the rent and the furniture, then arrange a visit.',
    steps: [
      step('Simsar', P('أهلين! شو بدّك بالضبط؟', 'ahlēn! shū biddak bi-ẓ-ẓabṭ?', 'Welcome! What exactly are you looking for?'), 'Say you want a small furnished apartment near the university.', [
        C('بدّي شقة صغيرة مفروشة قريبة من الجامعة.', 'biddi shaʾʾa zġīre mafrūshe ʾarībe mn ij-jāmʿa.', 'I want a small furnished apartment near the university.', true, 'Size, furniture and location: clear.'),
        C('بدّي جامعة صغيرة.', 'biddi jāmʿa zġīre.', 'I want a small university.', false, 'You want a شقة (apartment), not a university!'),
        C('أنا شقة.', 'ana shaʾʾa.', 'I am an apartment.', false, 'Use بدّي (I want) + شقة.'),
      ]),
      step('Simsar', P('عندي شقة حلوة بالطابق الرابع، فيها غرفتين ومطبخ وحمّام.', 'ʿindi shaʾʾa ḥilwe bi-ṭ-ṭābeʾ ir-rābeʿ, fīha ghurftēn w-maṭbakh w-ḥammām.', 'I have a nice apartment on the fourth floor. It has two rooms, a kitchen and a bathroom.'), 'What does the apartment have?', [
        U('Two rooms, a kitchen and a bathroom, on the fourth floor', true, 'فيها = it has; غرفتين = two rooms (dual).'),
        U('Four rooms on the second floor', false, 'الرابع = the fourth (floor); غرفتين = two rooms.'),
        U('One room and no kitchen', false, 'He mentioned مطبخ, a kitchen.'),
      ], 'understand'),
      step(null, null, 'Ask whether there is an elevator.', [
        C('في أسانسير؟', 'fī asansēr?', 'Is there an elevator?', true, 'في + noun = there is. Levantine uses أسانسير, from French.'),
        C('عندو أسانسير؟', 'ʿando asansēr?', 'Does he have an elevator?', false, 'For places use في (there is), not عند (to have).'),
        C('وين الأسانسير تبعي؟', 'wēn il-asansēr tabaʿi?', 'Where is my elevator?', false, "It isn't yours yet!"),
      ]),
      step('Simsar', P('لا والله، ما في. بس الإيجار رخيص: مية دولار بالشهر.', 'la wallāh, ma fī. bas il-ījār rkhīṣ: mīt dolār bi-sh-shahr.', "No, there isn't. But the rent is cheap: a hundred dollars a month."), 'What did he say?', [
        U("There's no elevator, but the rent is cheap: $100 a month", true, 'ما في = there isn\'t; بالشهر = per month.'),
        U('There is an elevator, and the rent is $100 a week', false, 'ما في = there isn\'t, and بالشهر = per month.'),
        U('The rent is expensive', false, 'رخيص = cheap.'),
      ], 'understand'),
      step(null, null, 'Ask whether it is furnished and whether you can see it today.', [
        C('الشقة مفروشة؟ فيني شوفها اليوم؟', 'ish-shaʾʾa mafrūshe? fīni shūfa il-yōm?', 'Is the apartment furnished? Can I see it today?', true, 'فيني = I can (Levantine).'),
        C('الشقة بتشوفني اليوم؟', 'ish-shaʾʾa btshūfni il-yōm?', 'Will the apartment see me today?', false, "You've swapped who sees whom!"),
        C('بدّي اشتري الشقة هلّق.', 'biddi ishtiri ish-shaʾʾa hallaʾ.', 'I want to buy the apartment right now.', false, 'You want to rent it, and see it first.'),
      ]),
      step('Simsar', P('أكيد! يلّا نروح هلّق.', 'akīd! yalla nrūḥ hallaʾ.', "Of course! Let's go now."), 'Agree and thank him for his trouble.', [
        C('تمام، يعطيك العافية!', 'tamām, yaʿṭīk il-ʿāfye!', 'Great, thanks for your trouble!', true, 'He will answer الله يعافيك.'),
        C('مبروك!', 'mabrūk!', 'Congratulations!', false, 'Nothing to congratulate yet.'),
        C('سلامتك!', 'salāmtak!', 'Get well soon!', false, "He isn't ill."),
      ]),
    ],
  },
  {
    id: 'ar-sc-wedding', title: 'A Wedding Invitation in Amman', level: 'B1', emoji: '💍', icon: 'envelope.open',
    setting: "A colleague in Amman hands you an invitation to her brother's wedding.", goal: 'Congratulate her, accept the invitation and use the right wishes at the party.',
    steps: [
      step('Colleague', P('تفضّل، هاي بطاقة دعوة لعرس أخوي يوم الخميس.', 'tfaḍḍal, hāy biṭāʾat daʿwe la-ʿurs akhūy yōm il-khamīs.', "Here you go, this is an invitation to my brother's wedding on Thursday."), 'Congratulate her.', [
        C('مبروك! ألف مبروك!', 'mabrūk! alf mabrūk!', 'Congratulations! A thousand congratulations!', true, 'Perfect.'),
        C('سلامتك!', 'salāmtik!', 'Get well soon!', false, "That's for someone who is ill."),
        C('رمضان كريم!', 'ramaḍān karīm!', 'Happy Ramadan!', false, 'Wrong occasion.'),
      ]),
      step('Colleague', P('الله يبارك فيك! عقبالك!', 'aḷḷa ybārik fīk! ʿuʾbālak!', 'Thank you! May you be next!'), 'What did she wish you?', [
        U("That you'll be the next to celebrate a wedding", true, 'عقبالك = may it be your turn (next).'),
        U('That you arrive on time', false, 'عقبالك wishes you a happy event of your own.'),
        U('That you bring a big present', false, 'Nothing about presents.'),
      ], 'understand'),
      step(null, null, 'Accept the invitation politely.', [
        C('أكيد رح إجي، شكراً على الدعوة!', 'akīd raḥ ʾiji, shukran ʿa-d-daʿwe!', "Of course I'll come, thanks for the invitation!", true, 'رح = will (Levantine).'),
        C('ما بحبّ الأعراس.', 'ma bḥibb il-aʿrās.', "I don't like weddings.", false, 'Honest, but rude!'),
        C('مين أخوكِ؟', 'mīn akhūki?', 'Who is your brother?', false, 'Not the best reply to an invitation.'),
      ]),
      step('Colleague', P('الحفلة الساعة تسعة بالليل بفندق قريب من الدوّار السابع.', 'il-ḥafle is-sāʿa tisʿa bi-l-lēl b-funduʾ ʾarīb min id-dawwār is-sābiʿ.', 'The party is at nine at night, in a hotel near Seventh Circle.'), 'When and where is it?', [
        U('At 9 pm, in a hotel near Seventh Circle', true, 'الدوّار السابع (Seventh Circle) is a well-known roundabout in Amman.'),
        U('At 7 pm, at her house', false, 'تسعة = nine; فندق = hotel.'),
        U('On Saturday morning', false, 'She said Thursday, at night.'),
      ], 'understand'),
      step(null, null, "At the wedding, greet the groom's mother.", [
        C('مبروك! الله يتمّم بالخير.', 'mabrūk! aḷḷa ytammim bi-l-khēr.', 'Congratulations! May God bring it to a happy completion.', true, 'A classic wedding wish.'),
        C('كل سنة وانتِ سالمة.', 'kull sane w-inti salme.', 'Happy holidays (or happy birthday).', false, "That's for yearly holidays and birthdays."),
        C('يعطيكي العافية.', 'yaʿṭīki il-ʿāfye.', 'God give you strength (for your work).', false, "That's said to someone working, not at a wedding."),
      ]),
    ],
  },
];

export const dictionary = [
  // housing
  ['شقة', 'shaqqa', 'apartment'], ['شقق', 'shuqaq', 'apartments'], ['طابق', 'ṭābiq', 'floor; story'], ['دور', 'dōr', 'floor (Egyptian); turn; role'],
  ['مطبخ', 'maṭbakh', 'kitchen'], ['مطابخ', 'maṭābikh', 'kitchens'], ['استأجر', 'istaʾjara', 'to rent'], ['إيجار', 'ījār', 'rent'],
  ['حديقة', 'ḥadīqa', 'garden; park'], ['جنينة', 'jnēne / gnēna', 'garden (spoken)'], ['بجانب', 'bi-jānib', 'next to'], ['جنب', 'janb', 'next to (spoken)'],
  ['وراء', 'warāʾ', 'behind'], ['ترك', 'taraka', 'to leave (something)'], ['ساب', 'sāb', 'to leave (Egyptian)'], ['خصوصية', 'khuṣūṣiyya', 'privacy'],
  ['استقلال', 'istiqlāl', 'independence'], ['سمسار', 'simsār', 'property agent; middleman'], ['بواب', 'bawwāb', 'doorman; building caretaker'],
  ['بناية', 'bināya', 'building'], ['مفروش', 'mafrūsh', 'furnished'], ['مسبح', 'masbaḥ', 'swimming pool'], ['منزل', 'manzil', 'residence; house'],
  ['انتقل', 'intaqala', 'to move (house)'], ['فاضي', 'fāḍī', 'empty; free; not busy'], ['أسانسير', 'asansēr', 'elevator (spoken)'],
  // migration & identity
  ['هاجر', 'hājara', 'to emigrate; to immigrate'], ['هجرة', 'hijra', 'emigration; migration'], ['مهاجر', 'muhājir', 'immigrant; emigrant'], ['مهجر', 'mahjar', 'diaspora; land of emigration'],
  ['جالية', 'jāliya', 'immigrant community'], ['هوية', 'huwiyya', 'identity; ID card'], ['بحث', 'baḥatha / baḥth', 'to look for; research'], ['دور على', 'dawwar ʿala', 'to look for (spoken)'],
  ['بقي', 'baqiya', 'to stay; to remain'], ['قعد', 'ʾaʿad', 'to stay; to sit (spoken)'], ['ملابس', 'malābis', 'clothes'], ['تياب', 'tyāb', 'clothes (Levantine)'], ['هدوم', 'hdūm', 'clothes (Egyptian)'],
  ['حرية', 'ḥurriyya', 'freedom'], ['أجنبي', 'ajnabī', 'foreign; foreigner'], ['أجانب', 'ajānib', 'foreigners'], ['شمال', 'shamāl', 'north; left (spoken)'],
  ['جنوب', 'janūb', 'south'], ['شرق', 'sharq', 'east'], ['غرب', 'gharb', 'west'], ['غضب', 'ghaḍiba / ghaḍab', 'to get angry; anger'], ['زعلان', 'zaʿlān', 'upset; angry (spoken)'],
  ['اللي', 'illi', 'who; which; that (spoken)'], ['الذي', 'alladhī', 'who; which (m.)'], ['التي', 'allatī', 'who; which (f.)'], ['الذين', 'alladhīna', 'who (m. pl.)'],
  // market
  ['اشترى', 'ishtarā', 'to buy'], ['باع', 'bāʿa', 'to sell'], ['سعر', 'siʿr', 'price'], ['أسعار', 'asʿār', 'prices'], ['رخيص', 'rakhīṣ', 'cheap'], ['غالي', 'ghālī', 'expensive; dear'],
  ['أصلح', 'aṣlaḥa', 'to repair'], ['صلح', 'ṣallaḥ', 'to repair (spoken)'], ['غسل', 'ghasala', 'to wash'], ['مفروشات', 'mafrūshāt', 'furniture'], ['عفش', 'ʿafsh', 'furniture (Egyptian)'],
  ['خزانة', 'khizāna', 'wardrobe; closet'], ['دولاب', 'dulāb', 'wardrobe (Egyptian)'], ['ثلاجة', 'thallāja', 'refrigerator'], ['براد', 'barrād', 'refrigerator (Levantine)'],
  ['لون', 'lawn', 'color'], ['ألوان', 'alwān', 'colors'], ['أحمر', 'aḥmar', 'red'], ['حمراء', 'ḥamrāʾ', 'red (f.)'], ['أزرق', 'azraq', 'blue'], ['زرقاء', 'zarqāʾ', 'blue (f.)'],
  ['أخضر', 'akhḍar', 'green'], ['خضراء', 'khaḍrāʾ', 'green (f.)'], ['أصفر', 'aṣfar', 'yellow'], ['صفراء', 'ṣafrāʾ', 'yellow (f.)'], ['أبيض', 'abyaḍ', 'white'], ['بيضاء', 'bayḍāʾ', 'white (f.)'],
  ['أسود', 'aswad', 'black'], ['سوداء', 'sawdāʾ', 'black (f.)'], ['بني', 'bunnī', 'brown'], ['رمادي', 'ramādī', 'gray'], ['برتقالي', 'burtuqālī', 'orange (color)'], ['وردي', 'wardī', 'pink'],
  ['يسار', 'yasār', 'left'], ['يمين', 'yamīn', 'right'], ['تغير', 'taghayyara', 'to change (by itself)'], ['غير', 'ghayyara / ghayr', 'to change (something); other than'],
  ['ما زال', 'mā zāla', 'still'], ['أصبح', 'aṣbaḥa', 'to become'], ['صار', 'ṣāra', 'to become'], ['يعطيك العافية', 'yaʿṭīk il-ʿāfye', 'God give you strength (to someone working)'],
  ['تكرم عينك', 'tikram ʿēnak', 'with pleasure (Levantine)'], ['المحل محلك', 'il-maḥall maḥallak', 'the shop is yours (polite welcome)'],
  // occasions & calendar
  ['حفلة', 'ḥafla', 'party; celebration'], ['عرس', 'ʿurs', 'wedding'], ['فرح', 'faraḥ', 'joy; wedding (Egyptian)'], ['دعا', 'daʿā', 'to invite; to call; to pray'],
  ['عزم', 'ʿazam', 'to invite (spoken)'], ['دعوة', 'daʿwa', 'invitation'], ['بطاقة', 'biṭāqa', 'card'], ['صام', 'ṣāma', 'to fast'], ['أفطر', 'afṭara', 'to break a fast'],
  ['سحور', 'saḥūr', 'pre-dawn meal in Ramadan'], ['رحلة', 'riḥla', 'trip; flight'], ['قلق', 'qalaq', 'anxiety; worry'], ['اعتاد', 'iʿtāda', 'to get used to'],
  ['اجتمع', 'ijtamaʿa', 'to meet; to gather'], ['اختلف', 'ikhtalafa', 'to differ; to disagree'], ['عاصمة', 'ʿāṣima', 'capital city'], ['معهد', 'maʿhad', 'institute'],
  ['عقبالك', 'ʿuʾbālak', 'may you be next (wedding wish)'], ['كل عام وأنتم بخير', 'kull ʿām wa-antum bi-khayr', 'happy holidays; happy birthday'],
  ['عيد مبارك', 'ʿīd mubārak', 'blessed Eid'], ['عيدية', 'ʿīdiyya', 'Eid money for children'], ['هلال', 'hilāl', 'crescent moon'], ['كنية', 'kunya', 'kunya (Abu / Umm + name)'],
  ['هجري', 'hijrī', 'Hijri (Islamic calendar)'], ['ميلادي', 'mīlādī', 'Gregorian; AD'],
  ['كانون الثاني', 'kānūn ath-thānī', 'January (Levant)'], ['شباط', 'shubāṭ', 'February (Levant)'], ['آذار', 'ādhār', 'March (Levant)'], ['نيسان', 'nīsān', 'April (Levant)'],
  ['أيار', 'ayyār', 'May (Levant)'], ['حزيران', 'ḥazīrān', 'June (Levant)'], ['تموز', 'tammūz', 'July (Levant)'], ['آب', 'āb', 'August (Levant)'], ['أيلول', 'aylūl', 'September (Levant)'],
  ['تشرين الأول', 'tishrīn al-awwal', 'October (Levant)'], ['تشرين الثاني', 'tishrīn ath-thānī', 'November (Levant)'], ['كانون الأول', 'kānūn al-awwal', 'December (Levant)'],
  ['يناير', 'yanāyir', 'January'], ['فبراير', 'fibrāyir', 'February'], ['مارس', 'māris', 'March'], ['أبريل', 'abrīl', 'April'], ['مايو', 'māyū', 'May'], ['يونيو', 'yūnyū', 'June'],
  ['يوليو', 'yūlyū', 'July'], ['أغسطس', 'aghusṭus', 'August'], ['سبتمبر', 'sibtambar', 'September'], ['أكتوبر', 'uktūbar', 'October'], ['نوفمبر', 'nūfambar', 'November'], ['ديسمبر', 'dīsambar', 'December'],
  ['محرم', 'muḥarram', 'Muharram (1st Hijri month)'], ['شعبان', 'shaʿbān', 'Shaʿban (8th Hijri month)'], ['شوال', 'shawwāl', 'Shawwal (10th Hijri month)'], ['ذو الحجة', 'dhū al-ḥijja', 'Dhu al-Hijja (12th Hijri month)'],
];

export const writingPrompts = [
  {
    id: 'ar-w-home', level: 'B1', prompt: 'Describe your home, or an apartment you would like: where it is, what it has and what is near it. Start some sentences with the place (في شقتي… / أمام… / بجانب…).', minWords: 20,
    requirements: [
      R('rooms or parts of a home (غرفة، مطبخ، حمام…)', ['غرفة', 'غرف', 'غرفتا', 'مطبخ', 'حمام', 'شرفة', 'صالون', 'طابق', 'الطابق']),
      R('a place-first sentence (في شقتي…، أمام…، بجانب…)', ['في بيتي', 'في شقتي', 'في البيت', 'في الشقة', 'أمام', 'بجانب', 'وراء', 'خلف']),
      R('a describing word (كبير، صغير، قريب، مريح…)', ['كبير', 'كبيرة', 'صغير', 'صغيرة', 'قريب', 'قريبة', 'جميل', 'جميلة', 'واسع', 'واسعة', 'مريح', 'مريحة']),
    ],
    model: P('أسكن في شقة صغيرة في الطابق الثالث. في شقتي غرفتا نوم ومطبخ وحمام. أمام البناية حديقة جميلة، وبجانبها مخبز قريب. الشقة مريحة لكنّ الإيجار غالٍ.', 'askunu fī shaqqa ṣaghīra fī aṭ-ṭābiq ath-thālith. fī shaqqatī ghurfatā nawm wa-maṭbakh wa-ḥammām. amāma al-bināya ḥadīqa jamīla, wa-bi-jānibihā makhbaz qarīb. ash-shaqqa murīḥa lākinna al-ījār ghālin.', 'I live in a small apartment on the third floor. My apartment has two bedrooms, a kitchen and a bathroom. In front of the building is a beautiful garden, and next to it a bakery. The apartment is comfortable, but the rent is expensive.'),
  },
  {
    id: 'ar-w-family-house', level: 'B2', prompt: "Should newly married couples live with the husband's family at first, or in a home of their own? Give arguments on both sides and your conclusion.", minWords: 35,
    requirements: [
      R('an opinion phrase (في رأيي، أعتقد أنّ…)', ['في رأيي', 'أعتقد أن', 'أظن أن', 'أرى أن']),
      R('both sides (من ناحية… ومن ناحية أخرى، لكنّ…)', ['من ناحية', 'لكن', 'ومع ذلك', 'أما']),
      R('key ideas (الاستقلال، الخصوصية، الأهل…)', ['الاستقلال', 'والاستقلال', 'الخصوصية', 'الأهل', 'العائلة', 'بيت العائلة']),
      R('a conclusion (لذلك، في النهاية)', ['لذلك', 'في النهاية', 'أخيرا']),
    ],
    model: P('يسكن كثير من الأزواج الجدد مع أهل الزوج لأنّ الإيجار غالٍ. من ناحية، هذا الحلّ يوفّر المال ويقرّب العائلة. ومن ناحية أخرى، يفقد الزوجان الخصوصية والاستقلال، وقد تحدث خلافات. في رأيي، السكن مع العائلة حلّ مؤقت جيد، لذلك يجب أن يكون للزوجين مطبخ خاص وخطة للانتقال.', 'yaskunu kathīr min al-azwāj al-judud maʿa ahl az-zawj li-anna al-ījār ghālin. min nāḥiya, hādhā al-ḥall yuwaffiru al-māl wa-yuqarribu al-ʿāʾila. wa-min nāḥiya ukhrā, yafqidu az-zawjān al-khuṣūṣiyya wa-l-istiqlāl, wa-qad taḥduthu khilāfāt. fī raʾyī, as-sakan maʿa al-ʿāʾila ḥall muʾaqqat jayyid, li-dhālika yajibu an yakūna li-z-zawjayn maṭbakh khāṣṣ wa-khuṭṭa li-l-intiqāl.', "Many newlyweds live with the husband's family because rent is expensive. On one hand, this saves money and brings the family closer. On the other hand, the couple loses privacy and independence, and disagreements may happen. In my opinion, living with the family is a good temporary solution, so the couple should have their own kitchen and a plan to move out."),
  },
  {
    id: 'ar-w-community', level: 'B2', prompt: 'Write about an immigrant community in your city or country: where they came from, when, and how they keep their identity.', minWords: 35,
    requirements: [
      R('migration words (هاجر، مهاجرين، جالية…)', ['هاجر', 'هاجروا', 'مهاجرين', 'المهاجرين', 'جالية', 'الجالية']),
      R('a relative clause (الذي، التي، الذين)', ['الذي', 'التي', 'الذين']),
      R('identity and culture (الهوية، اللغة، الثقافة…)', ['الهوية', 'هويتهم', 'اللغة', 'لغتهم', 'الثقافة', 'ثقافتهم', 'عاداتهم']),
      R('a time expression (منذ، قبل، سنة…)', ['منذ', 'في القرن', 'سنة', 'قبل']),
    ],
    model: P('في مدينتي جالية لبنانية كبيرة. هاجر أفرادها الأوائل منذ أكثر من مئة سنة، وكانوا يبحثون عن عمل وحرية. اليوم يعمل كثير منهم في التجارة والطب. الشباب الذين وُلدوا هنا يتكلمون الإنجليزية، لكنّ عائلاتهم تحافظ على اللغة العربية والمطبخ اللبناني، لذلك ما زالت هويتهم قوية.', 'fī madīnatī jāliya lubnāniyya kabīra. hājara afrāduhā al-awāʾil mundhu akthar min miʾat sana, wa-kānū yabḥathūna ʿan ʿamal wa-ḥurriyya. al-yawm yaʿmalu kathīr minhum fī at-tijāra wa-ṭ-ṭibb. ash-shabāb alladhīna wulidū hunā yatakallamūna al-injilīziyya, lākinna ʿāʾilātihim tuḥāfiẓu ʿalā al-lugha al-ʿarabiyya wa-l-maṭbakh al-lubnānī, li-dhālika mā zālat huwiyyatuhum qawiyya.', 'My city has a large Lebanese community. Its first members emigrated more than a hundred years ago, looking for work and freedom. Today many of them work in trade and medicine. The young people who were born here speak English, but their families keep the Arabic language and Lebanese cooking, so their identity is still strong.'),
  },
  {
    id: 'ar-w-shopping', level: 'B2', prompt: 'Online shopping or the market: compare them, then say which you prefer and why.', minWords: 30,
    requirements: [
      R('shopping words (يشتري، السوق، الأسعار، رخيص…)', ['أشتري', 'اشتريت', 'يشترون', 'السوق', 'الأسواق', 'الأسعار', 'سعر', 'رخيص', 'رخيصة', 'غالي', 'غالية']),
      R('"it is … to" (من السهل أن، من الصعب أن…)', ['من السهل', 'من الصعب', 'من الممكن', 'من المهم', 'من الأفضل']),
      R('a comparative (أسهل، أرخص، أسرع…)', ['أسهل', 'أرخص', 'أفضل', 'أغلى', 'أسرع', 'أمتع']),
      R('a reason (لأنّ، لذلك)', ['لأن', 'لذلك']),
    ],
    model: P('في السنوات الأخيرة أصبح كثير من الناس يشترون كل شيء من الإنترنت. من السهل أن تقارن الأسعار وأنت في البيت، والتوصيل أسرع من الماضي. لكنّني أفضّل السوق لأنّ التسوّق هناك أمتع: أرى الألوان وألمس القماش وأتكلم مع البائعين.', 'fī as-sanawāt al-akhīra aṣbaḥa kathīr min an-nās yashtarūna kull shayʾ min al-intarnit. min as-sahl an tuqārina al-asʿār wa-anta fī al-bayt, wa-t-tawṣīl asraʿ min al-māḍī. lākinnanī ufaḍḍilu as-sūq li-anna at-tasawwuq hunāk amtaʿ: arā al-alwān wa-almisu al-qumāsh wa-atakallamu maʿa al-bāʾiʿīn.', "In recent years many people have started buying everything online. It's easy to compare prices from home, and delivery is faster than before. But I prefer the market because shopping there is more fun: I see the colors, touch the fabric and talk with the sellers."),
  },
];

export const speakingPrompts = [
  {
    id: 'ar-s-home', level: 'B1', prompt: 'Describe your home out loud: what rooms it has and what is near it.', starter: 'في بيتي…', minWords: 10,
    requirements: [
      R('a room (غرفة، مطبخ، حمام…)', ['غرفة', 'غرف', 'مطبخ', 'حمام', 'صالون']),
      R('a location word (أمام، بجانب، قريب…)', ['أمام', 'وأمامه', 'بجانب', 'جنب', 'قريب', 'قريبة', 'وراء']),
    ],
    model: P('في بيتي ثلاث غرف ومطبخ كبير. بجانب البيت مدرسة، وأمامه حديقة صغيرة.', 'fī baytī thalāth ghuraf wa-maṭbakh kabīr. bi-jānib al-bayt madrasa, wa-amāmahu ḥadīqa ṣaghīra.', 'My home has three rooms and a big kitchen. Next to the house is a school, and in front of it a small garden.'),
  },
  {
    id: 'ar-s-occasion', level: 'B1', prompt: 'Talk about how your family celebrates a holiday: what you do and what you say.', starter: 'في العيد…', minWords: 12,
    requirements: [
      R('a holiday or occasion (عيد، رمضان، حفلة…)', ['عيد', 'العيد', 'رمضان', 'حفلة', 'عرس']),
      R('a greeting (كل عام وأنتم بخير، مبروك…)', ['كل عام وأنتم بخير', 'كل سنة', 'مبروك', 'عيد مبارك', 'رمضان كريم']),
      R('present-tense "we" verbs (نزور، نأكل، نجتمع…)', ['نزور', 'نأكل', 'ونأكل', 'نجتمع', 'نحتفل', 'نلبس', 'نذهب', 'نشتري']),
    ],
    model: P('في العيد نجتمع في بيت جدّتي ونأكل الحلويات. نلبس ملابس جديدة ونقول لبعض: كل عام وأنتم بخير!', 'fī al-ʿīd najtamiʿu fī bayt jaddatī wa-naʾkulu al-ḥalawiyyāt. nalbasu malābis jadīda wa-naqūlu li-baʿḍ: kull ʿām wa-antum bi-khayr!', "At Eid we gather at my grandmother's house and eat desserts. We wear new clothes and say to each other: Happy Eid!"),
  },
];

export const media = [
  M('B1', 'Book', 'Al-Kitaab fii Taʿallum al-ʿArabiyya, Part Two (الكتاب في تعلّم العربية)', 'Kristen Brustad, Mahmoud Al-Batal & Abbas Al-Tonsi', 'The intermediate course the Al-Kitaab Companion lessons follow. It presents formal Arabic, Egyptian and Levantine side by side, with video and audio.', 'Georgetown University Press', ['reading', 'writing', 'listening']),
];
