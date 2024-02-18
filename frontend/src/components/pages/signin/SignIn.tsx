import { useState, useContext } from "react";
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
import AlertMessage from "components/utils/error/AlertMessage";
import { signIn } from "lib/api/auth";
import { SignInData } from "interfaces/index";
import { useFormState } from "../../utils/error/useFormState";


const useStyles = makeStyles((theme: Theme) => ({
  
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
  const [formState, setFormState] = useFormState();

  const handleSuccessLogin = (res: any) => {
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
    }
    else {
      navigate("/");
    }

    console.log("Signed in successfully");
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

    if (!formState.isSubmitting) {
      try {
        setFormState({ alertMessageOpen: false, isSubmitting: true });
        handleCookies();

        const res = await signIn(data);
        setFormState({ alertSeverity: undefined });
        handleSuccessLogin(res);
      } catch (err) {
        setFormState({ alertSeverity: 'error', alertMessage: 'メールアドレスかパスワードが間違っています' });
      } finally {
        setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
      }
    }
  };

  return (
    <>
      <form>
        <Card
        style={{ width: '100%', maxWidth: 512}}
        >
        <CardHeader
          title="サインイン"
          style={{ textAlign: "center" }}
        />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="メールアドレス"
              value={email}
              margin="dense"
              autoComplete="email"
              onChange={e => {
                setEmail(e.target.value);
                setFormState({ isChanged: true });
              }}
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
              onChange={e => {
                setPassword(e.target.value);
                setFormState({ isChanged: true });
              }}
            />
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              disabled={!email || !password || formState.isSubmitting || !formState.isChanged}
              onClick={handleClickSubmit}
              fullWidth
            >
              ログイン
            </Button>
            <Box style={{ marginTop: '1rem' }}>
              <Typography align="center">
              <Link
                to="/reset-password"
                className={classes.resetPasswordLink}
                style={{
                  color: 'blue',
                  textDecoration: 'none',
                  cursor: 'pointer', 
                  borderBottom: '1px solid transparent', 
                  transition: 'border-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                パスワードを忘れた場合
              </Link>
              </Typography>
            </Box>
              <Divider style={{ marginTop: '1rem' }}/>
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
          </CardContent>
        </Card>
      </form>
      {formState.alertSeverity && (
        <AlertMessage
          open={formState.alertMessageOpen}
          setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
          severity={formState.alertSeverity}
          message={formState.alertMessage}
        />
      )}
    </>
  );
};

export default SignIn;
