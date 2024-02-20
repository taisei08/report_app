import { useState, useEffect, useContext } from 'react';
import { Typography, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import { red } from '@mui/material/colors';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import { AuthContext } from 'App';

interface Props {
  id: number;
  type: 'post' | 'review' | 'reply';
  disabled?: boolean;
}

const LikeButton: React.FC<Props> = ({ id, type, disabled=false }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const { isSignedIn } = useContext(AuthContext)
  

  const getItemId = (id: number, type: string): { [key: string]: number } => {
    if (type === 'post') {
      return { postId: id };
    } else if (type === 'review') {
      return { reviewId: id };
    } else if (type === 'reply') {
      return { replyId: id };
    } else {
      return {};
    }
  };

  const like: { [key: string]: number } = getItemId(id, type);

  const fetchLikeCount = async () => {
    try {
      const response = await client.get('/like_counts', { params: like, headers: getAuthHeaders() });
      setLiked(response.data.isLiked);
      setLikeCount(response.data.count);
    } catch (error) {
      console.error('いいね数の取得中にエラーが発生しました:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await client.delete('/likes/1', { params: like, headers: getAuthHeaders() });
        setLikeCount(likeCount - 1);
      } else {
        await client.post('/likes', like, { headers: getAuthHeaders() });
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('いいねの処理中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    fetchLikeCount();
  }, []);

  return (
    <>
      <IconButton onClick={handleLike} disabled={!isSignedIn || disabled}>
        {liked ? (
          <Favorite style={{ color: red[500] }} />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>
      <Typography variant="body2" color="textSecondary" component="span">
        {likeCount}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="span" style={{marginRight: 10}}>
        いいね
      </Typography>
    </>
  );
};

export default LikeButton;
