import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import AvatarEditor from 'react-avatar-editor';
import Modal from 'react-modal';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/setting/SettingsMenu';
import { Card, Box, TextField, Button } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';

const EditProfilePage = () => {
  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    userId: 0,
    accountName: '',
    iconPath: null,
    school: '',
    facultyDepartment: '',
    profileStatement: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await client.get("/users_index_for_header", { headers: getAuthHeaders() });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    const canvas = editor.getImageScaledToCanvas();
    canvas.toBlob((blob) => {
      const fileName = "icon.png";
      const file = new File([blob], fileName, {
        type: "image/png",
        lastModified: new Date().getTime(),
      });
      setUserData(prevUserData => ({ 
        ...prevUserData, 
        iconPath: {
          ...prevUserData.iconPath,
          url: URL.createObjectURL(file)
        } 
      }));
    }, "image/png");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    openModal();
    setUserData(prevUserData => ({ 
      ...prevUserData, 
      iconPath: {
        ...prevUserData.iconPath,
        url: null
      } 
    }));
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.getElementById('icon-button-file');
    fileInput.click();
  };

  const handleScaleChange = (e) => setScale(parseFloat(e.target.value));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevUserData => ({ ...prevUserData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await client.put(`/users/${userData.userId}`, createFormData(userData), { headers: getAuthHeaders() });
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  return (
    <Box p={2}>
      <SettingsMenu />
      <h1>プロフィール</h1>
      <Card>
        <Box p={2}>
          {userData.iconPath !== null && (
            <img
              src={userData.iconPath.url}
              alt="Icon"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          )}

            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={handleUploadButtonClick}
              >
                画像をアップロード
              </Button>
            </Box>
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
              {image && (
                <AvatarEditor
                  ref={setEditor}
                  image={image}
                  width={250}
                  height={250}
                  scale={scale}
                  borderRadius={125}
                />
              )}
            </label>
            <button onClick={closeModal}>Close</button>
          </Modal>

          <TextField
            label="ニックネーム"
            name="accountName"
            value={userData.accountName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="プロフィール文"
            name="profileStatement"
            value={userData.profileStatement}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="学校名"
            name="school"
            value={userData.school}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="専攻"
            name="facultyDepartment"
            value={userData.facultyDepartment}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default EditProfilePage;
