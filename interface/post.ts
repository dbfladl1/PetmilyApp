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
  likeHandler: () => void;
  handleComment: () => void;
}

export interface CommentProps {
  comments: {
    commentId: string;
    memberId: string;
    content: string;
    profilePicturePath: string;
    loginId: string;
  }[];
  postId: string;
  closeComment: () => void;
  getComment: () => void;
}

export interface CommentItemType {
  commentId: string;
  memberId: string;
  content: string;
  profilePicturePath: string;
  loginId: string;
}
