import { useState, useEffect, useContext } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/SettingsMenu';
import Cookies from 'js-cookie';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AlertMessage from 'components/utils/AlertMessage';
import { AuthContext } from 'App';

import { useNavigate } from 'react-router-dom';

const UserProfileEditPage7 = () => {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext)
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate()
  const [formData, setFormData] = useState<{
    password: string;

  }>({
    password: '',

  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // ページが読み込まれたときにユーザーデータを取得する
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // ユーザーデータをAPIから取得
      const response = await client.get("/users_index_for_header",
      { headers: getAuthHeaders() });
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // ユーザーデータを更新するAPIリクエスト
      await client.delete("/auth", {
        data: formData,  // paramsではなくdataを使用
        headers: getAuthHeaders(),
      });
      Cookies.remove("_access_token")
      Cookies.remove("_client")
      Cookies.remove("_uid")
      setIsSignedIn(false)
      Cookies.set("_account_deleted", "true");
      console.log('User data updated successfully!');
      handleClose();
      navigate("/deleted")
    } catch (error) {
      handleClose();
      console.error('Error updating user data:', error);
      const errorMessage = error.response?.data?.message || 'エラーが発生しました。';
      setAlertMessage(errorMessage);
      setAlertMessageOpen(true);
    }
  };


  return (
    <div>
      <SettingsMenu/>
      <h1>アカウントの消去</h1>
      <form>
        <label>
          パスワード
          <TextField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          消去
        </Button>

        {/* 確認用のモーダル */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>アカウントの削除</DialogTitle>
          <DialogContent>
            本当にアカウントを削除しますか？
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              戻る
            </Button>
            <Button onClick={handleSave} color="secondary">
              消去
            </Button>
          </DialogActions>
        </Dialog>
        
      </form>
      <AlertMessage // エラーが発生した場合はアラートを表示
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message={alertMessage}
      />
    </div>
  );
};

export default UserProfileEditPage7;