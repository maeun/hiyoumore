import { ref, set, get } from "firebase/database";
import { log_in_out_db } from "./firebaseConfig";

const getKSTDateAndTime = () => {
  const now = new Date();
  const utc9 = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return {
    date: utc9.toISOString().split("T")[0],
    formattedTime: utc9.toISOString().replace("Z", "+09:00"),
  };
};

export const saveLoginTime = async (userId, accessToken, platform) => {
  const { date, formattedTime } = getKSTDateAndTime();

  try {
    const dateRef = ref(log_in_out_db, `login/${date}`);
    const snapshot = await get(dateRef);
    let loginCount = 0;

    if (snapshot.exists()) {
      loginCount = snapshot.size;
    }

    const newLoginNumber = loginCount + 1;
    const newLoginRef = ref(log_in_out_db, `login/${date}/${newLoginNumber}`);
    await set(newLoginRef, {
      user_id: userId,
      login_time: formattedTime,
      accessToken: accessToken,
      login_platform: platform,
    });

    console.log("Login time saved successfully");
  } catch (error) {
    console.error("Error saving login time:", error);
  }
};

export const saveLogoutTime = async (userId, token) => {
  const { date, formattedTime } = getKSTDateAndTime();

  try {
    const loginPlatformSnapshot = await get(
      ref(log_in_out_db, `login/${date}`)
    );
    let platform = "UNKNOWN";

    if (loginPlatformSnapshot.exists()) {
      loginPlatformSnapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().user_id === userId) {
          platform = childSnapshot.val().login_platform;
        }
      });
    }

    const dateRef = ref(log_in_out_db, `logout/${date}`);
    const snapshot = await get(dateRef);
    let logoutCount = 0;

    if (snapshot.exists()) {
      logoutCount = snapshot.size;
    }

    const newLogoutNumber = logoutCount + 1;
    const newLogoutRef = ref(
      log_in_out_db,
      `logout/${date}/${newLogoutNumber}`
    );
    await set(newLogoutRef, {
      logout_platform: platform,
      user_id: userId,
      logout_time: formattedTime,
      accessToken: token,
    });

    console.log("Logout time saved successfully");
  } catch (error) {
    console.error("Error saving logout time:", error);
  }
};
