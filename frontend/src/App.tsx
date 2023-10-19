import React, { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom"

import CommonLayout from "components/layouts/CommonLayout"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Post3 from "components/pages/Post3"
import PostPage from "components/pages/PostPage"
import UserPage from "components/pages/UserPage"

import { getCurrentUser } from "lib/api/auth"
import { User } from "interfaces/index"

// グローバルで扱う変数・関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

export const PostIdContext = React.createContext({} as {
  sendPostId: number
  setSendPostId: React.Dispatch<React.SetStateAction<number>>
})

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()
  const [sendPostId, setSendPostId] = useState(0)

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      console.log(res)

      if (res?.status === 200) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.currentUser)
      } else {
        console.log("No current user")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [setCurrentUser])


  // ユーザーが認証済みかどうかでルーティングを決定
  // 未認証だった場合は「/signin」ページに促す
  const Private = ({ children }: { children: React.ReactElement }) => {
    console.log("joi")
    if (!loading) {
      if (isSignedIn) {
        return children
      } else {
        return <Navigate replace to="/signin" />
      }
    } else {
      return <></>
    }
  }

  return (

    
    <Router>
      <PostIdContext.Provider value={{ sendPostId, setSendPostId }}>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
        <CommonLayout>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/*" element={
              <Private>
              <Routes>
                <>
                <Route path="/" element={<Home />} />
                <Route path="/post" element={<Post3 />} />
                <Route path="/article/:postId" element={<PostPage />} />
                <Route path="/userpage" element={<UserPage />} />
                </>
            </Routes>
            </Private>
          }
          />        
          </Routes>
        </CommonLayout>
      </AuthContext.Provider>
      </PostIdContext.Provider>

    </Router>
  )
}

export default App