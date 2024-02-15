import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import AlertMessage from 'components/utils/error/AlertMessage';
import { useFormState } from 'components/utils/error/useFormState';

interface Props {
  reviewComment: string;
  setReviewComment: React.Dispatch<React.SetStateAction<string>>;
  fetchReviews: () => Promise<void>;
}

const ReviewForm: React.FC<Props> = ({ reviewComment, setReviewComment, fetchReviews }) => {
  const { postId } = useParams<{ postId: string }>();
  const [isInputValid, setIsInputValid] = useState<boolean>(false);
  const [formState, setFormState] = useFormState();

  const handleReviewSubmit = async () => {
    try {
      setFormState({ alertMessageOpen: false, isSubmitting: true });
      const response = await client.post('/reviews', { postId, review: reviewComment }, { headers: getAuthHeaders() });
      console.log('Review data sent successfully:', response.data);
      await fetchReviews();
    } catch (error) {
      setFormState({ alertSeverity: 'error', alertMessage: 'レビューの送信に失敗しました' });
      console.error('Error sending review data:', error);
    } finally {
      setFormState({ isSubmitting: false, alertMessageOpen: true, isChanged: false });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setReviewComment(inputValue);
    setIsInputValid(inputValue.trim().length > 0);
    setFormState({ isChanged: true });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body1" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>レビューの投稿:</Typography>
          <TextField
            label="レビューを入力してください"
            multiline
            rows={4}
            value={reviewComment}
            onChange={handleInputChange}
            fullWidth
            inputProps={{ maxLength: 1000 }}
          />
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="contained" onClick={handleReviewSubmit} disabled={!reviewComment || !isInputValid || formState.isSubmitting || !formState.isChanged}>投稿する</Button>
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

export default ReviewForm;
