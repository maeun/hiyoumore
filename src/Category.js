import { qa_db } from "./firebaseConfig";
import { ref, get, orderByChild, query, equalTo } from "firebase/database";

import React, { useState, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Chip, Typography } from "@mui/joy";
import "./Category.css";

function Category({ handleSelectedQuestions }) {
  const items = [
    "📆 Today's",
    "✔️ Maker's Pick",
    // "🎖️ 난이도 상",
    "🧪 이과",
    "🐖 동물",
    "👑 왕",
    "🌱 식물",
    "🍔 음식",
    "🔤 영어",
    "🙏 종교",
  ];

  const [selectedItem, setSelectedItem] = useState("📆 Today's");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const QuestionsRef_ = async () => {
      if (selectedItem === "📆 Today's") {
        const QuestionsRef = ref(qa_db);
        let questions = [];
        try {
          const snapshot = await get(QuestionsRef);
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const question = childSnapshot.val();
              questions.push(question);
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
          ((now.getYear() + now.getMonth() + now.getDate()) * 9301 + 49297) %
          233280; // Linear congruential generator (LCG)

        const randomNumber =
          Math.floor((randomSeed / 233280) * (30 - 16 + 1)) + 16; // 16부터 30 사이의 난수로 변환

        const index1 = Math.floor((randomSeed / 233280) * (len / 3));
        const index2 = Math.floor((randomSeed / 233280) * (len / 3) + len / 3);
        const index3 =
          Math.floor((randomSeed / 233280) * (len / 3) + (2 * len) / 3) - 1;

        console.log(index1);
        console.log(index2);
        console.log(index3);

        const selectedQuestions = [
          questions[index1],
          questions[index2],
          questions[index3],
        ];
        handleSelectedQuestions(selectedQuestions);
        console.log(selectedQuestions);
      } else {
        setQuestions([]);
      }
    };

    QuestionsRef_();
  }, [selectedItem]);

  const handleItemClick = async (item) => {
    setSelectedItem(item);
    if (item === "📆 Today's") {
      const QuestionsRef = ref(qa_db);
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const len = questions.length;
      const now = new Date();

      const index1 = Math.floor(len / now.getDate());
      const index2 = Math.floor(len / 3 + len / now.getDate());
      const index3 = Math.floor((2 * len) / 3 + len / now.getDate());

      const selectedQuestions = [
        questions[index1],
        questions[index2],
        questions[index3],
      ];
      handleSelectedQuestions(selectedQuestions);
    }
    if (item === "✔️ Maker's Pick") {
      const QuestionsRef = query(
        ref(qa_db),
        orderByChild("my_pick"),
        equalTo(1)
      );
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    }

    if (item === "🧪 이과") {
      const QuestionsRef = query(ref(qa_db), orderByChild("eng"), equalTo(1));
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    }
    if (item === "🐖 동물") {
      const QuestionsRef = query(
        ref(qa_db),
        orderByChild("animal"),
        equalTo(1)
      );
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    }
    if (item === "👑 왕") {
      const QuestionsRef = query(ref(qa_db), orderByChild("king"), equalTo(1));
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    }
    if (item === "🌱 식물") {
      const QuestionsRef = query(ref(qa_db), orderByChild("plant"), equalTo(1));
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    }
    if (item === "🍔 음식") {
      const QuestionsRef = query(ref(qa_db), orderByChild("food"), equalTo(1));
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    }
    if (item === "🔤 영어") {
      const QuestionsRef = query(
        ref(qa_db),
        orderByChild("english"),
        equalTo(1)
      );
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    }
    if (item === "🙏 종교") {
      const QuestionsRef = query(
        ref(qa_db),
        orderByChild("religion"),
        equalTo(1)
      );
      let questions = [];
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            questions.push(question);
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (questions.length >= 3) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions = questions.slice(0, 3);
      }
      handleSelectedQuestions(questions);
    } else {
      setQuestions([]);
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
