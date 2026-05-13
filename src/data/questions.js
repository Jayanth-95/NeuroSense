// ─── Age-Tiered Question Bank ─────────────────────────────────────────────────
// easy   → ages 10-25
// medium → ages 26-45
// hard   → ages 46+
//
// Each set: 15 questions across memory, attention, language, orientation.
// AI scoring weights: memory×3, attention×2, orientation×2, language×1

export const questionsByAge = {

  // ══════════════════════════════════════════════════════════════════════
  // EASY — Ages 10-25
  // ══════════════════════════════════════════════════════════════════════
  easy: [
    // Memory (5)
    {
      id: 'e_m1',
      question: 'You saw three items on a table: a pen, a cup, and a book. Which item was NOT there?',
      options: ['pen', 'cup', 'phone', 'book'],
      correctAnswer: 'phone',
      category: 'memory',
    },
    {
      id: 'e_m2',
      question: 'A dog is called Rex. He is brown and has a red collar. What colour is his collar?',
      options: ['Blue', 'Green', 'Red', 'Yellow'],
      correctAnswer: 'Red',
      category: 'memory',
    },
    {
      id: 'e_m3',
      question: 'Yesterday you ate breakfast at 8 AM. What meal was at 8 AM?',
      options: ['Lunch', 'Dinner', 'Breakfast', 'Snack'],
      correctAnswer: 'Breakfast',
      category: 'memory',
    },
    {
      id: 'e_m4',
      question: 'A list was read aloud: cat, dog, bird, fish. Which animal was SECOND?',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 'dog',
      category: 'memory',
    },
    {
      id: 'e_m5',
      question: 'Your friend told you to meet at the park at 3 PM. What time is the meeting?',
      options: ['1 PM', '2 PM', '3 PM', '4 PM'],
      correctAnswer: '3 PM',
      category: 'memory',
    },
    // Attention (4)
    {
      id: 'e_a1',
      question: 'Count the number of vowels in the word "EDUCATION".',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      category: 'attention',
    },
    {
      id: 'e_a2',
      question: 'Which number comes next: 5, 10, 15, 20, __?',
      options: ['22', '25', '28', '30'],
      correctAnswer: '25',
      category: 'attention',
    },
    {
      id: 'e_a3',
      question: 'Starting from 20, subtract 3 three times. What do you get?',
      options: ['9', '10', '11', '12'],
      correctAnswer: '11',
      category: 'attention',
    },
    {
      id: 'e_a4',
      question: 'Spot the different letter: A A A A A B A A',
      options: ['The 3rd A', 'The 6th letter (B)', 'The last A', 'There is no difference'],
      correctAnswer: 'The 6th letter (B)',
      category: 'attention',
    },
    // Language (3)
    {
      id: 'e_l1',
      question: 'Complete the sentence: "The sun rises in the ___."',
      options: ['West', 'North', 'East', 'South'],
      correctAnswer: 'East',
      category: 'language',
    },
    {
      id: 'e_l2',
      question: 'Which word means the opposite of "happy"?',
      options: ['Joyful', 'Sad', 'Excited', 'Calm'],
      correctAnswer: 'Sad',
      category: 'language',
    },
    {
      id: 'e_l3',
      question: 'Dog is to puppy as cat is to ___.',
      options: ['cub', 'kitten', 'foal', 'calf'],
      correctAnswer: 'kitten',
      category: 'language',
    },
    // Orientation (3)
    {
      id: 'e_o1',
      question: 'If today is Monday, what day is it in two days?',
      options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      correctAnswer: 'Wednesday',
      category: 'orientation',
    },
    {
      id: 'e_o2',
      question: 'Which season comes after summer?',
      options: ['Spring', 'Winter', 'Autumn', 'Monsoon'],
      correctAnswer: 'Autumn',
      category: 'orientation',
    },
    {
      id: 'e_o3',
      question: 'How many months are in a year?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '12',
      category: 'orientation',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════
  // MEDIUM — Ages 26-45
  // ══════════════════════════════════════════════════════════════════════
  medium: [
    // Memory (5)
    {
      id: 'm_m1',
      question: 'Three words: "apple", "table", "penny". Which word was NOT in the list?',
      options: ['apple', 'table', 'chair', 'penny'],
      correctAnswer: 'chair',
      category: 'memory',
    },
    {
      id: 'm_m2',
      question: "A person's name is Robert Johnson. He lives at 42 Oak Street. What is his street?",
      options: ['Maple Street', 'Oak Street', 'Pine Avenue', 'Elm Drive'],
      correctAnswer: 'Oak Street',
      category: 'memory',
    },
    {
      id: 'm_m3',
      question: 'You read: pen, clock, mirror, book. Which item was THIRD?',
      options: ['pen', 'clock', 'mirror', 'book'],
      correctAnswer: 'mirror',
      category: 'memory',
    },
    {
      id: 'm_m4',
      question: 'A story mentioned a red car, blue bicycle, and green bus. What colour was the bicycle?',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctAnswer: 'Blue',
      category: 'memory',
    },
    {
      id: 'm_m5',
      question: 'You were told: "Meeting at 2 PM, Room 4B, bring your ID." What room?',
      options: ['2B', '3A', '4B', '5C'],
      correctAnswer: '4B',
      category: 'memory',
    },
    // Attention (4)
    {
      id: 'm_a1',
      question: 'Count the letter "A" in: "A cat sat on a mat near a wall."',
      options: ['4', '5', '6', '7'],
      correctAnswer: '5',
      category: 'attention',
    },
    {
      id: 'm_a2',
      question: 'Starting from 100, subtract 7 four times. What is the result?',
      options: ['58', '65', '72', '79'],
      correctAnswer: '72',
      category: 'attention',
    },
    {
      id: 'm_a3',
      question: 'Which number continues: 2, 4, 8, 16, __?',
      options: ['24', '28', '32', '36'],
      correctAnswer: '32',
      category: 'attention',
    },
    {
      id: 'm_a4',
      question: 'Tap for letter "A" only: F-A-K-L-A-B-A. How many taps?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '3',
      category: 'attention',
    },
    // Language (3)
    {
      id: 'm_l1',
      question: 'Complete the analogy: "Doctor is to hospital as teacher is to ___."',
      options: ['clinic', 'school', 'court', 'office'],
      correctAnswer: 'school',
      category: 'language',
    },
    {
      id: 'm_l2',
      question: 'Which sentence is grammatically correct?',
      options: [
        'She go to the store yesterday.',
        'She went to the store yesterday.',
        'She going to store yesterday.',
        'She goed to the store.',
      ],
      correctAnswer: 'She went to the store yesterday.',
      category: 'language',
    },
    {
      id: 'm_l3',
      question: 'Name the category: "Alzheimer\'s, Lewy body, frontotemporal, vascular".',
      options: ['Brain tumours', 'Dementia types', 'Strokes', 'Infections'],
      correctAnswer: 'Dementia types',
      category: 'language',
    },
    // Orientation (3)
    {
      id: 'm_o1',
      question: 'If today is Wednesday the 15th, what day is it in 3 days?',
      options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
      correctAnswer: 'Saturday',
      category: 'orientation',
    },
    {
      id: 'm_o2',
      question: 'Which season comes after autumn?',
      options: ['Spring', 'Summer', 'Winter', 'Monsoon'],
      correctAnswer: 'Winter',
      category: 'orientation',
    },
    {
      id: 'm_o3',
      question: 'A nurse asks "Do you know where you are?" — what type of orientation is being tested?',
      options: ['Temporal', 'Personal', 'Place', 'Social'],
      correctAnswer: 'Place',
      category: 'orientation',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════
  // HARD — Ages 46+
  // ══════════════════════════════════════════════════════════════════════
  hard: [
    // Memory (5)
    {
      id: 'h_m1',
      question: 'Five items: lamp, trumpet, cloud, bicycle, envelope. Which was FOURTH?',
      options: ['cloud', 'trumpet', 'bicycle', 'envelope'],
      correctAnswer: 'bicycle',
      category: 'memory',
    },
    {
      id: 'h_m2',
      question: 'You were given this address: "Dr. Patel, Ward 7, Building C, Floor 3." What floor?',
      options: ['1', '2', '3', '7'],
      correctAnswer: '3',
      category: 'memory',
    },
    {
      id: 'h_m3',
      question: 'A passage mentioned these facts: the train left at 6:45 AM, platform 3, destination Mumbai. What platform?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '3',
      category: 'memory',
    },
    {
      id: 'h_m4',
      question: 'Ten words: rose, chair, river, moon, spoon, paper, cloud, frog, kite, drum. How many were living things?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '2',
      category: 'memory',
    },
    {
      id: 'h_m5',
      question: 'A phone number was 984-7620. What are the last four digits?',
      options: ['7620', '8462', '9847', '4762'],
      correctAnswer: '7620',
      category: 'memory',
    },
    // Attention (4)
    {
      id: 'h_a1',
      question: 'Starting at 200, subtract 13 five times. What is the result?',
      options: ['125', '130', '135', '140'],
      correctAnswer: '135',
      category: 'attention',
    },
    {
      id: 'h_a2',
      question: 'What is the next term: 1, 1, 2, 3, 5, 8, __?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '13',
      category: 'attention',
    },
    {
      id: 'h_a3',
      question: 'Count only the EVEN numbers in: 3, 8, 7, 2, 5, 4, 9, 6, 1, 10. How many?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '5',
      category: 'attention',
    },
    {
      id: 'h_a4',
      question: 'Read once: "The brown fox jumped quickly over the lazy sleeping dog near the barn." How many adjectives?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '4',
      category: 'attention',
    },
    // Language (3)
    {
      id: 'h_l1',
      question: 'In 60 seconds you should name 18+ animals for normal performance. Naming fewer than 12 suggests deficit in which domain?',
      options: ['Memory', 'Attention', 'Language', 'Orientation'],
      correctAnswer: 'Language',
      category: 'language',
    },
    {
      id: 'h_l2',
      question: '"Aphasia" refers to impairment in which cognitive domain?',
      options: ['Memory consolidation', 'Spatial navigation', 'Language processing', 'Motor control'],
      correctAnswer: 'Language processing',
      category: 'language',
    },
    {
      id: 'h_l3',
      question: 'Which is the correct use of the word "affect" vs "effect"?',
      options: [
        'The drug effected her mood.',
        'The drug affected her mood.',
        'The affect of the drug was mild.',
        'She was effected by the drug.',
      ],
      correctAnswer: 'The drug affected her mood.',
      category: 'language',
    },
    // Orientation (3)
    {
      id: 'h_o1',
      question: 'If it is currently March and you add 9 months, what month is it?',
      options: ['October', 'November', 'December', 'January'],
      correctAnswer: 'December',
      category: 'orientation',
    },
    {
      id: 'h_o2',
      question: 'The MMSE assigns a maximum of how many points to orientation questions (time + place combined)?',
      options: ['5', '8', '10', '12'],
      correctAnswer: '10',
      category: 'orientation',
    },
    {
      id: 'h_o3',
      question: 'Which type of orientation is typically lost LAST in advancing dementia?',
      options: ['Temporal (time)', 'Spatial (place)', 'Personal (self)', 'Social (others)'],
      correctAnswer: 'Personal (self)',
      category: 'orientation',
    },
  ],
};

// ─── Helper: select question set based on age ─────────────────────────────────
export const getQuestionSetByAge = (age) => {
  const n = Number(age);
  if (n <= 25) return { set: questionsByAge.easy,   difficulty: 'easy',   label: 'Easy (Ages 10–25)' };
  if (n <= 45) return { set: questionsByAge.medium, difficulty: 'medium', label: 'Moderate (Ages 26–45)' };
  return           { set: questionsByAge.hard,   difficulty: 'hard',   label: 'Advanced (Ages 46+)' };
};
