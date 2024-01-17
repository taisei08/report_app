import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import { makeStyles, Theme } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Button from "@material-ui/core/Button"

import { AuthContext } from "App"
import AlertMessage from "components/utils/AlertMessage"
import { signUp } from "lib/api/auth"
import { SignUpData } from "interfaces/index"

import EmailInputPage from "components/utils/EmailInputPage"
import UserInfoInputPage from "components/utils/UserInfoInputPage"
import SignUpSuccessPage from "components/utils/SignUpSuccessPage"
import IconSettingPage from "components/utils/IconSettingPage"
import ProfileSettingPage from "components/utils/ProfileSettingPage"

const useStyles = makeStyles((theme: Theme) => ({
  submitBtn: {
    paddingTop: theme.spacing(2),
    textAlign: "right",
    flexGrow: 1,
    textTransform: "none"
  },
  header: {
    textAlign: "center"
  },
  card: {
    padding: theme.spacing(2),
    maxWidth: 400
  }
}))

// サインアップ用ページ
const SignUp: React.FC = () => {
  const classes = useStyles()
  const navigation = useNavigate()

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)

  const [userName, setUserName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data: SignUpData = {
      userName: userName,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }

    try {
      const res = await signUp(data)
      console.log(res)

      if (res.status === 200) {
        // アカウント作成と同時にサインインさせてしまう
        // 本来であればメール確認などを挟むべきだが、今回はサンプルなので
        Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])

        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        navigation("/")

        console.log("Signed in successfully!")
      } else {
        setAlertMessageOpen(true)
      }
    } catch (err) {
      console.log(err)
      setAlertMessageOpen(true)
    }
  }

  // ステップの管理
  const [step, setStep] = useState<number>(1);

  // ユーザー情報
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleNextStep = (data: any) => {
    // ユーザー情報を更新
    setUserData((prevData) => ({ ...prevData, ...data }));
    // ステップを進める
    setStep((prevStep) => prevStep + 1);
    console.log(data)
  };


  return (
    <div>
      {step === 1 && (
        <EmailInputPage onNext={handleNextStep} />
      )}
      {step === 2 && (
        <UserInfoInputPage
        userData={userData}
        setUserData={setUserData}
        onNext={handleNextStep}/>
      )}
      <AlertMessage // エラーが発生した場合はアラートを表示
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="メールアドレスかパスワードが間違っています"
      />
    </div>
  )
}

export default SignUp