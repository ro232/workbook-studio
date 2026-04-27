/**
 * Romanian-language content: alphabet (with diacritics), word lists, school-style words.
 * The Romanian alphabet has 31 letters: A Ă Â B C D E F G H I Î J K L M N O P Q R S Ș T Ț U V W X Y Z.
 */

export const ROMANIAN_ALPHABET_UPPER = [
  "A", "Ă", "Â", "B", "C", "D", "E", "F", "G", "H",
  "I", "Î", "J", "K", "L", "M", "N", "O", "P", "Q",
  "R", "S", "Ș", "T", "Ț", "U", "V", "W", "X", "Y", "Z",
];

export const ROMANIAN_ALPHABET_LOWER = ROMANIAN_ALPHABET_UPPER.map((l) => l.toLowerCase());

/** Common first words taught in Romanian kindergartens (clasa pregătitoare). */
export const ROMANIAN_FIRST_WORDS = [
  "mama", "tata", "papa", "casa", "soare",
  "carte", "școală", "prieten", "iubire", "vară",
  "iarnă", "primăvară", "toamnă", "albină", "floare",
];

/** Short Romanian sentence prompts for handwriting practice. */
export const ROMANIAN_SENTENCE_PROMPTS = [
  "Eu sunt acasă.",
  "Mama citește.",
  "Soarele strălucește.",
  "Îmi place școala.",
  "Pisica doarme pe pernă.",
];

/**
 * Romanian-specific connect-the-dots: shapes drawn from familiar items.
 * Each shape uses 0-100 percent coordinates.
 */
export const ROMANIAN_DOT_PATTERNS = [
  {
    name: "Mărțișor (lăcrămioară)",
    dots: [
      { x: 50, y: 12, n: 1 },
      { x: 60, y: 22, n: 2 },
      { x: 56, y: 34, n: 3 },
      { x: 62, y: 46, n: 4 },
      { x: 56, y: 58, n: 5 },
      { x: 50, y: 70, n: 6 },
      { x: 44, y: 58, n: 7 },
      { x: 38, y: 46, n: 8 },
      { x: 44, y: 34, n: 9 },
      { x: 40, y: 22, n: 10 },
      { x: 50, y: 12, n: 11 },
    ],
  },
];
