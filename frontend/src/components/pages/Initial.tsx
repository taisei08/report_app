import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { makeStyles, Theme } from "@material-ui/core/styles"
import AlertMessage from "components/utils/AlertMessage"
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
const Initial: React.FC = () => {

  const navigation = useNavigate()

  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

 
  // ステップの管理
  const [step, setStep] = useState<number>(1);

  // ユーザー情報
  const [userData, setUserData] = useState<{
    accountName: string;
    iconPath: File | null; // iconPathの型をFileまたはnullに変更
    school: string;
    facultyDepartment: string;
    profileStatement: string;
  }>({
    accountName: '',
    iconPath: null,
    school: '',
    facultyDepartment: '',
    profileStatement: '',
  });

  const handleNextStep = (data: any) => {
    // ユーザー情報を更新
    setUserData((prevData) => ({ ...prevData, ...data }));
    // ステップを進める
    setStep((prevStep) => prevStep + 1);
    console.log(data)
  };


  return (
    <>
    <div>
      {step === 1 && <SignUpSuccessPage
      userData={userData}
      setUserData={setUserData}
      onNext={handleNextStep}/>}
      {step === 2 && <IconSettingPage onNext={handleNextStep} />}
      {step === 3 && (
        <ProfileSettingPage
          onNext={handleNextStep}
          onSignUp={handleSignUp}
        />
      )}
    </div>
      <AlertMessage // エラーが発生した場合はアラートを表示
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="メールアドレスかパスワードが間違っています"
      />
    </>
  )
}

export default Initial