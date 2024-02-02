import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import { useSearchParams } from 'react-router-dom'
import { getAuthHeaders } from 'lib/api/auth';

const UserProfileEditPage5 = () => {
  const [userData, setUserData] = useState()
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState<{
    password: string;
    passwordConfirmation: string;
  }>({
    password: '',
    passwordConfirmation: '',

  });
  const accessToken = searchParams.get('access-token');
  const clientId = searchParams.get('client_id');
  const config = searchParams.get('config');
  const expiry = searchParams.get('expiry');
  const resetPassword = searchParams.get('reset_password');
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  // ヘッダーに含めて送信するロジックをここに実装
  const headers = {
    'access-token': accessToken,
    'client': searchParams.get('client'),
    'client-id': clientId,
    'config': config,
    'expiry': expiry,
    'reset-password': resetPassword,
    'token': token,
    'uid': uid,
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
      setUserData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log(searchParams.get('access-token'))
      // ユーザーデータを更新するAPIリクエスト
      await client.put('auth/password', formData,
      { headers: headers });
      console.log('User data updated successfully!');
      console.log(formData);

    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="settings-page">
    
    <div>
      <h1>Edit Profile</h1>
      <form>
        <label>
          新しいパスワード
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <label>
          新しいパスワード(確認)
          <input
            type="text"
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
      </form>
    </div>
    </div>

  );
};

export default UserProfileEditPage5;

