# Social Features Implementation Guide

This document outlines the likes and comments functionality added to the Recipe Sharing Platform.

## 📋 Overview

The platform now includes:
- ❤️ Like/Unlike recipes
- 💬 Comment on recipes
- ✏️ Edit your own comments
- 🗑️ Delete your own comments
- 📊 View like counts and comment counts

## 🗄️ Database Setup

### Step 1: Run SQL Script

Open your Supabase Dashboard → SQL Editor → Run `supabase-social-features.sql`

This creates:
- **likes table** — Stores recipe likes
- **comments table** — Stores recipe comments
- **RLS policies** — Security rules
- **Helper functions** — Like/comment counts, user like status
- **Views** — Aggregated social data
- **Triggers** — Auto-update timestamps

## 📁 File Structure

```
app/
  actions/
    likes.ts          # Like server actions
    comments.ts       # Comment server actions
  recipes/
    [id]/
      page.tsx        # Recipe detail (with social features)

components/
  social/
    LikeButton.tsx       # Like/unlike button (client)
    CommentForm.tsx      # Comment form (client)
    CommentItem.tsx      # Single comment display (client)
    CommentSection.tsx   # Comments list (server)

lib/
  supabase/
    types.ts          # Updated TypeScript types
```

## 🔧 Components

### LikeButton
**Props:**
- `recipeId: string` — Recipe ID
- `initialLiked: boolean` — User's like status
- `initialCount: number` — Total likes

**Features:**
- Optimistic UI updates
- Toggle like/unlike
- Live count display
- Visual feedback (❤️ vs 🤍)

### CommentForm
**Props:**
- `recipeId: string` — Recipe ID
- `onCommentAdded?: () => void` — Callback after comment posted

**Features:**
- 2000 character limit
- Character counter
- Validation
- Loading state

### CommentItem
**Props:**
- `comment: CommentWithAuthor` — Comment data with author
- `currentUserId?: string` — Current user ID

**Features:**
- Display comment with author info
- Edit button (owner only)
- Delete button (owner only)
- Inline editing
- "Edited" indicator

### CommentSection
**Props:**
- `recipeId: string` — Recipe ID

**Features:**
- Server component (fetches data)
- Displays all comments
- Shows comment form (if logged in)
- Empty state

## 🔐 Security

### Row Level Security (RLS)

**Likes:**
- ✅ Anyone can view
- ✅ Authenticated users can like
- ✅ Users can only unlike their own likes

**Comments:**
- ✅ Anyone can view
- ✅ Authenticated users can comment
- ✅ Users can only edit/delete their own comments

### Data Validation

**Comments:**
- Non-empty content
- Max 2000 characters
- Ownership checks for edit/delete

## 📡 Server Actions

### Likes Actions (`app/actions/likes.ts`)

```typescript
toggleLike(recipeId: string)
getLikeCount(recipeId: string)
hasUserLiked(recipeId: string)
getRecipeLikes(recipeId: string)
```

### Comments Actions (`app/actions/comments.ts`)

```typescript
createComment(recipeId: string, content: string)
updateComment(commentId: string, content: string)
deleteComment(commentId: string)
getRecipeComments(recipeId: string)
getCommentCount(recipeId: string)
```

## 🎨 UI/UX Features

### Like Button
- Animated hover/click effects
- Color changes (gray → red when liked)
- Optimistic updates
- Loading states

### Comments
- Author avatars (initials)
- Timestamps
- Edit mode (inline)
- Delete confirmation
- Nested replies support (future enhancement)

## 🚀 Usage Example

### Recipe Detail Page

```tsx
import { LikeButton } from '@/components/social/LikeButton';
import { CommentSection } from '@/components/social/CommentSection';
import { getLikeCount, hasUserLiked } from '@/app/actions/likes';

export default async function RecipeDetailPage({ params }) {
  const { id } = await params;
  
  // Fetch social data
  const { count: likeCount } = await getLikeCount(id);
  const { liked: userHasLiked } = await hasUserLiked(id);

  return (
    <div>
      {/* Recipe content */}
      
      {/* Like Button */}
      <LikeButton
        recipeId={id}
        initialLiked={userHasLiked}
        initialCount={likeCount}
      />
      
      {/* Comments */}
      <CommentSection recipeId={id} />
    </div>
  );
}
```

## 🔄 Data Flow

### Like Flow
1. User clicks like button
2. Optimistic UI update
3. Server action `toggleLike()`
4. Database insert/delete
5. Revalidate page cache
6. UI syncs with server response

### Comment Flow
1. User types comment
2. Submits form
3. Server action `createComment()`
4. Validation
5. Database insert
6. Revalidate page cache
7. Form resets

## 📊 Database Schema

### likes table
```sql
id          UUID PRIMARY KEY
user_id     UUID → profiles(id)
recipe_id   UUID → recipes(id)
created_at  TIMESTAMPTZ
UNIQUE (user_id, recipe_id)
```

### comments table
```sql
id          UUID PRIMARY KEY
user_id     UUID → profiles(id)
recipe_id   UUID → recipes(id)
content     TEXT (max 2000 chars)
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

## 🎯 Future Enhancements

- [ ] Comment replies (nested comments)
- [ ] Comment reactions (👍 👎 😂 ❤️)
- [ ] Recipe ratings (⭐⭐⭐⭐⭐)
- [ ] User mentions (@username)
- [ ] Rich text editor for comments
- [ ] Comment sorting (newest, oldest, popular)
- [ ] Real-time updates (Supabase Realtime)
- [ ] Notifications for likes/comments

## 🐛 Troubleshooting

### Likes not showing
- Verify SQL script was run successfully
- Check RLS policies are enabled
- Ensure user is authenticated

### Comments not posting
- Check authentication status
- Verify character limit (2000)
- Check browser console for errors
- Verify RLS policies

### Edit/Delete not working
- Confirm user owns the comment
- Check browser console for errors
- Verify server actions are working

## ✅ Testing Checklist

- [ ] Like a recipe (logged in)
- [ ] Unlike a recipe
- [ ] Like count updates correctly
- [ ] Post a comment (logged in)
- [ ] Edit your own comment
- [ ] Delete your own comment
- [ ] Cannot edit others' comments
- [ ] Cannot delete others' comments
- [ ] Like/comment while logged out (should prompt login)
- [ ] Character limit validation (2000 chars)
- [ ] Empty comment validation

## 📝 Notes

- All social actions require authentication
- Cache revalidation ensures data consistency
- Optimistic updates provide instant feedback
- Error handling shows user-friendly messages
- TypeScript types ensure type safety

---

**Implementation Complete! 🎉**

The social features are now fully integrated and ready to use.

