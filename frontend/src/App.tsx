import React, { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom"
import Cookies from "js-cookie"
import CommonLayout from "components/layouts/CommonLayout"
import AccountDeleteComplete from "components/utils/AccountDeleteComplete"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Post3 from "components/pages/Post3"
import Post4 from "components/pages/Post4"
import PostPage from "components/pages/PostPage"
import UserPage from "components/pages/UserPage"
import UserProfileEditPage2 from "components/pages/UserPage2"
import UserProfileEditPage3 from "components/pages/UserPage3"
import Initial from "components/pages/Initial"
import ResetPassword from "components/pages/ResetPassword"
import Search from "components/pages/Search"
import UserProfileEditPage4 from "components/pages/UserPage4"
import UserProfileEditPage5 from "components/pages/UserPage5"
import UserProfileEditPage6 from "components/pages/UserPage6"
import UserProfileEditPage7 from "components/pages/UserPage7"
import UserProfileEditPage8 from "components/pages/UserPage8"
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
  const [isFirstsession, setIsFirstsession] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()
  const [sendPostId, setSendPostId] = useState(0)

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()

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
        return <Navigate replace to="/" />
      }
    } else {
      return <></>
    }
  }

  const FirstSession = ({ children }: { children: React.ReactElement }) => {
    console.log(Cookies.get("_first_session"))
    if (Cookies.get("_first_session")) {
      return children
    } 
    else {
      return <Navigate replace to="/" />
    }
  }

  const AccountDeleted = ({ children }: { children: React.ReactElement }) => {
    console.log(Cookies.get("_account_deleted"))
    if (Cookies.get("_account_deleted")) {
      return children
    } 
    else {
      return <Navigate replace to="/" />
    }
  }

  return (

    
    <Router>
      <PostIdContext.Provider value={{ sendPostId, setSendPostId }}>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
        <CommonLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:postId" element={<PostPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/userpage/:userId" element={<UserProfileEditPage3 />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/settings/userpage4" element={<UserProfileEditPage5 />} />
            <Route
              path="/deleted"
              element={
                <AccountDeleted>
                  <Routes>
                  <Route index element={<AccountDeleteComplete />} />
                  </Routes>
                </AccountDeleted>
              }
            />       
            

            <Route path="/*" element={
              <Private>
              <Routes>
                <>
                  <Route path="/post" element={<Post3 />} />
                  <Route path="/article/:postId/edit" element={<Post4 />} />
                  <Route path="/settings/userpage" element={<UserPage />} />
                  <Route path="/settings/userpage2" element={<UserProfileEditPage2 />} />
                  <Route path="/settings/userpage3" element={<UserProfileEditPage4 />} />
                  <Route path="/settings/userpage5" element={<UserProfileEditPage6 />} />
                  <Route path="/settings/userpage6" element={<UserProfileEditPage7 />} />
                  <Route path="/settings/userpage7" element={<UserProfileEditPage8 />} />

                  
                  <Route
                    path="/initial"
                    element={
                      <FirstSession>
                        <Routes>
                        <Route index element={<Initial />} />
                        </Routes>
                      </FirstSession>
                    }
                  />       

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