import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography, TextareaAutosize } from '@material-ui/core';
import Button from '@mui/material/Button';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from 'components/utils/error/useFormState';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  textArea: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submitButton: {
    height: '30px',
  },
}));

interface Props {
  id: number;
  fetchData: (shouldIncrementPage?: boolean, shouldIncrementReply?: boolean) => Promise<void>;
  setShowReplyData?: (prevData: boolean) => void;
}

const ReplyForm: React.FC<Props> = ({ id, fetchData, setShowReplyData }) => {
  const classes = useStyles();
  const [replyText, setReplyText] = useState<string>('');
  const [isInputValid, setIsInputValid] = useState<boolean>(false);
  const [formState, setFormState] = useFormState();

  const handleReplySubmit = async () => {
    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      await client.post('/replies', { reviewId: id, reply: replyText }, { headers: getAuthHeaders() });
      console.log('Reply data sent successfully');
      await fetchData(true, true);
      setReplyText('');
      if (setShowReplyData) {setShowReplyData(true);}
      setFormState({ alertSeverity: 'success', alertMessage: 'リプライを送信しました' });
    } catch (error) {
      console.error('Error sending reply data:', error);
      setFormState({ alertSeverity: 'error', alertMessage: 'リプライの送信に失敗しました' });
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setReplyText(e.target.value);
      setFormState({ isChanged: true });
    }
    const inputValue = e.target.value;
    setIsInputValid(inputValue.trim().length > 0);
  };

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="body1" style={{fontWeight: 'bold'}}>返信:</Typography>
          <TextareaAutosize
            minRows={5}
            value={replyText}
            onChange={handleChange}
            className={classes.textArea}
          />
          <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button
              onClick={handleReplySubmit}
              variant="contained"
              className={classes.submitButton}
              disabled={!replyText || !isInputValid || formState.isSubmitting || !formState.isChanged}
            >
              送信
            </Button>
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
    </>
  );
};

export default ReplyForm;