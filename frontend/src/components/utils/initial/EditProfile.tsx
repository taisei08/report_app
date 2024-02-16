import { useState, useEffect, useRef } from 'react';
import { CardContent, Typography } from '@material-ui/core';
import { Box, Button, Container, Card, IconButton, TextField, Modal, Slider } from '@mui/material';
import { CloudUpload, ZoomIn, ZoomOut } from '@material-ui/icons';
import { red } from '@mui/material/colors';
import AvatarEditor from 'react-avatar-editor';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import SettingsMenu from 'components/utils/setting/SettingsMenu';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from "../../utils/error/useFormState";

interface User {  
  userId: number;
  accountName: string;
  iconPath: { file: File | null; url: string };
  school: string;
  facultyDepartment: string;
  profileStatement: string;
}

interface Props {
  onNext: () => void;
}

const EditProfile: React.FC<Props> = ({ onNext }) => {
  const [image, setImage] = useState<File | null>(null);
  const [editor, setEditor] = useState<AvatarEditor | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>({
    userId: 0,
    accountName: '',
    iconPath: { file: null, url: '' },
    school: '',
    facultyDepartment: '',
    profileStatement: '',
  });
  const [formState, setFormState] = useFormState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await client.get<User>("/users_index_for_header", { headers: getAuthHeaders() });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const cancelModal = () => {
    setIsModalOpen(false);
    resetModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModal();
    if (editor && image) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = "icon.png";
          const file = new File([blob], fileName, {
            type: "image/png",
            lastModified: new Date().getTime(),
          });
          setUserData(prevUserData => ({
            ...prevUserData,
            iconPath: {
              ...prevUserData.iconPath,
              url: URL.createObjectURL(file),
              file: file
            }
          }));
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }, "image/png");
      setFormState({ isChanged: true });
    }
  };

  const resetModal = () => {
    setScale(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      openModal();
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleScaleChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setScale(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevUserData => ({ ...prevUserData, [name]: value }));
    setFormState({ isChanged: true });
  };

  const handleSave = async () => {
    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.put(`/users/${userData.userId}`, createFormData(userData), { headers: getAuthHeaders() });
      onNext();
      console.log('ユーザーデータが正常に更新されました！');
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: 'ユーザーデータの更新に失敗しました' });
      console.error('ユーザーデータの更新エラー:', error);
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  const createFormData = (data: User) => {
    const formData = new FormData();
    formData.append('userId', data.userId.toString());
    formData.append('accountName', data.accountName);
    formData.append('iconPath', data.iconPath.file || '');
    formData.append('school', data.school);
    formData.append('facultyDepartment', data.facultyDepartment);
    formData.append('profileStatement', data.profileStatement);
    return formData;
  };

  return (
    <>
      <SettingsMenu />
      <Card>
        <CardContent>
          <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
            プロフィールの編集
          </Typography>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            {userData.iconPath.url && (
              <img
                src={userData.iconPath.url}
                alt="アイコン"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  marginBottom: '1rem',
                  boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)'
                }}
              />
            )}
          </Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <Container style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handleUploadButtonClick}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              画像をアップロード
            </Button>
          </Container>

          <Modal
            open={isModalOpen}
            onClose={closeModal}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Card style={{ marginTop: '4rem', maxHeight: '400px', overflow: 'auto' }}>
              <CardContent>
                <Typography variant="h5" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  アイコンを編集
                </Typography>
                {image && (
                  <AvatarEditor
                    ref={setEditor}
                    image={image}
                    scale={scale}
                    borderRadius={125}
                    style={{ display: 'flex', margin: '0 auto' }}
                  />
                )}
                <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <IconButton onClick={() => setScale(prev => Math.max(prev - 0.1, 0.1))} color="primary">
                    <ZoomOut />
                  </IconButton>
                  <Slider
                    min={0.1}
                    max={2}
                    step={0.01}
                    value={scale}
                    onChange={handleScaleChange}
                    aria-labelledby="image-scale"
                    valueLabelDisplay="auto"
                    style={{ flexGrow: 1 }}
                  />
                  <IconButton onClick={() => setScale(prev => Math.min(prev + 0.1, 2))} color="primary">
                    <ZoomIn />
                  </IconButton>
                </Container>

                <Box display="flex" justifyContent="space-between">
                  <Button onClick={cancelModal} style={{ color: red[500] }}>キャンセル</Button>
                  <Button onClick={closeModal}>変更</Button>
                </Box>
              </CardContent>
            </Card>
          </Modal>

          <TextField
            label="ニックネーム"
            name="accountName"
            value={userData.accountName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            label="プロフィール文"
            name="profileStatement"
            value={userData.profileStatement}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ maxLength: 160 }}
          />

          <TextField
            label="学校名"
            name="school"
            value={userData.school}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ maxLength: 30 }}
          />

          <TextField
            label="専攻"
            name="facultyDepartment"
            value={userData.facultyDepartment}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ maxLength: 40 }}
          />
          <Container style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleSave}
              disabled={formState.isSubmitting || !formState.isChanged}
            >
              変更を保存
            </Button>
          </Container>
        </CardContent>
      </Card>
      {formState.alertSeverity && (
        <AlertMessage
          open={formState.alertMessageOpen}
          setOpen={(isOpen: boolean) => setFormState({ alertMessageOpen: isOpen })}
          severity={formState.alertSeverity}
          message={formState.alertMessage}
        />
      )}
    </>
  );
};

export default EditProfile;
