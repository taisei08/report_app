import { useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from 'react-modal';
import AvatarEditor from "react-avatar-editor";
import defaultIcon from "../../assets/images/default_icon.png";


interface UserDataType {
  userId: number;
  accountName: string;
  iconPath: string | File | null;
  school: string;
  facultyDepartment: string;
  profileStatement: string;
}

const IconSettingPage = (props: { userData: UserDataType, setUserData: (data: UserDataType) => void, onNext: (data: any) => void }) => {
  const { userData, setUserData, onNext } = props;
  const [image, setImage] = useState();
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
  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
        {console.log(userData.iconPath)}
        {userData.iconPath !== null ? (
  typeof userData.iconPath === 'string' ? (
    // iconPathがstringの場合
    <img
      src={userData.iconPath}
      alt="アイコン"
      style={{ width: '100px', height: '100px' }}
    />
    ) : (
      // iconPathがFileの場合
      <img
        src={URL.createObjectURL(userData.iconPath)}
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
        onClick={onNext}
      >
        次へ
      </Button>
    </div>
  );
};

export default IconSettingPage;