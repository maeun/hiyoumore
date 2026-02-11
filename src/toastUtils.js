import { toast, Bounce } from "react-toastify";

const TOAST_CONFIG = {
  position: "top-center",
  autoClose: 900,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const showToast = (message) => toast(<b>{message}</b>, TOAST_CONFIG);
export const showErrorToast = (message) => toast.error(message, TOAST_CONFIG);
