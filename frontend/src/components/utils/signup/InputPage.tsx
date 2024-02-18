import { useState } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import { signUp } from "lib/api/auth";
import AlertMessage from "../error/AlertMessage";
import ErrorMessage from "../error/ErrorMessage";
import { useFormState } from "../error/useFormState";
import { checkUserNameFormat, checkUserNameLength, checkEmail, checkPassword, checkPasswordConfirmation } from "lib/function";
import { SignUpData } from "interfaces";

interface Props {
  handleIsSuccessful: () => void;
}

const InputPage: React.FC<Props> = ({ handleIsSuccessful }) => {
  const confirmSuccessUrl: string = "http://localhost:3000";
  const [formState, setFormState] = useFormState();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormState({ isChanged: true });
  };

  const handleSubmit = async () => {
    setPasswordError(checkPassword(formData.password));
    setPasswordConfirmationError(checkPasswordConfirmation(formData.password, formData.passwordConfirmation));
    setEmailError(checkEmail(formData.email));
    setUserNameFormatError(checkUserNameFormat(formData.userName));
    setUserNameLengthError(checkUserNameLength(formData.userName));
  
    if (!checkPassword(formData.password) &&
        !checkPasswordConfirmation(formData.password, formData.passwordConfirmation) &&
        !checkEmail(formData.email) &&
        !checkUserNameLength(formData.userName) &&
        !userNameLengthError){

      if (!formState.isSubmitting) {
        try {
          setFormState({ alertMessageOpen: false, isSubmitting: true });
          await signUp(formData);
          handleIsSuccessful();
        } catch (err: any) {
          setFormState({ alertSeverity: 'error', alertMessage: 'ユーザー名かメールアドレスは既に使用されています' });
        } finally {
          setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
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
            disabled={!formData.email || !formData.userName || !formData.password || !formData.passwordConfirmation || formState.isSubmitting || !formState.isChanged}
            onClick={handleSubmit}
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            登録
          </Button>
          {formState.alertSeverity && (
            <AlertMessage
              open={formState.alertMessageOpen}
              setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
              severity={formState.alertSeverity}
              message={formState.alertMessage}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default InputPage;