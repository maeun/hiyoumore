/**
 * Import transformed quiz data to Supabase
 *
 * Usage:
 *   node import-to-supabase.js
 *
 * Prerequisites:
 *   - npm install @supabase/supabase-js (already installed in parent project)
 *   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing environment variables');
  console.log('\nPlease set:');
  console.log('  SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('\nGet service role key from: Supabase Dashboard → Settings → API');
  console.log('\n⚠️  WARNING: Service role key bypasses RLS - keep it secret!');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS for import)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Read transformed quiz data
const quizzesPath = path.join(__dirname, 'supabase-quizzes.json');
if (!fs.existsSync(quizzesPath)) {
  console.error(`❌ Error: ${quizzesPath} not found`);
  console.log('Run transform-quizzes.js first!');
  process.exit(1);
}

const quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf8'));

async function importQuizzes() {
  console.log(`📊 Importing ${quizzes.length} quizzes to Supabase...`);

  const BATCH_SIZE = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < quizzes.length; i += BATCH_SIZE) {
    const batch = quizzes.slice(i, i + BATCH_SIZE);

    const { data, error } = await supabase
      .from('quizzes')
      .insert(batch);

    if (error) {
      console.error(`❌ Error at batch starting at index ${i}:`, error.message);
      errorCount += batch.length;

      // If it's a duplicate key error, try inserting one by one
      if (error.code === '23505') {
        console.log('   Trying individual inserts for this batch...');
        for (const quiz of batch) {
          const { error: singleError } = await supabase
            .from('quizzes')
            .insert([quiz]);

          if (singleError) {
            console.error(`   ❌ Failed to insert quiz index ${quiz.index}:`, singleError.message);
          } else {
            successCount++;
          }
        }
      }
    } else {
      successCount += batch.length;
      console.log(`✅ Imported ${Math.min(i + BATCH_SIZE, quizzes.length)}/${quizzes.length} quizzes`);
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Success: ${successCount} quizzes`);
  if (errorCount > 0) {
    console.log(`   ❌ Errors: ${errorCount} quizzes`);
  }

  // Verify import
  const { count, error } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Error verifying count:', error);
  } else {
    console.log(`\n✅ Total quizzes in database: ${count}`);

    if (count !== quizzes.length) {
      console.log(`⚠️  Warning: Expected ${quizzes.length}, got ${count}`);
    } else {
      console.log('🎉 All quizzes imported successfully!');
    }
  }
}

importQuizzes()
  .then(() => {
    console.log('\n✅ Import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
