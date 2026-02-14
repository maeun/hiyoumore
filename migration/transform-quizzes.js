/**
 * Transform quiz data from Firebase format to Supabase format
 *
 * Usage:
 *   node transform-quizzes.js
 *
 * Input:  ../etc/hiyoumore-qa-db-export_241224.json
 * Output: supabase-quizzes.json
 */

const fs = require('fs');
const path = require('path');

// Read Firebase export file
const firebaseDataPath = path.join(__dirname, '..', 'etc', 'hiyoumore-qa-db-export_241224.json');

if (!fs.existsSync(firebaseDataPath)) {
  console.error(`Error: Firebase export file not found at ${firebaseDataPath}`);
  console.log('Please export quiz data from Firebase first.');
  process.exit(1);
}

const firebaseData = JSON.parse(fs.readFileSync(firebaseDataPath, 'utf8'));

// Convert Firebase format to Supabase format
const transformedQuizzes = Object.values(firebaseData).map(quiz => ({
  index: quiz.index,
  question: quiz.que,
  answer: quiz.ans,
  category_my_pick: quiz.my_pick === 1 || quiz.my_pick === "1",
  category_eng: quiz.eng === 1 || quiz.eng === "1",
  category_animal: quiz.animal === 1 || quiz.animal === "1",
  category_king: quiz.king === 1 || quiz.king === "1",
  category_plant: quiz.plant === 1 || quiz.plant === "1",
  category_food: quiz.food === 1 || quiz.food === "1",
  category_english: quiz.english === 1 || quiz.english === "1",
  category_religion: quiz.religion === 1 || quiz.religion === "1"
}));

// Write transformed data to output file
const outputPath = path.join(__dirname, 'supabase-quizzes.json');
fs.writeFileSync(outputPath, JSON.stringify(transformedQuizzes, null, 2));

console.log(`✅ Successfully transformed ${transformedQuizzes.length} quizzes`);
console.log(`📁 Output file: ${outputPath}`);
console.log('\nNext steps:');
console.log('1. Create Supabase project and run schema.sql');
console.log('2. Import supabase-quizzes.json to Supabase (use import-to-supabase.js or CSV import)');
