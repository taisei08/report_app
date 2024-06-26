export interface SignUpData {
  userName: string
  email: string
  password: string
  passwordConfirmation: string
  confirmSuccessUrl: string
}

export interface SignInData {
  email: string
  password: string
}

export interface User {  
  userId: number;
  userName: string;
  accountName: string;
  iconPath: { url: string };
  school: string;
  facultyDepartment: string;
  profileStatement: string;
}

export interface Posts {
  title: string
  description: string
  fieldId: number
  subFieldId: number
  documentPath?: File
  tags: string[]
}

export interface PostLists {
  postId: number
  userId: number
  userName: string
  iconPath: string
  title: string
  description: string
  fieldId: number
  subFieldId: number
  documentPath?: { url: string };
  createdAt: string
  updatedAt: string
  tags: { tagId: number; tagName: string }[];
  averageRating: number
}

export interface Fields {
  id: number;
  name: string;
}

export interface Tags {
  tag_name: string;
}

export interface Review {
  reviewId: number
  postId: number
  userId: number
  userName: string
  iconPath: string
  title: string
  review: string
  documentPath: string
  createdAt: string
  value: number
  replyLength: number
}

export interface Reply {
  replyId: number;
  userId: number;
  userName: string;
  iconPath: string;
  createdAt: string;
  reply: string;
}

export interface Notification {
  id?: number;
  action: string;
  activeUserId: number;
  accountName: string;
  userName: string;
  iconPath: string;
  postId?: number;
  reviewId?: number;
  replyId?: number;
  title?: string;
}