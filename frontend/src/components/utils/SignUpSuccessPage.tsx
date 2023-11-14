import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const SignUpSuccessPage = (props) => {
  return (
    <div>
      <p>登録が成功しました！</p>
      <Button
        variant="outlined"
        color="primary"
        onClick={props.onNext}
      >
        アイコンを設定する
      </Button>
    </div>
  );
};

export default SignUpSuccessPage;