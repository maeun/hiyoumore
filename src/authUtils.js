import { supabase } from './supabaseConfig';

const getKSTDateAndTime = () => {
  const now = new Date();
  const utc9 = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return {
    date: utc9.toISOString().split("T")[0],
    formattedTime: utc9.toISOString().replace("Z", "+09:00"),
  };
};

export const saveLoginTime = async (userId, accessToken, platform) => {
  const { formattedTime } = getKSTDateAndTime();

  const { error } = await supabase
    .from('login_logs')
    .insert({
      user_id: userId,  // Supabase auth UUID
      oauth_user_id: userId,  // For compatibility
      login_platform: platform.toUpperCase(),
      login_time: formattedTime,
      access_token: accessToken
    });

  if (error) {
    console.error('Error saving login time:', error);
  } else {
    console.log('Login time saved successfully');
  }
};

export const saveLogoutTime = async (userId, token, platform) => {
  const { formattedTime } = getKSTDateAndTime();

  const { error } = await supabase
    .from('logout_logs')
    .insert({
      user_id: userId,
      oauth_user_id: userId,
      logout_platform: platform.toUpperCase(),
      logout_time: formattedTime,
      access_token: token
    });

  if (error) {
    console.error('Error saving logout time:', error);
  } else {
    console.log('Logout time saved successfully');
  }
};
