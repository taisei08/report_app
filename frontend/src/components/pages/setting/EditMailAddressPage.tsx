import React, { useState } from 'react';
import { Typography, makeStyles, Theme, Card, CardContent, TextField, Button, Box } from '@material-ui/core';
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

const EditMailAddressPage = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    confirmSuccessUrl: 'http://localhost:3000',
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

    if (emailError) {
      return;
    }

    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.put('/auth', formData, { headers: getAuthHeaders() });
      setFormState({ alertSeverity: 'info', alertMessage: '新しいアドレスに確認メールを送信しました。添付のリンクをクリックし確認を完了させてください' });
      console.log('User data updated successfully!');
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: '正しい形式で入力してください' });
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
          <h1>メールアドレス変更</h1>
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            新しいメールアドレスを入力してください。データを送った後確認メールが送信されます
          </Typography>
          <form>
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
