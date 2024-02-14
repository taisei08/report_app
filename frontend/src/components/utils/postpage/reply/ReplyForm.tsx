import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography, TextareaAutosize } from '@material-ui/core';
import Button from '@mui/material/Button';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';

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
}

const ReplyForm: React.FC<Props> = ({ id, fetchData }) => {
  const classes = useStyles();
  const [replyText, setReplyText] = useState<string>('');

  const handleReplySubmit = async () => {
    try {
      await client.post('/replies', { reviewId: id, reply: replyText }, { headers: getAuthHeaders() });
      console.log('Reply data sent successfully');
      await fetchData(true, true);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply data:', error);
    }
  };

  return (
    <Box>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="body1" style={{fontWeight: 'bold'}}>返信:</Typography>
          <TextareaAutosize
            minRows={5}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className={classes.textArea}
          />
          <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button
              onClick={handleReplySubmit}
              variant="contained"
              className={classes.submitButton}
            >
              送信
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReplyForm;