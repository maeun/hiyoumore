import { supabase } from '../supabaseConfig';
import { showToast, showErrorToast } from '../toastUtils';

/**
 * Bookmark & Flip History Utilities
 *
 * Functions for managing user's bookmarked quizzes and flip history.
 */

/**
 * Toggle bookmark status for a quiz
 *
 * @param {number} quizIndex - Quiz index (matches quizzes.index)
 * @param {string} userId - User ID from Supabase Auth
 * @returns {Promise<boolean|null>} - true if bookmarked, false if removed, null if error
 */
export const toggleBookmark = async (quizIndex, userId) => {
  if (!userId) {
    showToast('로그인하면 북마크할 수 있어요! 😊');
    return null;
  }

  try {
    // Check if already bookmarked
    const { data: existing, error: checkError } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('quiz_index', quizIndex)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking bookmark:', checkError);
      showErrorToast('북마크 확인에 실패했습니다');
      return null;
    }

    if (existing) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('id', existing.id);

      if (deleteError) {
        console.error('Error removing bookmark:', deleteError);
        showErrorToast('북마크 제거에 실패했습니다');
        return null;
      }

      showToast('북마크에서 제거했어요');
      return false; // Not bookmarked
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from('user_bookmarks')
        .insert({ user_id: userId, quiz_index: quizIndex });

      if (insertError) {
        console.error('Error adding bookmark:', insertError);
        showErrorToast('북마크 추가에 실패했습니다');
        return null;
      }

      showToast('북마크에 저장했어요! ⭐');
      return true; // Bookmarked
    }
  } catch (error) {
    console.error('Unexpected error in toggleBookmark:', error);
    showErrorToast('북마크 처리 중 오류가 발생했습니다');
    return null;
  }
};

/**
 * Check if a quiz is bookmarked by user
 *
 * @param {number} quizIndex - Quiz index
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - true if bookmarked
 */
export const checkIfBookmarked = async (quizIndex, userId) => {
  if (!userId) return false;

  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('quiz_index', quizIndex)
      .maybeSingle();

    if (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error in checkIfBookmarked:', error);
    return false;
  }
};

/**
 * Track when user flips a quiz card
 *
 * @param {number} quizIndex - Quiz index
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const trackFlip = async (quizIndex, userId) => {
  if (!userId) return; // Don't track anonymous users

  try {
    // Use PostgreSQL function for efficient upsert
    const { error } = await supabase.rpc('upsert_flip_history', {
      p_user_id: userId,
      p_quiz_index: quizIndex,
    });

    if (error) {
      console.error('Flip tracking error:', error);
      // Don't show error to user - this is background tracking
    }
  } catch (error) {
    console.error('Unexpected error in trackFlip:', error);
    // Silent fail - don't interrupt user experience
  }
};

/**
 * Get user's bookmark count
 *
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Count of bookmarked quizzes
 */
export const getBookmarkCount = async (userId) => {
  if (!userId) return 0;

  try {
    const { count, error } = await supabase
      .from('user_bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting bookmark count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Unexpected error in getBookmarkCount:', error);
    return 0;
  }
};

/**
 * Get user's total flip count
 *
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Count of unique quizzes flipped
 */
export const getFlipCount = async (userId) => {
  if (!userId) return 0;

  try {
    const { count, error } = await supabase
      .from('user_flip_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting flip count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Unexpected error in getFlipCount:', error);
    return 0;
  }
};

/**
 * Get user's bookmarked quizzes with pagination
 *
 * @param {string} userId - User ID
 * @param {number} offset - Pagination offset
 * @param {number} limit - Number of bookmarks to fetch
 * @returns {Promise<{data: Array, hasMore: boolean}>}
 */
export const getUserBookmarks = async (userId, offset = 0, limit = 10) => {
  if (!userId) return { data: [], hasMore: false };

  try {
    const { data, error, count } = await supabase
      .from('bookmarks_with_quizzes')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching bookmarks:', error);
      return { data: [], hasMore: false };
    }

    return {
      data: data || [],
      hasMore: count > offset + limit,
    };
  } catch (error) {
    console.error('Unexpected error in getUserBookmarks:', error);
    return { data: [], hasMore: false };
  }
};

/**
 * Delete a bookmark
 *
 * @param {string} bookmarkId - Bookmark UUID
 * @param {string} userId - User ID (for verification)
 * @returns {Promise<boolean>} - true if successful
 */
export const deleteBookmark = async (bookmarkId, userId) => {
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('id', bookmarkId)
      .eq('user_id', userId); // Ensure user owns this bookmark

    if (error) {
      console.error('Error deleting bookmark:', error);
      showErrorToast('북마크 삭제에 실패했습니다');
      return false;
    }

    showToast('북마크를 삭제했어요');
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteBookmark:', error);
    showErrorToast('북마크 삭제 중 오류가 발생했습니다');
    return false;
  }
};

/**
 * Get user's flip history with quiz details and pagination
 *
 * @param {string} userId - User ID
 * @param {number} offset - Pagination offset
 * @param {number} limit - Number of items to fetch
 * @returns {Promise<{data: Array, hasMore: boolean}>}
 */
export const getUserFlipHistory = async (userId, offset = 0, limit = 10) => {
  if (!userId) return { data: [], hasMore: false };

  try {
    // Get flip history with quiz details
    const { data: flipData, error: flipError, count } = await supabase
      .from('user_flip_history')
      .select('quiz_index, last_flipped_at, flip_count', { count: 'exact' })
      .eq('user_id', userId)
      .order('last_flipped_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (flipError) {
      console.error('Error fetching flip history:', flipError);
      return { data: [], hasMore: false };
    }

    if (!flipData || flipData.length === 0) {
      return { data: [], hasMore: false };
    }

    // Get quiz details for each flipped quiz
    const quizIndices = flipData.map((f) => f.quiz_index);
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('index, question, answer')
      .in('index', quizIndices);

    if (quizError) {
      console.error('Error fetching quiz details:', quizError);
      return { data: [], hasMore: false };
    }

    // Merge flip history with quiz data
    const mergedData = flipData.map((flip) => {
      const quiz = quizData.find((q) => q.index === flip.quiz_index);
      return {
        id: flip.quiz_index, // Use quiz_index as unique ID
        quiz_index: flip.quiz_index,
        question: quiz?.question || '',
        answer: quiz?.answer || '',
        last_flipped_at: flip.last_flipped_at,
        flip_count: flip.flip_count,
        category: '기타', // TODO: Extract category from quiz
      };
    });

    return {
      data: mergedData,
      hasMore: count > offset + limit,
    };
  } catch (error) {
    console.error('Unexpected error in getUserFlipHistory:', error);
    return { data: [], hasMore: false };
  }
};

/**
 * Delete a flip history entry
 *
 * @param {number} quizIndex - Quiz index to delete from history
 * @param {string} userId - User ID (for verification)
 * @returns {Promise<boolean>} - true if successful
 */
export const deleteFlipHistory = async (quizIndex, userId) => {
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('user_flip_history')
      .delete()
      .eq('quiz_index', quizIndex)
      .eq('user_id', userId); // Ensure user owns this history

    if (error) {
      console.error('Error deleting flip history:', error);
      showErrorToast('기록 삭제에 실패했습니다');
      return false;
    }

    showToast('기록을 삭제했어요');
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteFlipHistory:', error);
    showErrorToast('기록 삭제 중 오류가 발생했습니다');
    return false;
  }
};
