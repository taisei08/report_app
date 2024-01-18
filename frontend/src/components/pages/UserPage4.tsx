import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/SettingsMenu';

const UserProfileEditPage2 = () => {
  const [userData, setUserData] = useState<{
    userName: string;
    userId: number;
  }>({
    
    userName: '',
    userId: 0,
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
      setUserData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // ユーザーデータを更新するAPIリクエスト
      await client.put(`/users/${userData.userId}`, createFormData(userData),
      { headers: getAuthHeaders() });
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const createFormData = (data): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  return (
    <div className="settings-page">
    <SettingsMenu />
    
    <div>
      <h1>Edit Profile</h1>
      <form>
        <label>
          User Name:
          <input
            type="text"
            name="userName"
            value={userData.userName}
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

export default UserProfileEditPage2;

