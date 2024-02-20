import { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom"
import Cookies from "js-cookie"
import CommonLayout from "components/layouts/CommonLayout"
import DeleteComplete from "components/pages/setting/DeleteComplete"
import Home from "components/pages/Home"
import LikeList from "components/pages/post/LikeList"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/signin/SignIn"
import UploadPage from "components/pages/UploadPage"
import EditPage from "components/pages/post/EditPage"
import PostPage from "components/pages/post/PostPage"
import EditProfilePage from "components/pages/setting/EditProfilePage"
import EditUserNamePage from "components/pages/setting/EditUserNamePage"
import UserPage from "components/pages/UserPage"
import Initial from "components/pages/Initial"
import ResetPassword from "components/pages/signin/ResetPassword"
import Search from "components/pages/Search"
import EditPasswordPagePhase1 from "components/pages/setting/EditPasswordPagePhase1"
import EditPasswordPagePhase2 from "components/pages/setting/EditPasswordPagePhase2"
import EditMailAddressPage from "components/pages/setting/EditMailAddressPage"
import DeleteAccountPage from "components/pages/setting/DeleteAccountPage"
import EditInterests from "components/pages/setting/EditInterests"
import EditMailAddressCompletePage from "components/pages/setting/EditMailAddressCompletePage"
import NotFound from "components/pages/NotFound"
import RatingList from "components/pages/post/RatingList"
import { getCurrentUser } from "lib/api/auth"
import { User } from "interfaces/index"

export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

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

  const Private = ({ children }: { children: React.ReactElement }) => {
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

  const NotSignin = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (!isSignedIn) {
        return children
      } else {
        return <Navigate replace to="/" />
      }
    } else {
      return <></>
    }
  }

  const FirstSession = ({ children }: { children: React.ReactElement }) => {
    if (Cookies.get("_first_session")) {
      return children
    } else {
      return <Navigate replace to="/" />
    }
  }

  const AccountDeleted = ({ children }: { children: React.ReactElement }) => {
    if (Cookies.get("_account_deleted")) {
      return children
    } else {
      return <Navigate replace to="/" />
    }
  }

  const ChangeEmail = ({ children }: { children: React.ReactElement }) => {
    if (Cookies.get("_new_email")) {
      return children
    } else {
      return <Navigate replace to="/" />
    }
  }

  return (

    
    <Router>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
        <CommonLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/not_found" element={<NotFound />} />
            <Route path="/article/:postId" element={<PostPage />} />
            <Route path="/article/:postId/likes" element={<LikeList />} /> 
            <Route path="/article/:postId/ratings" element={<RatingList />} /> 
            <Route path="/userpage/:userId" element={<UserPage />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/settings/edit_new_password" element={<EditPasswordPagePhase2 />} />
            <Route
              path="/email_confirmed/*"
              element={
                <ChangeEmail>
                  <Routes>
                    <Route index element={<EditMailAddressCompletePage />} />
                  </Routes>
                </ChangeEmail>
              }
            /> 
            <Route
              path="/deleted/*"
              element={
                <AccountDeleted>
                  <Routes>
                    <Route index element={<DeleteComplete />} />
                  </Routes>
                </AccountDeleted>
              }
            />
            <Route
              path="/signup/*"
              element={
                <NotSignin>
                  <Routes>
                    <Route index element={<SignUp />} />
                  </Routes>
                </NotSignin>
              }
            />
            <Route
              path="/signin/*"
              element={
                <NotSignin>
                  <Routes>
                    <Route index element={<SignIn />} />
                  </Routes>
                </NotSignin>
              }
            />
            <Route path="/*" element={
              <>
                <Private>
                  <Routes>
                    <Route path="/post" element={<UploadPage />} />
                    <Route path="/article/:postId/edit" element={<EditPage />} />
                    <Route path="/settings/edit_profile" element={<EditProfilePage />} />
                    <Route path="/settings/edit_user_name" element={<EditUserNamePage />} />
                    <Route path="/settings/edit_password" element={<EditPasswordPagePhase1 />} />
                    <Route path="/settings/edit_email" element={<EditMailAddressPage />} />
                    <Route path="/settings/delete_account" element={<DeleteAccountPage />} />
                    <Route path="/settings/edit_interests" element={<EditInterests />} />
                    <Route path="/initial" 
                      element={
                        <FirstSession>
                          <Routes>
                            <Route index element={<Initial />} />
                          </Routes>
                        </FirstSession>
                      }
                    />
                  </Routes>
                </Private>
              </>
            }
            />        
          </Routes>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  )
}

export default App