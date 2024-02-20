import { useState } from 'react';
import { Typography, makeStyles, Card, CardContent, TextField, Button, Box } from '@material-ui/core';
import client from 'lib/api/client';
import { useFormState } from 'components/utils/error/useFormState';
import AlertMessage from 'components/utils/error/AlertMessage';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    width: '70vw',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    marginTop: theme.spacing(2),
    width: '100%',
    maxWidth: '500px',
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

const EmailInput: React.FC<Props> = ({ handleIsSuccessful }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    redirect_url: `${process.env.REACT_APP_FRONTEND_URL}/settings/edit_new_password`,
    email: '',
  });
  const [formState, setFormState] = useFormState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.post(`/auth/password`, formData);
      setFormState({ alertSeverity: undefined });
      handleIsSuccessful();
      console.log('data updated successfully!');
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: 'メールアドレスが間違っています' });
      console.error('Error updating data:', error);
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true });
    }
  };

  return (
    <Box className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h4' style={{textAlign: 'center', fontWeight: 'bold'}}>パスワード変更</Typography>
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            ご登録のメールアドレスにパスワード変更用のリンクを記載したメールを送付します
          </Typography>
          <form className={classes.form} onSubmit={(e) => { e.preventDefault(); }}>
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
              disabled={!formData.email || formState.isSubmitting}
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

export default EmailInput;
