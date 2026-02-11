import { showToast } from "./toastUtils";

export const handleShare = async (url, title = "😉 이런, 퀴즈가 도착했어요") => {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch (err) {
      // user cancelled share - not an error
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${title} - ${url}`);
      showToast("퀴즈 URL이 복사되었습니다!");
    } catch (err) {
      console.error("클립보드 복사 실패", err);
    }
  }
};
