import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import Avatar from 'react-avatar';

interface Props {
  icon: string | undefined;
  id: string | undefined;
  handleSignOut: () => Promise<void>
}

const MenuButton: React.FC<Props> = ({ icon, id, handleSignOut }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = (destination: string) => {
    navigate(destination);
    handleMenuClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen} style={{paddingRight: '0px'}}>
        <Avatar size="40" round={true} src={icon}/>
      </IconButton>
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleMenuItemClick(`/userpage/${id}`)}>マイページ</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("settings/edit_user_name")}>設定</MenuItem>
        <MenuItem onClick={handleSignOut}>ログアウト</MenuItem>
      </Menu>
    </>
  );
};

export default MenuButton;
