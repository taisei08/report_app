import { Link } from 'react-router-dom'; // React Routerが使える場合

const SettingsMenu = () => {
  return (
    <div className="settings-menu">
      <h2>設定メニュー</h2>
      <ul>
        <li><Link to="/settings/userpage2">アカウント</Link></li>
        <li><Link to="/settings/password">パスワード</Link></li>
        <li><Link to="/settings/userpage">プロフィール</Link></li>
        {/* 他の設定項目を追加 */}
      </ul>
    </div>
  );
};

export default SettingsMenu;