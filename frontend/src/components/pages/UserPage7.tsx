import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/SettingsMenu';
import Cookies from 'js-cookie';

const UserProfileEditPage7 = () => {
  const [formData, setFormData] = useState<{
    confirmSuccessUrl: string;
    email: string;
  }>({
    
    confirmSuccessUrl: "http://localhost:3000",
    email: '',
  });

  useEffect(() => {
    // ページが読み込まれたときにユーザーデータを取得する
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // ユーザーデータをAPIから取得
      const response = await client.get('/users',
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
      await client.delete(`/auth`,
      { headers: getAuthHeaders() });
      Cookies.remove("_access_token")
      Cookies.remove("_client")
      Cookies.remove("_uid")
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="settings-page">
    <SettingsMenu />
    
    <div>
      <h1>アカウントの消去</h1>
      <form>
        <label>
          アカウントの消去
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleSave}>
          消去
        </button>
      </form>
    </div>
    </div>

  );
};

export default UserProfileEditPage7;

