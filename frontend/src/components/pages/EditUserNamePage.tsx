import { useState, useEffect, ChangeEvent } from 'react';
import { Typography, Box, Card, CardContent, TextField, Button } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/setting/SettingsMenu';
import ErrorMessage from 'components/utils/ErrorMessage';
import AlertMessage from 'components/utils/AlertMessage';
import { useFormState } from './useFormState';
import { checkUserNameFormat, checkUserNameLength } from 'lib/function';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '60vw',
    alignItems: 'center',
    marginTop: theme.spacing(2),
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

const EditUserNamePage: React.FC = () => {
  const classes = useStyles();
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<number>();
  const [formState, setFormState] = useFormState();
  const [userNameFormatError, setUserNameFormatError] = useState<boolean>(false);
  const [userNameLengthError, setUserNameLengthError] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await client.get("/users_index_for_header", { headers: getAuthHeaders() });
      setUserName(response.data.userName);
      setUserId(response.data.userId);
    } catch (error) {
      console.error('ユーザーデータの取得エラー:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserName(value);
    setFormState({ isChanged: true });
  };

  const handleSave = async () => {
    setUserNameFormatError(checkUserNameFormat(userName));
    setUserNameLengthError(checkUserNameLength(userName));

    if (userNameFormatError || userNameLengthError) {
      return;
    }

    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.put(`/users/${userId}`, { userName }, { headers: getAuthHeaders() });
      setFormState({ alertSeverity: "success", alertMessage: 'ユーザーデータが正常に更新されました' });
    } catch (error) {
      console.error('ユーザーデータの更新エラー:', error);
      setFormState({ alertSeverity: "error", alertMessage: '正しい形式で入力してください' });
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  return (
    <Box className={classes.root}>
      <SettingsMenu />
      <Card>
        <CardContent>
          <h1>アカウント</h1>
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            新しいユーザー名を入力してください
          </Typography>
          <Box className={classes.form}>
            <TextField
              label="ユーザー名"
              variant="outlined"
              name="userName"
              value={userName}
              onChange={handleInputChange}
              required
              fullWidth
              margin="dense"
              autoComplete="username"
            />
            {userNameFormatError && <ErrorMessage message='半角英数字と特殊文字は-と_のみが使用できます' />}
            {userNameLengthError && <ErrorMessage message='32文字以内で入力してください' />}
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              onClick={handleSave}
              disabled={!userName || formState.isSubmitting || !formState.isChanged}
            >
              更新する
            </Button>
          </Box>
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

export default EditUserNamePage;
