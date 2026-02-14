import { supabase } from './supabaseConfig';

import React, { useState, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Chip } from "@mui/joy";
import "./Category.css";

const CATEGORY_MAP = {
  "✔️ Maker's Pick": "my_pick",
  "🧪 이과": "eng",
  "🐖 동물": "animal",
  "👑 왕": "king",
  "🌱 식물": "plant",
  "🍔 음식": "food",
  "🔤 영어": "english",
  "🙏 종교": "religion",
};

// Map Firebase field names to Supabase column names
const FIREBASE_TO_SUPABASE_CATEGORY = {
  'my_pick': 'category_my_pick',
  'eng': 'category_eng',
  'animal': 'category_animal',
  'king': 'category_king',
  'plant': 'category_plant',
  'food': 'category_food',
  'english': 'category_english',
  'religion': 'category_religion',
};

const items = [
  "📆 Today's",
  "✔️ Maker's Pick",
  "🧪 이과",
  "🐖 동물",
  "👑 왕",
  "🌱 식물",
  "🍔 음식",
  "🔤 영어",
  "🙏 종교",
];

const shuffleAndPick = (arr, count = 3) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
};

const fetchByCategory = async (field) => {
  const columnName = FIREBASE_TO_SUPABASE_CATEGORY[field];

  const { data: questions, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq(columnName, true);

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  // Map Supabase fields back to existing format (que/ans for backward compatibility)
  const mappedQuestions = questions.map(q => ({
    ...q,
    que: q.question,
    ans: q.answer
  }));

  return mappedQuestions.length >= 3 ? shuffleAndPick(mappedQuestions) : mappedQuestions;
};

const fetchTodays = async () => {
  const { data: questions, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('index', { ascending: true });  // CRITICAL: consistent ordering

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  // Map fields for backward compatibility
  const mappedQuestions = questions.map(q => ({
    ...q,
    que: q.question,
    ans: q.answer
  }));

  // Same deterministic algorithm as before
  const len = mappedQuestions.length;
  const now = new Date();
  const randomSeed =
    ((now.getYear() + now.getMonth() + now.getDate()) * 9301 + 49297) % 233280;

  const index1 = Math.floor((randomSeed / 233280) * (len / 3));
  const index2 = Math.floor((randomSeed / 233280) * (len / 3) + len / 3);
  const index3 =
    Math.floor((randomSeed / 233280) * (len / 3) + (2 * len) / 3) - 1;

  return [mappedQuestions[index1], mappedQuestions[index2], mappedQuestions[index3]];
};

function Category({ handleSelectedQuestions }) {
  const [selectedItem, setSelectedItem] = useState("📆 Today's");

  useEffect(() => {
    fetchTodays().then(handleSelectedQuestions);
  }, []);

  const handleItemClick = async (item) => {
    setSelectedItem(item);

    if (item === "📆 Today's") {
      const selected = await fetchTodays();
      handleSelectedQuestions(selected);
    } else {
      const field = CATEGORY_MAP[item];
      if (field) {
        const selected = await fetchByCategory(field);
        handleSelectedQuestions(selected);
      }
    }
  };

  return (
    <div className="category-scroll-wrapper">
      <ScrollContainer className="Category_list">
        {items.map((item, index) => (
          <div className="item" key={index}>
            <Chip
              className="chip"
              color="info"
              onClick={() => handleItemClick(item)}
              variant={selectedItem === item ? "solid" : "outlined"}
            >
              <div className="chip-label">{item}</div>
            </Chip>
          </div>
        ))}
      </ScrollContainer>
    </div>
  );
}

export default Category;
