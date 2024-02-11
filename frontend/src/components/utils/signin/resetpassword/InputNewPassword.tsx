import { useState } from 'react';
import { Typography, makeStyles, Card, CardContent, TextField, Button, Box } from '@material-ui/core';
import client from 'lib/api/client';
import AlertMessage from 'components/utils/error/AlertMessage';
import ErrorMessage from 'components/utils/error/ErrorMessage';
import { useFormState } from "../../error/useFormState";
import { checkPassword, checkPasswordConfirmation } from 'lib/function';
import { useSearchParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    marginTop: theme.spacing(2),
    width: '70vw'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  handleIsSuccessful: () => void;
}

const InputNewPassword: React.FC<Props> = ({ handleIsSuccessful }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmation: '',
  });
  const [formState, setFormState] = useFormState();
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const accessToken = searchParams.get('access-token');
  const clientId = searchParams.get('client_id');
  const uid = searchParams.get('uid');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setPasswordError(checkPassword(formData.password));
    setPasswordConfirmationError(checkPasswordConfirmation(formData.password,formData.passwordConfirmation));

    if (checkPassword(formData.password) || checkPasswordConfirmation(formData.password,formData.passwordConfirmation)) {
      return;
    }

    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.put('auth/password', formData,
      { headers: {
        'access-token': accessToken,
        'client': clientId,
        'uid': uid,
      } });
      setFormState({ alertSeverity: undefined });
      handleIsSuccessful();
      console.log('User data updated successfully!');
      console.log(formData);

    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: 'パスワードの変更に失敗しました' });
      console.error('Error updating user data:', error);
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  return (
    <Box className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant='h4' style={{textAlign: 'center', fontWeight: 'bold'}}>パスワード変更</Typography>
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            新しいパスワードを入力してください。
          </Typography>
          <form className={classes.form}>
            <TextField
              label="新しいパスワード"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
              margin="dense"
            />
            {passwordError && <ErrorMessage message='パスワードは8文字以上で、大文字・小文字・数字・特殊文字を含み半角文字のみで構成される必要があります' />}
            <TextField
              label="新しいパスワード(確認)"
              variant="outlined"
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleInputChange}
              required
              fullWidth
              margin="dense"
            />
            {passwordConfirmationError && <ErrorMessage message='パスワードが一致しません' />}
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              onClick={handleSave}
              disabled={!formData.password || !formData.passwordConfirmation || formState.isSubmitting}
            >
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
      {formState.alertSeverity && (
        <AlertMessage
          open={formState.alertMessageOpen}
          setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
          severity={formState.alertSeverity}
          message={formState.alertMessage}
        />
      )}
    </Box>
  );
};

export default InputNewPassword;