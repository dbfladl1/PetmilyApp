export interface feedType {
  id: string;
  content: string;
  imagePaths: string[] | null;
  createdAt: string;
  likeCount: number;
  totalCommentCount: number;
  feedsWriterName: string;
  isLiked: boolean | null;
  isWriter: boolean;
  memberProfilePicturePath: string;
}

export interface FeedProps {
  content: feedType;
}

export interface CommentProps {
  postId: string;
  closeComment: () => void;
  getComment: () => void;
}

export interface CommentType {
  commentId: string;
  memberId: string;
  content: string;
  profilePicturePath: string;
  loginId: string;
}
