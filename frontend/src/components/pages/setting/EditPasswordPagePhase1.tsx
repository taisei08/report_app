import { useState } from 'react';
import { Typography, makeStyles, Theme, Card, CardContent, TextField, Button, Box } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/setting/SettingsMenu';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from "../../utils/error/useFormState";

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

const EditPasswordPagePhase1 = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    redirect_url: 'http://localhost:3000/settings/edit_new_password',
    email: '',
  });
  const [formState, setFormState] = useFormState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setFormState({ isChanged: true });
  };

  const handleSave = async () => {
    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.post(`/auth/password`, formData, { headers: getAuthHeaders() });
      setFormState({
        alertSeverity: 'info',
        alertMessage: 'パスワード変更用のメールを送信しました。ご登録のメールアドレスをご確認ください'
      });
      console.log(formData);
      console.log('User data updated successfully!');
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: 'メールアドレスが間違っています' });
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
          <h1>パスワード変更</h1>
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            ご登録のメールアドレスにパスワード変更用のリンクを記載したメールを送付します
          </Typography>
          <form>
            <Box className={classes.form}>
              <TextField
                label="現在のメールアドレス"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                margin="dense"
                autoComplete="email"
              />
              <Button
                variant="contained"
                className={classes.button}
                onClick={handleSave}
                disabled={!formData.email || formState.isSubmitting || !formState.isChanged}
              >
                送信
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

export default EditPasswordPagePhase1;
