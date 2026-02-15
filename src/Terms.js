import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import tokensArcade from "./tokens-arcade";

// ============================================
// ARCADE TERMINAL SCREEN - TERMS OF SERVICE
// ============================================

const TerminalScreen = styled('div')({
  minHeight: 'calc(100vh - 70px - 80px)',
  backgroundColor: '#000000',
  color: '#00FF00',
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '0.85rem',
  lineHeight: 1.6,
  padding: `${tokensArcade.spacing.xxl} ${tokensArcade.spacing.lg}`,
  paddingBottom: '100px',
  position: 'relative',
  overflow: 'auto',

  // CRT scanline effect
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `repeating-linear-gradient(
      0deg,
      rgba(0, 255, 0, 0.03) 0px,
      rgba(0, 255, 0, 0.03) 1px,
      transparent 1px,
      transparent 2px
    )`,
    pointerEvents: 'none',
    zIndex: 2,
  },

  // Screen glow
  '&::after': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
});

const TerminalContent = styled('div')({
  maxWidth: '800px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 3,
});

const SystemHeader = styled('div')({
  borderBottom: '2px solid #00FF00',
  paddingBottom: tokensArcade.spacing.md,
  marginBottom: tokensArcade.spacing.xl,
  textAlign: 'center',
});

const SystemTitle = styled('div')({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  letterSpacing: '4px',
  marginBottom: tokensArcade.spacing.sm,

  '&::after': {
    content: '"_"',
    display: 'inline-block',
    marginLeft: '8px',
    animation: 'blink 1s step-end infinite',
  },

  '@keyframes blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0 },
  },
});

const SystemInfo = styled('div')({
  fontSize: '0.75rem',
  opacity: 0.7,
});

const TerminalSection = styled('section')({
  marginBottom: tokensArcade.spacing.xl,
});

const SectionTitle = styled('h2')({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#00FF00',
  marginBottom: tokensArcade.spacing.md,
  letterSpacing: '2px',

  '&::before': {
    content: '"> "',
    color: '#00FF00',
  },
});

const SectionContent = styled('p')({
  margin: `${tokensArcade.spacing.sm} 0`,
  paddingLeft: tokensArcade.spacing.lg,
  opacity: 0.9,

  '&::before': {
    content: '"• "',
    marginLeft: `-${tokensArcade.spacing.lg}`,
    color: '#00FF00',
  },
});

const Footer = styled('div')({
  position: 'fixed',
  bottom: '100px', // Above TabBar
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: '0.75rem',
  color: '#00FF00',
  opacity: 0.5,
  animation: 'blink 2s ease-in-out infinite',
  zIndex: 10,
  pointerEvents: 'none',

  '@keyframes blink': {
    '0%, 100%': { opacity: 0.5 },
    '50%': { opacity: 1 },
  },
});

const EffectiveDate = styled('div')({
  marginTop: tokensArcade.spacing.xxl,
  paddingTop: tokensArcade.spacing.lg,
  borderTop: '1px solid rgba(0, 255, 0, 0.3)',
  textAlign: 'center',
  fontSize: '0.75rem',
  opacity: 0.6,
});

function Terms() {
  const navigate = useNavigate();

  // ESC key to exit
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <TerminalScreen>
      <Helmet>
        <title>SYSTEM INFO: TERMS | HIYOUMORE</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <TerminalContent>
        <SystemHeader>
          <SystemTitle>SYSTEM INFORMATION: 이용약관</SystemTitle>
          <SystemInfo>HIYOUMORE v1.0.0 | ARCADE TERMINAL MODE</SystemInfo>
        </SystemHeader>

        <TerminalSection>
          <SectionTitle>제1조 (목적)</SectionTitle>
          <SectionContent>
            본 약관은 하이유모어(이하 "서비스")가 제공하는 퀴즈 공유 서비스의 이용과
            관련하여 서비스와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로
            합니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제2조 (서비스 이용)</SectionTitle>
          <SectionContent>
            ① 서비스는 다양한 카테고리의 퀴즈를 제공하며, 이용자는 퀴즈를 풀고
            친구에게 공유할 수 있습니다.
          </SectionContent>
          <SectionContent>
            ② 퀴즈 열람 및 공유는 회원가입 없이 이용 가능하며, 일부 기능은 카카오
            또는 네이버 소셜 로그인을 통해 이용할 수 있습니다.
          </SectionContent>
          <SectionContent>
            ③ 서비스는 무료로 제공되며, 향후 변경될 수 있습니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제3조 (이용자의 의무)</SectionTitle>
          <SectionContent>
            ① 이용자는 서비스를 악용하거나 타인의 권리를 침해하는 행위를 하여서는 안
            됩니다.
          </SectionContent>
          <SectionContent>
            ② 이용자는 서비스의 정상적인 운영을 방해하는 행위를 하여서는 안 됩니다.
          </SectionContent>
          <SectionContent>
            ③ 이용자는 타인의 개인정보를 무단으로 수집, 저장, 공개하는 행위를
            하여서는 안 됩니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제4조 (지적재산권)</SectionTitle>
          <SectionContent>
            ① 서비스가 제공하는 퀴즈 콘텐츠, 디자인, 로고 등에 대한 지적재산권은
            서비스 운영자에게 있습니다.
          </SectionContent>
          <SectionContent>
            ② 이용자는 서비스의 콘텐츠를 개인적, 비상업적 용도로만 이용할 수
            있습니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제5조 (면책조항)</SectionTitle>
          <SectionContent>
            ① 서비스는 퀴즈 콘텐츠의 정확성을 보장하지 않으며, 콘텐츠 이용으로
            발생하는 손해에 대해 책임지지 않습니다.
          </SectionContent>
          <SectionContent>
            ② 천재지변, 기술적 장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지
            않습니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제6조 (서비스 변경 및 중단)</SectionTitle>
          <SectionContent>
            서비스 운영자는 운영상, 기술상의 사유로 서비스의 전부 또는 일부를 변경하거나
            중단할 수 있으며, 이 경우 사전에 공지합니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제7조 (약관 변경)</SectionTitle>
          <SectionContent>
            ① 본 약관은 필요 시 변경될 수 있으며, 변경된 약관은 서비스 내에
            공지합니다.
          </SectionContent>
          <SectionContent>
            ② 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단할 수 있습니다.
          </SectionContent>
        </TerminalSection>

        <EffectiveDate>
          EFFECTIVE_DATE: 2025-02-13 | STATUS: ACTIVE
        </EffectiveDate>
      </TerminalContent>

      <Footer>PRESS ESC TO EXIT</Footer>
    </TerminalScreen>
  );
}

export default Terms;
