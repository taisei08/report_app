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

import InputPage from "components/utils/signup/InputPage"
import CheckMail from "components/utils/CheckMail"

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

  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  // ステップの管理
  const [step, setStep] = useState<number>(1);

  const handleNextStep = () => {
    // ユーザー情報を更新
    // ステップを進める
    setStep((prevStep) => prevStep + 1);
  };


  return (
    <div>
      {step === 1 && (
        <InputPage onNext={handleNextStep} />
      )}
      {step === 2 && (
        <CheckMail/>
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