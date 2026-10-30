// Mexican Spanish expansion: B1–C1 lessons, regional Mexico and slang, more scenarios,
// a larger dictionary, free-writing and free-speaking prompts.
import { P, Q, C, T } from './helpers.mjs';

const S = (t, en, note) => P(t, '', en, note);
const step = (speaker, line, prompt, choices, mode) => {
  const s = {};
  if (speaker) s.speaker = speaker;
  if (line) s.line = line;
  if (prompt) s.prompt = prompt;
  if (choices) s.choices = choices;
  if (mode) s.mode = mode;
  return s;
};
const Rc = (t, en, correct, feedback) => C(t, '', en, correct, feedback);
const U = (en, correct, feedback) => C('', '', en, correct, feedback);

export const categories = [
  {
    id: 'es-health', title: 'Health & the Body', nativeTitle: 'Salud y cuerpo',
    icon: 'cross.case', emoji: '🩺',
    summary: 'Body parts, symptoms and health care in Mexico.',
    lessons: [
      {
        id: 'es-health-1', title: 'The Body & Feeling Unwell', level: 'A2',
        summary: 'Doler, tener and estar for symptoms.',
        grammar: {
          title: 'Doler, tener and estar for symptoms',
          body: [
            'Doler works like gustar: the body part is the subject. Me duele la cabeza (my head hurts), Me duelen los pies (my feet hurt).',
            "Use tener for many symptoms: tengo fiebre (I have a fever), tengo tos (a cough), tengo gripa (the flu or a bad cold; 'gripe' outside Mexico).",
            'Use estar for states: estoy enfermo/a (I am sick), estoy mareado/a (I am dizzy).',
          ],
          table: T(['English', 'Spanish'],
            ['My head hurts', 'Me duele la cabeza'], ['My feet hurt', 'Me duelen los pies'], ['I have a fever', 'Tengo fiebre'],
            ['I have the flu (MX)', 'Tengo gripa'], ["I'm dizzy", 'Estoy mareado / mareada'], ['I need a prescription', 'Necesito una receta']),
        },
        vocab: [
          S('la cabeza', 'head'), S('el estómago', 'stomach'), S('la espalda', 'back'), S('la muela', "molar ('dolor de muelas' = toothache)"),
          S('la gripa', 'flu / bad cold (MX)'), S('la tos', 'cough'), S('la receta', 'prescription'),
        ],
        examples: [
          S('Me duele el estómago desde anoche.', 'My stomach has hurt since last night.'),
          S('Tengo gripa y un poco de fiebre.', 'I have the flu and a bit of a fever.'),
          S('¡Que te mejores pronto!', 'Get well soon!', 'Que + subjunctive expresses a wish.'),
        ],
        culture: {
          title: 'Health care in Mexico',
          body: [
            'Public health care is provided mainly by IMSS (for private-sector workers) and ISSSTE (for government employees). Many people also see private doctors.',
            'Many pharmacies have a consultorio next door where a doctor sees patients quickly and cheaply.',
            "Home remedies are popular: té de manzanilla (chamomile tea) for an upset stomach, and Vick VapoRub ('vaporú') for almost everything.",
          ],
        },
        quiz: [
          Q("'My feet hurt':", ['Me duelen los pies', 'Me duele los pies', 'Yo duelo los pies', 'Tengo dolor pies']),
          Q("In Mexico, 'gripa' means…", ['the flu / a bad cold', 'a grip', 'a pill', 'a doctor']),
          Q("'¡Que te mejores!' means…", ['Get well soon!', 'Improve your Spanish!', "What's better?", 'Cheers!']),
          Q('A consultorio next to a pharmacy is…', ["a doctor's office", 'a dentist only', 'a gym', 'a bank']),
        ],
      },
    ],
  },
  {
    id: 'es-work', title: 'Work & Opinions', nativeTitle: 'Trabajo y opiniones',
    icon: 'briefcase', emoji: '💼',
    summary: 'The office, the present perfect, opinions and comparisons.',
    lessons: [
      {
        id: 'es-work-1', title: 'Work & the Office', level: 'B1',
        summary: 'Present perfect vs. preterite, Mexican style.',
        grammar: {
          title: 'Present perfect vs. preterite in Mexico',
          body: [
            'The present perfect is haber + participle (-ado / -ido): he trabajado, has comido. Irregular participles: hecho, dicho, visto, escrito, puesto, vuelto, abierto.',
            'Mexicans use it for experiences and situations that continue: He trabajado aquí tres años (and still do), ¿Has ido a Oaxaca? (ever).',
            'For finished actions, even today, Mexico prefers the preterite: ¿Ya comiste? (Spain: ¿Ya has comido?).',
          ],
          table: T(['', 'haber + participle'],
            ['yo', 'he trabajado'], ['tú', 'has trabajado'], ['él / ella / usted', 'ha trabajado'],
            ['nosotros', 'hemos trabajado'], ['ellos / ustedes', 'han trabajado']),
        },
        vocab: [
          S('la chamba', 'job / work (MX, informal)'), S('el puesto', 'position'), S('el jefe / la jefa', 'boss'),
          S('la junta', 'meeting (MX)'), S('el sueldo', 'salary'), S('las prestaciones', 'job benefits'), S('el aguinaldo', 'year-end bonus'),
        ],
        examples: [
          S('He trabajado en esta empresa desde 2020.', "I've worked at this company since 2020."),
          S('Tengo junta a las diez con mi jefa.', 'I have a meeting at ten with my boss.'),
          S('¿Ya mandaste el correo? — Sí, ya lo mandé.', 'Did you send the email yet? — Yes, I sent it.'),
        ],
        culture: {
          title: 'Office life',
          body: [
            "By law, employees in Mexico receive an aguinaldo (year-end bonus) of at least 15 days' pay, paid before December 20.",
            "Titles matter: colleagues often say 'Licenciado/a', 'Ingeniero/a' or 'Contador/a' instead of first names.",
            'Juntas (meetings) may start a little late and begin with friendly chat. Going straight to business can feel cold.',
          ],
        },
        quiz: [
          Q("'I have worked here for three years':", ['He trabajado aquí tres años', 'Trabajo aquí tres años ya pasado', 'Tengo trabajado aquí', 'Estoy trabajado aquí']),
          Q("In Mexico, a 'junta' is…", ['a meeting', 'a joint', 'a party', 'a contract']),
          Q('The aguinaldo is…', ['a year-end bonus', 'a tax', 'a holiday', 'a uniform']),
          Q("In Mexico, 'Have you eaten yet?' is usually…", ['¿Ya comiste?', '¿Ya has comido?', '¿Ya comes?', '¿Ya comerás?']),
        ],
      },
      {
        id: 'es-work-2', title: 'Opinions & Comparisons', level: 'B1',
        summary: 'Creo que vs. no creo que, and comparing things.',
        grammar: {
          title: 'Creo que vs. no creo que',
          body: [
            'Creo que, pienso que and me parece que + indicative state an opinion: Creo que tienes razón.',
            'Negative or doubtful opinions take the subjunctive: No creo que sea buena idea. Dudo que llegue a tiempo.',
            'Comparisons: más… que (more… than), menos… que (less… than), tan… como (as… as). Irregular: mejor (better), peor (worse), mayor (older), menor (younger).',
          ],
          table: T(['English', 'Spanish'],
            ["I think you're right", 'Creo que tienes razón'], ["I don't think it's a good idea", 'No creo que sea buena idea'],
            ['It seems to me that…', 'Me parece que…'], ['Mexico City is bigger than Monterrey', 'La CDMX es más grande que Monterrey'],
            ['Tacos are as good as tamales', 'Los tacos son tan buenos como los tamales'], ['This is the best', 'Este es el mejor']),
        },
        vocab: [
          S('creo que', 'I think that'), S('no creo que', "I don't think that (+ subjunctive)"), S('estoy de acuerdo', 'I agree'),
          S('no estoy de acuerdo', 'I disagree'), S('tienes razón', "you're right"), S('mejor / peor', 'better / worse'),
          S('fíjate que…', 'you know what… / the thing is…'),
        ],
        examples: [
          S('Me parece que el metro es más rápido que el camión.', 'It seems to me the Metro is faster than the bus.'),
          S('No creo que llueva hoy.', "I don't think it'll rain today."),
          S('Fíjate que no estoy de acuerdo.', "You know, I don't agree.", "'Fíjate que…' softens what comes next. Very Mexican."),
        ],
        culture: {
          title: 'Disagreeing, Mexican style',
          body: [
            "Open confrontation is usually avoided. People soften disagreement with 'Sí, pero…', 'Fíjate que…' or '¿No crees que…?'.",
            "A direct 'no' can feel rude, so you may hear 'lo veo difícil' (I see it as difficult) or 'a ver' (we'll see) instead.",
            'Among friends, though, passionate debates about soccer (Chivas vs. América!) are a national pastime.',
          ],
        },
        quiz: [
          Q("'I don't think it's true':", ['No creo que sea verdad', 'No creo que es verdad', 'No pienso es verdad', 'Creo no verdad']),
          Q("'Better' is…", ['mejor', 'más bueno', 'mayor', 'buenísimo']),
          Q("'Lo veo difícil' often means…", ['a polite no', 'a definite yes', "I can't see", "it's easy"]),
          Q("'As… as' is…", ['tan… como', 'más… que', 'menos… que', 'tanto que']),
        ],
      },
    ],
  },
  {
    id: 'es-story', title: 'Storytelling', nativeTitle: 'Contar historias',
    icon: 'book', emoji: '📜',
    summary: 'Imperfect vs. preterite, relative clauses and Mexican legends.',
    lessons: [
      {
        id: 'es-story-1', title: 'Telling Stories: Imperfect & Preterite', level: 'B1',
        summary: 'Set the scene, then move the story.',
        grammar: {
          title: 'Setting the scene vs. moving the story',
          body: [
            'The imperfect describes background, habits and descriptions: era, había, estaba, hacía frío.',
            'The preterite tells completed events that move the story forward: llegó, vio, dijo.',
            'Together: Estaba en casa cuando sonó el teléfono (I was at home when the phone rang).',
            'Imperfect endings: -ar → -aba, -abas, -aba, -ábamos, -aban; -er / -ir → -ía, -ías, -ía, -íamos, -ían. Only three verbs are irregular: ser (era), ir (iba), ver (veía).',
          ],
          table: T(['English', 'Spanish'],
            ['Once upon a time there was…', 'Había una vez…'], ['It was night', 'Era de noche'], ['It was cold', 'Hacía frío'],
            ['I was walking when…', 'Caminaba cuando…'], ['…I saw a light', '…vi una luz'], ['We used to go every summer', 'Íbamos cada verano']),
        },
        vocab: [
          S('había una vez', 'once upon a time'), S('de repente', 'suddenly'), S('mientras', 'while'), S('entonces', 'then / so'),
          S('al final', 'in the end'), S('la leyenda', 'legend'), S('asustar', 'to scare'),
        ],
        examples: [
          S('Cuando era niña, vivía en Puebla con mis abuelos.', 'When I was a girl, I lived in Puebla with my grandparents.'),
          S('Mientras cenábamos, de repente se fue la luz.', 'While we were having dinner, the power suddenly went out.'),
          S('Al final, todos se rieron.', 'In the end, everyone laughed.'),
        ],
        culture: {
          title: 'Legends of Mexico',
          body: [
            'La Llorona, the weeping woman searching for her children, is the most famous Mexican legend. Parents warn children that she wanders near rivers at night.',
            'In Guanajuato, the Callejón del Beso is an alley so narrow that, legend says, two lovers could kiss from opposite balconies.',
            'Corridos are narrative ballads that tell stories of heroes, revolutions and outlaws.',
          ],
        },
        quiz: [
          Q("Background: 'It was night when…'", ['Era de noche', 'Fue de noche', 'Es de noche', 'Será de noche']),
          Q('Estaba en casa cuando ___ el teléfono.', ['sonó', 'sonaba', 'suena', 'sonará'], 'A completed event interrupting the background → preterite.'),
          Q('Which verb is irregular in the imperfect?', ['ir (iba)', 'hablar', 'comer', 'vivir']),
          Q('La Llorona is…', ['a legend about a weeping woman', 'a Mexican dish', 'a type of song', 'a city']),
        ],
      },
      {
        id: 'es-story-2', title: 'Relative Clauses & Connectors', level: 'B2',
        summary: 'Que, quien, lo que, cuyo, and aunque.',
        grammar: {
          title: 'Linking ideas',
          body: [
            'Que is the all-purpose relative: la película que vimos (the film we saw).',
            'After prepositions use el / la que, los / las que or quien(es): la amiga con quien viajé, el edificio en el que trabajo.',
            "Lo que means 'what / the thing that': Lo que me gusta es… Cuyo / cuya (whose) agrees with the thing owned: el autor cuya novela leí.",
            'Aunque + indicative states a fact (although it is); aunque + subjunctive is hypothetical (even if): Aunque llueve, salgo / Aunque llueva, saldré.',
          ],
          table: T(['English', 'Spanish'],
            ['the film (that) we saw', 'la película que vimos'], ['the friend I traveled with', 'la amiga con quien viajé'],
            ['the building where I work', 'el edificio en el que trabajo'], ['what I like', 'lo que me gusta'],
            ['the author whose novel I read', 'el autor cuya novela leí'], ['even if it rains', 'aunque llueva']),
        },
        vocab: [
          S('lo que', 'what / the thing that'), S('cuyo / cuya', 'whose'), S('aunque', 'although / even if'),
          S('sin embargo', 'however'), S('por lo tanto', 'therefore'), S('en cambio', 'on the other hand'), S('o sea', 'I mean / that is'),
        ],
        examples: [
          S('Lo que más extraño de México es la comida.', 'What I miss most about Mexico is the food.'),
          S('Es un pueblo cuyas calles son de piedra.', 'It is a town whose streets are made of stone.'),
          S('Aunque esté cansado, voy a ir a la fiesta.', "Even if I'm tired, I'm going to go to the party."),
        ],
        culture: {
          title: 'Stories in song',
          body: [
            'Corridos grew popular as ballads of the Mexican Revolution (1910–1920), telling of figures like Pancho Villa.',
            "Today 'corridos tumbados', which mix regional Mexican music with trap and hip-hop, are among the most-streamed songs in the world.",
            "'O sea' is a classic filler, especially associated with the 'fresa' (posh) way of talking.",
          ],
        },
        quiz: [
          Q("'What I need is time':", ['Lo que necesito es tiempo', 'Que necesito es tiempo', 'El cual necesito tiempo', 'Cuyo necesito tiempo']),
          Q("'The woman whose son…':", ['la mujer cuyo hijo', 'la mujer que su hijo de', 'la mujer cuya hijo', 'la mujer quien hijo']),
          Q('Aunque ___ (llover), iré.', ['llueva', 'llueve', 'llovió', 'lloverá'], 'Hypothetical (even if) → subjunctive.'),
          Q("'Sin embargo' means…", ['however', 'therefore', 'although', 'meanwhile']),
        ],
      },
    ],
  },
  {
    id: 'es-news', title: 'News & Formal Spanish', nativeTitle: 'Noticias y español formal',
    icon: 'newspaper', emoji: '📰',
    summary: 'The passive, reported speech, and formal letters and procedures.',
    lessons: [
      {
        id: 'es-news-1', title: 'Reading the News', level: 'B2',
        summary: 'Passive voice, reported speech and attribution.',
        grammar: {
          title: 'Passive and reported speech',
          body: [
            'News often uses the passive with ser + participle: La ley fue aprobada (the law was passed), or the passive se: Se aprobó la ley.',
            "Reported speech shifts tenses: 'Hay crisis' → Dijo que había crisis; 'Llegaremos' → Dijeron que llegarían.",
            'Attribution: según (according to), de acuerdo con, informó, declaró, aseguró.',
          ],
          table: T(['Direct', 'Reported'],
            ['"Estoy cansado."', 'Dijo que estaba cansado.'], ['"Vamos a ganar."', 'Dijeron que iban a ganar.'],
            ['"Lo haré."', 'Dijo que lo haría.'], ['"Llegué tarde."', 'Dijo que había llegado tarde.']),
        },
        vocab: [
          S('el gobierno', 'government'), S('las elecciones', 'elections'), S('la Cámara de Diputados', 'Chamber of Deputies'),
          S('la encuesta', 'poll / survey'), S('según', 'according to'), S('aprobar', 'to approve / pass'), S('la reforma', 'reform'),
        ],
        examples: [
          S('La reforma fue aprobada por la Cámara de Diputados.', 'The reform was passed by the Chamber of Deputies.'),
          S('Según una encuesta, el 60% está a favor.', 'According to a poll, 60% are in favor.'),
          S('El secretario dijo que la economía crecería este año.', 'The minister said the economy would grow this year.', "In Mexico, government ministers are called 'secretarios'."),
        ],
        culture: {
          title: 'Mexican media',
          body: [
            'Major newspapers include El Universal, Reforma, La Jornada and Milenio, each with a different editorial line.',
            "Since 2018, the president has held near-daily morning press conferences known as 'las mañaneras'.",
            'Mexico has been one of the most dangerous countries in the world for journalists, which shapes how news is reported.',
          ],
        },
        quiz: [
          Q("'The law was passed':", ['La ley fue aprobada', 'La ley estuvo aprobada', 'La ley fue aprobado', 'La ley es aprobar']),
          Q("'Estoy cansada' → Dijo que ___ cansada.", ['estaba', 'está', 'estará', 'estuvo']),
          Q("'Según' means…", ['according to', 'despite', 'because', 'against']),
          Q("In Mexico, a 'secretario de Estado' is…", ['a government minister', 'a typist', 'a senator', 'a governor']),
        ],
      },
      {
        id: 'es-news-2', title: 'Formal Writing & Trámites', level: 'C1',
        summary: 'Formal letters, the subjunctive in requests, and bureaucracy.',
        grammar: {
          title: 'Register and formal connectors',
          body: [
            'Formal writing uses usted / ustedes, longer sentences and precise connectors: además (moreover), no obstante (nevertheless), por consiguiente (consequently), cabe señalar que (it should be noted that).',
            'Requests take the subjunctive: Le solicito que me envíe… (I request that you send me…), Le agradecería que… (I would be grateful if…).',
            'Letters open with Estimado/a señor/a… or A quien corresponda (to whom it may concern) and close with Atentamente or Quedo a sus órdenes.',
          ],
          table: T(['English', 'Spanish'],
            ['To whom it may concern', 'A quien corresponda'], ['By means of this letter…', 'Por medio de la presente…'],
            ['I request that you…', 'Le solicito que…'], ['I would be grateful if…', 'Le agradecería que…'],
            ['Nevertheless', 'No obstante'], ['Sincerely', 'Atentamente']),
        },
        vocab: [
          S('por medio de la presente', 'by means of this letter'), S('a quien corresponda', 'to whom it may concern'),
          S('no obstante', 'nevertheless'), S('por consiguiente', 'consequently'), S('cabe señalar que', 'it should be noted that'),
          S('el trámite', 'bureaucratic procedure'), S('atentamente', 'sincerely'),
        ],
        examples: [
          S('Por medio de la presente, le solicito una constancia de estudios.', 'By means of this letter, I request a certificate of enrollment.'),
          S('Le agradecería que me respondiera a la brevedad.', 'I would be grateful if you could reply as soon as possible.'),
          S('Sin otro particular, quedo a sus órdenes.', 'With nothing further, I remain at your service.'),
        ],
        culture: {
          title: 'Trámites',
          body: [
            'A trámite is any bureaucratic procedure, from renewing a passport to registering a business. Patience and photocopies are essential.',
            'The CURP (Clave Única de Registro de Población) is the personal ID code asked for in most official procedures.',
            "Formal Mexican letters are notably courteous: formulas like 'Sin otro particular' and 'Quedo a sus órdenes' are standard.",
          ],
        },
        quiz: [
          Q("'To whom it may concern':", ['A quien corresponda', 'Para quien sea', 'Hola a todos', 'Querido señor']),
          Q('Le solicito que me ___ (enviar) el documento.', ['envíe', 'envía', 'enviará', 'enviaba']),
          Q("'No obstante' means…", ['nevertheless', 'therefore', 'moreover', 'for example']),
          Q("A 'trámite' is…", ['a bureaucratic procedure', 'a tram', 'a tax refund', 'a lawyer']),
        ],
      },
    ],
  },
  {
    id: 'es-reg', title: 'Regional Mexico & Slang', nativeTitle: 'Variantes y caló',
    icon: 'map', emoji: '🗺️',
    summary: 'How Spanish changes across Mexico, and when slang is (and isn\'t) OK.',
    lessons: [
      {
        id: 'es-reg-1', title: 'Words Across the Country', level: 'B1',
        summary: 'Chilango, norteño and yucateco Spanish.',
        grammar: {
          title: 'Same country, different words',
          body: [
            'Mexican Spanish varies by region in accent and vocabulary, but everyone understands standard Mexican Spanish from school and TV.',
            "Northern speech (norteño) has a strong, open rhythm and words like 'plebe' (kids / the gang) and 'morro / morra' (boy / girl).",
            "In Yucatán, Maya influence shows in words like 'huach' (a Mexican from outside the peninsula). At jarana dances someone shouts '¡Bomba!' before a funny rhyming verse.",
            "In Mexico City, chilango speech has a sing-song intonation and favorites like 'güey', 'chido' and '¿qué onda?'.",
          ],
          table: T(['Region', 'Word', 'Meaning'],
            ['CDMX', 'chido', 'cool'], ['CDMX', '¿qué onda?', "what's up?"], ['North', 'plebe', 'kids / the gang'],
            ['North', 'morro / morra', 'boy / girl (informal)'], ['Yucatán', 'huach', 'outsider from central Mexico'],
            ['Jalisco', 'tapatío / tapatía', 'from Guadalajara']),
        },
        vocab: [
          S('chilango / chilanga', 'person from Mexico City'), S('tapatío / tapatía', 'person from Guadalajara'),
          S('regio / regia', 'person from Monterrey'), S('plebe', 'kids / the gang (north)'), S('morro / morra', 'boy / girl (informal)'),
          S('huach', 'outsider (Yucatán)'), S('ándale', "come on / that's it"),
        ],
        examples: [
          S('Mi amigo es regio y le encanta la carne asada.', 'My friend is from Monterrey and loves carne asada.'),
          S('¡Ándale, plebe, vámonos!', "Come on, guys, let's go!", 'Northern flavor.'),
          S('En Mérida me dicen huach porque soy de la capital.', "In Mérida they call me 'huach' because I'm from the capital."),
        ],
        culture: {
          title: 'Food and identity',
          body: [
            'Regional pride runs deep and often centers on food: carne asada in the north, birria in Jalisco, cochinita pibil in Yucatán, mole in Puebla and Oaxaca.',
            "Chilango humor and Monterrey's business culture are favorite subjects of friendly rivalry.",
            'Indigenous languages, including Maya in Yucatán and Zapotec and Mixtec in Oaxaca, are spoken alongside Spanish in many regions.',
          ],
        },
        quiz: [
          Q("A 'regio' is from…", ['Monterrey', 'Mexico City', 'Guadalajara', 'Mérida']),
          Q("In the north, 'morra' means…", ['girl', 'money', 'mountain', 'beer']),
          Q('Which food is iconic in the north?', ['carne asada', 'cochinita pibil', 'mole poblano', 'tlayudas']),
          Q("In Yucatán, a 'huach' is…", ['an outsider from central Mexico', 'a hat', 'a dance', 'a fish']),
        ],
      },
      {
        id: 'es-reg-2', title: 'Slang & Register', level: 'B2',
        summary: 'Everyday slang, vulgar words to recognize, and when to switch.',
        grammar: {
          title: 'Knowing when to use slang',
          body: [
            "Slang depends on who you're with. A useful rule: if you'd use usted with someone, avoid slang with them.",
            "Some very common words are vulgar: 'no mames' (no way!), '¿qué pedo?' (what's up?) and 'pinche' (damn) are fine among close friends but rude elsewhere.",
            "Softer alternatives: 'no manches' instead of 'no mames', '¿qué onda?' instead of '¿qué pedo?'.",
          ],
          table: T(['Word', 'Meaning', 'Register'],
            ['chido', 'cool', 'informal, OK'], ['chafa', 'lame / low-quality', 'informal, OK'], ['un chorro', 'a lot', 'informal, OK'],
            ['no manches', 'no way!', 'informal, OK'], ['no mames', 'no way!', 'vulgar'], ['naco', 'tacky', 'offensive (classist)']),
        },
        vocab: [
          S('chafa', 'lame / low-quality'), S('un chorro', 'a lot'), S('neta', 'truth / for real'), S('¡aguas!', 'watch out!'),
          S('hacer la pinta', 'to skip school'), S('buena onda', 'nice / cool (person)'), S('de volada', 'right away / quickly'),
        ],
        examples: [
          S('Ese celular está bien chafa.', 'That phone is really poor quality.'),
          S('Hay un chorro de tráfico, ¡aguas!', "There's a ton of traffic, watch out!"),
          S('Ahorita lo hago, de volada.', "I'll do it right away."),
        ],
        culture: {
          title: 'Respect and register',
          body: [
            'Using slang well can make you sound warm and local; using it in the wrong place can sound disrespectful.',
            "Words like 'naco' (tacky) and 'indio' used as insults carry classism and racism. Avoid them.",
            'With elders, officials and in business, Mexicans switch to polished, courteous Spanish, and so should you.',
          ],
        },
        quiz: [
          Q("'Un chorro' means…", ['a lot', 'a little', 'a jet of water only', 'a dog']),
          Q("The polite alternative to 'no mames' is…", ['no manches', 'no mames, güey', '¿qué pedo?', 'pinche']),
          Q("'Chafa' means…", ['low-quality', 'expensive', 'delicious', 'fast']),
          Q("'De volada' means…", ['right away', 'flying', 'on vacation', 'slowly']),
        ],
      },
    ],
  },
];

export const scenarios = [
  {
    id: 'es-sc-doctor', title: "At the Doctor's Office", level: 'B1', emoji: '🩺', icon: 'stethoscope',
    setting: 'A consultorio next to a pharmacy in Puebla. You have had a sore throat for three days.', goal: 'Describe your symptoms, understand the treatment and ask about work.',
    steps: [
      step('Doctor', S('Buenas tardes. ¿Qué le pasa?', "Good afternoon. What's wrong?"), "Say you've had a sore throat and a fever for three days.", [
        Rc('Tengo dolor de garganta y fiebre desde hace tres días.', "I've had a sore throat and fever for three days.", true, "'Desde hace' + time = for (and still)."),
        Rc('Estoy garganta tres días.', 'I am throat three days.', false, "Use 'tengo dolor de garganta'."),
        Rc('Me duelo la fiebre.', 'I hurt myself the fever.', false, "Fevers don't hurt; you 'have' them: tengo fiebre."),
      ]),
      step('Doctor', S('¿Ha tomado algún medicamento?', 'Have you taken any medicine?'), 'Answer her.', [
        Rc('Sí, he tomado paracetamol, pero no me ha ayudado.', "Yes, I've taken paracetamol, but it hasn't helped.", true, 'Present perfect for a recent experience.'),
        Rc('No, no he tomado nada.', "No, I haven't taken anything.", true, 'Double negative: correct in Spanish.'),
        Rc('Tomaré mañana el metro.', "I'll take the Metro tomorrow.", false, 'Tomar is to take, but not the Metro here!'),
      ]),
      step('Doctor', S('Le voy a recetar un antibiótico. Tómelo cada ocho horas durante siete días y no lo deje aunque se sienta mejor.', "I'm going to prescribe an antibiotic. Take it every eight hours for seven days, and don't stop even if you feel better."), 'What should you do?', [
        U('Take it every 8 hours for 7 days, even if you feel better', true, "'Aunque se sienta mejor' = even if you feel better (subjunctive)."),
        U('Take it once and stop when you feel better', false, "She said don't stop."),
        U("Don't take anything for a week", false, "She's prescribing an antibiotic."),
      ], 'understand'),
      step(null, null, 'Ask if you can go to work tomorrow.', [
        Rc('¿Puedo ir a trabajar mañana?', 'Can I go to work tomorrow?', true, 'Clear and correct.'),
        Rc('¿Puedo trabajar el doctor?', 'Can I work the doctor?', false, 'Mixed up!'),
        Rc('¿Fui a trabajar?', 'Did I go to work?', false, "That's the past."),
      ]),
      step('Doctor', S('Mejor descanse dos días. Le doy una incapacidad.', "You'd better rest for two days. I'll give you a sick note.", "An 'incapacidad' is an official sick-leave certificate."), 'What did she say?', [
        U('Rest for two days; you get a sick-leave note', true, 'Incapacidad = sick leave, not incapacity forever!'),
        U("You're unable to work forever", false, "It's just two days."),
        U('Go to work tomorrow', false, 'She said to rest.'),
      ], 'understand'),
    ],
  },
  {
    id: 'es-sc-rent', title: 'Renting an Apartment', level: 'B1', emoji: '🏢', icon: 'building.2',
    setting: 'You visit an apartment for rent in Guadalajara.', goal: 'Ask about rent, requirements and services, and arrange a visit.',
    steps: [
      step('Owner', S('Buenas, ¿viene por el depa?', 'Hi, are you here about the apartment?', "'Depa' = departamento (apartment) in Mexico."), 'Say yes and ask about the rent.', [
        Rc('Sí, buenas tardes. ¿Cuánto es la renta al mes?', 'Yes, good afternoon. How much is the monthly rent?', true, 'Renta = rent in Mexico.'),
        Rc('Sí, yo soy el depa.', 'Yes, I am the apartment.', false, 'Careful with ser!'),
        Rc('¿Dónde está la renta?', 'Where is the rent?', false, 'Ask how much it is.'),
      ]),
      step('Owner', S('Son doce mil al mes, más un mes de depósito, y necesito un aval o una póliza jurídica.', "It's twelve thousand a month, plus a month's deposit, and I need a guarantor or a rental guarantee policy."), 'What are the conditions?', [
        U("12,000 a month + one month's deposit + a guarantor or rental policy", true, "An 'aval' (guarantor, often a property owner) is a common requirement in Mexico."),
        U('1,200 a year with no deposit', false, 'Doce mil = 12,000, al mes = per month.'),
        U('A 12,000 deposit only', false, 'There is monthly rent too.'),
      ], 'understand'),
      step(null, null, 'Ask whether utilities are included.', [
        Rc('¿Los servicios están incluidos? ¿La luz, el agua, el gas?', 'Are utilities included? Electricity, water, gas?', true, "In Mexico, 'la luz' = the electricity bill."),
        Rc('¿Los servicios son incluir?', 'Are the services to include?', false, 'Use estar + incluidos.'),
        Rc('¿Hay servicio de taxis?', 'Is there a taxi service?', false, 'Wrong services!'),
      ]),
      step('Owner', S('El agua sí está incluida; la luz y el gas no.', 'Water is included; electricity and gas are not.'), 'Ask to see it this weekend.', [
        Rc('¿Podría verlo este fin de semana?', 'Could I see it this weekend?', true, 'The conditional sounds polite.'),
        Rc('¿Lo vi el fin de semana?', 'Did I see it on the weekend?', false, "That's the past."),
        Rc('Quiero verte siempre.', 'I want to see you always.', false, 'Very romantic, but no!'),
      ]),
    ],
  },
  {
    id: 'es-sc-debate', title: 'A Debate at the Office', level: 'B2', emoji: '🗣️', icon: 'person.3',
    setting: 'A team meeting in Mexico City about working from home.', goal: 'Agree, propose a compromise with the subjunctive, and close politely.',
    steps: [
      step('Colleague', S('Creo que deberíamos trabajar desde casa todos los viernes.', 'I think we should work from home every Friday.'), 'Agree and give a reason.', [
        Rc('Estoy de acuerdo, porque así ahorraríamos tiempo de traslado.', 'I agree, because that way we would save commuting time.', true, 'Conditional for a hypothetical benefit.'),
        Rc('Estoy acuerdo con el viernes.', 'I am agreement with Friday.', false, "It's 'estoy de acuerdo'."),
        Rc('¡Qué pedo!', "What the heck!", false, 'Vulgar slang in a meeting? No!'),
      ]),
      step('Boss', S('No creo que sea buena idea; los clientes nos buscan los viernes.', "I don't think it's a good idea; clients look for us on Fridays."), 'Propose a compromise.', [
        Rc('Propongo que la mitad del equipo venga a la oficina los viernes.', 'I propose that half the team come to the office on Fridays.', true, 'Proponer que + subjunctive (venga).'),
        Rc('Propongo que la mitad viene.', 'I propose that half comes.', false, 'Proponer que needs the subjunctive: venga.'),
        Rc('No, usted está mal.', "No, you're wrong.", false, 'Too blunt with the boss.'),
      ]),
      step('Boss', S('Me parece razonable, siempre y cuando no afecte la atención al cliente.', "That seems reasonable, as long as it doesn't affect customer service."), 'What did the boss say?', [
        U("It's reasonable, as long as customer service isn't affected", true, "'Siempre y cuando' + subjunctive = as long as."),
        U('The idea is completely rejected', false, "'Me parece razonable' = it seems reasonable."),
        U('Everyone can work from home every day', false, 'Only the compromise was accepted.'),
      ], 'understand'),
      step(null, null, 'Close the discussion politely.', [
        Rc('Perfecto, entonces lo probamos un mes y vemos cómo nos va.', "Great, then we'll try it for a month and see how it goes.", true, 'Positive and practical.'),
        Rc('Ya me voy.', "I'm leaving now.", false, 'A bit abrupt.'),
        Rc('Ni modo, adiós.', 'Oh well, bye.', false, 'Sounds like you lost the argument!'),
      ]),
    ],
  },
  {
    id: 'es-sc-customer', title: 'Calling Customer Service', level: 'B2', emoji: '📞', icon: 'phone',
    setting: 'You call your bank because a payment was charged twice.', goal: 'Explain the problem, give your details and get a reference number.',
    steps: [
      step('Agent', S('Gracias por llamar. ¿En qué le puedo ayudar?', 'Thank you for calling. How can I help you?'), 'Explain you were charged twice.', [
        Rc('Me cobraron dos veces el mismo pago y quisiera un reembolso.', 'I was charged twice for the same payment and I would like a refund.', true, 'Impersonal "me cobraron" = I was charged.'),
        Rc('Me cobro dos veces yo.', 'I charge myself twice.', false, 'Use "me cobraron" (they charged me).'),
        Rc('Quiero dos pagos más.', 'I want two more payments.', false, 'The opposite!'),
      ]),
      step('Agent', S('¿Me podría proporcionar su número de cliente?', 'Could you give me your customer number?'), 'Give it.', [
        Rc('Claro, es el cuatro, cinco, ocho, dos, uno, nueve.', "Sure, it's four, five, eight, two, one, nine.", true, 'Read numbers digit by digit on the phone.'),
        Rc('No tengo números.', "I don't have numbers.", false, 'Find your card!'),
        Rc('¿Cuánto cuesta el número?', 'How much does the number cost?', false, 'Not what she asked.'),
      ]),
      step('Agent', S('Ya vi el cargo duplicado. El reembolso se verá reflejado en un plazo de cinco a siete días hábiles.', 'I can see the duplicate charge. The refund will appear within five to seven business days.'), 'When will you get the money back?', [
        U('Within 5 to 7 business days', true, "'Días hábiles' = business days."),
        U('No refund is possible', false, 'She found the duplicate charge.'),
        U('In 57 days', false, 'Cinco a siete = five to seven.'),
      ], 'understand'),
      step(null, null, 'Ask for a reference number.', [
        Rc('¿Me podría dar un número de folio, por favor?', 'Could you give me a reference number, please?', true, "In Mexico a 'folio' is a reference or ticket number."),
        Rc('¿Cuál es su número de celular personal?', "What's your personal cell number?", false, 'Not appropriate!'),
        Rc('Dame el folio ya.', 'Give me the folio now.', false, 'Too rude for the phone.'),
      ]),
      step(null, null, 'Thank her and end the call.', [
        Rc('Muchas gracias por su ayuda, que tenga buen día.', 'Thank you very much for your help, have a good day.', true, 'Que tenga + subjunctive: a polite wish.'),
        Rc('Bye.', 'Bye.', false, 'Too casual for a formal call.'),
        Rc('Cuelgue usted primero.', 'You hang up first.', false, 'A strange thing to say!'),
      ]),
    ],
  },
];

// [Spanish, English]
export const dictionary = [
  // body & health
  ['cuerpo', 'body'], ['cara', 'face'], ['ojo', 'eye'], ['oreja', 'ear'], ['nariz', 'nose'], ['boca', 'mouth'], ['diente', 'tooth'],
  ['muela', 'molar; tooth'], ['mano', 'hand'], ['brazo', 'arm'], ['pierna', 'leg'], ['pie', 'foot'], ['espalda', 'back'],
  ['estómago', 'stomach'], ['corazón', 'heart'], ['garganta', 'throat'], ['sangre', 'blood'], ['fiebre', 'fever'], ['tos', 'cough'],
  ['gripa', 'flu; bad cold (MX)'], ['receta', 'prescription; recipe'], ['pastilla', 'pill'], ['enfermera', 'nurse'],
  ['consultorio', "doctor's office"], ['dentista', 'dentist'], ['me duele', 'it hurts; my … hurts'],
  // work
  ['empresa', 'company'], ['puesto', 'position; job'], ['jefe', 'boss'], ['jefa', 'boss (f)'], ['compañero', 'colleague; classmate'],
  ['sueldo', 'salary'], ['junta', 'meeting (MX)'], ['entrevista', 'interview'], ['prestaciones', 'job benefits'],
  ['aguinaldo', 'year-end bonus'], ['contrato', 'contract'], ['proyecto', 'project'], ['correo', 'email; mail'],
  ['computadora', 'computer (MX)'], ['ingeniero', 'engineer'], ['abogado', 'lawyer'], ['contador', 'accountant'],
  ['licenciado', 'university graduate (title)'], ['vendedor', 'seller; salesperson'],
  // opinions & feelings
  ['opinión', 'opinion'], ['creer', 'to believe; to think'], ['pensar', 'to think'], ['parecer', 'to seem'], ['creo que', 'I think that'],
  ['estoy de acuerdo', 'I agree'], ['enojado', 'angry (MX)'], ['preocupado', 'worried'], ['emocionado', 'excited'],
  ['orgulloso', 'proud'], ['aburrido', 'bored; boring'], ['asustado', 'scared'], ['nervioso', 'nervous'], ['contento', 'happy; content'],
  ['importante', 'important'], ['posible', 'possible'], ['imposible', 'impossible'], ['verdad', 'truth; true'], ['mentira', 'lie'],
  ['error', 'mistake; error'], ['razón', 'reason'], ['tener razón', 'to be right'], ['mejor', 'better; best'], ['peor', 'worse; worst'],
  // nature & weather
  ['lluvia', 'rain'], ['llover', 'to rain'], ['nieve', 'snow'], ['viento', 'wind'], ['nube', 'cloud'], ['cielo', 'sky'], ['árbol', 'tree'],
  ['río', 'river'], ['flor', 'flower'], ['animal', 'animal'], ['gato', 'cat'], ['perro', 'dog'], ['caballo', 'horse'], ['pájaro', 'bird'],
  ['serpiente', 'snake'], ['víbora', 'snake; viper (MX)'], ['verano', 'summer'], ['invierno', 'winter'], ['primavera', 'spring (season)'],
  ['otoño', 'fall; autumn'], ['calor', 'heat'], ['hace calor', "it's hot"], ['hace frío', "it's cold"],
  // home, clothes, colors
  ['cocina', 'kitchen'], ['cama', 'bed'], ['silla', 'chair'], ['mesa', 'table'], ['llave', 'key'], ['ropa', 'clothes'], ['camisa', 'shirt'],
  ['playera', 'T-shirt (MX)'], ['zapatos', 'shoes'], ['rojo', 'red'], ['azul', 'blue'], ['verde', 'green'], ['amarillo', 'yellow'],
  ['blanco', 'white'], ['negro', 'black'], ['color', 'color'], ['departamento', 'apartment (MX)'], ['depa', 'apartment (MX, informal)'],
  ['renta', 'rent (MX)'],
  // verbs
  ['decir', 'to say; to tell'], ['preguntar', 'to ask'], ['contestar', 'to answer'], ['recordar', 'to remember'], ['olvidar', 'to forget'],
  ['empezar', 'to begin; to start'], ['terminar', 'to finish'], ['sentarse', 'to sit down'], ['pararse', 'to stand up (MX)'],
  ['lavar', 'to wash'], ['dar', 'to give'], ['poner', 'to put'], ['traer', 'to bring'], ['llevar', 'to take; to carry'], ['enviar', 'to send'],
  ['mandar', 'to send (MX)'], ['reír', 'to laugh'], ['llorar', 'to cry'], ['ganar', 'to win; to earn'], ['perder', 'to lose'],
  ['aprender', 'to learn'], ['enseñar', 'to teach; to show'], ['usar', 'to use'], ['cambiar', 'to change'], ['vender', 'to sell'],
  ['elegir', 'to choose'], ['sentir', 'to feel'], ['extrañar', 'to miss (someone)'],
  // news & society
  ['gobierno', 'government'], ['presidente', 'president'], ['presidenta', 'president (f)'], ['secretario', 'minister (MX); secretary'],
  ['elecciones', 'elections'], ['economía', 'economy'], ['política', 'politics; policy'], ['guerra', 'war'], ['paz', 'peace'],
  ['problema', 'problem'], ['solución', 'solution'], ['noticia', 'news item'], ['noticias', 'news'], ['periódico', 'newspaper'],
  ['encuesta', 'poll; survey'], ['ley', 'law'], ['reforma', 'reform'], ['sociedad', 'society'], ['historia', 'history; story'],
  ['cultura', 'culture'], ['educación', 'education'], ['medio ambiente', 'environment'], ['tecnología', 'technology'],
  ['internet', 'internet'], ['según', 'according to'],
  // connectors & time
  ['porque', 'because'], ['si', 'if'], ['aunque', 'although; even if'], ['sin embargo', 'however'], ['entonces', 'then; so'],
  ['después', 'after; later'], ['antes', 'before'], ['luego', 'later; then'], ['siempre', 'always'], ['nunca', 'never'],
  ['a veces', 'sometimes'], ['tal vez', 'maybe'], ['quizás', 'maybe; perhaps'], ['ya', 'already; now'], ['todavía', 'still; yet'],
  ['mientras', 'while'], ['además', 'besides; moreover'], ['por eso', "that's why"], ['de repente', 'suddenly'],
  ['pasado mañana', 'the day after tomorrow'], ['la semana que entra', 'next week (MX)'], ['el año pasado', 'last year'],
  ['anoche', 'last night'], ['temprano', 'early'],
  // slang & regional
  ['chafa', 'lame; low-quality (MX)'], ['un chorro', 'a lot (MX)'], ['de volada', 'right away (MX)'], ['ándale', "come on; that's it (MX)"],
  ['órale', 'wow; OK; come on (MX)'], ['chela', 'beer (MX slang)'], ['chamaco', 'kid (MX)'], ['morro', 'boy; young guy (MX)'],
  ['morra', 'girl; young woman (MX)'], ['plebe', 'kids; the gang (northern MX)'], ['regio', 'person from Monterrey'],
  ['chilango', 'person from Mexico City'], ['tapatío', 'person from Guadalajara'], ['buena onda', 'nice; cool (person)'],
  ['¿te late?', 'are you in? (MX)'], ['sale', 'OK; deal (MX)'], ['ni modo', 'oh well (MX)'], ['¡que te mejores!', 'get well soon!'],
];

const R = (label, any) => ({ label, any });

export const writingPrompts = [
  {
    id: 'es-w-intro', level: 'A1', prompt: 'Introduce yourself: your name, where you are from, and what you do.', minWords: 10,
    requirements: [R('your name (me llamo…)', ['me llamo', 'mi nombre es']), R('where you are from or live (soy de…, vivo en…)', ['soy de', 'vivo en']), R('what you do (trabajo, estudio…)', ['trabajo', 'estudio', 'soy estudiante', 'soy maestro', 'soy maestra'])],
    model: S('Me llamo Sam. Soy de Canadá, pero vivo en Guadalajara. Estudio español y trabajo en una cafetería.', "My name is Sam. I'm from Canada, but I live in Guadalajara. I study Spanish and work in a café."),
  },
  {
    id: 'es-w-family', level: 'A1', prompt: 'Describe your family: who is in it and one thing about each person.', minWords: 15,
    requirements: [R('family members (mi mamá, mi hermano…)', ['mi mamá', 'mi papá', 'mi hermano', 'mi hermana', 'mis papás', 'mi familia', 'mi esposo', 'mi esposa', 'mis hijos', 'mi hijo', 'mi hija']), R('tengo or se llama', ['tengo', 'se llama']), R('a describing word (alto, simpática…)', ['alto', 'alta', 'bajo', 'baja', 'simpático', 'simpática', 'bonito', 'bonita', 'chistoso', 'chistosa', 'trabajador', 'trabajadora', 'grande', 'pequeño', 'pequeña'])],
    model: S('Mi familia es pequeña. Mi mamá se llama Rosa y es muy trabajadora. Tengo un hermano; es alto y chistoso.', 'My family is small. My mom is called Rosa and she is very hard-working. I have a brother; he is tall and funny.'),
  },
  {
    id: 'es-w-day', level: 'A2', prompt: 'Describe your daily routine from morning to night.', minWords: 20,
    requirements: [R('reflexive verbs (me levanto, me baño…)', ['me levanto', 'me baño', 'me despierto', 'me visto', 'me acuesto', 'me lavo']), R('times (a las…, en la mañana…)', ['a las', 'a la una', 'en la mañana', 'en la tarde', 'en la noche']), R('sequence words (luego, después…)', ['luego', 'después', 'primero', 'entonces', 'más tarde'])],
    model: S('Me levanto a las seis y me baño. Luego desayuno chilaquiles y tomo el metro. En la tarde trabajo y en la noche me acuesto temprano.', 'I get up at six and shower. Then I have chilaquiles for breakfast and take the Metro. In the afternoon I work and at night I go to bed early.'),
  },
  {
    id: 'es-w-past', level: 'A2', prompt: 'Write about what you did last weekend.', minWords: 20,
    requirements: [R('preterite verbs (fui, comí, vi…)', ['fui', 'comí', 'visité', 'vi', 'hice', 'salí', 'jugué', 'estuve', 'compré']), R('a time expression (el sábado, ayer…)', ['el fin de semana', 'el sábado', 'el domingo', 'ayer', 'la semana pasada']), R('how it was (estuvo…, me gustó…)', ['estuvo', 'fue', 'me gustó', 'me encantó'])],
    model: S('El sábado fui a Coyoacán con mis amigos. Comimos tacos y vimos una exposición en la Casa Azul. Me encantó; estuvo bien padre.', 'On Saturday I went to Coyoacán with my friends. We ate tacos and saw an exhibition at the Blue House. I loved it; it was really cool.'),
  },
  {
    id: 'es-w-opinion', level: 'B1', prompt: 'City or small town: where is it better to live? Give your opinion, compare, and give reasons.', minWords: 35,
    requirements: [R('an opinion (creo que, me parece que…)', ['creo que', 'pienso que', 'me parece que', 'en mi opinión']), R('a comparison (más, menos, mejor…)', ['más', 'menos', 'mejor', 'peor', 'tan']), R('a reason (porque, por eso…)', ['porque', 'por eso', 'ya que'])],
    model: S('Creo que vivir en un pueblo es mejor que vivir en la ciudad, porque la vida es más tranquila y la gente se conoce. Sin embargo, en la ciudad hay más trabajo, por eso muchos jóvenes se van.', 'I think living in a small town is better than living in the city, because life is calmer and people know each other. However, there is more work in the city, so many young people leave.'),
  },
  {
    id: 'es-w-story', level: 'B1', prompt: 'Tell a short story or legend in the past.', minWords: 40,
    requirements: [R('imperfect for background (era, había, estaba…)', ['era', 'había', 'estaba', 'vivía', 'tenía', 'hacía']), R('events (de repente, un día, entonces…)', ['de repente', 'un día', 'entonces']), R('an ending (al final, por fin…)', ['al final', 'por fin', 'finalmente'])],
    model: S('Era una noche de lluvia y yo estaba sola en casa. De repente escuché a una mujer que lloraba cerca del río. Entonces salí con una lámpara, pero no había nadie. Al final, mi abuela me dijo que era La Llorona.', 'It was a rainy night and I was home alone. Suddenly I heard a woman crying near the river. So I went out with a lamp, but there was no one there. In the end, my grandmother told me it was La Llorona.'),
  },
  {
    id: 'es-w-email', level: 'B2', prompt: 'Write a formal email to a language school asking about a Spanish course.', minWords: 25,
    requirements: [R('a formal opening (Estimado/a…, A quien corresponda)', ['estimado', 'estimada', 'a quien corresponda', 'buenos días']), R('a polite request (le agradecería, quisiera…)', ['le agradecería', 'quisiera', 'me gustaría', 'podría']), R('a formal closing (atentamente…)', ['atentamente', 'saludos cordiales', 'quedo a sus órdenes', 'gracias de antemano'])],
    model: S('Estimada coordinadora: Me gustaría recibir información sobre el curso intensivo de español. ¿Podría indicarme los horarios y el costo? Le agradecería mucho su respuesta. Atentamente, Sam', 'Dear coordinator: I would like to receive information about the intensive Spanish course. Could you tell me the schedule and the cost? I would greatly appreciate your reply. Sincerely, Sam'),
  },
  {
    id: 'es-w-debate', level: 'C1', prompt: 'Argue for or against a four-day work week. Use the subjunctive, connectors and a conclusion.', minWords: 55,
    requirements: [R('subjunctive triggers (no creo que, es importante que…)', ['no creo que', 'es importante que', 'es necesario que', 'ojalá', 'aunque', 'para que']), R('connectors (sin embargo, además, por lo tanto…)', ['sin embargo', 'no obstante', 'además', 'por lo tanto', 'por consiguiente']), R('a conclusion (en conclusión, en resumen…)', ['en conclusión', 'en resumen', 'para concluir'])],
    model: S('La semana laboral de cuatro días tiene ventajas claras. Además de mejorar la salud mental, aumenta la productividad en muchas empresas. Sin embargo, no creo que funcione en todos los sectores, por ejemplo en los hospitales. Por lo tanto, es importante que cada empresa evalúe su caso. En conclusión, es una buena idea, siempre y cuando se aplique con flexibilidad.', 'The four-day work week has clear advantages. As well as improving mental health, it increases productivity at many companies. However, I don\'t think it works in every sector, for example in hospitals. Therefore, it is important that each company evaluates its own case. In conclusion, it is a good idea as long as it is applied flexibly.'),
  },
];

export const speakingPrompts = [
  {
    id: 'es-s-intro', level: 'A1', prompt: 'Introduce yourself out loud: your name and where you are from.', starter: 'Me llamo… Soy de…', minWords: 5,
    requirements: [R('your name (me llamo…)', ['me llamo', 'mi nombre es', 'soy']), R('where you are from (soy de…, vivo en…)', ['soy de', 'vivo en'])],
    model: S('Hola, me llamo Sam y soy de Canadá.', "Hi, my name is Sam and I'm from Canada."),
  },
  {
    id: 'es-s-order', level: 'A1', prompt: 'Order at a taquería.', starter: 'Me da… por favor', minWords: 5,
    requirements: [R('a polite order (me da, quisiera…)', ['me da', 'quisiera', 'quiero']), R('please (por favor)', ['por favor']), R('something to eat or drink', ['tacos', 'agua', 'refresco', 'quesadilla', 'torta', 'horchata'])],
    model: S('Me da tres tacos al pastor y un agua de horchata, por favor.', 'Can I have three al pastor tacos and a horchata, please.'),
  },
  {
    id: 'es-s-day', level: 'A2', prompt: 'Describe what you do every day.', starter: 'Todos los días…', minWords: 10,
    requirements: [R('daily actions (me levanto, trabajo…)', ['me levanto', 'me baño', 'desayuno', 'trabajo', 'estudio', 'como']), R('time expressions (todos los días, a las…)', ['todos los días', 'en la mañana', 'en la tarde', 'a las'])],
    model: S('Todos los días me levanto a las siete, desayuno y trabajo hasta las cinco.', 'Every day I get up at seven, have breakfast and work until five.'),
  },
  {
    id: 'es-s-weekend', level: 'A2', prompt: 'What did you do last weekend?', starter: 'El fin de semana…', minWords: 10,
    requirements: [R('preterite verbs (fui, comí, vi…)', ['fui', 'comí', 'vi', 'visité', 'salí', 'jugué']), R('when (el sábado, ayer…)', ['el fin de semana', 'el sábado', 'el domingo', 'ayer'])],
    model: S('El fin de semana fui al mercado y comí unas quesadillas buenísimas.', 'On the weekend I went to the market and ate some amazing quesadillas.'),
  },
  {
    id: 'es-s-opinion', level: 'B1', prompt: 'Which do you prefer, the beach or the mountains? Why?', starter: 'Creo que…', minWords: 15,
    requirements: [R('an opinion (creo que, prefiero…)', ['creo que', 'pienso que', 'me parece que', 'prefiero']), R('a comparison (más, mejor…)', ['más', 'mejor', 'menos']), R('a reason (porque)', ['porque'])],
    model: S('Prefiero la playa porque me gusta nadar y creo que es más relajante que la montaña.', 'I prefer the beach because I like swimming, and I think it is more relaxing than the mountains.'),
  },
  {
    id: 'es-s-plans', level: 'B1', prompt: 'Talk about your plans for next year.', starter: 'El próximo año voy a…', minWords: 15,
    requirements: [R('future or wishes (voy a, me gustaría, ojalá…)', ['voy a', 'vamos a', 'me gustaría', 'quiero', 'ojalá']), R('a future time (el próximo año…)', ['el próximo año', 'el año que entra', 'en el futuro', 'este verano'])],
    model: S('El próximo año voy a viajar a Oaxaca y me gustaría hablar español con fluidez.', 'Next year I am going to travel to Oaxaca and I would like to speak Spanish fluently.'),
  },
];

export const levelHours = { A1: 90, A2: 190, B1: 375, B2: 550, C1: 750 };
