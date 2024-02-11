import { useState } from "react"
import InputNewPassword from "../../utils/signin/resetpassword/InputNewPassword";
import Finish from "components/utils/Finish";


const EditPasswordPagePhase2: React.FC = () => {
  // ステップの管理
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const handleIsSuccessful = () => {
    setIsSuccessful(true);
  };


  return (
    <>
      {!isSuccessful && (
        <InputNewPassword handleIsSuccessful={handleIsSuccessful} />
      )}
      {isSuccessful && (
        <Finish
          mainText='パスワードの変更が完了しました'
          subText='下のボタンを押してログインしましょう'
          buttonText='サインイン'
          buttonUrl='/signin'
        />
      )}
    </>
  )
}

export default EditPasswordPagePhase2;