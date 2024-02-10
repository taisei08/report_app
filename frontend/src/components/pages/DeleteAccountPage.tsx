import { useState, useContext } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/setting/SettingsMenu';
import Cookies from 'js-cookie';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles, Theme, Typography, Box, Card, CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AlertMessage from 'components/utils/AlertMessage';
import { AuthContext } from 'App';
import { useFormState } from './useFormState';
import { useNavigate } from 'react-router-dom';

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
      setFormState({ alertSeverity: undefined });
      Cookies.set("_account_deleted", "true");
      console.log('User data updated successfully!');
      handleClose();
      navigate("/deleted");
    } catch (error) {
      handleClose();
      console.error('Error updating user data:', error);
      setFormState({ alertSeverity: "error", alertMessage: 'パスワードが間違っています' });
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  return (
    <Box style={{width: '60vw'}}>
      <SettingsMenu />
      <Card>
        <CardContent>
          <h1>アカウントの消去</h1>
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            パスワードを入力してください
          </Typography>
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
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>アカウントの削除</DialogTitle>
        <DialogContent>
          本当にアカウントを削除しますか？
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            戻る
          </Button>
          <Button onClick={handleDelete} color="secondary">
            消去
          </Button>
        </DialogActions>
      </Dialog>
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