import { P, Q, A, C, M, T } from './helpers.mjs';

const S = (t, en, note) => P(t, '', en, note);

const categories = [
  {
    id: 'es-greet', title: 'Greetings & Introductions', nativeTitle: 'Saludos y presentaciones',
    icon: 'hand.wave', emoji: '👋',
    summary: 'Say hello, choose tú or usted, and introduce yourself.',
    lessons: [
      {
        id: 'es-greet-1', title: 'Greetings, Tú & Usted', level: 'A1',
        summary: "Greetings, and when to use formal or informal 'you'.",
        grammar: {
          title: 'Tú, usted and ustedes',
          body: [
            "Spanish has two singular words for 'you': tú (informal: friends, family, children) and usted (formal: elders, strangers, service staff, bosses).",
            "Mexicans use usted more than many Spanish speakers. When in doubt, start with usted and switch when invited ('háblame de tú').",
            "For plural 'you', Mexico uses ustedes for everyone. Vosotros, used in Spain, isn't part of everyday Mexican speech.",
            'The verb changes too: ¿Cómo estás? (tú) vs. ¿Cómo está? (usted).',
          ],
          table: T(['English', 'Informal (tú)', 'Formal (usted)'],
            ['How are you?', '¿Cómo estás?', '¿Cómo está (usted)?'],
            ['Where are you from?', '¿De dónde eres?', '¿De dónde es?'],
            ["What's your name?", '¿Cómo te llamas?', '¿Cómo se llama?'],
            ['Do you want…?', '¿Quieres…?', '¿Quiere…?']),
        },
        vocab: [
          S('Hola', 'Hello'), S('Buenos días', 'Good morning'), S('Buenas tardes', 'Good afternoon (noon until dark)'),
          S('Buenas noches', 'Good evening / good night'), S('¿Qué tal?', "How's it going?"),
          S('¿Qué onda?', "What's up? (very Mexican, informal)"), S('Mucho gusto', 'Nice to meet you'),
          S('Igualmente', 'Likewise'), S('Hasta luego', 'See you later'),
        ],
        examples: [
          S('Buenos días, señora. ¿Cómo está?', "Good morning, ma'am. How are you?"),
          S('¡Qué onda, güey! ¿Todo bien?', "What's up, dude! All good?", 'Only with close friends. Güey can be rude in other contexts.'),
          S('Mucho gusto. — Igualmente.', 'Nice to meet you. — Likewise.'),
        ],
        culture: {
          title: 'Mexican greeting etiquette',
          body: [
            "Say hello when you walk into a small shop, waiting room or lift ('Buenas tardes') and goodbye when you leave ('Hasta luego').",
            'Women often greet friends with a single kiss on the right cheek. Men shake hands or give a back-patting hug (abrazo).',
            "'Buenas' on its own is a friendly greeting at any time of day.",
            'Expect professional titles: Licenciado/Licenciada (university graduate), Ingeniero, Doctor are used routinely at work.',
          ],
        },
        quiz: [
          Q("Which is the formal 'How are you?'", ['¿Cómo está?', '¿Cómo estás?', '¿Qué onda?', '¿Qué tal, güey?']),
          Q("In Mexico, plural 'you' (for anyone) is…", ['ustedes', 'vosotros', 'tú', 'ellos']),
          Q("'¿Qué onda?' is best used with…", ['friends', 'your boss', 'a police officer', 'an elderly stranger']),
          Q('What do you say walking into a small shop in the afternoon?', ['Buenas tardes', 'Buen provecho', 'Igualmente', 'Salud']),
        ],
      },
      {
        id: 'es-greet-2', title: 'Introducing Yourself', level: 'A1',
        summary: 'Ser, llamarse, nationalities and professions.',
        grammar: {
          title: 'Ser, llamarse and gender',
          body: [
            "Give your name with me llamo… (literally 'I call myself') or soy…",
            'Ser (to be) states identity, origin and profession: Soy de Chicago. Soy enfermera.',
            "Nationality adjectives agree in gender (mexicano / mexicana), but some don't change: estadounidense, canadiense.",
            "Professions change too: el doctor / la doctora, el maestro / la maestra. Leave out the article after ser: Soy maestro (not 'soy un maestro').",
          ],
          table: T(['Person', 'ser'],
            ['yo', 'soy'], ['tú', 'eres'], ['usted / él / ella', 'es'], ['nosotros', 'somos'], ['ustedes / ellos', 'son']),
        },
        vocab: [
          S('Me llamo…', 'My name is…'), S('¿Cómo se llama?', "What's your name? (formal)"), S('Soy de…', "I'm from…"),
          S('¿De dónde eres?', 'Where are you from?'), S('estadounidense', 'from the U.S.'),
          S('mexicano / mexicana', 'Mexican (m / f)'), S('Trabajo como…', 'I work as…'),
        ],
        examples: [
          S('Me llamo Ana y soy de Monterrey.', "My name is Ana and I'm from Monterrey."),
          S('Soy estadounidense, de Texas.', "I'm American, from Texas."),
          S('Ella es ingeniera.', "She's an engineer."),
        ],
        culture: {
          title: "'Americano' and naming",
          body: [
            "Many Latin Americans feel 'americano' covers the whole continent, so 'estadounidense' is the safest way to say you're from the U.S.",
            "Mexicans usually have two surnames: the father's first, then the mother's (Ana López García). Day to day, people use just the first one.",
            "Questions about your age, whether you're married or whether you have children are normal small talk.",
          ],
        },
        quiz: [
          Q("'I am a teacher' (female):", ['Soy maestra.', 'Soy una maestro.', 'Estoy maestra.', 'Soy maestro.']),
          Q("The form of ser for 'we' is…", ['somos', 'son', 'es', 'estamos']),
          Q("The safest way to say you're from the U.S.:", ['estadounidense', 'americano', 'gringo', 'norteño']),
          Q("In 'Ana López García', López is…", ["her father's surname", "her mother's surname", 'her middle name', "her husband's surname"]),
        ],
      },
    ],
  },
  {
    id: 'es-ser', title: 'Ser & Estar', nativeTitle: 'Ser y estar',
    icon: 'equal.circle', emoji: '⚖️',
    summary: "Two verbs for 'to be', the present progressive and 'ahorita'.",
    lessons: [
      {
        id: 'es-ser-1', title: 'Ser vs. Estar', level: 'A2',
        summary: 'Identity vs. state and location.',
        grammar: {
          title: "Two ways to say 'to be'",
          body: [
            'Ser describes what something IS: identity, origin, profession, characteristics, time, and where an EVENT takes place.',
            'Estar describes how or where something is: location, temporary states, feelings, and the result of a change.',
            'Some adjectives change meaning: ser listo = to be clever, estar listo = to be ready. Ser aburrido = boring, estar aburrido = bored.',
          ],
          table: T(['Use', 'Example', 'Meaning'],
            ['ser: identity', 'Es mi hermana.', "She's my sister."],
            ['ser: origin', 'Somos de Puebla.', "We're from Puebla."],
            ['ser: time', 'Son las tres.', "It's three o'clock."],
            ['ser: event location', 'La fiesta es en mi casa.', 'The party is at my house.'],
            ['estar: location', 'El baño está al fondo.', 'The bathroom is at the back.'],
            ['estar: state', 'Estoy cansado.', "I'm tired."],
            ['estar: feeling', '¿Estás bien?', 'Are you OK?']),
        },
        vocab: [
          S('estoy', 'I am (state / location)'), S('estás', 'you are'), S('está', 'he / she is; you (formal) are'),
          S('cansado / cansada', 'tired'), S('listo / lista', 'clever (ser) / ready (estar)'),
          S('contento / contenta', 'happy'), S('enfermo / enferma', 'sick'),
        ],
        examples: [
          S('Mi mamá es doctora, pero hoy está enferma.', "My mom is a doctor, but today she's sick."),
          S('¿Dónde está el Zócalo?', 'Where is the Zócalo?'),
          S('La boda es en Oaxaca.', 'The wedding is in Oaxaca.'),
        ],
        culture: {
          title: 'The Zócalo',
          body: [
            "Mexico City's main square, officially the Plaza de la Constitución, is called the Zócalo. Many towns call their main square 'el zócalo' too.",
            'It sits on top of the Aztec capital, Tenochtitlan. The ruins of the Templo Mayor are right next to it.',
            "It hosts concerts, protests and the Independence Day 'Grito'.",
          ],
        },
        quiz: [
          Q("'I'm tired' is…", ['Estoy cansado.', 'Soy cansado.', 'Tengo cansado.', 'Es cansado.']),
          Q("'The party is at my house.'", ['La fiesta es en mi casa.', 'La fiesta está en mi casa.', 'La fiesta hay en mi casa.', 'La fiesta son en mi casa.'], 'Events use ser for location.'),
          Q("'Estar listo' means…", ['to be ready', 'to be clever', 'to be boring', 'to be late']),
          Q("'¿Dónde ___ el baño?'", ['está', 'es', 'son', 'hay']),
        ],
      },
      {
        id: 'es-ser-2', title: "Right Now: Estar + -ndo & 'Ahorita'", level: 'A2',
        summary: 'The present progressive and Mexican diminutives.',
        grammar: {
          title: "What's happening now",
          body: [
            "To say what's happening right now, use estar + the gerund (-ando / -iendo): Estoy comiendo (I'm eating).",
            '-ar verbs → -ando (hablando); -er and -ir verbs → -iendo (comiendo, viviendo). Some change: leer → leyendo, dormir → durmiendo.',
            "Mexican Spanish uses diminutives everywhere. Ahora (now) becomes ahorita, which can mean 'right now', 'in a little while' or even 'maybe never'.",
          ],
          table: T(['Verb', 'Gerund', 'Example'],
            ['hablar', 'hablando', 'Estoy hablando por teléfono.'], ['comer', 'comiendo', 'Estamos comiendo.'],
            ['escribir', 'escribiendo', 'Está escribiendo un correo.'], ['leer', 'leyendo', 'Estoy leyendo.'],
            ['dormir', 'durmiendo', 'El bebé está durmiendo.']),
        },
        vocab: [
          S('ahorita', 'right now / in a bit (MX)'), S('ahorita no', 'not right now'),
          S('¿Qué estás haciendo?', 'What are you doing?'), S('estoy trabajando', "I'm working"),
          S('un momentito', 'just a moment'), S('luego', 'later'),
        ],
        examples: [
          S('¿Qué estás haciendo? — Estoy viendo una serie.', "What are you doing? — I'm watching a series."),
          S('Ahorita vengo.', "I'll be right back (…at some point)."),
          S('Ahorita no, joven, gracias.', 'Not right now, thanks.', 'A polite way to say no to street sellers.'),
        ],
        culture: {
          title: "Decoding 'ahorita'",
          body: [
            "'Ahorita' softens what you say. 'Ahorita lo hago' might mean in a minute or later today. Ask '¿ahorita ahorita?' if you need it now.",
            'Diminutives make speech warmer and more polite: un cafecito, un ratito (a little while), poquito, cerquita (pretty close).',
            "'Ahorita no, gracias' is the gentle, standard way to turn down a street seller.",
          ],
        },
        quiz: [
          Q("'We are eating' is…", ['Estamos comiendo.', 'Somos comiendo.', 'Estamos comer.', 'Comemos estando.']),
          Q('The gerund of leer is…', ['leyendo', 'leiendo', 'leando', 'leído']),
          Q("'Ahorita vengo' most likely means…", ["I'll be back in a bit", 'I already came', "I'm never coming", 'I arrive tomorrow']),
          Q("'Un cafecito' is…", ['a friendly way to say a coffee', 'a decaf coffee', 'a large coffee', 'an iced coffee']),
        ],
      },
    ],
  },
  {
    id: 'es-num', title: 'Numbers, Time & Money', nativeTitle: 'Números, hora y dinero',
    icon: 'clock', emoji: '🕰️',
    summary: 'Prices in pesos, telling the time, and Mexican time culture.',
    lessons: [
      {
        id: 'es-num-1', title: 'Numbers & Prices', level: 'A1',
        summary: 'Counting and asking prices the Mexican way.',
        grammar: {
          title: 'Counting and prices',
          body: [
            "0–15 are unique words. 16–29 are written as one word (dieciséis, veintiuno). From 31 on, use 'y': treinta y uno.",
            'Ask prices with ¿Cuánto cuesta? (how much does it cost?). At Mexican markets, ask ¿A cómo está…? or ¿A cómo el kilo?',
            "Mexico uses the $ sign for pesos. To avoid confusion with dollars, prices may be marked MXN or 'M.N.' (moneda nacional).",
          ],
          table: T(['#', 'Spanish'],
            ['1', 'uno'], ['2', 'dos'], ['3', 'tres'], ['4', 'cuatro'], ['5', 'cinco'], ['6', 'seis'], ['7', 'siete'],
            ['8', 'ocho'], ['9', 'nueve'], ['10', 'diez'], ['15', 'quince'], ['20', 'veinte'], ['50', 'cincuenta'],
            ['100', 'cien'], ['500', 'quinientos'], ['1000', 'mil']),
        },
        vocab: [
          S('¿Cuánto cuesta?', 'How much does it cost?'), S('¿A cómo está?', "What's the price? (MX markets)"),
          S('pesos', 'pesos'), S('cambio', 'change (money back)'), S('efectivo', 'cash'), S('tarjeta', 'card'), S('propina', 'tip'),
        ],
        examples: [
          S('¿Cuánto cuesta esta playera? — Doscientos pesos.', 'How much is this T-shirt? — 200 pesos.', 'Playera = T-shirt in Mexico.'),
          S('¿A cómo el kilo de jitomate?', 'How much for a kilo of tomatoes?'),
          S('¿Acepta tarjeta o solo efectivo?', 'Do you take cards, or cash only?'),
        ],
        culture: {
          title: 'Money tips',
          body: [
            "Small businesses, markets and street stalls are often cash-only, and many can't break big notes. Keep coins and small bills.",
            'Restaurant tips are usually 10–15%. It is customary to give a few pesos to petrol-station attendants and supermarket baggers (often older people or teenagers).',
            "'Lana' and 'varo' are slang for money.",
          ],
        },
        quiz: [
          Q('35 in Spanish:', ['treinta y cinco', 'trescientos cinco', 'treinta cinco', 'tres cinco']),
          Q("At a Mexican market, '¿A cómo está?' asks…", ['the price', 'the time', 'where it is', 'how heavy it is']),
          Q('A typical restaurant tip in Mexico is…', ['10–15%', '0%', '25–30%', 'exactly 5 pesos']),
          Q("'Efectivo' means…", ['cash', 'card', 'change', 'receipt']),
        ],
      },
      {
        id: 'es-num-2', title: 'Telling Time & Days', level: 'A2',
        summary: 'Clock times, days, and when Mexicans eat.',
        grammar: {
          title: 'Hours and days',
          body: [
            'Ask ¿Qué hora es? Use es for one o’clock (Es la una) and son for every other hour (Son las cuatro).',
            "Add y cuarto (quarter past), y media (half past) or menos cuarto (quarter to). Mexicans also say 'cuarto para las…': Son cuarto para las ocho = 7:45.",
            "To say 'at' a time, use a las…: La clase es a las diez.",
            "Days and months don't take capital letters: el lunes, en marzo.",
          ],
          table: T(['Time', 'Spanish'],
            ['1:00', 'Es la una.'], ['3:15', 'Son las tres y cuarto.'], ['5:30', 'Son las cinco y media.'],
            ['7:45', 'Son cuarto para las ocho.'], ['at 9', 'a las nueve']),
        },
        vocab: [
          S('¿Qué hora es?', 'What time is it?'), S('¿A qué hora…?', 'At what time…?'), S('lunes', 'Monday'),
          S('viernes', 'Friday'), S('sábado', 'Saturday'), S('domingo', 'Sunday'), S('temprano', 'early'), S('tarde', 'late / afternoon'),
        ],
        examples: [
          S('¿A qué hora abre el museo? — A las diez.', 'What time does the museum open? — At ten.'),
          S('Nos vemos el sábado a las ocho.', 'See you on Saturday at eight.'),
          S('Ya es tarde, me voy.', "It's late, I'm off."),
        ],
        culture: {
          title: 'Time, Mexican style',
          body: [
            "For parties and get-togethers, arriving 15–30 minutes late is normal ('hora mexicana'). For business, doctors and tours, be on time.",
            'La comida, the main meal, is eaten around 2–4 p.m. Dinner (la cena) is often light and late.',
            'Many Mexican museums close on Mondays, and many are free for Mexican citizens and residents on Sundays.',
          ],
        },
        quiz: [
          Q("'It's one o'clock' is…", ['Es la una.', 'Son la una.', 'Es las una.', 'Son las uno.']),
          Q("'Cuarto para las ocho' is…", ['7:45', '8:15', '8:45', '4:08']),
          Q('Days of the week in Spanish are written…', ['in lowercase', 'with a capital letter', 'in italics', 'abbreviated']),
          Q('The main meal (la comida) is usually eaten…', ['mid-afternoon', 'at 7 a.m.', 'at midnight', 'at 11 a.m.']),
        ],
      },
    ],
  },
  {
    id: 'es-food', title: 'Food & Restaurants', nativeTitle: 'Comida y restaurantes',
    icon: 'fork.knife', emoji: '🌮',
    summary: 'Order tacos, use gustar, and explore regional cooking.',
    lessons: [
      {
        id: 'es-food-1', title: 'Ordering at a Taquería', level: 'A1',
        summary: 'Articles, plurals and polite orders.',
        grammar: {
          title: 'Articles and polite requests',
          body: [
            'Nouns are masculine or feminine: el taco, la tortilla, los tacos, las tortillas. Un / una = a; unos / unas = some.',
            "In Mexico, polite orders use ¿Me da…? ('Will you give me…?'), ¿Me pasa…? or Quisiera… (I'd like…). 'Quiero' is fine but more direct.",
            'Plurals: add -s after a vowel (taco → tacos) and -es after a consonant (limón → limones).',
          ],
          table: T(['', 'Masculine', 'Feminine'],
            ['the (singular)', 'el taco', 'la salsa'], ['the (plural)', 'los tacos', 'las salsas'],
            ['a / some', 'un taco / unos tacos', 'una salsa / unas salsas']),
        },
        vocab: [
          S('¿Me da…?', 'Can I have…?'), S('tacos al pastor', 'marinated pork tacos'),
          S('con todo', 'with everything (onion & cilantro)'), S('para llevar', 'to go'), S('para aquí', 'for here'),
          S('agua de horchata', 'rice and cinnamon drink'), S('la cuenta', 'the bill'),
        ],
        examples: [
          S('¿Me da cuatro tacos al pastor con todo, por favor?', 'Can I have four al pastor tacos with everything, please?'),
          S('Para llevar, por favor.', 'To go, please.'),
          S('¿Me trae la cuenta, por favor?', 'Could you bring me the bill, please?'),
        ],
        culture: {
          title: 'Taquería know-how',
          body: [
            "'Con todo' means with chopped onion and cilantro. Salsas and limes are usually on the counter for you to add.",
            'Al pastor pork is cooked on a vertical spit (trompo), a technique Lebanese immigrants brought and Mexicans adapted with chiles and pineapple.',
            "Many taquerías don't ask you to pay until the end, and trust you to say how many tacos you ate ('¿Cuánto le debo?').",
            "Say 'Provecho' to people eating near you when you arrive or leave. It's a very Mexican courtesy.",
          ],
        },
        quiz: [
          Q("At a taquería, 'con todo' means with…", ['onion and cilantro', 'cheese and cream', 'beans and rice', 'lettuce and tomato']),
          Q('Which is the most polite way to order in Mexico?', ['¿Me da dos tacos, por favor?', 'Dos tacos.', 'Dame tacos.', 'Tacos, ¡ya!']),
          Q('The plural of limón is…', ['limones', 'limóns', 'limónes', 'limons']),
          Q('Al pastor was influenced by immigrants from…', ['Lebanon', 'Italy', 'China', 'Germany']),
        ],
      },
      {
        id: 'es-food-2', title: 'Gustar & Regional Food', level: 'A2',
        summary: 'How gustar works, plus a tour of Mexican regional cooking.',
        grammar: {
          title: 'Gustar works backwards',
          body: [
            "With gustar, the thing you like is the subject. Me gusta el mole = 'Mole pleases me' = I like mole.",
            'Use gusta with one thing or a verb, and gustan with plural things: Me gusta cocinar. Me gustan los chilaquiles.',
            "The pronoun shows who likes it: me (I), te (you), le (he / she / you formal), nos (we), les (they / you all). Add 'a mí, a ella…' for emphasis or clarity.",
          ],
          table: T(['English', 'Spanish'],
            ['I like', 'me gusta(n)'], ['you like', 'te gusta(n)'], ['he / she / you (formal) like', 'le gusta(n)'],
            ['we like', 'nos gusta(n)'], ['they / you all like', 'les gusta(n)']),
        },
        vocab: [
          S('me gusta', 'I like (one thing)'), S('me gustan', 'I like (plural)'), S('me encanta', 'I love it'),
          S('picante', 'spicy'), S('rico / sabroso', 'delicious'), S('¿Pica?', 'Is it spicy?'), S('no me gusta', "I don't like it"),
        ],
        examples: [
          S('Me gustan mucho los chilaquiles verdes.', 'I really like green chilaquiles.'),
          S('¿Te gusta la comida picante? — Sí, ¡me encanta!', 'Do you like spicy food? — Yes, I love it!'),
          S('A mi papá le gusta el mole poblano.', 'My dad likes mole poblano.'),
        ],
        culture: {
          title: 'A map in your mouth',
          body: [
            "Traditional Mexican cuisine was added to UNESCO's Intangible Cultural Heritage list in 2010.",
            'Oaxaca is the land of seven moles and tlayudas. Puebla gives mole poblano and chiles en nogada, Yucatán has cochinita pibil, and Jalisco has birria and tortas ahogadas.',
            "'¿Pica?' is the question to ask. Even if a local says 'no pica', it may still be spicy for you!",
          ],
        },
        quiz: [
          Q("'I like the tacos':", ['Me gustan los tacos.', 'Me gusta los tacos.', 'Yo gusto los tacos.', 'Me gustas los tacos.']),
          Q("'She likes to cook':", ['A ella le gusta cocinar.', 'Ella gusta cocinar.', 'A ella les gusta cocinar.', 'Ella le gustan cocinar.']),
          Q('Cochinita pibil comes from…', ['Yucatán', 'Baja California', 'Chihuahua', 'Jalisco']),
          Q("'¿Pica?' asks whether food is…", ['spicy', 'expensive', 'fresh', 'sweet']),
        ],
      },
    ],
  },
  {
    id: 'es-verb', title: 'Verbs & Daily Life', nativeTitle: 'Verbos y vida diaria',
    icon: 'calendar', emoji: '🗓️',
    summary: 'Present and past tenses, routines and Mexican slang.',
    lessons: [
      {
        id: 'es-verb-1', title: 'Present Tense & Routines', level: 'A2',
        summary: 'Regular -ar / -er / -ir verbs and reflexives.',
        grammar: {
          title: 'Regular verbs and reflexives',
          body: [
            'Regular verbs follow three patterns by their ending: -ar (hablar), -er (comer), -ir (vivir). Take off the ending and add the person ending.',
            'Reflexive verbs describe things you do to yourself and use me / te / se / nos: me levanto (I get up), te bañas (you shower).',
            'Common irregular verbs: tener (tengo), ir (voy), hacer (hago), querer (quiero), poder (puedo).',
          ],
          table: T(['', 'hablar', 'comer', 'vivir'],
            ['yo', 'hablo', 'como', 'vivo'], ['tú', 'hablas', 'comes', 'vives'],
            ['él / ella / usted', 'habla', 'come', 'vive'], ['nosotros', 'hablamos', 'comemos', 'vivimos'],
            ['ellos / ustedes', 'hablan', 'comen', 'viven']),
        },
        vocab: [
          S('me levanto', 'I get up'), S('me baño', 'I shower (MX)'), S('desayunar', 'to have breakfast'),
          S('trabajar', 'to work'), S('manejar', 'to drive (MX)'), S('platicar', 'to chat (MX)'), S('regresar', 'to come back'),
        ],
        examples: [
          S('Me levanto a las seis y me baño.', 'I get up at six and shower.'),
          S('Trabajo en una oficina en Polanco.', 'I work in an office in Polanco.'),
          S('Los domingos platicamos con mi abuela.', 'On Sundays we chat with my grandma.'),
        ],
        culture: {
          title: 'Everyday Mexican verbs',
          body: [
            "Mexicans 'platican' (chat) rather than 'charlan', 'manejan' (drive) rather than 'conducen', and 'se bañan' when they shower.",
            "Commutes in big cities can be long, so many people eat breakfast on the go. A tamal inside a bread roll (a 'guajolota') is a classic Mexico City breakfast.",
            'Sunday is family day, often with a long lunch with the extended family.',
          ],
        },
        quiz: [
          Q("'We live' is…", ['vivimos', 'vivemos', 'viven', 'vivo']),
          Q("'I get up' is…", ['me levanto', 'levanto', 'me levanta', 'se levanto']),
          Q("The Mexican word for 'to drive':", ['manejar', 'conducir', 'guiar', 'llevar']),
          Q("A 'guajolota' is…", ['a tamal in a bread roll', 'a turkey dance', 'a bus', 'a dessert']),
        ],
      },
      {
        id: 'es-verb-2', title: 'The Past (Preterite) & Slang', level: 'B1',
        summary: 'Completed actions and how young Mexicans really talk.',
        grammar: {
          title: 'The preterite',
          body: [
            'The preterite describes completed actions: Ayer comí tacos (Yesterday I ate tacos).',
            '-ar endings: -é, -aste, -ó, -amos, -aron. -er / -ir endings: -í, -iste, -ió, -imos, -ieron.',
            "Ser and ir share the same irregular preterite: fui, fuiste, fue, fuimos, fueron. Context tells you whether it means 'went' or 'was'.",
            'Accents matter: hablo (I speak) vs. habló (he spoke).',
          ],
          table: T(['', 'hablar', 'comer', 'ir / ser'],
            ['yo', 'hablé', 'comí', 'fui'], ['tú', 'hablaste', 'comiste', 'fuiste'],
            ['él / ella / usted', 'habló', 'comió', 'fue'], ['nosotros', 'hablamos', 'comimos', 'fuimos'],
            ['ellos / ustedes', 'hablaron', 'comieron', 'fueron']),
        },
        vocab: [
          S('chido', 'cool (MX)'), S('qué padre', 'how cool (MX)'), S('¿neta?', 'really? (MX)'),
          S('no manches', 'no way! (MX)'), S('chamba', 'job (MX)'), S('lana', 'money (MX)'),
          S('¿a poco?', 'no way? / really? (MX)'), S('fresa', 'posh / preppy (MX)'),
        ],
        examples: [
          S('El fin de semana fuimos a Teotihuacán. ¡Estuvo bien padre!', 'At the weekend we went to Teotihuacan. It was really cool!'),
          S('¿Neta conseguiste chamba? ¡No manches!', 'You really got a job? No way!'),
          S('Ayer hablé con mi jefe.', 'Yesterday I talked to my boss.'),
        ],
        culture: {
          title: 'Use slang with care',
          body: [
            "'Güey' (also spelled 'wey') means dude among friends but can be an insult with strangers.",
            "'Chido' and 'padre' both mean cool. 'Qué mala onda' means 'what a bummer', and 'buena onda' describes a nice person.",
            'Albures are elaborate double-meaning wordplay, a much-loved (and very adult) Mexican art form. If people laugh at an innocent phrase, you may have stumbled into one!',
          ],
        },
        quiz: [
          Q("'I ate' is…", ['comí', 'comió', 'como', 'comé']),
          Q("'Fuimos' can mean…", ['we went / we were', 'we go', 'they went', 'we will go']),
          Q("'¡Qué padre!' means…", ['How cool!', 'What a father!', 'How sad!', 'How expensive!']),
          Q("'Habló' means…", ['he / she spoke', 'I speak', 'I spoke', 'speak!']),
        ],
      },
    ],
  },
  {
    id: 'es-dir', title: 'Directions & Transport', nativeTitle: 'Direcciones y transporte',
    icon: 'tram', emoji: '🚇',
    summary: 'Ask the way, use the Metro, make plans and use por / para.',
    lessons: [
      {
        id: 'es-dir-1', title: 'Asking for Directions', level: 'A2',
        summary: 'Formal commands and Mexican direction words.',
        grammar: {
          title: 'Commands for directions',
          body: [
            'Ask ¿Dónde está…? (Where is…?) or ¿Cómo llego a…? (How do I get to…?).',
            'Directions usually come as formal (usted) commands: siga (keep going), dé vuelta (turn), cruce (cross), tome (take). Informal: sigue, da vuelta, cruza, toma.',
            "Mexicans say 'derecho' for straight ahead (not 'recto') and count distance in cuadras (blocks).",
          ],
          table: T(['Command (usted)', 'Meaning'],
            ['Siga derecho', 'Keep going straight'], ['Dé vuelta a la derecha', 'Turn right'],
            ['Dé vuelta a la izquierda', 'Turn left'], ['Cruce la calle', 'Cross the street'],
            ['Camine dos cuadras', 'Walk two blocks'], ['Está en la esquina', "It's on the corner"]),
        },
        vocab: [
          S('¿Cómo llego a…?', 'How do I get to…?'), S('derecha', 'right'), S('izquierda', 'left'),
          S('derecho', 'straight ahead'), S('cuadra', 'block'), S('esquina', 'corner'), S('enfrente de', 'across from'),
        ],
        examples: [
          S('Disculpe, ¿cómo llego al Museo de Antropología?', 'Excuse me, how do I get to the Anthropology Museum?'),
          S('Siga derecho dos cuadras y dé vuelta a la izquierda.', 'Go straight for two blocks and turn left.'),
          S('Está enfrente del parque.', "It's across from the park."),
        ],
        culture: {
          title: 'Getting around',
          body: [
            'Every Mexico City Metro station has an icon as well as a name. The system was designed in 1969 so that everyone could find their way, whether or not they could read.',
            "'Camión' usually means a city bus. 'Pesero' and 'micro' are minibuses on set routes. Ride-hailing apps are widely used.",
            "If someone says it's 'aquí cerquita' (just round the corner), it might still be a 15-minute walk. Ask '¿cuántas cuadras?'",
          ],
        },
        quiz: [
          Q("'Turn right' (formal):", ['Dé vuelta a la derecha.', 'Siga derecho.', 'Dé vuelta a la izquierda.', 'Cruce derecha.']),
          Q("In directions, 'derecho' means…", ['straight ahead', 'right', 'left', 'back']),
          Q("A 'cuadra' is…", ['a block', 'a square metre', 'a street sign', 'a bus stop']),
          Q('Mexico City Metro stations are identified by…', ['icons and names', 'numbers only', 'colours only', 'letters']),
        ],
      },
      {
        id: 'es-dir-2', title: 'Plans: Ir a + Infinitive, Por & Para', level: 'B1',
        summary: "The everyday future and the two words for 'for'.",
        grammar: {
          title: 'Talking about plans',
          body: [
            "Talk about plans with ir a + infinitive: Voy a viajar (I'm going to travel). It's the most common way to talk about the future in conversation.",
            'Para = purpose, destination, deadline, recipient: Voy para Guadalajara. Es para ti. Estudio para aprender.',
            'Por = cause, exchange, duration, through / along, by means of: Gracias por todo. Lo compré por 50 pesos. Pasamos por el centro.',
          ],
          table: T(['Use', 'Example', 'Meaning'],
            ['para: destination', 'Salgo para Cancún.', "I'm leaving for Cancún."],
            ['para: recipient', 'Este regalo es para ti.', 'This gift is for you.'],
            ['para: purpose', 'Ahorro para viajar.', 'I save (in order) to travel.'],
            ['por: exchange', 'Lo compré por cien pesos.', 'I bought it for 100 pesos.'],
            ['por: through', 'Caminamos por el mercado.', 'We walked through the market.'],
            ['por: reason', 'Gracias por tu ayuda.', 'Thanks for your help.']),
        },
        vocab: [
          S('voy a', "I'm going to"), S('vamos a', "let's / we're going to"), S('el boleto', 'the ticket (MX)'),
          S('la parada', 'the stop'), S('¿Me deja aquí?', 'Can you drop me here?'), S('bajarse', 'to get off'),
        ],
        examples: [
          S('Vamos a tomar el camión para Coyoacán.', "We're going to take the bus to Coyoacán."),
          S('¿Me deja en la esquina, por favor?', 'Can you drop me at the corner, please?'),
          S('Pagué por el boleto en línea.', 'I paid for the ticket online.'),
        ],
        culture: {
          title: 'Long-distance travel',
          body: [
            'Mexico has a large network of comfortable first-class intercity buses (autobuses de primera clase). For medium distances they are often better than flying.',
            "The bus station is the 'central de autobuses', or just 'la central'. Mexico City has several, such as TAPO and Terminal Norte.",
            "On local buses and colectivos, call out 'En la esquina, por favor' or '¡Bajan!' to ask for your stop.",
          ],
        },
        quiz: [
          Q("'I'm going to travel':", ['Voy a viajar.', 'Voy viajar.', 'Voy por viajar.', 'Viajo a voy.']),
          Q("'This gift is ___ you.'", ['para', 'por', 'a', 'de']),
          Q("'I bought it ___ 100 pesos.'", ['por', 'para', 'en', 'con']),
          Q("'¿Me deja aquí?' means…", ['Can you drop me here?', 'Can I stay here?', 'Will you leave me?', 'Can I sit here?']),
        ],
      },
    ],
  },
  {
    id: 'es-cult', title: 'Culture & Traditions', nativeTitle: 'Cultura y tradiciones',
    icon: 'sparkles', emoji: '🌼',
    summary: 'Holidays, courtesy, and Nahuatl words in Spanish.',
    lessons: [
      {
        id: 'es-cult-1', title: 'Holidays & Traditions', level: 'A2',
        summary: 'Día de Muertos, posadas and the impersonal se.',
        grammar: {
          title: 'Talking about traditions with se',
          body: [
            'To describe what people generally do, use the impersonal se: Se pone una ofrenda (An altar is set up / People set up an altar).',
            'Use a plural verb with plural things: Se comen tamales. Se ponen flores.',
            'Use the present tense for yearly traditions: Cada año celebramos…',
          ],
          table: T(['Holiday', 'Date', 'What happens'],
            ['Día de la Independencia', 'Sept 15–16', "The 'Grito' ('¡Viva México!') on the night of the 15th; parades on the 16th"],
            ['Día de Muertos', 'Nov 1–2', 'Altars (ofrendas), marigolds, pan de muerto, visits to cemeteries'],
            ['Día de la Virgen de Guadalupe', 'Dec 12', 'Pilgrimage to the Basilica in Mexico City'],
            ['Las Posadas', 'Dec 16–24', "Processions re-enacting Mary and Joseph's search for shelter; piñatas"],
            ['Día de Reyes', 'Jan 6', 'Rosca de Reyes; whoever finds the figurine provides tamales on Feb 2']),
        },
        vocab: [
          S('la ofrenda', 'altar of offerings'), S('el cempasúchil', 'marigold'), S('el pan de muerto', 'Day of the Dead bread'),
          S('la calavera', 'skull (also a sugar skull or a satirical poem)'), S('la piñata', 'piñata'),
          S('los tamales', 'tamales'), S('la rosca de Reyes', "Three Kings' bread ring"),
        ],
        examples: [
          S('En Día de Muertos se pone una ofrenda con fotos de los difuntos.', 'On the Day of the Dead, people set up an altar with photos of the dead.'),
          S('Se rompen piñatas en las posadas.', 'Piñatas are broken at the posadas.'),
          S('¡Me salió el muñeco! Me tocan los tamales.', 'I got the figurine! I have to bring the tamales.'),
        ],
        culture: {
          title: 'Beyond Cinco de Mayo',
          body: [
            "Cinco de Mayo marks the 1862 Battle of Puebla and is celebrated mostly in Puebla and in the U.S. Mexico's big national holiday is Independence Day (Sept 16).",
            "Día de Muertos (UNESCO Intangible Heritage) is a joyful remembrance, not Halloween. Families believe the dead come back to visit, guided by the scent and colour of cempasúchil.",
            "'Calaveritas literarias' are funny rhyming poems written as if Death had come for friends, teachers or politicians.",
          ],
        },
        quiz: [
          Q("Mexico's main national holiday is…", ['September 16 (Independence)', 'May 5 (Cinco de Mayo)', 'July 4', 'December 31']),
          Q('Which flower guides spirits on Día de Muertos?', ['cempasúchil (marigold)', 'rose', 'sunflower', 'lily']),
          Q("'Se comen tamales' means…", ['Tamales are eaten / People eat tamales', 'The tamales eat themselves', 'He eats tamales alone', 'We will eat tamales']),
          Q('If you find the figurine in the rosca, you must…', ['provide tamales on February 2', 'pay for the rosca', 'make a wish', 'give a speech']),
        ],
      },
      {
        id: 'es-cult-2', title: 'Courtesy & Nahuatl Words', level: 'B1',
        summary: 'Polite indirectness and the Aztec language inside Spanish.',
        grammar: {
          title: 'Softening requests',
          body: [
            'Mexican Spanish prefers indirect, polite phrasing. The conditional and imperfect soften requests: ¿Podría…? (Could you…?), Quería pedirle… (I wanted to ask you…).',
            "'¿Gusta?' offers your food to the people around you. It's a polite reflex whenever you eat in front of others.",
            "Say 'Con permiso' when you pass someone or leave, and 'Provecho' to people who are eating.",
          ],
          table: T(['Phrase', 'When to use it'],
            ['¿Mande?', "A polite 'Pardon?', or 'Yes?' when someone calls you"],
            ['Con permiso', 'Excuse me (passing by, leaving the table)'],
            ['Provecho', 'Enjoy your meal (to anyone eating)'],
            ['¿Gusta?', 'Offering what you are eating'],
            ['¿Me podría ayudar?', 'Could you help me? (polite)'],
            ['Disculpe la molestia', 'Sorry to bother you']),
        },
        vocab: [
          S('¿Mande?', 'Pardon? (MX)'), S('con permiso', 'excuse me'), S('provecho', 'enjoy your meal'),
          S('¿Podría…?', 'Could you…?'), S('aguacate', 'avocado (from Nahuatl ahuacatl)'),
          S('elote', 'corn on the cob (from Nahuatl elotl)'), S('papalote', 'kite (from Nahuatl papalotl, butterfly)'),
        ],
        examples: [
          S('¿Mande? No le escuché bien.', "Pardon? I didn't hear you properly."),
          S('¿Me podría decir dónde está la salida, por favor?', 'Could you tell me where the exit is, please?'),
          S('¡Provecho! — Gracias, ¿gusta?', 'Enjoy your meal! — Thanks, would you like some?'),
        ],
        culture: {
          title: 'Nahuatl inside Spanish',
          body: [
            'Nahuatl, the language of the Aztecs, is still spoken by more than 1.5 million people in Mexico, and it lives on inside everyday Mexican Spanish.',
            'Aguacate, tomate, chile, elote, cacahuate, guajolote (turkey), papalote (kite) and chapulín (grasshopper) all come from Nahuatl.',
            "So do place names: México, Oaxaca, Tlaxcala, Xochimilco. The 'x' once stood for a 'sh' sound and is now pronounced differently in different words (México = 'MEH-hee-ko', Xochimilco = 'so-chee-MEEL-ko').",
          ],
        },
        quiz: [
          Q("'¿Mande?' is used to…", ['politely ask someone to repeat', 'order food', 'say goodbye', 'complain']),
          Q('Which word comes from Nahuatl?', ['aguacate', 'perro', 'mesa', 'calle']),
          Q("A polite way to say 'Could you…?':", ['¿Podría…?', '¡Haz…!', 'Quiero que…', 'Dame…']),
          Q('What do you say when you walk past in front of someone?', ['Con permiso', 'Provecho', 'Salud', 'Mande']),
        ],
      },
    ],
  },
  {
    id: 'es-adv', title: 'Advanced Grammar', nativeTitle: 'Gramática avanzada',
    icon: 'graduationcap', emoji: '🎓',
    summary: 'The subjunctive, conditionals and if-clauses.',
    lessons: [
      {
        id: 'es-adv-1', title: 'The Present Subjunctive', level: 'B1',
        summary: 'Wishes, requests and ojalá.',
        grammar: {
          title: 'Wishes, doubts and requests',
          body: [
            'The subjunctive expresses wishes, doubts, emotions and requests about someone or something else: Quiero que vengas (I want you to come).',
            'The trigger is a wish, emotion or doubt + que + a different subject.',
            "To form it, take the yo form of the present, drop the -o, and add the 'opposite' vowel: hablar → hable, comer → coma, vivir → viva. Irregular: ser → sea, ir → vaya, estar → esté, tener → tenga.",
            "Ojalá (from Arabic 'law shāʾa llāh', 'if God wills') is always followed by the subjunctive: Ojalá que llueva.",
          ],
          table: T(['', 'hablar', 'comer', 'tener'],
            ['yo', 'hable', 'coma', 'tenga'], ['tú', 'hables', 'comas', 'tengas'],
            ['él / ella / usted', 'hable', 'coma', 'tenga'], ['nosotros', 'hablemos', 'comamos', 'tengamos'],
            ['ellos / ustedes', 'hablen', 'coman', 'tengan']),
        },
        vocab: [
          S('quiero que', 'I want (someone) to…'), S('ojalá', 'I hope / hopefully'), S('espero que', 'I hope that'),
          S('es importante que', "it's important that"), S('cuando llegues', 'when you arrive'), S('para que', 'so that'),
        ],
        examples: [
          S('Quiero que vengas a mi fiesta.', 'I want you to come to my party.'),
          S('Ojalá que no llueva mañana.', "I hope it doesn't rain tomorrow."),
          S('Avísame cuando llegues.', 'Let me know when you get there.'),
        ],
        culture: {
          title: 'Ojalá, a gift from Arabic',
          body: [
            'Spanish has around 4,000 words of Arabic origin, from nearly eight centuries of al-Andalus: aceite, azúcar, almohada, ojalá…',
            'Many begin with a- or al- from the Arabic article: alcalde (mayor, from al-qāḍī), algodón (cotton), almohada (pillow).',
            "If you're studying both languages in this app, look out for cousins: azúcar ↔ sukkar, aceite ↔ az-zayt.",
          ],
        },
        quiz: [
          Q("'I want you to come':", ['Quiero que vengas.', 'Quiero que vienes.', 'Quiero venir tú.', 'Quiero que vendrás.']),
          Q('The present subjunctive of tener (yo) is…', ['tenga', 'tengo', 'tena', 'tuviera']),
          Q("'Ojalá' comes from…", ['Arabic', 'Nahuatl', 'Latin', 'French']),
          Q('Avísame cuando ___ (llegar).', ['llegues', 'llegas', 'llegarás', 'llegaste']),
        ],
      },
      {
        id: 'es-adv-2', title: 'Conditionals & If-Clauses', level: 'B2',
        summary: 'Would, could, and hypothetical situations.',
        grammar: {
          title: 'Would, could, if…',
          body: [
            'Conditional (would): add -ía endings to the infinitive: hablaría, comería, viviría. Irregular stems: tendría, podría, haría, diría, saldría.',
            "Hypothetical 'if' clauses use the imperfect subjunctive + the conditional: Si tuviera tiempo, viajaría más (If I had time, I'd travel more).",
            'To form the imperfect subjunctive, take the ellos preterite, drop -ron and add -ra: tuvieron → tuviera, fueron → fuera, hablaron → hablara.',
            'Past regrets: Si hubiera sabido, te habría llamado (If I had known, I would have called you).',
          ],
          table: T(['Type', 'Example', 'Meaning'],
            ['Real', 'Si llueve, me quedo en casa.', 'If it rains, I stay home.'],
            ['Hypothetical', 'Si tuviera dinero, compraría una casa en Mérida.', "If I had money, I'd buy a house in Mérida."],
            ['Past (unreal)', 'Si hubiera estudiado, habría pasado el examen.', "If I'd studied, I'd have passed the exam."]),
        },
        vocab: [
          S('podría', 'I / he / she could'), S('me gustaría', 'I would like'), S('tuviera', '(if) I had'),
          S('fuera', '(if) I were / went'), S('si', 'if'), S('hubiera sabido', '(if) I had known'),
        ],
        examples: [
          S('Me gustaría reservar una mesa para cuatro.', "I'd like to book a table for four."),
          S('Si fuera tú, iría a Oaxaca para Día de Muertos.', "If I were you, I'd go to Oaxaca for the Day of the Dead."),
          S('Si me hubieras avisado, te habría recogido.', "If you'd told me, I'd have picked you up."),
        ],
        culture: {
          title: 'The polite power of the conditional',
          body: [
            "'Me gustaría…' and '¿Podría…?' are the gold standard for polite requests in shops, offices and restaurants.",
            "Mexican business emails often open warmly and indirectly ('Espero que se encuentre muy bien') before getting to the point.",
            "Being too direct can sound rude. A softener like '¿No sería posible…?' gets better results than a demand.",
          ],
        },
        quiz: [
          Q("'If I had money, I would travel':", ['Si tuviera dinero, viajaría.', 'Si tengo dinero, viajaría.', 'Si tendría dinero, viajara.', 'Si tuve dinero, viajo.']),
          Q('The conditional of poder (yo) is…', ['podría', 'podería', 'pudiera', 'puedo']),
          Q('The imperfect subjunctive of ir / ser (yo) is…', ['fuera', 'iría', 'vaya', 'fui']),
          Q('A polite way to start a request:', ['Me gustaría…', 'Quiero ya…', 'Dame…', 'Necesito que tú…']),
        ],
      },
    ],
  },
];

const L = (char, name, tr, sound, example) => ({ char, name, tr, sound, example });

const reading = {
  title: 'Reading & Writing Spanish',
  intro: [
    'Spanish spelling is very regular. Once you know the rules, you can pronounce almost any word you read.',
    "Mexican Spanish uses seseo: z and c (before e / i) sound like s. There is no 'th' sound like in Spain.",
    "Learn the accent rules below, practise reading Mexican place names, then write phrases yourself.",
  ],
  letters: [
    L('a', 'a', 'ah', "Open 'ah' as in 'father'.", S('casa', 'house')),
    L('b', 'be (grande)', 'b', 'b. It is softer between vowels.', S('bueno', 'good')),
    L('c', 'ce', 'k / s', 'k before a, o, u; s before e, i (seseo).', S('cine', 'cinema')),
    L('d', 'de', 'd', "d. Between vowels it is soft, like 'th' in 'this'.", S('dedo', 'finger')),
    L('e', 'e', 'eh', "'eh' as in 'met'.", S('mesa', 'table')),
    L('f', 'efe', 'f', 'f.', S('fiesta', 'party')),
    L('g', 'ge', 'g / h', "g as in 'go' before a, o, u; a raspy h before e, i.", S('gente', 'people')),
    L('h', 'hache', '—', 'Always silent.', S('hola', 'hello')),
    L('i', 'i', 'ee', "'ee' as in 'see'.", S('sí', 'yes')),
    L('j', 'jota', 'h', "A raspy h, like a strong English 'h'.", S('jugo', 'juice')),
    L('k', 'ka', 'k', 'k (rare, mostly in borrowed words).', S('kilo', 'kilo')),
    L('l', 'ele', 'l', 'l.', S('luna', 'moon')),
    L('m', 'eme', 'm', 'm.', S('mamá', 'mom')),
    L('n', 'ene', 'n', 'n.', S('noche', 'night')),
    L('ñ', 'eñe', 'ny', "'ny' as in 'canyon'.", S('año', 'year')),
    L('o', 'o', 'oh', "A short, pure 'oh'.", S('ojo', 'eye')),
    L('p', 'pe', 'p', 'p, without a puff of air.', S('pan', 'bread')),
    L('q', 'cu', 'k', 'k. Always written que / qui, with a silent u.', S('queso', 'cheese')),
    L('r', 'erre', 'r', 'A single tap between vowels; rolled at the start of a word.', S('pero', 'but')),
    L('rr', 'doble erre', 'rr', 'A strong rolled r.', S('perro', 'dog')),
    L('s', 'ese', 's', 's.', S('sol', 'sun')),
    L('t', 'te', 't', 't, with the tongue on the teeth.', S('taco', 'taco')),
    L('u', 'u', 'oo', "'oo' as in 'food'.", S('uno', 'one')),
    L('v', 've (chica)', 'b', 'Sounds the same as b.', S('vaca', 'cow')),
    L('w', 'doble ve / doble u', 'w', 'w (borrowed words).', S('web', 'web')),
    L('x', 'equis', 'ks / h / s', 'ks in most words, but in Mexican names it is often h (México), s (Xochimilco) or sh.', S('México', 'Mexico')),
    L('y', 'ye (i griega)', 'y', "y as in 'yes'. On its own (y = and) it sounds like 'ee'.", S('yo', 'I')),
    L('z', 'zeta', 's', 'Sounds like s in Mexico.', S('zapato', 'shoe')),
  ],
  marks: [
    { symbol: '´', name: 'Written accent (tilde)', body: 'Marks the stressed syllable when a word breaks the default rules: café, árbol, teléfono.', example: S('café', 'coffee') },
    { symbol: '1', name: 'Rule 1: ends in a vowel, n or s', body: 'Stress falls on the second-to-last syllable: CA-sa, HA-blan, LU-nes. No accent needed.', example: S('joven', 'young') },
    { symbol: '2', name: 'Rule 2: ends in any other consonant', body: 'Stress falls on the last syllable: ha-BLAR, re-LOJ, ciu-DAD.', example: S('ciudad', 'city') },
    { symbol: '3', name: 'Rule 3: exceptions get an accent', body: 'Words that break rules 1 and 2 get a written accent: ca-FÉ, ÁR-bol, te-LÉ-fo-no, ca-MIÓN.', example: S('camión', 'bus (MX)') },
    { symbol: '¿ ¡', name: 'Upside-down punctuation', body: 'Questions and exclamations open with ¿ and ¡: ¿Cómo estás? ¡Qué padre!', example: S('¿Mande?', 'Pardon?') },
    { symbol: 'qué', name: 'Question words', body: "Question words carry an accent: qué, cómo, dónde, cuándo, quién, cuánto. Without it they are linking words: 'Creo que…'", example: S('¿Dónde está?', 'Where is it?') },
    { symbol: 'tú / tu', name: 'Accents that change meaning', body: 'Some pairs differ only by an accent: tú (you) / tu (your), él (he) / el (the), sí (yes) / si (if), más (more) / mas (but), sé (I know) / se (oneself).', example: S('Tú tienes tu boleto.', 'You have your ticket.') },
    { symbol: 'ü', name: 'Diéresis', body: 'Two dots make the u sound after g: güero (blond / light-skinned, MX), pingüino, agüita.', example: S('güero', 'blond (MX)') },
  ],
  words: [
    P('México', 'MEH-hee-koh', 'Mexico'), P('Oaxaca', 'wah-HAH-kah', 'Oaxaca'), P('Xochimilco', 'soh-chee-MEEL-koh', 'Xochimilco'),
    P('Guadalajara', 'gwah-dah-lah-HAH-rah', 'Guadalajara'), P('Querétaro', 'keh-REH-tah-roh', 'Querétaro'),
    P('aguacate', 'ah-gwah-KAH-teh', 'avocado'), P('jitomate', 'hee-toh-MAH-teh', 'tomato (MX)'),
    P('chilaquiles', 'chee-lah-KEE-lehs', 'chilaquiles'), P('quesadilla', 'keh-sah-DEE-yah', 'quesadilla'),
    P('ahorita', 'ah-oh-REE-tah', 'right now / in a bit'), P('güero', 'GWEH-roh', 'blond / light-skinned'),
    P('papalote', 'pah-pah-LOH-teh', 'kite'), P('cempasúchil', 'sem-pah-SOO-cheel', 'marigold'),
    P('ferrocarril', 'feh-rroh-kah-RREEL', 'railway'), P('cacahuate', 'kah-kah-WAH-teh', 'peanut'),
    P('Tlaquepaque', 'tlah-keh-PAH-keh', 'Tlaquepaque'), P('zócalo', 'SOH-kah-loh', 'main square'),
    P('chapulines', 'chah-poo-LEE-nehs', 'grasshoppers (a snack)'),
  ],
  writing: [
    { en: 'Good morning', answer: 'Buenos días' },
    { en: 'How are you? (formal)', answer: '¿Cómo está?', alts: ['¿Cómo está usted?'] },
    { en: 'Thank you very much', answer: 'Muchas gracias' },
    { en: 'Nice to meet you', answer: 'Mucho gusto', alts: ['Encantado', 'Encantada'] },
    { en: 'Where is the bathroom?', answer: '¿Dónde está el baño?' },
    { en: 'How much does it cost?', answer: '¿Cuánto cuesta?' },
    { en: "I don't understand", answer: 'No entiendo' },
    { en: 'The bill, please', answer: 'La cuenta, por favor' },
    { en: "I'm from the United States", answer: 'Soy de Estados Unidos', alts: ['Soy de los Estados Unidos', 'Soy estadounidense'] },
    { en: 'Pardon? (Mexican, polite)', answer: '¿Mande?' },
    { en: 'I like tacos', answer: 'Me gustan los tacos' },
    { en: "I'm tired (male speaker)", answer: 'Estoy cansado' },
    { en: 'Turn right (formal)', answer: 'Dé vuelta a la derecha', alts: ['Gire a la derecha', 'Da vuelta a la derecha'] },
    { en: 'See you tomorrow', answer: 'Hasta mañana', alts: ['Nos vemos mañana'] },
    { en: 'I want you to come', answer: 'Quiero que vengas', alts: ['Quiero que venga'] },
  ],
  tips: [
    { title: 'Five pure vowels', body: "a, e, i, o, u always sound the same. Don't glide them like English 'oh-oo'." },
    { title: 'No silent letters except h', body: 'Every letter is pronounced except h (and the u in que / qui / gue / gui).' },
    { title: 'Mexican x', body: 'In Nahuatl-origin names, x can be h, s, sh or ks. Learn them one at a time: México, Xochimilco, Xola, Taxco.' },
    { title: 'Type accents easily', body: 'On phones, press and hold a vowel to get á é í ó ú. In this app, use the accent buttons under the text box.' },
  ],
  keyboard: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
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
const R = (t, en, correct, feedback) => C(t, '', en, correct, feedback);
const U = (en, correct, feedback) => C('', '', en, correct, feedback);

const scenarios = [
  {
    id: 'es-sc-taqueria', title: 'Tacos at Midnight', level: 'A1', emoji: '🌮', icon: 'fork.knife',
    setting: 'A busy taquería in Mexico City, late at night.', goal: 'Order tacos and a drink, then pay.',
    steps: [
      step('Taquero', S('¡Buenas! ¿Qué le damos, joven?', 'Hi! What can we get you, young man?', "'Joven' is a polite way to address any youngish man (señorita for women)."), 'Order three al pastor tacos.', [
        R('Me da tres tacos al pastor, por favor.', 'Can I have three al pastor tacos, please?', true, 'Perfect Mexican ordering style.'),
        R('Yo soy tres tacos.', 'I am three tacos.', false, "Careful! Use 'Me da…' (Will you give me…)."),
        R('¿Cómo te llamas?', "What's your name?", false, "Friendly, but he's waiting for your order."),
      ]),
      step('Taquero', S('¿Con todo?', 'With everything?'), 'You want onion and cilantro.', [
        R('Sí, con todo, por favor.', 'Yes, with everything, please.', true, "'Todo' = onion and cilantro."),
        R('Sin cebolla, por favor.', 'No onion, please.', true, "That's fine too. You'll get just cilantro."),
        R('Con todo el dinero.', 'With all the money.', false, "Ha! That's not what he means."),
      ]),
      step('Taquero', S('¿Para aquí o para llevar?', 'For here or to go?'), 'Answer him.', [
        R('Para aquí.', 'For here.', true, "They'll hand you a plate straight away."),
        R('Para llevar.', 'To go.', true, "They'll wrap them up."),
        R('Para mañana.', 'For tomorrow.', false, 'Tacos are best eaten now!'),
      ]),
      step('Taquero', S('¿Y de tomar?', 'And to drink?'), 'Order a drink.', [
        R('Un agua de horchata, por favor.', 'A horchata, please.', true, 'Aguas frescas include horchata, jamaica (hibiscus) and tamarindo.'),
        R('Un refresco, por favor.', 'A soft drink, please.', true, 'Every taquería has refrescos.'),
        R('Tomo el metro.', 'I take the Metro.', false, "Here 'tomar' means 'to drink'."),
      ]),
      step(null, null, "You've finished. Ask how much you owe.", [
        R('¿Cuánto le debo?', 'How much do I owe you?', true, 'The classic way to pay at a taquería.'),
        R('¿Cuánto cuestas?', 'How much do you cost?', false, "Oops: 'cuestas' asks how much HE costs!"),
        R('¿Dónde está el baño?', "Where's the bathroom?", false, 'Useful, but not for paying.'),
      ]),
      step('Taquero', S('Son ochenta y cinco pesos.', "That's eighty-five pesos."), 'How much is it?', [
        U('85 pesos', true, 'ochenta = 80, cinco = 5.'),
        U('58 pesos', false, '58 is cincuenta y ocho.'),
        U('95 pesos', false, '95 is noventa y cinco.'),
      ], 'understand'),
    ],
  },
  {
    id: 'es-sc-metro', title: 'Riding the Metro', level: 'A2', emoji: '🚇', icon: 'tram',
    setting: 'Mexico City. You want to get to the Palacio de Bellas Artes.', goal: 'Get a travel card, ask the way, and get off at the right stop.',
    steps: [
      step(null, null, 'At the ticket window, ask for a rechargeable card.', [
        R('Buenas tardes, ¿me da una tarjeta, por favor?', 'Good afternoon, can I have a card, please?', true, 'The integrated mobility card works on the Metro, Metrobús and more.'),
        R('Quiero un tren.', 'I want a train.', false, 'Buying a whole train might be expensive!'),
        R('¿Mande?', 'Pardon?', false, "That's for when you didn't hear someone."),
      ]),
      step(null, null, 'Ask a station officer how to get to Bellas Artes.', [
        R('Disculpe, ¿cómo llego a Bellas Artes?', 'Excuse me, how do I get to Bellas Artes?', true, '¿Cómo llego a…? is the key phrase.'),
        R('¿Dónde vive Bellas Artes?', 'Where does Bellas Artes live?', false, "Places don't 'live'. Use '¿cómo llego a…?' or '¿dónde está…?'"),
        R('¿Qué hora es Bellas Artes?', 'What time is Bellas Artes?', false, "You've mixed two questions!"),
      ]),
      step('Officer', S('Tome la línea 2, dirección Cuatro Caminos, y bájese en Bellas Artes.', 'Take Line 2 towards Cuatro Caminos and get off at Bellas Artes.'), 'What should you do?', [
        U('Take Line 2 towards Cuatro Caminos and get off at Bellas Artes', true, "'Dirección' is the last station on the line, which tells you the direction."),
        U('Take Line 4 and walk two blocks', false, 'Línea 2 = Line 2.'),
        U('Take a bus to Cuatro Caminos', false, "'Línea' means a Metro line."),
      ], 'understand'),
      step('Passenger', S('¿Va a bajar en la próxima?', 'Are you getting off at the next one?'), "You aren't. Answer politely.", [
        R('No, todavía no. Con permiso.', 'Not yet. Excuse me.', true, "Say 'Con permiso' as you step aside. Very polite."),
        R('Sí, voy a subir.', "Yes, I'm going to get on.", false, 'Subir = get on; bajar = get off.'),
        R('No hablo metro.', "I don't speak Metro.", false, 'Ha!'),
      ]),
      step(null, null, "You hear 'Próxima estación: Bellas Artes'. What do you do?", [
        R('Me bajo aquí.', 'I get off here.', true, "Bajarse = to get off. You're there!"),
        R('Me subo aquí.', 'I get on here.', false, "You're already on the train!"),
        R('Me baño aquí.', 'I shower here.', false, 'Careful: bañarse (to shower) vs. bajarse (to get off)!'),
      ]),
    ],
  },
  {
    id: 'es-sc-mercado', title: 'At the Market', level: 'A2', emoji: '🥑', icon: 'basket',
    setting: 'A busy neighbourhood market in Guadalajara. You need avocados and tomatoes.', goal: 'Ask prices the Mexican way and buy what you need.',
    steps: [
      step('Vendor', S('¿Qué le damos, güerita? Pásele, pásele.', 'What can I get you, blondie? Come on in.', "'Güero / güerita' is a friendly (not rude) way vendors address light-skinned or foreign customers."), 'Ask the price of avocados per kilo.', [
        R('¿A cómo el kilo de aguacate?', 'How much for a kilo of avocados?', true, "'¿A cómo…?' is how Mexicans ask prices at the market."),
        R('¿Cuántos años tiene el aguacate?', 'How old is the avocado?', false, 'Ha! You want the price, not its age.'),
        R('Yo soy güera.', "I'm blonde.", false, 'She knows! Ask the price.'),
      ]),
      step('Vendor', S('A sesenta el kilo.', 'Sixty a kilo.'), "What's the price?", [
        U('60 pesos a kilo', true, 'sesenta = 60.'),
        U('70 pesos a kilo', false, '70 is setenta. Watch out for sesenta / setenta!'),
        U('6 pesos each', false, "'El kilo' = per kilo."),
      ], 'understand'),
      step(null, null, 'Ask for a kilo, ripe enough to eat today.', [
        R('Deme un kilo, pero que estén para hoy, por favor.', 'Give me a kilo, ripe for today, please.', true, "'Para hoy' = ready to eat today. The vendor will pick them for you."),
        R('Quiero un kilómetro.', 'I want a kilometre.', false, 'Kilo, not kilómetro!'),
        R('Un kilo para el año pasado.', 'A kilo for last year.', false, 'Time-travelling avocados?'),
      ]),
      step('Vendor', S('¿Algo más? El jitomate está bien bonito hoy.', 'Anything else? The tomatoes are really nice today.'), 'Ask for half a kilo of tomatoes.', [
        R('Sí, medio kilo de jitomate, por favor.', 'Yes, half a kilo of tomatoes, please.', true, 'Jitomate = red tomato in central Mexico.'),
        R('No, gracias, es todo.', "No thanks, that's all.", true, 'That works too!'),
        R('El jitomate es mi amigo.', 'The tomato is my friend.', false, 'Sweet, but not helpful.'),
      ]),
      step('Vendor', S('Son noventa pesos, marchanta.', "That's ninety pesos, my dear customer.", "'Marchante / marchanta' = a regular customer. It's a term of affection."), 'What did she say?', [
        U("It's 90 pesos (and she called you a valued customer)", true, "noventa = 90. 'Marchanta' builds friendly loyalty."),
        U("It's 19 pesos, March", false, '19 is diecinueve.'),
        U('The market is closed', false, "She's telling you the price."),
      ], 'understand'),
      step(null, null, 'Pay and say a warm goodbye.', [
        R('Aquí tiene. ¡Gracias, que le vaya bien!', 'Here you are. Thanks, all the best!', true, "'Que le vaya bien' (may it go well for you) is a warm goodbye."),
        R('¡Provecho!', 'Enjoy your meal!', false, "She isn't eating."),
        R('¿Mande?', 'Pardon?', false, 'No need, you understood!'),
      ]),
    ],
  },
  {
    id: 'es-sc-farmacia', title: 'At the Pharmacy', level: 'A2', emoji: '💊', icon: 'cross.case',
    setting: 'You wake up with a sore throat in Mérida and go to a pharmacy.', goal: 'Describe your symptoms and understand the instructions.',
    steps: [
      step('Pharmacist', S('Buenas tardes, ¿qué se le ofrece?', 'Good afternoon, how can I help you?'), 'Say your throat hurts.', [
        R('Me duele la garganta. ¿Tiene algo para eso?', 'My throat hurts. Do you have anything for it?', true, "'Me duele…' works like 'me gusta': the body part is the subject."),
        R('Yo duelo la garganta.', 'I hurt the throat.', false, "Use 'Me duele…'."),
        R('Tengo garganta.', 'I have a throat.', false, "Congratulations! Say 'Me duele la garganta.'"),
      ]),
      step('Pharmacist', S('¿Desde cuándo?', 'Since when?'), 'Say: since yesterday.', [
        R('Desde ayer.', 'Since yesterday.', true, 'ayer = yesterday.'),
        R('Hasta mañana.', 'See you tomorrow.', false, "That's a goodbye!"),
        R('Son las tres.', "It's three o'clock.", false, "He asked since when, not what time it is."),
      ]),
      step('Pharmacist', S('¿Tiene fiebre? ¿Es alérgico a algún medicamento?', 'Do you have a fever? Are you allergic to any medicine?'), 'Answer: no fever, no allergies.', [
        R('No tengo fiebre y no soy alérgico a nada.', "No fever, and I'm not allergic to anything.", true, "Double negatives are correct in Spanish: 'no… nada'."),
        R('Sí, soy alérgico a las fiestas.', "Yes, I'm allergic to parties.", false, "Ha! That's not a medical allergy."),
        R('No sé, gracias.', "I don't know, thanks.", false, 'Try to answer clearly, for your own safety.'),
      ]),
      step('Pharmacist', S('Tómese una pastilla cada ocho horas después de comer. Si no mejora, vaya con el doctor.', "Take one pill every eight hours after eating. If you don't get better, see a doctor."), 'What should you do?', [
        U("One pill every 8 hours after eating, and see a doctor if you don't improve", true, 'Many pharmacies have a doctor’s office (consultorio) next door for quick, cheap consultations.'),
        U('Eight pills once a day before eating', false, "'Cada ocho horas' = every eight hours."),
        U('See the doctor first, then eat', false, "Only if you don't get better."),
      ], 'understand'),
      step(null, null, 'Thank him and say goodbye.', [
        R('Muchas gracias, muy amable. Hasta luego.', "Thank you, that's very kind. Goodbye.", true, "'Muy amable' (very kind) is a lovely, common way to say thanks."),
        R('Salud.', 'Bless you / Cheers.', false, "That's for sneezes and toasts."),
        R('Provecho.', 'Enjoy your meal.', false, "He isn't eating."),
      ]),
    ],
  },
  {
    id: 'es-sc-muertos', title: 'Día de Muertos with a Family', level: 'B1', emoji: '🌼', icon: 'sparkles',
    setting: "Oaxaca, November 1. Your friend Lucía invites you to her grandmother's house.", goal: 'Show respect at the ofrenda and join the conversation.',
    steps: [
      step("Lucía's grandmother", S('Pásale, mijo, estás en tu casa.', 'Come in, dear. Make yourself at home.', "'Mijo / mija' (mi hijo / mi hija) is an affectionate way elders address younger people."), 'Thank her as you go in.', [
        R('Muchas gracias, señora. Con permiso.', "Thank you very much, ma'am. Excuse me.", true, "Saying 'Con permiso' as you enter someone's home is very respectful."),
        R('¡Qué onda, güey!', "What's up, dude!", false, 'Much too informal for a grandmother!'),
        R('Adiós.', 'Goodbye.', false, 'You just arrived!'),
      ]),
      step("Lucía's grandmother", S('Esta es la ofrenda para mi esposo. Le encantaba el mole.', 'This is the altar for my husband. He loved mole.'), 'Respond respectfully.', [
        R('Está muy bonita. ¿Cómo se llamaba?', "It's beautiful. What was his name?", true, 'Asking about the person honours their memory.'),
        R('¿Puedo comer el mole?', 'Can I eat the mole?', false, 'The food on the ofrenda is for the spirits first!'),
        R('Qué miedo.', 'How scary.', false, 'Día de Muertos is about love and memory, not fear.'),
      ]),
      step("Lucía's grandmother", S('Se llamaba Don Ernesto. Le pusimos pan de muerto, cempasúchil y su mezcal favorito.', "His name was Don Ernesto. We put out pan de muerto, marigolds and his favourite mezcal."), 'What is on the altar?', [
        U('Pan de muerto, marigolds and his favourite mezcal', true, 'Ofrendas hold the favourite things of the person who died.'),
        U('Candy skulls and a guitar', false, 'Listen again: pan de muerto, cempasúchil, mezcal.'),
        U('Only photos of Lucía', false, "It's for Don Ernesto."),
      ], 'understand'),
      step('Lucía', S('En la noche vamos a ir al panteón. ¿Quieres venir?', "Tonight we're going to the cemetery. Do you want to come?"), 'Accept and ask what to bring.', [
        R('¡Claro que sí! ¿Llevo algo?', 'Of course! Should I bring anything?', true, 'Offering to bring something is a nice touch. Candles or flowers are welcome.'),
        R('No me gustan los muertos.', "I don't like dead people.", false, 'A bit blunt for the occasion!'),
        R('Fui al panteón mañana.', 'I went to the cemetery tomorrow.', false, "Tense mix-up: 'fui' is past and 'mañana' is future."),
      ]),
      step('Lucía', S('Trae unas velas, si quieres. Vamos a estar ahí toda la noche.', "Bring some candles if you like. We'll be there all night."), 'What does she suggest?', [
        U("Bring some candles. They'll be there all night.", true, 'Families keep vigil by candlelight and share food and music.'),
        U("Bring your car. They'll leave at night.", false, "'Velas' = candles."),
        U("Don't come. It's only for family.", false, "She's warmly inviting you."),
      ], 'understand'),
    ],
  },
  {
    id: 'es-sc-plans', title: 'Weekend Plans with Friends', level: 'B1', emoji: '📱', icon: 'message',
    setting: 'Texting with your friend Diego in Monterrey.', goal: 'Make plans in casual Mexican Spanish.',
    steps: [
      step('Diego', S('¿Qué onda? ¿Qué vas a hacer el sábado?', "What's up? What are you doing on Saturday?"), "Say you don't have plans yet.", [
        R('Nada todavía. ¿Por?', 'Nothing yet. Why?', true, "'¿Por?' is short for '¿por qué?'. Very casual."),
        R('Fui al cine el sábado.', 'I went to the cinema on Saturday.', false, "He's asking about this coming Saturday."),
        R('Muy bien, gracias, ¿y usted?', 'Very well, thanks, and you (formal)?', false, 'Far too formal for a friend!'),
      ]),
      step('Diego', S('Vamos a ir a una carne asada en casa de mi primo. ¿Te late?', "We're going to a barbecue at my cousin's. Are you in?", "'¿Te late?' = 'Do you like the idea?' (MX slang)."), 'Say yes enthusiastically.', [
        R('¡Va! ¡Qué padre!', 'Deal! Awesome!', true, "'¡Va!' = OK / deal. 'Qué padre' = how cool."),
        R('No manches, ¿neta? ¡Sí!', 'No way, really? Yes!', true, 'Surprised and keen. That works!'),
        R('¿Qué es un primo?', 'What is a cousin?', false, 'Primo = cousin.'),
      ]),
      step(null, null, 'Ask what time it starts and what to bring.', [
        R('¿A qué hora y qué llevo?', 'What time, and what should I bring?', true, 'Bringing drinks or tortillas to a carne asada is always appreciated.'),
        R('¿Qué hora es?', 'What time is it?', false, 'That asks the time right now.'),
        R('Llevo a las cinco.', 'I bring at five.', false, 'Mixed up. Ask both questions.'),
      ]),
      step('Diego', S('Como a las cuatro. Trae unas chelas o hielo, lo que quieras.', 'Around four. Bring some beers or ice, whatever you like.', "'Chela' = beer (MX slang)."), 'What does he say?', [
        U('Around 4; bring some beers or ice, whatever you like', true, "'Como a las cuatro' = around four (expect it to start later!)."),
        U('Exactly at 4; bring chairs', false, "'Como' = around; 'chelas' = beers."),
        U('At 2 p.m.; bring nothing', false, 'cuatro = four.'),
      ], 'understand'),
      step(null, null, 'Confirm and sign off.', [
        R('Sale, ahí nos vemos.', 'Deal, see you there.', true, "'Sale' = OK (MX). You sound like a local!"),
        R('Hasta luego, señor Diego.', 'Goodbye, Mr. Diego.', false, 'Too formal for a friend.'),
        R('Ahorita no.', 'Not right now.', false, 'You just said yes!'),
      ]),
    ],
  },
  {
    id: 'es-sc-interview', title: 'A Job Interview', level: 'B2', emoji: '💼', icon: 'briefcase',
    setting: 'A video interview with a marketing agency in Mexico City.', goal: 'Talk about your experience in polite, formal Spanish.',
    steps: [
      step('Interviewer', S('Buenos días. Gracias por su tiempo. Platíqueme un poco de su experiencia.', 'Good morning. Thanks for your time. Tell me a little about your experience.'), 'Describe your experience (use the past tense).', [
        R('Trabajé tres años como diseñador en una agencia de publicidad.', 'I worked for three years as a designer at an advertising agency.', true, "The preterite fits a finished period. 'Platicar' is very Mexican for 'tell / chat'."),
        R('Trabajo tres años mañana.', 'I work three years tomorrow.', false, 'Mixed tenses. Use the preterite: trabajé.'),
        R('¿Qué onda? Soy bien chido.', "What's up? I'm really cool.", false, 'Far too informal for an interview!'),
      ]),
      step('Interviewer', S('¿Por qué le interesa este puesto?', 'Why are you interested in this position?'), 'Give a reason.', [
        R('Me interesa porque quiero crecer profesionalmente y admiro sus proyectos.', 'Because I want to grow professionally and I admire your projects.', true, 'Polite, specific and flattering.'),
        R('Porque necesito lana.', 'Because I need money (slang).', false, 'Honest, but too informal!'),
        R('No sé, me mandó mi mamá.', "I don't know, my mom sent me.", false, "Not the confidence they're looking for."),
      ]),
      step('Interviewer', S('¿Cuándo podría empezar?', 'When could you start?'), 'Answer using the conditional.', [
        R('Podría empezar el próximo lunes.', 'I could start next Monday.', true, "'Podría' mirrors their polite tone."),
        R('Empecé el lunes.', 'I started on Monday.', false, "That's the past tense."),
        R('Ahorita.', 'Right now / in a bit.', false, 'Too vague! Give a date.'),
      ]),
      step('Interviewer', S('Perfecto. ¿Tiene alguna pregunta para nosotros?', 'Perfect. Do you have any questions for us?'), 'Ask a polite question.', [
        R('Me gustaría saber cómo es un día típico en el equipo.', "I'd like to know what a typical day on the team is like.", true, "'Me gustaría saber…' is elegant and polite."),
        R('¿Cuánto me van a pagar, eh?', 'How much are you going to pay me, huh?', false, "It's fair to ask about salary, but bring it up more gently and later."),
        R('Ninguna.', 'None.', false, 'Asking a question shows you are interested.'),
      ]),
      step('Interviewer', S('Muy bien. Nosotros le avisamos a más tardar el viernes.', "Very good. We'll let you know by Friday at the latest."), 'What did they say?', [
        U("They'll let you know by Friday at the latest", true, "'Avisar' = to let someone know; 'a más tardar' = at the latest."),
        U('You start on Friday', false, "They'll tell you their decision. They haven't hired you yet."),
        U('You should call them on Friday', false, "They'll contact you."),
      ], 'understand'),
      step(null, null, 'Close the interview politely.', [
        R('Muchas gracias por la oportunidad. Quedo a sus órdenes.', 'Thank you very much for the opportunity. I remain at your service.', true, "'A sus órdenes' is a classic Mexican courtesy phrase."),
        R('¡Bye!', 'Bye!', false, 'A bit too casual.'),
        R('Nos vemos, güey.', 'See you, dude.', false, 'Definitely not!'),
      ]),
    ],
  },
];

const aptitude = [
  A('A1', 'vocabulary', "What does '¿Cómo te llamas?' mean?", ["What's your name?", 'How are you?', 'Where are you from?', 'How old are you?']),
  A('A1', 'grammar', 'Yo ___ de México.', ['soy', 'estoy', 'es', 'eres'], 'Origin uses ser.'),
  A('A1', 'vocabulary', "At a restaurant, 'la cuenta' is…", ['the bill', 'the menu', 'the tip', 'the table']),
  A('A1', 'grammar', '___ casa es grande.', ['La', 'El', 'Los', 'Un'], 'Casa is feminine and singular.'),
  A('A1', 'culture', "In Mexico, '¿Mande?' is a polite way to say…", ['Pardon? / Yes?', 'Send it', 'Give it to me', 'Go away']),
  A('A2', 'grammar', 'A mí me ___ los tacos.', ['gustan', 'gusta', 'gusto', 'gustas'], 'Plural thing liked → gustan.'),
  A('A2', 'grammar', 'Ella ___ cansada hoy.', ['está', 'es', 'ser', 'son'], 'Temporary state → estar.'),
  A('A2', 'grammar', 'Ayer yo ___ (comer) en casa.', ['comí', 'como', 'comeré', 'comer']),
  A('A2', 'vocabulary', "In Mexico City, 'el camión' usually means…", ['a city bus', 'a train', 'a taxi', 'a bicycle']),
  A('A2', 'culture', 'Día de Muertos is celebrated on…', ['November 1–2', 'September 16', 'May 5', 'December 12']),
  A('B1', 'grammar', 'Quiero que tú ___ conmigo.', ['vengas', 'vienes', 'venir', 'vendrás'], 'Wish + que + different subject → subjunctive.'),
  A('B1', 'grammar', 'Cuando era niño, ___ al parque todos los días.', ['iba', 'fui', 'voy', 'iré'], 'Habitual past → imperfect.'),
  A('B1', 'reading', "In Mexican usage, 'Ahorita vengo' most likely means…", ["I'll be back in a bit (time uncertain)", 'I arrived just now', "I'm never coming", 'I came yesterday']),
  A('B1', 'grammar', 'Este regalo es ___ ti.', ['para', 'por', 'en', 'de'], 'Recipient → para.'),
  A('B1', 'vocabulary', "'¡Qué padre!' means…", ['How cool!', 'What a dad!', 'How sad!', 'How expensive!']),
  A('B2', 'grammar', 'Si tuviera dinero, ___ un coche.', ['compraría', 'compro', 'compraré', 'compré']),
  A('B2', 'grammar', 'Busco a alguien que ___ náhuatl.', ['hable', 'habla', 'hablará', 'hablaba'], 'Unknown / hypothetical person → subjunctive.'),
  A('B2', 'reading', '"No es que no quiera ir, es que no puedo."', ["It's not that I don't want to go; I can't.", "I don't want to go and I can't.", "I want to go, but I won't.", "I can go, but I don't want to."], null, 'No es que no quiera ir, es que no puedo.'),
  A('B2', 'grammar', 'Si me ___ dicho antes, te habría ayudado.', ['hubieras', 'habías', 'has', 'habrías'], 'Past unreal condition → pluperfect subjunctive.'),
  A('B2', 'culture', "Which word for 'avocado' comes from Nahuatl?", ['aguacate', 'palta', 'durazno', 'plátano'], 'Palta (used in Peru and Chile) comes from Quechua.'),
];

// [Spanish, English]. English alternatives are separated by ';'.
const dictionary = [
  ['hola', 'hello; hi'], ['buenos días', 'good morning'], ['buenas tardes', 'good afternoon'], ['buenas noches', 'good evening; good night'],
  ['¿qué tal?', "how's it going"], ['¿cómo estás?', 'how are you'], ['¿cómo está?', 'how are you (formal)'], ['¿qué onda?', "what's up (MX)"],
  ['mucho gusto', 'nice to meet you'], ['igualmente', 'likewise'], ['gracias', 'thank you; thanks'], ['muchas gracias', 'thank you very much; thanks a lot'],
  ['de nada', "you're welcome"], ['por favor', 'please'], ['perdón', 'sorry; excuse me'], ['disculpe', 'excuse me (formal)'],
  ['con permiso', 'excuse me (passing)'], ['¿mande?', 'pardon (MX)'], ['adiós', 'goodbye; bye'], ['hasta luego', 'see you later'],
  ['hasta mañana', 'see you tomorrow'], ['nos vemos', 'see you'], ['sí', 'yes'], ['no', 'no; not'], ['¿cuánto cuesta?', 'how much does it cost; how much is it'],
  ['¿dónde está?', 'where is'], ['¿dónde está el baño?', 'where is the bathroom'], ['no entiendo', "I don't understand; I do not understand"],
  ['no sé', "I don't know; I do not know"], ['¿habla inglés?', 'do you speak English'], ['hablo un poco de español', 'I speak a little Spanish'],
  ['la cuenta, por favor', 'the check please; the bill please'], ['buen provecho', 'enjoy your meal'], ['provecho', 'enjoy your meal'],
  ['me llamo', 'my name is'], ['¿cómo te llamas?', 'what is your name'], ['soy de', 'I am from'], ['salud', 'cheers; bless you'],
  ['ayuda', 'help'], ['¡aguas!', 'watch out (MX)'], ['¿a cómo?', 'how much (MX market)'], ['ahorita', 'right now; in a bit (MX)'],
  ['qué padre', 'how cool (MX)'], ['chido', 'cool (MX)'], ['neta', 'truth; really (MX)'], ['no manches', 'no way (MX)'],
  ['chamba', 'job; work (MX)'], ['lana', 'money (MX slang)'], ['güey', 'dude (MX, informal)'], ['cuate', 'buddy (MX)'], ['padre', 'father; cool (MX)'],
  ['yo', 'I; me'], ['tú', 'you (informal)'], ['usted', 'you (formal)'], ['él', 'he; him'], ['ella', 'she; her'], ['nosotros', 'we; us'],
  ['ustedes', 'you all; you (plural)'], ['ellos', 'they; them'], ['el', 'the'], ['la', 'the'], ['los', 'the'], ['las', 'the'], ['un', 'a; an'], ['una', 'a; an'],
  ['qué', 'what'], ['quién', 'who'], ['dónde', 'where'], ['cuándo', 'when'], ['cómo', 'how'], ['por qué', 'why'], ['cuánto', 'how much'],
  ['cuántos', 'how many'], ['cuál', 'which'],
  ['ser', 'to be (identity)'], ['estar', 'to be (state; location)'], ['tener', 'to have'], ['ir', 'to go'], ['hacer', 'to do; to make'],
  ['querer', 'to want; to love'], ['poder', 'can; to be able'], ['hablar', 'to speak; to talk'], ['comer', 'to eat'], ['beber', 'to drink'],
  ['tomar', 'to take; to drink'], ['vivir', 'to live'], ['trabajar', 'to work'], ['estudiar', 'to study'], ['comprar', 'to buy'],
  ['pagar', 'to pay'], ['necesitar', 'to need'], ['gustar', 'to like; to please'], ['saber', 'to know (facts)'], ['conocer', 'to know (people / places); to meet'],
  ['ver', 'to see; to watch'], ['venir', 'to come'], ['llegar', 'to arrive'], ['salir', 'to leave; to go out'], ['entrar', 'to enter; to go in'],
  ['esperar', 'to wait; to hope'], ['ayudar', 'to help'], ['dormir', 'to sleep'], ['escribir', 'to write'], ['leer', 'to read'],
  ['entender', 'to understand'], ['platicar', 'to chat (MX)'], ['manejar', 'to drive (MX)'], ['rentar', 'to rent (MX)'], ['abrir', 'to open'],
  ['cerrar', 'to close'], ['cocinar', 'to cook'], ['viajar', 'to travel'], ['bailar', 'to dance'], ['cantar', 'to sing'], ['jugar', 'to play'],
  ['llamar', 'to call'], ['buscar', 'to look for; to search'], ['encontrar', 'to find'],
  ['soy', 'I am'], ['eres', 'you are'], ['es', 'is; he is; she is; it is'], ['somos', 'we are'], ['son', 'they are; are'], ['estoy', 'I am (state)'],
  ['está', 'is (state / location)'], ['estamos', 'we are (state)'], ['tengo', 'I have'], ['tienes', 'you have'], ['tiene', 'has; he has; she has'],
  ['voy', "I go; I'm going"], ['vas', 'you go'], ['va', 'goes'], ['vamos', "we go; let's go"], ['quiero', 'I want'], ['quieres', 'you want'],
  ['puedo', 'I can'], ['puede', 'can (formal you / he / she)'], ['hablo', 'I speak'], ['como', 'I eat; like; as'], ['vivo', 'I live'],
  ['trabajo', 'work; job; I work'], ['me gusta', 'I like'], ['me gustan', 'I like (plural)'], ['hay', 'there is; there are'],
  ['fui', 'I went; I was'], ['comí', 'I ate'],
  ['taco', 'taco'], ['tortilla', 'tortilla'], ['agua', 'water'], ['café', 'coffee'], ['té', 'tea'], ['leche', 'milk'], ['pan', 'bread'],
  ['carne', 'meat'], ['pollo', 'chicken'], ['pescado', 'fish'], ['arroz', 'rice'], ['frijoles', 'beans'], ['huevo', 'egg'], ['queso', 'cheese'],
  ['fruta', 'fruit'], ['verdura', 'vegetable'], ['aguacate', 'avocado'], ['jitomate', 'tomato (MX)'], ['tomate', 'tomatillo (MX); tomato'],
  ['chile', 'chili pepper; chili'], ['elote', 'corn on the cob (MX)'], ['maíz', 'corn'], ['limón', 'lime (MX); lemon'], ['cebolla', 'onion'],
  ['cilantro', 'cilantro; coriander'], ['salsa', 'sauce; salsa'], ['cerveza', 'beer'], ['refresco', 'soda; soft drink'], ['jugo', 'juice'],
  ['postre', 'dessert'], ['desayuno', 'breakfast'], ['comida', 'food; lunch (main meal)'], ['cena', 'dinner; supper'], ['mesero', 'waiter (MX)'],
  ['menú', 'menu'], ['propina', 'tip'], ['popote', 'straw (MX)'], ['dulce', 'candy; sweet'], ['picante', 'spicy; hot (spicy)'], ['mole', 'mole (sauce)'],
  ['pan dulce', 'sweet bread; pastry'],
  ['casa', 'house; home'], ['escuela', 'school'], ['universidad', 'university'], ['mercado', 'market'], ['tianguis', 'open-air market (MX)'],
  ['tienda', 'store; shop'], ['farmacia', 'pharmacy'], ['hospital', 'hospital'], ['hotel', 'hotel'], ['aeropuerto', 'airport'],
  ['estación', 'station'], ['calle', 'street'], ['ciudad', 'city'], ['pueblo', 'town; village'], ['iglesia', 'church'], ['oficina', 'office'],
  ['banco', 'bank'], ['baño', 'bathroom; restroom'], ['cuarto', 'room (MX); quarter'], ['recámara', 'bedroom (MX)'], ['puerta', 'door'],
  ['ventana', 'window'], ['playa', 'beach'], ['montaña', 'mountain'], ['parque', 'park'], ['restaurante', 'restaurant'], ['museo', 'museum'],
  ['zócalo', 'main square (MX)'], ['centro', 'downtown; center'], ['esquina', 'corner'], ['cuadra', 'block'],
  ['carro', 'car (MX)'], ['coche', 'car'], ['camión', 'bus (MX); truck'], ['metro', 'subway; metro'], ['taxi', 'taxi'], ['avión', 'airplane; plane'],
  ['boleto', 'ticket (MX)'], ['tren', 'train'], ['pesero', 'minibus (MX)'],
  ['derecha', 'right'], ['izquierda', 'left'], ['derecho', 'straight ahead'], ['aquí', 'here'], ['allí', 'there'], ['allá', 'over there'],
  ['cerca', 'near; close'], ['lejos', 'far'], ['enfrente', 'in front; across'], ['atrás', 'behind'], ['al lado', 'next to'],
  ['en', 'in; on; at'], ['de', 'of; from'], ['a', 'to; at'], ['con', 'with'], ['sin', 'without'], ['para', 'for; in order to'],
  ['por', 'for; by; through'], ['y', 'and'], ['o', 'or'], ['pero', 'but'], ['también', 'also; too'], ['muy', 'very'], ['más', 'more'], ['menos', 'less'],
  ['hoy', 'today'], ['mañana', 'tomorrow; morning'], ['ayer', 'yesterday'], ['ahora', 'now'], ['día', 'day'], ['semana', 'week'], ['mes', 'month'],
  ['año', 'year'], ['hora', 'hour; time'], ['minuto', 'minute'], ['tarde', 'afternoon; late'], ['noche', 'night'],
  ['lunes', 'Monday'], ['martes', 'Tuesday'], ['miércoles', 'Wednesday'], ['jueves', 'Thursday'], ['viernes', 'Friday'], ['sábado', 'Saturday'], ['domingo', 'Sunday'],
  ['cero', 'zero'], ['uno', 'one'], ['dos', 'two'], ['tres', 'three'], ['cuatro', 'four'], ['cinco', 'five'], ['seis', 'six'], ['siete', 'seven'],
  ['ocho', 'eight'], ['nueve', 'nine'], ['diez', 'ten'], ['once', 'eleven'], ['doce', 'twelve'], ['quince', 'fifteen'], ['veinte', 'twenty'],
  ['treinta', 'thirty'], ['cincuenta', 'fifty'], ['cien', 'hundred; one hundred'], ['mil', 'thousand'],
  ['familia', 'family'], ['madre', 'mother'], ['mamá', 'mom'], ['papá', 'dad'], ['hermano', 'brother'], ['hermana', 'sister'], ['hijo', 'son'],
  ['hija', 'daughter'], ['abuelo', 'grandfather'], ['abuela', 'grandmother'], ['esposo', 'husband'], ['esposa', 'wife'], ['amigo', 'friend'],
  ['amiga', 'friend (f)'], ['novio', 'boyfriend'], ['novia', 'girlfriend'], ['niño', 'child; boy'], ['niña', 'girl'],
  ['grande', 'big; large'], ['pequeño', 'small; little'], ['chico', 'small (MX); boy'], ['bonito', 'pretty; nice'], ['nuevo', 'new'], ['viejo', 'old'],
  ['bueno', 'good'], ['malo', 'bad'], ['caliente', 'hot'], ['frío', 'cold'], ['caro', 'expensive'], ['barato', 'cheap'], ['fácil', 'easy'],
  ['difícil', 'difficult; hard'], ['feliz', 'happy'], ['triste', 'sad'], ['cansado', 'tired'], ['enfermo', 'sick; ill'], ['rico', 'delicious; rich'],
  ['sabroso', 'tasty'], ['alto', 'tall; high'], ['bajo', 'short; low'], ['mucho', 'a lot; much; many'], ['poco', 'a little; few'], ['todo', 'all; everything'],
  ['libro', 'book'], ['pluma', 'pen (MX)'], ['teléfono', 'phone; telephone'], ['celular', 'cell phone (MX)'], ['dinero', 'money'], ['sol', 'sun'],
  ['luna', 'moon'], ['clima', 'weather'], ['idioma', 'language'], ['español', 'Spanish'], ['inglés', 'English'], ['árabe', 'Arabic'], ['palabra', 'word'],
  ['pregunta', 'question'], ['respuesta', 'answer'], ['nombre', 'name'], ['doctor', 'doctor'], ['maestro', 'teacher'], ['estudiante', 'student'],
  ['medicina', 'medicine'], ['dolor', 'pain'], ['fiesta', 'party'], ['regalo', 'gift; present'], ['ofrenda', 'altar offering'],
  ['calavera', 'skull; sugar skull'], ['cempasúchil', 'marigold (MX)'], ['día de muertos', 'Day of the Dead'], ['posada', 'Christmas posada; inn'],
];

const media = [
  M('A1', 'TV', 'Plaza Sésamo', 'Sesame Workshop / Televisa', "Mexico's Sesame Street: slow, clear Mexican Spanish for absolute beginners.", 'YouTube / streaming', ['listening']),
  M('A1', 'Music', 'Cri-Cri songs', 'Francisco Gabilondo Soler', 'Classic Mexican children’s songs with simple vocabulary that every Mexican knows by heart.', 'Music streaming', ['listening', 'culture']),
  M('A1', 'Film', 'Coco (2017), Latin American Spanish dub', 'Pixar', 'A Día de Muertos story with a Mexican voice cast. Watch with Spanish subtitles.', 'Disney+', ['listening', 'culture']),
  M('A2', 'TV', 'El Chavo del Ocho', 'Roberto Gómez Bolaños (Chespirito)', 'Iconic 1970s sitcom with simple, repetitive dialogue and catchphrases everyone still quotes.', 'YouTube / streaming', ['listening', 'culture']),
  M('A2', 'Music', 'Natalia Lafourcade: "Hasta la Raíz"', 'Natalia Lafourcade', 'A beautiful song with very clear diction. Read the lyrics while you listen.', 'Music streaming', ['listening']),
  M('A2', 'TV', 'Rebelde (2004)', 'Televisa', 'A hugely popular teen telenovela with everyday dialogue and dramatic, easy-to-follow plots.', 'Streaming / YouTube', ['listening']),
  M('B1', 'Film', 'Instructions Not Included / No se aceptan devoluciones (2013)', 'Eugenio Derbez', 'Bilingual comedy-drama that moves between Acapulco and L.A. Great for bridging English and Spanish.', 'Streaming', ['listening']),
  M('B1', 'TV', 'Club de Cuervos (2015–2019)', 'Netflix, Mexico', 'A satirical comedy about a football club, packed with Mexican slang and business Spanish.', 'Netflix', ['listening', 'culture']),
  M('B1', 'YouTube', 'Luisito Comunica', 'Luis Arturo Villar', 'Travel vlogs in fast, casual Mexican Spanish. Turn on Spanish captions.', 'YouTube', ['listening']),
  M('B1', 'Film', 'Nosotros los Nobles (2013)', 'Gary Alazraki', 'A comedy about spoiled rich kids forced to work, with lots of class-based slang (fresa vs. naco).', 'Streaming', ['listening', 'culture']),
  M('B2', 'Film', 'Roma (2018)', 'Alfonso Cuarón', 'An Oscar-winning portrait of 1970s Mexico City in Spanish and Mixtec.', 'Netflix', ['listening', 'culture']),
  M('B2', 'Book', 'Como agua para chocolate', 'Laura Esquivel', 'A magical-realist novel built around recipes. Each chapter is a month and a dish.', 'Bookshops', ['reading', 'culture']),
  M('B2', 'Podcast', 'Radio Ambulante', 'NPR', 'Long-form Latin American stories, with transcripts. Many episodes are set in Mexico.', 'Podcast apps / radioambulante.org', ['listening', 'reading']),
  M('B2', 'TV', 'La Casa de las Flores (2018–2020)', 'Manolo Caro, Netflix', 'A dark comedy about an upper-class Mexico City family. Witty, fast dialogue.', 'Netflix', ['listening']),
  M('C1', 'Book', 'Pedro Páramo', 'Juan Rulfo', 'A short, haunting novel that influenced García Márquez. Dense and poetic.', 'Bookshops', ['reading']),
  M('C1', 'Book', 'El laberinto de la soledad', 'Octavio Paz', "The Nobel laureate's classic essays on Mexican identity, fiesta and death.", 'Bookshops', ['reading', 'culture']),
  M('C1', 'Film', 'Y tu mamá también (2001)', 'Alfonso Cuarón', 'A road movie full of rapid slang and wordplay among young Mexicans. Adult content.', 'Streaming', ['listening']),
  M('C1', 'Podcast', 'Leyendas Legendarias', 'Mexican comedy podcast', 'A hugely popular Mexican comedy podcast about true crime and the paranormal. Fast, slangy and very funny.', 'Podcast apps', ['listening', 'culture']),
];

export default {
  id: 'es',
  name: 'Mexican Spanish',
  nativeName: 'Español de México',
  subtitle: 'Everyday Spanish as spoken in Mexico',
  symbol: 'ñ',
  dir: 'ltr',
  speech: 'es-MX',
  accent: '#c2185b',
  translateSkipEn: ['an'],
  categories, reading, scenarios, aptitude,
  dictionary: dictionary.map(([t, en]) => [t, '', en]),
  media,
};
