import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import PostList2 from 'components/utils/PostList2';
import ReviewList from 'components/utils/ReviewList';
import LikeList from 'components/utils/LikeList';
import { useParams } from 'react-router-dom';
import { getAuthHeaders } from 'lib/api/auth';
import FollowButton from 'components/utils/FollowButton';
import UserCounts from 'components/utils/UserCounts';

const UserProfileEditPage3 = () => {
  const Id = useParams()
  const [contentType, setContentType] = useState('post'); // デフォルトは投稿
  const [userData, setUserData] = useState<{
    userId: number;
    userName: string;
    accountName: string;
    iconPath: File | null; // iconPathの型をFileまたはnullに変更
    birthday: string
    school: string;
    facultyDepartment: string;
    profileStatement: string;
  }>({
    
    userId: Number(Id.userId),
    userName: '',
    accountName: '',
    iconPath: null,
    birthday: '',
    school: '',
    facultyDepartment: '',
    profileStatement: '',
  });
  const [counts, setCounts] = useState()

  useEffect(() => {
    // ページが読み込まれたときにユーザーデータを取得する
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // ユーザーデータをAPIから取得
      const [response1, response2] = await Promise.all([
        client.get('/users', { headers: getAuthHeaders() }),
        client.get('/follow_and_post_counts', {
          params: { userId: Id.userId },
          headers: getAuthHeaders(),
        })      
      ]);
      setUserData(response1.data);
      console.log(response2.data);
      setCounts(response2.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleButtonClick = (newContentType) => {
    setContentType(newContentType);
  };

  const resetParentState = () => {
    setContentType('post');
  };

  return (
    <div>
    <h1>User Profile</h1>
    <p>Account Name: {userData.accountName}</p>
    {/* iconPathの表示はフォームや画像タグを使用 */}
    <p>School: {userData.school}</p>
    <p>Faculty Department: {userData.facultyDepartment}</p>
    <p>Profile Statement: {userData.profileStatement}</p>
    {
  counts && (
    <UserCounts
      id= {Id.userId}
      postsCount={counts.posts}
      followingsCount={counts.folloings}
      followersCount={counts.followers}
      resetParentState={resetParentState}
    />
  )
    }
    <FollowButton id={Id.userId}/>
    <div>
        <button onClick={() => handleButtonClick('post')}>投稿を表示</button>
        <button onClick={() => handleButtonClick('review')}>レビューを表示</button>
        <button onClick={() => handleButtonClick('like')}>いいねを表示</button>
    </div>
    <div>
        {contentType === 'post' &&
          <PostList2
          id= {Id.userId}
          />
          }
        {contentType === 'review' && 
          <ReviewList
          id= {Id.userId}
          resetParentState={resetParentState}
          />
          }
        {contentType === 'like' &&
          <LikeList
          id= {Id.userId}
          resetParentState={resetParentState}
          />
          }
    </div>
    </div>
  );
};

export default UserProfileEditPage3;

