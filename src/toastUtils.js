import { toast, Slide } from "react-toastify";
import tokensArcade from './tokens-arcade';

/**
 * Toast Utilities - Arcade Edition
 *
 * Styled toast notifications matching the arcade aesthetic:
 * - Deep black background with neon borders
 * - Pixel font for retro feel
 * - Bottom-center position (above TabBar)
 * - Slide up animation with bounce
 */

const ARCADE_TOAST_CONFIG = {
  position: "bottom-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "dark",
  transition: Slide,
  style: {
    background: tokensArcade.colors.deepBlack,
    border: `${tokensArcade.borders.base} ${tokensArcade.colors.neonPink}`,
    borderRadius: tokensArcade.borderRadius.lg,
    boxShadow: tokensArcade.shadows.arcade,
    fontFamily: tokensArcade.fonts.pixel,
    fontSize: tokensArcade.fonts.xs,
    color: tokensArcade.colors.neonPink,
    textShadow: tokensArcade.shadows.neonPink,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    bottom: '100px', // Above TabBar (80px) + margin
    maxWidth: '400px',
  },
  progressStyle: {
    background: `linear-gradient(90deg, ${tokensArcade.colors.neonPink}, ${tokensArcade.colors.neonCyan})`,
  },
};

const ERROR_TOAST_CONFIG = {
  ...ARCADE_TOAST_CONFIG,
  style: {
    ...ARCADE_TOAST_CONFIG.style,
    borderColor: tokensArcade.colors.hotOrange,
    color: tokensArcade.colors.hotOrange,
    textShadow: `0 0 10px rgba(255, 107, 53, 0.6)`,
  },
  progressStyle: {
    background: tokensArcade.colors.hotOrange,
  },
};

const SUCCESS_TOAST_CONFIG = {
  ...ARCADE_TOAST_CONFIG,
  style: {
    ...ARCADE_TOAST_CONFIG.style,
    borderColor: tokensArcade.colors.mintGreen,
    color: tokensArcade.colors.mintGreen,
    textShadow: `0 0 10px rgba(0, 255, 179, 0.6)`,
  },
  progressStyle: {
    background: tokensArcade.colors.mintGreen,
  },
};

const LOGIN_TOAST_CONFIG = {
  ...SUCCESS_TOAST_CONFIG,
  position: "top-center",
  autoClose: 2000,
  style: {
    ...SUCCESS_TOAST_CONFIG.style,
    top: '80px', // Below header (70px) + margin
    bottom: 'auto',
  },
};

export const showToast = (message) => toast(message, SUCCESS_TOAST_CONFIG);
export const showLoginToast = (message) => toast(message, LOGIN_TOAST_CONFIG);
export const showErrorToast = (message) => toast.error(message, ERROR_TOAST_CONFIG);
export const showInfoToast = (message) => toast.info(message, ARCADE_TOAST_CONFIG);
