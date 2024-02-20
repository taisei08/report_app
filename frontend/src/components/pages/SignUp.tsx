import { useState } from "react"
import InputPage from "components/utils/signup/InputPage"
import Finish from "components/utils/Finish";

const SignUp: React.FC = () => {
  
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const handleIsSuccessful = () => {
    setIsSuccessful(true);
  };


  return (
    <>
      {!isSuccessful && (
        <InputPage handleIsSuccessful={handleIsSuccessful} />
      )}
      {isSuccessful && (
        <Finish
        mainText='認証メールを送信しました'
        subText='ご登録のメールアドレスをご確認ください'
        />
      )}
    </>
  )
}

export default SignUp