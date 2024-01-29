import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import AvatarEditor from 'react-avatar-editor'
import Modal from 'react-modal';
import { getAuthHeaders } from 'lib/api/auth';

const UserProfileEditPage = () => {
  const [image, setImage] = useState();
  const [editor, setEditor] = useState();
  const [scale, setScale] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<{
    userId: number;
    accountName: string;
    iconPath: File | null; // iconPathの型をFileまたはnullに変更
    school: string;
    facultyDepartment: string;
    profileStatement: string;
  }>({
    
    userId: 0,
    accountName: '',
    iconPath: null,
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
      const response = await client.get("/users_index_for_header",
      { headers: getAuthHeaders() });
      setUserData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    const canvas = editor.getImageScaledToCanvas();
    canvas.toBlob((blob) => {
      // BlobをFileに変換
      const fileName = "icon.png"; // ファイル名を設定
      const file = new File([blob], fileName, {
        type: "image/png", // MIMEタイプを設定
        lastModified: new Date().getTime(),
      });
      console.log(file); // ファイルオブジェクトが表示される
      setUserData((prevUserData) => ({
        ...prevUserData,
        iconPath: file,
      }));
    }, "image/png");

  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    openModal();
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
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
      // ユーザーデータを更新するAPIリクエスト
      console.log(userData)
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
    <div>
      <h1>Edit Profile</h1>
      <form>
        {console.log(userData.iconPath)}
      {userData.iconPath !== null && (
        <img
        src={Object.values(userData.iconPath)}
        alt="アイコン"
        style={{ width: '100px', height: '100px' }}
        />
      )
      }

      <input type="file" onChange={handleImageChange} />
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>

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
        <button onClick={closeModal}>Close</button>
      </Modal>
        <label>
          Account Name:
          <input
            type="text"
            name="accountName"
            value={userData.accountName}
            onChange={handleInputChange}
          />
        </label>
        <label>
        Profile Statement:
          <input
            type="text"
            name="profileStatement"
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
            name="facultyDepartment"
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

