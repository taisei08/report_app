import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const EmailInputPage = ({ onNext }) => {
  const [email, setEmail] = useState("");

  const handleNext = () => {
    // バリデーションなどが必要であればここで行う
    // 例: メールアドレスの形式チェック

    // ユーザー名、アカウント名、パスワードの入力画面に遷移
    onNext({ email: email });
  };

  return (
    <div>
      <TextField
        variant="outlined"
        required
        fullWidth
        label="メールアドレス"
        value={email}
        margin="dense"
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button
        variant="outlined"
        color="primary"
        disabled={!email}
        onClick={handleNext}
      >
        次へ
      </Button>
    </div>
  );
};

export default EmailInputPage;

