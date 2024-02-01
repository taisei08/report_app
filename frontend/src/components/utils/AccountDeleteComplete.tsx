import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from "@material-ui/core/Button";

const AccountDeleteComplete = () => {

  useEffect(() => {
    Cookies.remove("_account_deleted")
  }, [])

  return (
    <div>
      <h1>アカウントの消去が完了しました！</h1>
      <Link to="/">
        <Button variant="outlined" color="primary">
          トップ画面に戻る
        </Button>
      </Link>
    </div>
  );
};

export default AccountDeleteComplete;