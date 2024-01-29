import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/SettingsMenu';

const UserProfileEditPage6 = () => {
  const [userData, setUserData] = useState()
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // ユーザーデータを更新するAPIリクエスト
      await client.put("/auth", formData,
      { headers: getAuthHeaders() });
      console.log(formData)
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="settings-page">
    <SettingsMenu />
    
    <div>
      <h1>メールアドレス変更</h1>
      <form>
        <label>
          新しいメールアドレス
          <input
            type="text"
            name="email"
            value={formData.email}
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

export default UserProfileEditPage6;

