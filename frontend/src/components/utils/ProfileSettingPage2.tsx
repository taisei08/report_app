import { useState } from "react";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";

const ProfileSettingPage2 = (props) => {

  const [accountName, setAccountName] = useState("");
  const [profileStatement, setProfileStatement] = useState("");

  const handleSave = async () => {
    try {

      
      const userData = {
        ...(accountName && { accountName: accountName }),
        ...(profileStatement && { profileStatement: profileStatement }),
      };
      
      if (accountName.trim() === '' && profileStatement.trim() === '' ) {
        // 必要な情報が入力されていない場合は処理を中止
        return;
      }

      console.log(userData)

      // ユーザーデータを更新するAPIリクエスト
      await client.put("/users/1", userData, {
        headers: getAuthHeaders(),
      });
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div>
      <p>表示名とプロフィールぶんを入力</p>
      {console.log(accountName)}
      <TextField
        variant="outlined"
        fullWidth
        label="表示名"
        value={accountName}
        margin="dense"
        onChange={(event) => setAccountName(event.target.value)}
      />
      <TextField
        variant="outlined"
        fullWidth
        label="プロフィール文"
        value={profileStatement}
        margin="dense"
        onChange={(event) => setProfileStatement(event.target.value)}
      />
      <Button variant="outlined" color="primary" onClick={() => {
        handleSave()
        props.onNext()}}>
        保存
      </Button>
    </div>
  );
};

export default ProfileSettingPage2;
