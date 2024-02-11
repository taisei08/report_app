import { useState } from "react"
import EditInput from "components/utils/edit/EditInput";
import Finish from "components/utils/Finish";


const EditPage: React.FC = () => {
  // ステップの管理
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const handleIsSuccessful = () => {
    setIsSuccessful(true);
  };


  return (
    <>
      {!isSuccessful && (
        <EditInput handleIsSuccessful={handleIsSuccessful} />
      )}
      {isSuccessful && (
        <Finish
        mainText='更新が完了しました'
        subText='ボタンを押して投稿ページを確認しましょう'
        buttonText='投稿ページへ'
        buttonUrl={-1}
        />
      )}
    </>
  )
}

export default EditPage;