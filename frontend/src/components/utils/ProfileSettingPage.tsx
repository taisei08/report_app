import React from "react";
import Button from "@material-ui/core/Button";

const ProfileSettingPage = () => {
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
