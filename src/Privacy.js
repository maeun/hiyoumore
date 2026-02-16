import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import tokensArcade from "./tokens-arcade";

// ============================================
// ARCADE TERMINAL SCREEN - PRIVACY POLICY
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
  textAlign: 'left',
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

const IntroText = styled('p')({
  marginBottom: tokensArcade.spacing.xl,
  opacity: 0.9,
  lineHeight: 1.8,
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

const TerminalList = styled('ul')({
  listStyle: 'none',
  paddingLeft: tokensArcade.spacing.xl,
  margin: `${tokensArcade.spacing.sm} 0`,
});

const TerminalListItem = styled('li')({
  margin: `${tokensArcade.spacing.xs} 0`,
  opacity: 0.9,

  '&::before': {
    content: '"- "',
    color: '#00FF00',
    marginLeft: `-${tokensArcade.spacing.md}`,
  },
});

const TerminalLink = styled('a')({
  color: '#00FF00',
  textDecoration: 'none',
  borderBottom: '1px solid #00FF00',
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 0.7,
    textDecoration: 'none',
  },

  '&::before': {
    content: '"["',
    marginRight: '4px',
  },

  '&::after': {
    content: '"]"',
    marginLeft: '4px',
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

function Privacy() {
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
        <title>SYSTEM INFO: PRIVACY | HIYOUMORE</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <TerminalContent>
        <SystemHeader>
          <SystemTitle>SYSTEM INFORMATION: 개인정보처리방침</SystemTitle>
          <SystemInfo>HIYOUMORE v1.0.0 | SECURE TERMINAL MODE</SystemInfo>
        </SystemHeader>

        <IntroText>
          하이유모어(이하 "서비스")는 이용자의 개인정보를 소중히 여기며, 관련 법령에
          따라 개인정보를 보호하고 있습니다. 본 방침은 서비스가 수집하는 개인정보의
          항목, 목적, 보유 기간 등을 안내합니다.
        </IntroText>

        <TerminalSection>
          <SectionTitle>제1조 (수집하는 개인정보)</SectionTitle>
          <SectionContent>
            서비스는 소셜 로그인 시 다음 정보를 수집합니다.
          </SectionContent>
          <TerminalList>
            <TerminalListItem>카카오 로그인: 닉네임, 이메일, 프로필 이미지</TerminalListItem>
            <TerminalListItem>자동 수집: 로그인/로그아웃 시간</TerminalListItem>
          </TerminalList>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제2조 (수집 목적)</SectionTitle>
          <SectionContent>
            수집된 개인정보는 다음 목적으로 이용됩니다.
          </SectionContent>
          <TerminalList>
            <TerminalListItem>이용자 인증 및 서비스 제공</TerminalListItem>
            <TerminalListItem>서비스 이용 현황 파악 및 개선</TerminalListItem>
          </TerminalList>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제3조 (보유 기간)</SectionTitle>
          <SectionContent>
            ① 수집된 개인정보는 서비스 이용 기간 동안 보유하며, 이용자가 삭제를
            요청하거나 서비스가 종료될 경우 지체 없이 파기합니다.
          </SectionContent>
          <SectionContent>
            ② 로그인/로그아웃 기록은 서비스 운영 목적으로 보관되며, 동일한 기준에
            따라 파기합니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제4조 (제3자 제공)</SectionTitle>
          <SectionContent>
            서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 소셜
            로그인 과정에서 카카오의 OAuth 인증 서비스를 이용하며, 해당
            플랫폼의 개인정보처리방침이 적용됩니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제5조 (이용자 권리)</SectionTitle>
          <SectionContent>
            이용자는 언제든지 다음 권리를 행사할 수 있습니다.
          </SectionContent>
          <TerminalList>
            <TerminalListItem>수집된 개인정보의 열람 요청</TerminalListItem>
            <TerminalListItem>개인정보의 정정 및 삭제 요청</TerminalListItem>
            <TerminalListItem>개인정보 처리 정지 요청</TerminalListItem>
          </TerminalList>
          <SectionContent>
            위 요청은 아래 연락처를 통해 접수하실 수 있으며, 요청 접수 후 지체 없이
            처리합니다.
          </SectionContent>
        </TerminalSection>

        <TerminalSection>
          <SectionTitle>제6조 (연락처)</SectionTitle>
          <SectionContent>
            개인정보 관련 문의는 아래 카카오톡 오픈채팅을 통해 접수하실 수 있습니다.
          </SectionContent>
          <div style={{ paddingLeft: tokensArcade.spacing.xl, marginTop: tokensArcade.spacing.md }}>
            <TerminalLink
              href="https://open.kakao.com/o/sPjylDmf"
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오톡 오픈채팅 문의
            </TerminalLink>
          </div>
        </TerminalSection>

        <EffectiveDate>
          EFFECTIVE_DATE: 2025-02-13 | STATUS: ACTIVE
        </EffectiveDate>
      </TerminalContent>

      <Footer>PRESS ESC TO EXIT</Footer>
    </TerminalScreen>
  );
}

export default Privacy;
