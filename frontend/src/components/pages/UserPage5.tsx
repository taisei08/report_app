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
    resetPasswordToken: string|null;
  }>({
    password: '',
    passwordConfirmation: '',
    resetPasswordToken: searchParams.get('access-token')
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
    setFormData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // ユーザーデータを更新するAPIリクエスト
      await client.put('auth/password', formData,
      { headers: getAuthHeaders() });
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

