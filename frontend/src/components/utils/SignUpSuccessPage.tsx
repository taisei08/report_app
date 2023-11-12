import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const SignUpSuccessPage = () => {
  return (
    <div>
      <p>登録が成功しました！</p>
      <Button
        variant="outlined"
        color="primary"
        component={Link}
        to="/signup/icon"
      >
        アイコンを設定する
      </Button>
    </div>
  );
};

export default SignUpSuccessPage;