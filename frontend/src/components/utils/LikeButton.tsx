import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';


const LikeButton = ( props ) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUser, setlikeUser] = useState();

  const getItemId = (id, type) => {
    if (type === 'post') {
      return { postId: id };
    } else if (type === 'review') {
      return { reviewId: id };
    } else if (type === 'reply') {
      return { replyId: id };
    } else {
      // タイプが未知の場合にデフォルト値を返すか、エラー処理を追加することもできます
      return {};
    }
  };

  const id = getItemId(props.id, props.type)
  

  useEffect(() => {
    // コンポーネントがマウントされたときに、いいねの総数を取得
    fetchLike();
  }, []);

  const fetchLike = async () => {
    try {
      const [response1, response2] = await Promise.all([
        client.get(`/likes`, { params: id, headers: getAuthHeaders()}),
        client.get('/like_counts', { params: id, headers: getAuthHeaders()}),
      ]);
      setlikeUser(response1.data.likes);
      setLiked(response2.data.is_liked);
      setLikeCount(response2.data.count);
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await client.delete('/likes', { params: id, headers: getAuthHeaders() });
        setLikeCount(likeCount - 1); // いいねが削除されたので総数を減らす
      } else {
        await client.post('/likes', id, { headers: getAuthHeaders() });
        setLikeCount(likeCount + 1); // いいねが追加されたので総数を増やす
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };


  return (
    <div>
      <button onClick={handleLike}>
        {liked ? 'いいね済み' : 'いいね'}
      </button>
      <span>{likeCount} いいね</span>
    </div>
  );
};

export default LikeButton;