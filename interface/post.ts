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
