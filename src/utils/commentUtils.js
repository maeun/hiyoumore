import { supabase } from '../supabaseConfig';
import { showToast, showErrorToast } from '../toastUtils';

/**
 * Comment Utilities
 *
 * Functions for managing user's quiz comments.
 */

/**
 * Get user's total comment count
 *
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Count of comments
 */
export const getCommentCount = async (userId) => {
  if (!userId) return 0;

  try {
    const { count, error } = await supabase
      .from('quiz_comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_hidden', false);

    if (error) {
      console.error('Error getting comment count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Unexpected error in getCommentCount:', error);
    return 0;
  }
};

/**
 * Get user's comments with quiz details and pagination
 *
 * @param {string} userId - User ID
 * @param {number} offset - Pagination offset
 * @param {number} limit - Number of comments to fetch
 * @returns {Promise<{data: Array, hasMore: boolean}>}
 */
export const getUserComments = async (userId, offset = 0, limit = 10) => {
  if (!userId) return { data: [], hasMore: false };

  try {
    // Get user's comments with quiz details
    const { data: commentsData, error: commentsError, count } = await supabase
      .from('quiz_comments')
      .select('id, quiz_index, comment_text, likes_count, created_at', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (commentsError) {
      console.error('Error fetching user comments:', commentsError);
      return { data: [], hasMore: false };
    }

    if (!commentsData || commentsData.length === 0) {
      return { data: [], hasMore: false };
    }

    // Get quiz details for each commented quiz
    const quizIndices = commentsData.map((c) => c.quiz_index);
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('index, question')
      .in('index', quizIndices);

    if (quizError) {
      console.error('Error fetching quiz details:', quizError);
      return { data: [], hasMore: false };
    }

    // Merge comments with quiz data
    const mergedData = commentsData.map((comment) => {
      const quiz = quizData.find((q) => q.index === comment.quiz_index);
      return {
        ...comment,
        question: quiz?.question || '',
      };
    });

    return {
      data: mergedData,
      hasMore: count > offset + limit,
    };
  } catch (error) {
    console.error('Unexpected error in getUserComments:', error);
    return { data: [], hasMore: false };
  }
};

/**
 * Delete a comment (soft delete by setting is_hidden = true)
 *
 * @param {string} commentId - Comment UUID
 * @param {string} userId - User ID (for verification)
 * @returns {Promise<boolean>} - true if successful
 */
export const deleteComment = async (commentId, userId) => {
  if (!userId) return false;

  try {
    // Soft delete: Set is_hidden = true instead of actual delete
    const { error } = await supabase
      .from('quiz_comments')
      .update({ is_hidden: true })
      .eq('id', commentId)
      .eq('user_id', userId); // Ensure user owns this comment

    if (error) {
      console.error('Error deleting comment:', error);
      showErrorToast('댓글 삭제에 실패했습니다');
      return false;
    }

    showToast('댓글을 삭제했어요');
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteComment:', error);
    showErrorToast('댓글 삭제 중 오류가 발생했습니다');
    return false;
  }
};
