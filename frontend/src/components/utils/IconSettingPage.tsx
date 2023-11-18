import { useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from 'react-modal';
import AvatarEditor from "react-avatar-editor";
import defaultIcon from "../../assets/images/default_icon.png";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";



const IconSettingPage = (props) => {
  const [image, setImage] = useState(defaultIcon);
  const [editor, setEditor] = useState();
  const [scale, setScale] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    const canvas = editor.getImageScaledToCanvas();
    canvas.toBlob((blob) => {
      const fileName = "icon.png";
      const file = new File([blob], fileName, {
        type: "image/png",
        lastModified: new Date().getTime(),
      });
      setImage(file); // トリミング後の画像を設定
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

  const handleSave = async () => {
    try {
      // ユーザーデータを更新するAPIリクエスト
      await client.put("/users/1", createFormData(image),
      { headers: getAuthHeaders() });
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const createFormData = (imageData) => {
    const formData = new FormData();
    if (imageData) {
      formData.append('iconPath', imageData);
    }
    return formData;
  };
  
  return (
    <div>
          {console.log(1 + image)}
      <h1>Edit Profile</h1>
      <form>
        {image !== null ? (
  typeof image === 'string' ? (
    // iconPathがstringの場合
    <img
      src={image}
      alt="アイコン"
      style={{ width: '100px', height: '100px' }}
    />
    ) : (
      // iconPathがFileの場合
      <img
        src={URL.createObjectURL(image)}
        alt="アイコン"
        style={{ width: '100px', height: '100px' }}
      />
      )
    ) : (
      // iconPathがnullの場合
      <p>アイコンがありません</p>
    )}
      <input type="file" onChange={handleImageChange} />
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <>
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
        </>
      </Modal>
      </form>
      <p>アイコンを設定しましょう！</p>
      {/* アイコンアップロードや設定のためのフォームをここに追加 */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          handleSave()
          props.onNext()}}
      >
        次へ
      </Button>
    </div>
  );
};

export default IconSettingPage;