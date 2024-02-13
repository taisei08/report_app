import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import { Reply } from 'interfaces';

interface Props {
  reply: Reply;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
}

const ReplyEditForm: React.FC<Props> = ({ reply, setModalOpen, modalOpen }) => {
  const [editingReply, setEdtingReply] = useState<string>(reply.reply);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleReplyUpdate = async () => {
    try {
      const response = await client.put(`/replies/${reply.replyId}`, { reply: editingReply }, { headers: getAuthHeaders() });
      console.log('Reply data updated successfully:', response.data);
      reply.reply = editingReply;
      handleClose();
    } catch (error) {
      console.error('Error updating reply data:', error);
    }
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={handleClose}
      >
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh'}}>
          <Card>
            <CardContent>
              <Typography variant="body1" style={{ marginBottom: 10, fontWeight: 'bold' }}>リプライの編集:</Typography>
              <TextField
                label="リプライを入力してください"
                multiline
                rows={4}
                value={editingReply}
                onChange={(e) => setEdtingReply(e.target.value)}
                style={{ width: 'calc(min(600px, 90vw))' }}
              />
              <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button variant="contained" onClick={handleReplyUpdate}>編集する</Button>
                <Button variant="contained" onClick={handleClose} style={{ marginLeft: '1rem' }}>キャンセル</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
};

export default ReplyEditForm;