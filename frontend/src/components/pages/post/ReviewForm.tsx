import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@material-ui/core';

interface Props {
  reviewComment: string;
  setReviewComment: React.Dispatch<React.SetStateAction<string>>;
  handleReviewSubmit: () => void;
}



const ReviewForm: React.FC<Props> = ({ reviewComment, setReviewComment, handleReviewSubmit }) => {
  
  return (
    <Card>
      <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Typography variant="body1" style={{fontWeight: 'bold'}}>レビューの投稿:</Typography>
        <TextField
          label="レビューを入力してください"
          multiline
          rows={4}
          value={reviewComment}
          onChange={e => setReviewComment(e.target.value)}
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
