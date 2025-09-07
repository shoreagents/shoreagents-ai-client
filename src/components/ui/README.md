# Comment Component

A reusable comment component that displays user comments with avatar, name, timestamp, and optional delete functionality.

## Features

- **Responsive Design**: Adapts to different screen sizes
- **Hover Effects**: Shows timestamp on hover, actions on hover
- **Delete Functionality**: Optional delete button with confirmation
- **Customizable Styling**: Accepts custom CSS classes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Animation**: Smooth hover transitions using Framer Motion

## Usage

### Basic Import

```tsx
import { Comment, CommentData } from "@/components/ui/comment"
```

### Basic Comment (Read-only)

```tsx
const comment: CommentData = {
  id: "1",
  comment: "This is a sample comment.",
  created_at: "2024-01-15T10:30:00Z",
  user_name: "John Doe"
}

<Comment comment={comment} />
```

### Comment with Delete Functionality

```tsx
const handleDelete = (commentId: string) => {
  // Handle comment deletion
  console.log('Deleting comment:', commentId)
}

<Comment
  comment={comment}
  onDelete={handleDelete}
  showDeleteButton={true}
/>
```

### Custom Styling

```tsx
<Comment
  comment={comment}
  className="bg-blue-50 border-blue-200 dark:bg-blue-950/20"
/>
```

### Dynamic Comments List

```tsx
{comments.map((comment) => (
  <Comment
    key={comment.id}
    comment={comment}
    onDelete={handleDelete}
    showDeleteButton={true}
  />
))}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `comment` | `CommentData` | Required | The comment data to display |
| `onDelete` | `(commentId: string) => void` | `undefined` | Function called when delete button is clicked |
| `showDeleteButton` | `boolean` | `false` | Whether to show the delete button |
| `className` | `string` | `""` | Additional CSS classes for custom styling |

## CommentData Interface

```tsx
interface CommentData {
  id: string
  comment: string
  created_at: string
  updated_at?: string
  user_id?: string
  user_name: string
  user_role?: string
}
```

## Styling

The component uses Tailwind CSS classes and follows the design system:

- **Background**: `bg-sidebar` (light/dark theme aware)
- **Border**: `border` with customizable colors
- **Typography**: Responsive text sizes
- **Spacing**: Consistent padding and margins
- **Hover States**: Smooth transitions and visual feedback

## Accessibility

- Proper semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast support

## Dependencies

- React 18+
- Framer Motion (for animations)
- Tailwind CSS (for styling)
- Tabler Icons (for icons)
- Shadcn/ui components (Avatar, Tooltip, etc.)

## Examples

See `comment-example.tsx` for comprehensive usage examples.










