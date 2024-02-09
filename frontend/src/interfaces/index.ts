// サインアップ
export interface SignUpData {
    userName: string
    email: string
    password: string
    passwordConfirmation: string
    confirmSuccessUrl: string
  }
  
  // サインイン
  export interface SignInData {
    email: string
    password: string
  }
  
  // ユーザー
  export interface User {  
    userId: number;
    userName: string;
    accountName: string;
    iconPath: { url: string }; // ファイルパスの型を仮定
    birthday: string;
    school: string;
    facultyDepartment: string;
    profileStatement: string;
  }

  // 投稿
  export interface Posts {
    post_id: number
    user_id: number
    title: string
    description: string
    field_id: number
    sub_field_id: number
    document_type: string
    document_path: string
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
    documentPath: string
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

  export interface UserReviewss {
    postId: number
    userId: number
    userName: string
    iconPath: string
    title: string
    review: string
    documentPath: string
    createdAt: string
    value: number
  }