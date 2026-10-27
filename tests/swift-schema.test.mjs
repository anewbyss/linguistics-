// Checks the JSON embedded in the Swift app against the Decodable models in Models.swift,
// so a content change can't break JSON decoding on device. Keep SCHEMA in sync with Models.swift.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const swiftSrc = readFileSync(new URL('../swift/Lingua.swiftpm/ContentData.swift', import.meta.url), 'utf8');
const json = swiftSrc.slice(swiftSrc.indexOf('#"""\n') + 5, swiftSrc.lastIndexOf('\n"""#'));
const lib = JSON.parse(json);

// field: type. "?" suffix = optional. [T] = array of T. {T} = dictionary of T.
const SCHEMA = {
  Library: { version: 'int', levels: '[string]', languages: '[Language]' },
  Language: {
    id: 'string', name: 'string', nativeName: 'string', subtitle: 'string', symbol: 'string', dir: 'string',
    speech: 'string', accent: 'string', translateSkipEn: '[string]', categories: '[Category]', reading: 'Reading',
    scenarios: '[Scenario]', aptitude: '[Question]', dictionary: '[Phrase]', media: '[MediaItem]',
  },
  Phrase: { t: 'string', tr: 'string?', en: 'string', note: 'string?' },
  TableData: { headers: '[string]', rows: '[[string]]' },
  LessonSection: { title: 'string', body: '[string]', table: 'TableData?' },
  Question: { id: 'string', q: 'string', t: 'string?', options: '[string]', answer: 'int', explain: 'string?', level: 'string?', skill: 'string?' },
  Lesson: { id: 'string', title: 'string', level: 'string', summary: 'string', grammar: 'LessonSection', vocab: '[Phrase]', examples: '[Phrase]', culture: 'LessonSection', quiz: '[Question]' },
  Category: { id: 'string', title: 'string', nativeTitle: 'string', icon: 'string', emoji: 'string', summary: 'string', lessons: '[Lesson]' },
  Letter: { char: 'string', name: 'string', tr: 'string', sound: 'string', example: 'Phrase', connects: 'bool?', forms: '[string]?' },
  Mark: { symbol: 'string', name: 'string', body: 'string', example: 'Phrase?' },
  WritingTask: { en: 'string', answer: 'string', alts: '[string]?', hint: 'string?' },
  Tip: { title: 'string', body: 'string' },
  Reading: { title: 'string', intro: '[string]', letters: '[Letter]', marks: '[Mark]', words: '[Phrase]', writing: '[WritingTask]', tips: '[Tip]', keyboard: '[string]?' },
  Choice: { t: 'string', tr: 'string?', en: 'string', correct: 'bool', feedback: 'string' },
  Step: { speaker: 'string?', line: 'Phrase?', prompt: 'string?', mode: 'string?', choices: '[Choice]?' },
  Scenario: { id: 'string', title: 'string', level: 'string', emoji: 'string', icon: 'string', setting: 'string', goal: 'string', steps: '[Step]' },
  MediaItem: { level: 'string', type: 'string', title: 'string', creator: 'string?', why: 'string', source: 'string', skills: '[string]' },
};

function check(value, type, path) {
  if (type.endsWith('?')) {
    if (value === undefined || value === null) return;
    type = type.slice(0, -1);
  }
  assert.notEqual(value, undefined, `${path} is missing`);
  assert.notEqual(value, null, `${path} is null`);
  if (type.startsWith('[')) {
    assert.ok(Array.isArray(value), `${path} should be an array`);
    value.forEach((v, i) => check(v, type.slice(1, -1), `${path}[${i}]`));
  } else if (type === 'string') assert.equal(typeof value, 'string', `${path} should be a string`);
  else if (type === 'int') assert.ok(Number.isInteger(value), `${path} should be an integer`);
  else if (type === 'bool') assert.equal(typeof value, 'boolean', `${path} should be a boolean`);
  else {
    const fields = SCHEMA[type];
    assert.ok(fields, `unknown type ${type}`);
    assert.equal(typeof value, 'object', `${path} should be an object`);
    for (const [k, t] of Object.entries(fields)) check(value[k], t, `${path}.${k}`);
  }
}

test('embedded Swift content matches the Decodable models', () => {
  check(lib, 'Library', 'library');
});

test('Swift data matches the web data', () => {
  const web = readFileSync(new URL('../web/data/content.js', import.meta.url), 'utf8');
  const webLib = JSON.parse(web.slice(web.indexOf('= ') + 2, web.lastIndexOf(';')));
  assert.deepEqual(webLib, lib);
});

test('Swift sources have balanced brackets', () => {
  const files = ['Engine.swift', 'Models.swift', 'ProgressStore.swift', 'ContentStore.swift', 'LinguaApp.swift', 'Package.swift',
    'Views/Components.swift', 'Views/HomeViews.swift', 'Views/ReadingViews.swift', 'Views/PracticeViews.swift',
    'Fluency.swift', 'Speech.swift', 'Views/FluencyViews.swift'];
  for (const f of files) {
    let src = readFileSync(new URL(`../swift/Lingua.swiftpm/${f}`, import.meta.url), 'utf8');
    // Strip comments and string literals (including interpolations) before counting.
    src = src.replace(/\/\/[^\n]*/g, '').replace(/"(?:\\.|[^"\\\n])*"/g, '""');
    const pairs = { '(': ')', '[': ']', '{': '}' };
    const stack = [];
    for (const ch of src) {
      if (pairs[ch]) stack.push(pairs[ch]);
      else if (')]}'.includes(ch)) assert.equal(stack.pop(), ch, `${f}: unbalanced ${ch}`);
    }
    assert.equal(stack.length, 0, `${f}: unclosed brackets`);
  }
});

test('Swift type names do not shadow SwiftUI / Foundation types', () => {
  const reserved = new Set(['Section', 'Text', 'List', 'Label', 'Group', 'Image', 'Color', 'Font', 'Path', 'Shape', 'Link', 'Menu',
    'Table', 'Form', 'Grid', 'GridRow', 'Toggle', 'Picker', 'Button', 'Divider', 'Spacer', 'Canvas', 'Gauge', 'Stepper', 'Slider',
    'Alert', 'Animation', 'Angle', 'Edge', 'Axis', 'Layout', 'Scene', 'App', 'View', 'Binding', 'State', 'Environment', 'Tab',
    'ProgressView', 'ScrollView', 'NavigationLink', 'Data', 'Date', 'URL', 'Locale', 'Calendar', 'Character', 'Result', 'Never']);
  const dir = new URL('../swift/Lingua.swiftpm/', import.meta.url);
  const files = ['Engine.swift', 'Models.swift', 'ProgressStore.swift', 'ContentStore.swift', 'LinguaApp.swift',
    'Views/Components.swift', 'Views/HomeViews.swift', 'Views/ReadingViews.swift', 'Views/PracticeViews.swift',
    'Fluency.swift', 'Speech.swift', 'Views/FluencyViews.swift'];
  for (const f of files) {
    const src = readFileSync(new URL(f, dir), 'utf8');
    for (const m of src.matchAll(/^\s*(?:private |fileprivate )?(?:final )?(?:struct|class|enum|protocol)\s+(\w+)/gm)) {
      assert.ok(!reserved.has(m[1]), `${f}: type ${m[1]} shadows a system type`);
    }
  }
});
