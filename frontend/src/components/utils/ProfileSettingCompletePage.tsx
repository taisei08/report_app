import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from "@material-ui/core/Button";

const ProfileSettingCompletePage = () => {

  useEffect(() => {
    Cookies.remove("_first_session")
  }, [])

  return (
    <div>
      <h1>設定が完了しました！</h1>
      <p>全ての設定が完了しました。</p>
      <Link to="/">
        <Button variant="outlined" color="primary">
          ホーム画面に遷移する
        </Button>
      </Link>
    </div>
  );
};

export default ProfileSettingCompletePage;