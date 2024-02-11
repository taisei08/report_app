import { useState } from "react"
import EmailInput from "components/utils/signin/resetpassword/EmailInput";
import Finish from "components/utils/Finish";


const ResetPassword: React.FC = () => {
  // ステップの管理
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const handleIsSuccessful = () => {
    setIsSuccessful(true);
  };


  return (
    <>
      {!isSuccessful && (
        <EmailInput handleIsSuccessful={handleIsSuccessful} />
      )}
      {isSuccessful && (
        <Finish
        mainText='パスワード変更用のメールを送信しました'
        subText='ご登録のメールアドレスをご確認ください'
        />
      )}
    </>
  )
}

export default ResetPassword;