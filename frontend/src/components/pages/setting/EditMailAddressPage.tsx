import { useState } from 'react';
import { Typography, makeStyles, Theme, Card, CardContent, TextField, Button, Box } from '@material-ui/core';
import Cookies from 'js-cookie';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/setting/SettingsMenu';
import AlertMessage from 'components/utils/error/AlertMessage';
import ErrorMessage from 'components/utils/error/ErrorMessage';
import { useFormState } from "../../utils/error/useFormState";
import { checkEmail } from 'lib/function';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    marginTop: theme.spacing(2),
    width: 'calc(min(600px, 90vw))',
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

const EditMailAddressPage = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    confirmSuccessUrl: `${process.env.REACT_APP_FRONTEND_URL}/email_confirmed`,
    email: '',
  });
  const [formState, setFormState] = useFormState();
  const [emailError, setEmailError] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
    setFormState({ isChanged: true });
  };

  const handleSave = async () => {
    setEmailError(checkEmail(formData.email));

    if (checkEmail(formData.email)) {
      setFormState({ isChanged: false })
      return;
    }

    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.put('/auth', formData, { headers: getAuthHeaders() });
      setFormState({ alertSeverity: 'info', alertMessage: '新しいアドレスに確認メールを送信しました。添付のリンクをクリックし確認を完了させてください' });
      Cookies.remove('_new_email');
      Cookies.set('_new_email', `${formData.email}`, { expires: 1 });
      console.log('data updated successfully');
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: '既に登録されているメールアドレスです' });
      console.error('Error updating user data:', error);
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  return (
    <Box className={classes.root}>
      <SettingsMenu />
      <Card>
        <CardContent>
          <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
            メールアドレスの変更
          </Typography> 
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            新しいメールアドレスを入力してください。データを送った後確認メールが送信されます
          </Typography>
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <Box className={classes.form}>
              <TextField
                label="新しいメールアドレス"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                margin="dense"
                autoComplete="email"
              />
              {emailError && <ErrorMessage message='メールアドレスの形式が間違っています' />}
              <Button
                variant="contained"
                color="inherit"
                className={classes.button}
                onClick={handleSave}
                disabled={!formData.email || formState.isSubmitting || !formState.isChanged}
              >
                更新する
              </Button>
            </Box>
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

export default EditMailAddressPage;
