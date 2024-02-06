import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Divider } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import { AuthContext } from "App";
import AlertMessage from "components/utils/AlertMessage";
import { signIn } from "lib/api/auth";
import { SignInData } from "interfaces/index";

const useStyles = makeStyles((theme: Theme) => ({
  // 他のスタイル定義は省略
  
  link: {
    textDecoration: "none"
  },
  signUpButton: {
    marginTop: theme.spacing(2),
    textTransform: "none",
    fontWeight: "bold",
    color: theme.palette.common.white,
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark
    },
    width: "100%",
    padding: theme.spacing(2)
  },
  resetPasswordLink: {
    marginTop: theme.spacing(2),
    textDecoration: "none",
    color: theme.palette.text.secondary
  }
}));

const SignIn: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSuccessLogin = (res: any) => {
    setIsSubmitting(false);
    const firstSessionCookie = Cookies.get("_first_session");
    if (firstSessionCookie) {
      Cookies.remove("_first_session");
    }

    if (res.data["cookies"]) {
      Cookies.set("_first_session", res.data["cookies"], { expires: 1 / 144 });
    }
    Cookies.set("_access_token", res.headers["access-token"], { expires: 1 });
    Cookies.set("_client", res.headers["client"], { expires: 1 });
    Cookies.set("_uid", res.headers["uid"], { expires: 1 });

    setIsSignedIn(true);
    setCurrentUser(res.data.data);

    if (res.data["cookies"]) {
      navigate("/initial");
    } else {
      navigate("/");
    }

    console.log("Signed in successfully!");
  };

  const handleLoginError = () => {
    setAlertMessageOpen(true);
  };

  const handleCookies = () => {
    const firstSessionCookie = Cookies.get("_first_session");
    if (firstSessionCookie) {
      Cookies.remove("_first_session");
    }
  };

  const handleClickSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: SignInData = {
      email: email,
      password: password
    };

    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        handleCookies();

        const res = await signIn(data);
        console.log(res);

        if (res.status === 200) {
          handleSuccessLogin(res);
        } else {
          handleLoginError();
        }
      } catch (err) {
        console.log(err);
        handleLoginError();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <form noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="サインイン" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="メールアドレス"
              value={email}
              margin="dense"
              onChange={event => setEmail(event.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="パスワード"
              type="password"
              placeholder="6文字以上"
              value={password}
              margin="dense"
              autoComplete="current-password"
              onChange={event => setPassword(event.target.value)}
            />
            <Box className={classes.submitBtn} style={{ marginTop: '1rem' }}>
              <Button
                type="submit"
                variant="outlined"
                color="inherit"
                disabled={!email || !password || isSubmitting}
                onClick={handleClickSubmit}
                fullWidth
              >
                送信
              </Button>
            </Box>
            <Box textAlign="center" className={classes.box} style={{ marginTop: '1rem' }}>
              <div style={{ display: 'inline-block' }}>
                <Link to="/reset-password" className={classes.resetPasswordLink}>
                  パスワードを忘れた場合
                </Link>
              </div>
            </Box>
            <Box textAlign="center" className={classes.box } style={{ marginTop: '1rem' }}>
              <Divider />
            </Box>
            <Box textAlign="center" className={classes.box}>
              <Button
                variant="contained"
                color="primary"
                className={classes.signUpButton}
                component={Link}
                to="/signup"
                fullWidth
              >
                新規登録
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="メールアドレスかパスワードが間違っています"
      />
    </>
  );
};

export default SignIn;
