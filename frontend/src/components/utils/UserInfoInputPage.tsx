import React, { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { signUp } from "lib/api/auth";
import Cookies from "js-cookie";
import { AuthContext } from "App";
import AlertMessage from "./AlertMessage";
import { SignUpData } from "interfaces";

const UserInfoInputPage = (props) => {

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)
  const navigation = useNavigate()
  const { userData, setUserData, onNext } = props;
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data: SignUpData = {
      userName: userName,
      email: userData.email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }

    try {
      const res = await signUp(data)
      console.log(res)

      if (res.status === 200) {
        // アカウント作成と同時にサインインさせてしまう
        // 本来であればメール確認などを挟むべきだが、今回はサンプルなので
        Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])

        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        navigation("/initial")

        console.log("Signed in successfully!")
      } else {
        setAlertMessageOpen(true)
      }
    } catch (err) {
      console.log(err)
      setAlertMessageOpen(true)
    }
  }

  return (
    <div>
      <TextField
        variant="outlined"
        required
        fullWidth
        label="ユーザー名"
        value={userName}
        margin="dense"
        onChange={(event) => setUserName(event.target.value)}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        label="パスワード"
        type="password"
        value={password}
        margin="dense"
        onChange={(event) => setPassword(event.target.value)}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        label="パスワード確認"
        type="password"
        value={passwordConfirmation}
        margin="dense"
        onChange={(event) => setPasswordConfirmation(event.target.value)}
      />
      <Button
        variant="outlined"
        color="primary"
        disabled={!userName || !password}
        onClick={handleSubmit}
      >
        登録
      </Button>
      <AlertMessage // エラーが発生した場合はアラートを表示
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="メールアドレスかパスワードが間違っています"
      />
    </div>
  );
};

export default UserInfoInputPage;
