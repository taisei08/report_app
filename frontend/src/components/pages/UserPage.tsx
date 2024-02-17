import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import { AuthContext } from 'App';
import UserLikePosts from 'components/utils/userpage/UserPosts';
import UserReviews from 'components/utils/userpage/UserReviews';
import LikeList from 'components/utils/userpage/UserLikePosts';
import FollowButton from 'components/utils/userpage/FollowButton';
import UserCounts from 'components/utils/userpage/UserCounts';
import FollowingList from 'components/utils/userpage/FollowingList';
import FollowerList from 'components/utils/userpage/FollowerList';
import UserProfile from 'components/utils/userpage/UserProfile';
import TabSwitcher from 'components/utils/userpage/TabSwitcher';
import { User } from 'interfaces';

interface UserDataCounts {
  posts: number;
  followings: number;
  followers: number;
}

const UserPage = () => {
  const { isSignedIn } = useContext(AuthContext)
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isYourPage, setIsYourPage] = useState<boolean>(false)
  const [contentType, setContentType] = useState<string>('post');
  const [userData, setUserData] = useState<User | undefined>();
  const [dataCounts, setDataCounts] = useState<UserDataCounts | undefined>();

  useEffect(() => {
    fetchUserData();
    setContentType("post");
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const [response1, response2] = await Promise.all([
        client.get('/users', {
          params: { userId },
          headers: getAuthHeaders() }),
        client.get('/follow_and_post_counts', {
          params: { userId },
          headers: getAuthHeaders(),
        })      
      ]);
      console.log(response1.data)
      setUserData(response1.data.user);
      setIsYourPage(response1.data.isMe);
      setDataCounts(response2.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/not_found');
    }
  };

  const handleTabChange = (newValue: string) => {
    setContentType(newValue);
  };

  const resetParentState = () => {
    setContentType('post');
  };

  return (
    <>
      {userData && <UserProfile userData={userData} />}
      {dataCounts && (
        <>
          <UserCounts
            postsCount={dataCounts.posts}
            followingsCount={dataCounts.followings}
            followersCount={dataCounts.followers}
            resetParentState={resetParentState}
            setContentType={setContentType}
          />
          {userId && !isYourPage && isSignedIn && (
            <Box style={{ marginTop: 10 }}>
              <FollowButton id={userId}/>
            </Box>
          )}
        </>
      )}
      {userId && (
        <>
          <TabSwitcher contentType={contentType} handleTabChange={handleTabChange} />
          <Box style={{ display: 'flex', justifyContent: 'center' }} >
            {contentType === 'post' && <UserLikePosts userId={userId} />}
            {contentType === 'review' && <UserReviews userId={userId} />}
            {contentType === 'like' && <LikeList userId={userId} />}
            {contentType === 'following' && <FollowingList userId={userId} />}
            {contentType === 'followed' && <FollowerList userId={userId} />}
          </Box>
        </>
      )}
    </>
  );
};

export default UserPage;
