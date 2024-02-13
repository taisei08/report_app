import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Menu, MenuItem, IconButton } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import ConfirmationDialog from 'components/utils/ConfirmationDialog';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from 'components/utils/error/useFormState';

const HamburgerMenu: React.FC<{ isYourPost: boolean }> = ({ isYourPost }) => {
  const { postId } = useParams<{ postId?: string }>();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const navigate = useNavigate();
  const [formState, setFormState] = useFormState();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteConfirmation = () => {
    handleMenuClose();
    setShowConfirmation(true);
  };

  const handleDelete = async () => {
    setFormState({ alertMessageOpen: false });
  
    try {
      await client.delete(`/posts/${postId}`, { headers: getAuthHeaders() });
      console.log('削除が成功しました');
      setShowConfirmation(false);
      setFormState({ alertSeverity: 'success', alertMessage: '投稿の削除に成功しました' });
      setFormState({ alertMessageOpen: true });
      navigate('/');
    } catch (error) {
      console.error('削除中にエラーが発生しました', error);
      setShowConfirmation(false);
      setFormState({ alertSeverity: 'error', alertMessage: '投稿の削除に失敗しました' });
    } finally {
      setFormState({ alertMessageOpen: true });
    }
  };
  

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {isYourPost && [
          <MenuItem key="edit" onClick={() => navigate(`/article/${postId}/edit`)}>
            <Typography variant="body2">編集</Typography>
          </MenuItem>,
          <MenuItem key="delete" onClick={handleDeleteConfirmation}>
            <Typography variant="body2">削除</Typography>
          </MenuItem>
        ]}
        <MenuItem onClick={() =>{navigate(`/article/${postId}/likes`)}}>
          <Typography variant="body2">いいねしたユーザーを表示</Typography>
        </MenuItem>
      </Menu>
      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleDelete}
        title="投稿の削除"
        content="本当に投稿を削除しますか？"
        cancelText="戻る"
        confirmText="削除"
      />
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

export default HamburgerMenu;