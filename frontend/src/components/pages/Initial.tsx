import { useState } from "react"
import SignUpSuccess from "components/utils/initial/SignUpSuccess"
import EditProfile from "components/utils/initial/EditProfile"
import EditInterests from "components/utils/initial/EditInterests"
import Finish from "components/utils/Finish"

const Initial: React.FC = () => {
  const [step, setStep] = useState<number>(1);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <>
      {step === 1 && <SignUpSuccess
      onNext={handleNextStep}/>}
      {step === 2 && <EditProfile
      onNext={handleNextStep}/>}
      {step === 3 && <EditInterests
      onNext={handleNextStep}/>}
      {step === 4 && (
        <Finish
        mainText='設定が完了しました'
        subText='ボタンを押してホーム画面に進みましょう'
        buttonText='ホームへ'
        buttonUrl={'/'}
        />
      )}
    </>
  )
}

export default Initial