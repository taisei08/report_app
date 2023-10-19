import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import AvatarEditor from 'react-avatar-editor'
import { getAuthHeaders } from 'lib/api/auth';

const UserProfileEditPage = () => {
  const [image, setImage] = useState();
  const [editor, setEditor] = useState();
  const [scale, setScale] = useState(1);
  const [userData, setUserData] = useState({
    userId: 0,
    accountName: '',
    iconPath: '',
    school: '',
    facultyDepartment: '',
    profileStatement: '',
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    console.log(newScale)
    setScale(newScale);
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
      const canvas = editor.getImageScaledToCanvas().toDataURL();

      // ユーザーデータを更新するAPIリクエスト
      await client.put(`/users/${userData.userId}`, userData,
      { headers: getAuthHeaders() });
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
      <input type="file" onChange={handleImageChange} />
      <input
        type="range"
        min="0.1"
        max="2"
        step="0.01"
        value={scale}
        onChange={handleScaleChange}
      />
        <label>
          Icon
          {
            <AvatarEditor
            ref={(ref) => setEditor(ref)}
            image={image}
            width={250}
            height={250}
            scale={scale}
            borderRadius={125}
            />
          }
        </label>
        <label>
          Account Name:
          <input
            type="text"
            name="account_name"
            value={userData.accountName}
            onChange={handleInputChange}
          />
        </label>
        <label>
        Profile Statement:
          <input
            type="text"
            name="profile_statement"
            value={userData.profileStatement}
            onChange={handleInputChange}
          />
        </label>
        <label>
          School:
          <input
            type="text"
            name="school"
            value={userData.school}
            onChange={handleInputChange}
          />
        </label>
        <label>
        Faculty Department:
          <input
            type="text"
            name="faculty_department"
            value={userData.facultyDepartment}
            onChange={handleInputChange}
          />
        </label>
        {/* 他の入力フィールドも同様に追加 */}
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserProfileEditPage;

