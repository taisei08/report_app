import React from "react";
import Button from "@material-ui/core/Button";

const ProfileSettingPage = (props) => {

  const { userData, setUserData, onNext } = props;
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)


  return (
    <div>
      <p>誕生日や学校情報を設定しましょう！</p>
      {/* フォームをここに追加 */}
      <Button variant="outlined" color="primary" onClick={() => console.log("保存")}>
        保存
      </Button>
    </div>
  );
};

export default ProfileSettingPage;
