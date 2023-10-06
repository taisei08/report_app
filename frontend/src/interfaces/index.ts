// サインアップ
export interface SignUpData {
    userName: string
    email: string
    password: string
    passwordConfirmation: string
  }
  
  // サインイン
  export interface SignInData {
    email: string
    password: string
  }
  
  // ユーザー
  export interface User {
    id: number
    uid: string
    provider: string
    email: string
    userName: string
    account_name?: string
    image_path?: string
    allowPasswordChange: boolean
  }

  // 投稿
  export interface Posts {
    post_id: number
    user_id: number
    title: string
    description: string
  }
