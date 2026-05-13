// ─── Learning Content Data ───────────────────────────────────────────────────
// Four cognitive domains used in dementia screening

export const learningContent = [
  {
    id: 'memory',
    category: 'Memory',
    icon: '🧠',
    colorClass: 'cat-memory',
    tagline: 'The foundation of identity',
    description:
      'Memory is the cognitive ability to encode, store, and retrieve information. ' +
      'Early dementia often first affects short-term (episodic) memory — the ability ' +
      'to recall recent events, conversations, or where items were placed. ' +
      'Long-term and procedural memory tend to remain intact longer.',
    keyPoints: [
      'Short-term memory holds 7±2 items for ~20 seconds',
      'Hippocampus is the primary memory consolidation centre',
      'Sleep plays a critical role in memory consolidation',
      'Repetition and association strengthen recall',
    ],
    example: {
      scenario: 'Recall Test',
      detail:
        'You are shown three words — "apple", "table", "penny" — and asked to remember them. ' +
        'After a 5-minute distraction task, you are asked to recall those words. ' +
        'Difficulty recalling ≥2 words may indicate early memory impairment.',
    },
    warningSign: 'Forgetting recently learned information or important dates repeatedly.',
  },
  {
    id: 'attention',
    category: 'Attention',
    icon: '🎯',
    colorClass: 'cat-attention',
    tagline: 'Selective focus under cognitive load',
    description:
      'Attention is the capacity to selectively concentrate on information while ignoring ' +
      'distractions. It includes sustained attention (vigilance over time), selective attention ' +
      '(filtering distractors), and divided attention (multitasking). Impairment manifests as ' +
      'difficulty following conversations or losing track of tasks.',
    keyPoints: [
      'Prefrontal cortex governs executive attention',
      'Average attention span is approximately 20 minutes',
      'Divided attention declines markedly with age',
      'Fatigue and stress drastically reduce attentional capacity',
    ],
    example: {
      scenario: 'Serial Subtraction',
      detail:
        'Starting from 100, subtract 7 repeatedly (100 → 93 → 86 → 79...). ' +
        'This tests sustained attention and working memory simultaneously. ' +
        'More than 2 errors in 5 subtractions may indicate attention deficits.',
    },
    warningSign: 'Difficulty following TV programmes, conversations, or completing familiar tasks.',
  },
  {
    id: 'language',
    category: 'Language',
    icon: '💬',
    colorClass: 'cat-language',
    tagline: 'Expression and comprehension',
    description:
      'Language encompasses the ability to name objects, form coherent sentences, comprehend ' +
      'spoken and written words, and express thoughts clearly. Dementia-related language ' +
      'changes often begin with word-finding difficulties (anomia), followed by reduced ' +
      'vocabulary and eventually impaired comprehension.',
    keyPoints: [
      "Broca's area handles speech production; Wernicke's area handles comprehension",
      'Naming common objects tests lexical access speed',
      'Fluency tasks reveal retrieval from semantic memory',
      'Reading comprehension typically declines before production in some dementia types',
    ],
    example: {
      scenario: 'Verbal Fluency',
      detail:
        'Name as many animals as you can in 60 seconds. ' +
        'Healthy adults typically produce 18–22 animals. ' +
        'Fewer than 12 may indicate semantic memory or language impairment.',
    },
    warningSign: 'Stopping mid-sentence, struggling to find common words, or using wrong words.',
  },
  {
    id: 'orientation',
    category: 'Orientation',
    icon: '🧭',
    colorClass: 'cat-orientation',
    tagline: 'Anchoring self in time and space',
    description:
      'Orientation refers to awareness of time (date, day, year, season), place (current ' +
      'location, city, country), and person (knowledge of self and others). Disorientation ' +
      'is one of the most clinically significant early signs of cognitive decline and is ' +
      'a core component of standardised screening tools like the MMSE.',
    keyPoints: [
      'Temporal orientation is usually impaired before spatial orientation',
      'Confusion about year before month or day is common in early stages',
      'Familiarity with surroundings can mask spatial disorientation initially',
      'MMSE assigns 5 points each to time and place orientation',
    ],
    example: {
      scenario: 'Orientation Check',
      detail:
        'What is today\'s date? What day of the week is it? What year is it? ' +
        'What city are you in? What building are you in? ' +
        'Healthy individuals answer all 5 correctly. Missing 2+ may warrant further evaluation.',
    },
    warningSign: 'Getting lost in familiar places or confusion about the current date or year.',
  },
];
