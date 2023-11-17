import { useState } from "react";
import Button from "@material-ui/core/Button";

const ProfileSettingPage = (props) => {

  const { userData, setUserData, onNext } = props;
  const [school, setsc] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");


  return (
    <div>
      <p>通っている(卒業した)学校の名前などを入力</p>
      {/* フォームをここに追加 */}
      <TextField
        variant="outlined"
        required
        fullWidth
        label="学校名"
        value={email}
        margin="dense"
        onChange={(event) => setEmail(event.target.value)}
      />
            <TextField
        variant="outlined"
        required
        fullWidth
        label="学部学科"
        value={email}
        margin="dense"
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button variant="outlined" color="primary" onClick={() => console.log("保存")}>
        保存
      </Button>
    </div>
  );
};

export default ProfileSettingPage;
