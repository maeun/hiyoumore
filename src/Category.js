import { qa_db } from "./firebaseConfig";
import { ref, get, orderByChild, query, equalTo } from "firebase/database";

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
  const questionsRef = query(ref(qa_db), orderByChild(field), equalTo(1));
  let questions = [];
  try {
    const snapshot = await get(questionsRef);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        questions.push(childSnapshot.val());
      });
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return questions.length >= 3 ? shuffleAndPick(questions) : questions;
};

const fetchTodays = async () => {
  const questionsRef = ref(qa_db);
  let questions = [];
  try {
    const snapshot = await get(questionsRef);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        questions.push(childSnapshot.val());
      });
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const len = questions.length;
  const now = new Date();
  const randomSeed =
    ((now.getYear() + now.getMonth() + now.getDate()) * 9301 + 49297) % 233280;

  const index1 = Math.floor((randomSeed / 233280) * (len / 3));
  const index2 = Math.floor((randomSeed / 233280) * (len / 3) + len / 3);
  const index3 =
    Math.floor((randomSeed / 233280) * (len / 3) + (2 * len) / 3) - 1;

  return [questions[index1], questions[index2], questions[index3]];
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
