const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const QuestionBank = require('../models/QuestionBank');

// Load environment variables since db config needs MONGO_URI
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // Path to the questions JSON file
    const dataPath = path.join(__dirname, '../data/cs_fundamentals_question_bank.json');
    
    // Check if the source JSON exists
    if (!fs.existsSync(dataPath)) {
      console.error(`Error: Seeding source file not found at ${dataPath}`);
      console.log('Please place the cs_fundamentals_question_bank.json file in the server/data directory.');
      process.exit(1);
    }

    // 2. Read and parse JSON data
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const categories = JSON.parse(rawData);

    // 3. Flatten categories into individual QuestionBank documents
    // The JSON format expected:
    // {
    //   "OS": [ { "topic", "subtopic", "question", "expected_depth", "difficulty" }, ... ],
    //   "DBMS": [ ... ],
    //   "CN": [ ... ],
    //   "OOP": [ ... ]
    // }
    const questionsToInsert = [];

    Object.keys(categories).forEach((categoryKey) => {
      const questionsList = categories[categoryKey];
      if (Array.isArray(questionsList)) {
        questionsList.forEach((q) => {
          questionsToInsert.push({
            topic: q.topic || categoryKey,
            subtopic: q.subtopic,
            question: q.question,
            expectedDepth: q.expected_depth || [],
            difficulty: (q.difficulty || 'medium').toLowerCase(),
          });
        });
      }
    });

    console.log(`Found ${questionsToInsert.length} total questions in JSON. Checking database...`);

    // 4. Insert each question if it doesn't already exist to avoid duplicates
    let newSeedsCount = 0;
    let skippedCount = 0;

    for (const q of questionsToInsert) {
      const existing = await QuestionBank.findOne({
        topic: q.topic,
        subtopic: q.subtopic,
        question: q.question
      });

      if (!existing) {
        await QuestionBank.create(q);
        newSeedsCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`Seeding process completed.`);
    console.log(`- New questions seeded: ${newSeedsCount}`);
    console.log(`- Questions skipped (already exist): ${skippedCount}`);

    // 5. Log a summary count per topic
    const summary = await QuestionBank.aggregate([
      { $group: { _id: '$topic', count: { $sum: 1 } } }
    ]);

    console.log('\n--- Seeding Summary Count Per Topic ---');
    summary.forEach((item) => {
      console.log(`${item._id}: ${item.count} questions`);
    });
    console.log('----------------------------------------\n');

    /**
     * TODO: Equivalent DSA question set integration.
     * In a future module, DSA pattern-based questions (e.g. two pointers, sliding window, etc.)
     * will be provided in a similar JSON format.
     * We will need to update this script or add an additional JSON file under server/data/
     * to load and seed the DSA question banks into the database.
     */

    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
