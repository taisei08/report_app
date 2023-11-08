import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';

type Props = {
  id: string;
  selfId: string; // id プロパティの型を文字列に設定
  // 他のプロパティもここに追加
};

const FollowButton = (props: Props) => {
  console.log(props.id)
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // ページが読み込まれたときにユーザーのフォロー状態を取得
    fetchFollowStatus();
  }, []);

  const fetchFollowStatus = async () => {
    try {
      // ユーザーのフォロー状態をAPIから取得
      const response = await client.get('/follows', {
        params:{userId: props.id}, headers: getAuthHeaders()
      });
      console.log(response)
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error fetching follow status:', error);
    }
  };

  const handleFollow = async () => {
    try {
      // フォローボタンがクリックされたときにフォローを追加
      await client.post(`/follows`, {userId: props.id}, { headers: getAuthHeaders() });
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      // フォローボタンがクリックされたときにフォローを解除
      await client.delete(`/follows/${props.id}`, { headers: getAuthHeaders() });
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (props.id === props.selfId) 
    return null;
  else
    return (
      <div>
        {isFollowing ? (
          <div>
            <button onClick={handleUnfollow}>リムーブ</button>
          </div>
        ) : (
          <button onClick={handleFollow}>フォロー</button>
        )}
      </div>
    );
};

export default FollowButton;
