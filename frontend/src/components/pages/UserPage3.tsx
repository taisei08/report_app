import { useState, useEffect } from 'react';
import client from 'lib/api/client';
import PostList2 from 'components/utils/PostList2';
import ReviewList from 'components/utils/ReviewList';
import { useParams } from 'react-router-dom';
import { getAuthHeaders } from 'lib/api/auth';
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

  const [Reviews, setReviews] = useState(); // デフォルトは投稿

  useEffect(() => {
    // ページが読み込まれたときにユーザーデータを取得する
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // ユーザーデータをAPIから取得
      const response = await client.get('/users',
      { headers: getAuthHeaders() });
      setUserData(response.data);
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
        {contentType === 'like' && <p>ここにいいねが表示されます。</p>}
    </div>
    </div>
  );
};

export default UserProfileEditPage3;

