import { useState, useContext } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/setting/SettingsMenu';
import Cookies from 'js-cookie';
import { makeStyles, Theme, Typography, Box, Card, CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AlertMessage from 'components/utils/error/AlertMessage';
import { AuthContext } from 'App';
import { useFormState } from '../../utils/error/useFormState';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../utils/ConfirmationDialog';

const useStyles = makeStyles((theme: Theme) => ({
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


const DeleteAccountPage: React.FC = () => {
  const classes = useStyles();
  const { setIsSignedIn } = useContext(AuthContext);
  const [formState, setFormState] = useFormState();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    setFormState({ isChanged: true });
  };

  const handleDelete = async () => {
    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.delete("/auth", {
        data: { password },
        headers: getAuthHeaders(),
      });
      Cookies.remove("_access_token");
      Cookies.remove("_client");
      Cookies.remove("_uid");
      setIsSignedIn(false);
      Cookies.set("_account_deleted", "true");
      setFormState({ alertSeverity: undefined });
      navigate('/deleted')
      console.log(' data updated successfully');
      handleClose();
    } catch (error) {
      handleClose();
      console.error('Error updating user data:', error);
      setFormState({ alertSeverity: "error", alertMessage: 'パスワードが間違っています' });
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  return (
    <Box style={{ width: 'calc(min(400px, 90vw))' }}>
      <SettingsMenu />
      <Card>
        <CardContent>
          <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
            アカウントの消去
          </Typography>          
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            パスワードを入力してください
          </Typography>
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <input type="text" style={{ display: 'none' }} autoComplete='username'/>
            <Box className={classes.form}>
              <TextField
                label="パスワード"
                variant="outlined"
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                required
                fullWidth
                margin="dense"
                autoComplete="current-password"
              />
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="inherit"
                  className={classes.button}
                  onClick={handleOpen}
                  disabled={!password || formState.isSubmitting || !formState.isChanged}
                >
                  消去する
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleDelete}
        title="アカウントの削除"
        content="本当にアカウントを削除しますか？"
        cancelText="戻る"
        confirmText="消去"
      />
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

export default DeleteAccountPage;