import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';

interface Props {
  reviewComment: string;
  setReviewComment: React.Dispatch<React.SetStateAction<string>>;
  fetchReviews: () => Promise<void>; // 非同期関数に変更
}


const ReviewForm: React.FC<Props> = ({ reviewComment, setReviewComment, fetchReviews}) => {

  const Id = useParams()
  const handleReviewSubmit = async () => {
    try {
      const response = await client.post('/reviews', { postId: Id.postId, review: reviewComment }, { headers: getAuthHeaders() });
      console.log('Review data sent successfully:', response.data);
      await fetchReviews();
    } catch (error) {
      console.error('Error sending rating data:', error);
    }
  };

  return (
    <Card>
      <CardContent >
        <Typography variant="body1" style={{fontWeight: 'bold'}}>レビューの投稿:</Typography>
        <TextField
          label="レビューを入力してください"
          multiline
          rows={4}
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          fullWidth
        />
        <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="contained" onClick={handleReviewSubmit}>投稿する</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
