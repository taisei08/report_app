import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography, IconButton, Menu, MenuItem } from "@material-ui/core";
import { Reply } from "interfaces";
import UserInfo from 'components/utils/posts/post_item/UserInfo';
import LikeButton from '../LikeButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ConfirmationDialog from 'components/utils/ConfirmationDialog';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import ReplyEditForm from './ReplyEditForm';
import ExpandText from 'components/utils/userpage/ExpandText';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  reply: Reply;
  currentUserId: number;
}

const ReplyItem: React.FC<Props> = ({ reply, currentUserId }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null); // メニューアンカーエレメントの状態

  const handleModalOpen = () => {
    setModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      const response = await client.delete(`/replies/${replyId}`, { headers: getAuthHeaders() });
      console.log('削除が成功しました', response);
      reply.reply = '';
      setShowConfirmation(false);
    } catch (error) {
      console.error('削除中にエラーが発生しました', error);
    }
  };

  const showDialog = () => {
    setShowConfirmation(true);
  };

  if (!reply.reply) return null;

  return (
    <Box key={reply.replyId}>
      <Card className={classes.card}>
        <CardContent>
          <UserInfo
            userId={reply.userId}
            userName={reply.userName}
            iconPath={reply.iconPath}
            createdAt={reply.createdAt}
          />
          <ExpandText statement={reply.reply} length={100}/>
        </CardContent>
        <CardContent>
          <LikeButton id={reply.replyId} type="reply" />
          {currentUserId === reply.userId && (
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleModalOpen}>
              <Typography variant="body2">編集</Typography>
            </MenuItem>
            <MenuItem onClick={showDialog}>
              <Typography variant="body2">削除</Typography>
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
      {modalOpen && <ReplyEditForm reply={reply} setModalOpen={setModalOpen} modalOpen={modalOpen} />}
      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => handleDeleteReply(reply.replyId)}
        title="リプライの削除"
        content="本当にリプライを削除しますか？"
        cancelText="戻る"
        confirmText="削除"
      />
    </Box>
  );
};

export default ReplyItem;