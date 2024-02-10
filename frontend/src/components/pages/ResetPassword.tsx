import { useState, useEffect } from 'react';
import client from 'lib/api/client';

const ResetPassword = () => {
  const [userData, setUserData] = useState()
  const [formData, setFormData] = useState<{
    redirect_url: string;
    email: string;
  }>({
    
    redirect_url: 'http://localhost:3000/settings/edit_profile4',
    email: '',
  });

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
      await client.post(`/auth/password`, formData);
      console.log(formData)
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="settings-page">    
    <div>
      <h1>パスワード変更</h1>
      <form>
        <label>
          現在のメールアドレス
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleSave}>
          メールを送信
        </button>
      </form>
    </div>
    </div>

  );
};

export default ResetPassword;

