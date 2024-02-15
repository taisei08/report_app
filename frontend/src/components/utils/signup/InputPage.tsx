import { useState } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import { signUp } from "lib/api/auth";
import AlertMessage from "../error/AlertMessage";
import { SignUpData } from "interfaces";
import ErrorMessage from "../error/ErrorMessage";

interface Props {
  handleIsSuccessful: () => void;
}

const InputPage: React.FC<Props> = ({ handleIsSuccessful }) => {
  const confirmSuccessUrl: string = "http://localhost:3000";
  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    userName: "",
    password: "",
    passwordConfirmation: "",
    confirmSuccessUrl: confirmSuccessUrl
  });
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [userNameFormatError, setUserNameFormatError] = useState<boolean>(false);
  const [userNameLengthError, setUserNameLengthError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const checkPassword = () => {
    const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*[^\x01-\x7E]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(true);
      return true
    }
    else {
      setPasswordError(false);
      return false
    }
  };

  const checkPasswordConfirmation = () => {
    if (formData.password == formData.passwordConfirmation) {
      setPasswordConfirmationError(false);
      return false
    }
    else {
      setPasswordConfirmationError(true);
      return true
    }
  };

  const checkuserNameFormat = () => {
    const userNameRegex: RegExp = /^[a-zA-Z0-9_-]*$/;
    if (!userNameRegex.test(formData.userName)) {
      setUserNameFormatError(true);
      return true
    }
    else {
      setUserNameFormatError(false);
      return false
    }
  };

  const checkuserNameLength = () => {
    if (!(formData.userName.length > 0 && formData.userName.length <= 32)) {
      setUserNameLengthError(true);
      return true
    }
    else {
      setUserNameLengthError(false);
      return false
    }
  };

  const checkEmail = () => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      console.log(!emailRegex.test(formData.email))
      setEmailError(true);
      return true
    } 
    else {
      setEmailError(false);
      return false
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    checkPassword();
    checkPasswordConfirmation();
    checkEmail();
    checkuserNameFormat();
    checkuserNameLength();
  
    if (!passwordError && !passwordConfirmationError && !emailError && !userNameFormatError && !userNameLengthError) {
      if (!isSubmitting) {
        try {
          setIsSubmitting(true);
          const res = await signUp(formData);
          if (res.status === 200) {
            handleIsSuccessful();
          } else {
            setAlertMessageOpen(true);
          }
        } catch (err: any) {
          setErrorMessage(err.response.data.errors);
          setAlertMessageOpen(true);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  return (
    <Card style={{ width: '100%', maxWidth: 512 }}>
      <CardHeader title="新規登録" style={{ textAlign: "center" }} />
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="メールアドレス"
            name="email"
            value={formData.email}
            margin="dense"
            autoComplete="email"
            onChange={handleChange}
          />
          {emailError && <ErrorMessage message='正しいメールアドレスを入力してください' />}
          <TextField
            variant="outlined"
            required
            fullWidth
            label="ユーザー名"
            name="userName"
            value={formData.userName}
            margin="dense"
            autoComplete="username"
            onChange={handleChange}
          />
          {userNameFormatError && <ErrorMessage message='半角英数字と特殊文字は-と_のみが使用できます' />}
          {userNameLengthError && <ErrorMessage message='32文字以内で入力してください' />}
          <TextField
            variant="outlined"
            required
            fullWidth
            label="パスワード"
            type="password"
            name="password"
            value={formData.password}
            margin="dense"
            onChange={handleChange}
            autoComplete="current-password"
            onFocus={() => setPasswordError(false)}
          />
          {passwordError && <ErrorMessage message='パスワードは8文字以上で、大文字・小文字・数字・特殊文字を含み半角文字のみで構成される必要があります' />}
          <TextField
            variant="outlined"
            required
            fullWidth
            label="パスワード確認"
            type="password"
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            margin="dense"
            autoComplete="current-password"
            onChange={handleChange}
          />
          {passwordConfirmationError && <ErrorMessage message='パスワードが一致しません' />}
          <Button
            variant="contained"
            color="primary"
            disabled={!formData.email || !formData.userName || !formData.password || !formData.passwordConfirmation || isSubmitting}
            onClick={handleSubmit}
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            登録
          </Button>
          <AlertMessage
            open={alertMessageOpen}
            setOpen={setAlertMessageOpen}
            severity="error"
            message={`${errorMessage}`}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default InputPage;