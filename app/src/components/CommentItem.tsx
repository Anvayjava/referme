import { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

export default function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diff = now.getTime() - posted.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`flex items-start space-x-3 ${isReply ? 'ml-8 mt-4' : ''}`}>
      <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} bg-${isReply ? 'gray' : 'blue'}-600 rounded-full flex items-center justify-center text-white font-semibold ${isReply ? 'text-sm' : ''} flex-shrink-0`}>
        {comment.author.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-gray-900">{comment.author.name}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
            {comment.author.company}
          </span>
          <span className="text-sm text-gray-500">• {timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-700 mb-2">{comment.content}</p>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>{comment.upvotes}</span>
          </button>
          <button className="text-sm text-gray-600 hover:text-blue-600">Reply</button>
        </div>
      </div>
    </div>
  );
}
