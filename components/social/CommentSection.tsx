import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { getRecipeComments } from '@/app/actions/comments';
import { createClient } from '@/lib/supabase/server';

interface CommentSectionProps {
  recipeId: string;
}

export async function CommentSection({ recipeId }: CommentSectionProps) {
  const supabase = await createClient();
  
  // Get current user - CRITICAL: This must be the logged-in user, not the comment author
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error getting current user:', userError);
  }
  
  // Debug: Log the actual logged-in user
  if (process.env.NODE_ENV === 'development' && user) {
    console.log('CommentSection - Logged-in User:', {
      userId: user.id,
      userEmail: user.email,
      userMetadata: user.user_metadata,
    });
  }
  
  // Fetch comments
  const result = await getRecipeComments(recipeId);
  const comments = result.comments || [];
  const error = result.error;


  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading comments</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}


      {/* Comment Form (only for logged-in users) */}
      {user ? (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Leave a Comment
          </h3>
          <CommentForm recipeId={recipeId} />
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg">
          <p className="font-medium">
            Please log in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No comments yet
            </h3>
            <p className="text-gray-600">
              Be the first to share your thoughts about this recipe!
            </p>
          </div>
        ) : (
          comments.map((comment, index) => {
            // Ensure comment has required fields and ID is a string
            const commentId = String(comment?.id || `comment-${index}`);
            if (!comment || !comment.content) {
              return null;
            }
            
            // Ensure all required fields exist - preserve original user_id type
            const safeComment = {
              id: commentId,
              content: comment.content || '',
              created_at: comment.created_at || new Date().toISOString(),
              updated_at: comment.updated_at || comment.created_at || new Date().toISOString(),
              user_id: comment.user_id || '', // Keep original type (should be string/UUID)
              recipe_id: String(comment.recipe_id || ''),
              profiles: comment.profiles || null,
            };
            
            // Ensure we pass the user ID as a string (matching the comment.user_id format)
            const currentUserId = user?.id ? String(user.id) : undefined;
            
            // Debug: Log ownership check at component level
            if (process.env.NODE_ENV === 'development') {
              console.log('CommentSection - Comment Data:', {
                commentId: commentId,
                commentUserId: safeComment.user_id,
                commentAuthor: safeComment.profiles?.username || safeComment.profiles?.email || 'Unknown',
                currentUserId: currentUserId,
                currentUserEmail: user?.email,
                isOwner: safeComment.user_id === currentUserId,
                commentUserType: typeof safeComment.user_id,
                currentUserType: typeof currentUserId,
                rawComment: comment, // Show full comment object
              });
            }
            
            return (
              <CommentItem
                key={commentId}
                comment={safeComment as any}
                currentUserId={currentUserId}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

