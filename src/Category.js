import { supabase } from './supabaseConfig';

import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon from "@mui/icons-material/Star";
import tokensArcade from "./tokens-arcade";
import { showLoginToast } from "./toastUtils";
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

// ============================================
// ARCADE CATEGORY CHIP
// ============================================

const CategoryChip = styled(Box)(({ selected }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokensArcade.spacing.xs,
  padding: `${tokensArcade.spacing.xs} ${tokensArcade.spacing.md}`,
  minHeight: '32px',
  fontFamily: 'Noto Sans KR, sans-serif',
  fontSize: tokensArcade.fonts.sm,
  fontWeight: selected ? tokensArcade.fonts.weights.bold : tokensArcade.fonts.weights.medium,
  border: tokensArcade.borders.base,
  borderRadius: tokensArcade.borderRadius.pill,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.bounce}`,

  // Unselected state
  ...(!selected && {
    backgroundColor: tokensArcade.colors.pureWhite,
    borderColor: tokensArcade.colors.electricPurple,
    color: tokensArcade.colors.deepBlack,
    boxShadow: tokensArcade.shadows.pixel,

    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: tokensArcade.shadows.arcade,
      borderColor: tokensArcade.colors.neonCyan,
    },

    '&:active': {
      transform: 'scale(0.95)',
      boxShadow: tokensArcade.shadows.pixel,
    },
  }),

  // Selected state
  ...(selected && {
    backgroundColor: tokensArcade.colors.electricPurple,
    borderColor: tokensArcade.colors.neonPink,
    color: tokensArcade.colors.pureWhite,
    boxShadow: tokensArcade.shadows.deep,
    animation: 'bounce 0.4s ease-out',

    '@keyframes bounce': {
      '0%': {
        transform: 'scale(1)',
      },
      '50%': {
        transform: 'scale(1.1)',
      },
      '100%': {
        transform: 'scale(1)',
      },
    },
  }),
}));

const StarIconStyled = styled(StarIcon)({
  fontSize: '1rem',
  color: tokensArcade.colors.arcadeYellow,
  filter: `drop-shadow(0 0 4px ${tokensArcade.colors.arcadeYellow})`,
});

// Refresh button next to selected category
const RefreshButton = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  backgroundColor: tokensArcade.colors.neonCyan,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.pill,
  boxShadow: tokensArcade.shadows.pixel,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.bounce}`,

  '&:hover': {
    transform: 'translateY(-2px) rotate(90deg)',
    boxShadow: tokensArcade.shadows.arcade,
    backgroundColor: tokensArcade.colors.neonPink,
  },

  '&:active': {
    transform: 'scale(0.9) rotate(180deg)',
    boxShadow: tokensArcade.shadows.pixel,
  },

  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: tokensArcade.colors.deepBlack,
  },
});

// Category header with title
const CategoryHeader = styled(Box)({
  marginTop: tokensArcade.spacing.base,
  marginBottom: tokensArcade.spacing.md,
  textAlign: 'center',
});

const CategoryTitle = styled('h2')({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  color: tokensArcade.colors.electricPurple,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  margin: `0 0 ${tokensArcade.spacing.md} 0`,
  textShadow: `2px 2px 0 ${tokensArcade.colors.pixelGray}`,
});

// ============================================
// CATEGORY COMPONENT
// ============================================

function Category({ handleSelectedQuestions }) {
  const [selectedItem, setSelectedItem] = useState("📆 Today's");
  const [refreshCount, setRefreshCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodays().then(handleSelectedQuestions);
  }, []);

  useEffect(() => {
    // Check for login success query parameter
    const params = new URLSearchParams(location.search);
    if (params.get('loginSuccess') === 'true') {
      // Show toast at top of page after small delay to ensure page is ready
      setTimeout(() => {
        showLoginToast('👋 로그인 되었습니다 👋');
      }, 300);
      // Remove query parameter from URL
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);

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

  const handleRefresh = async () => {
    setRefreshCount(prev => prev + 1);

    if (selectedItem === "📆 Today's") {
      const selected = await fetchTodays();
      handleSelectedQuestions(selected);
    } else {
      const field = CATEGORY_MAP[selectedItem];
      if (field) {
        const selected = await fetchByCategory(field);
        handleSelectedQuestions(selected);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>HIYOUMORE — 오늘의 퀴즈</title>
        <meta name="description" content="427개의 한국어 퀴즈를 풀고 친구와 공유해보세요! 동물, 상식, 음식, 역사 등 다양한 카테고리." />
        <meta property="og:title" content="HIYOUMORE — 오늘의 퀴즈" />
        <meta property="og:description" content="427개의 한국어 퀴즈를 풀고 친구와 공유해보세요! 동물, 상식, 음식, 역사 등 다양한 카테고리." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="category-scroll-wrapper">
        <ScrollContainer className="Category_list">
          {items.map((item, index) => (
            <div className="item" key={index}>
              <CategoryChip
                selected={selectedItem === item}
                onClick={() => handleItemClick(item)}
              >
                <span>{item}</span>
              </CategoryChip>
            </div>
          ))}
          {/* Refresh button appears next to chips */}
          <div className="item">
            <RefreshButton
              onClick={handleRefresh}
              title="탭하면 새로운 퀴즈가 나와요!"
            >
              <RefreshIcon />
            </RefreshButton>
          </div>
        </ScrollContainer>
      </div>
    </>
  );
}

export default Category;
