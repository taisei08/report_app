import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import { Reply } from 'interfaces';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from 'components/utils/error/useFormState';

interface Props {
  reply: Reply;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
}

const ReplyEditForm: React.FC<Props> = ({ reply, setModalOpen, modalOpen }) => {
  const [editingReply, setEditingReply] = useState<string>(reply.reply);
  const [isInputValid, setIsInputValid] = useState<boolean>(false);
  const [formState, setFormState] = useFormState();

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setEditingReply(e.target.value);
      setFormState({ isChanged: true });
    }
    const inputValue = e.target.value;
    setIsInputValid(inputValue.trim().length > 0);
  };

  const handleReplyUpdate = async () => {
    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      const response = await client.put(`/replies/${reply.replyId}`, { reply: editingReply }, { headers: getAuthHeaders() });
      console.log('Reply data updated successfully:', response.data);
      reply.reply = editingReply;
      handleClose();
    } catch (error) {
      console.error('Error updating reply data:', error);
      setFormState({ alertSeverity: 'error', alertMessage: 'リプライの編集に失敗しました' });
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  return (
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
              onChange={handleChange}
              inputProps={{ maxLength: 1000 }}
              style={{ width: 'calc(min(600px, 90vw))' }}
            />
            <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button 
                variant="contained"
                onClick={handleReplyUpdate} 
                disabled={!editingReply || !isInputValid || formState.isSubmitting || !formState.isChanged}
              >
                編集する
              </Button>
              <Button variant="contained" onClick={handleClose} sx={{ marginLeft: '1rem' }}>キャンセル</Button>
            </Box>
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
      </Box>
    </Modal>
  );
};

export default ReplyEditForm;
