import { useEffect } from "react";
import Cookies from "js-cookie";
import Button from "@material-ui/core/Button";

const SignUpSuccessPage = (props) => {

  useEffect(() => {
    Cookies.remove("_first_session")
  }, [])

  return (
    <div>
      <p>登録が成功しました！</p>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => props.onNext()}
      >
        アイコンを設定する
      </Button>
    </div>
  );
};

export default SignUpSuccessPage;