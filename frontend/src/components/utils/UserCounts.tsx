import { Link, useLocation } from 'react-router-dom';

const UserCounts = ({ id, postsCount, followingsCount, followersCount, resetParentState }) => {
  const currentLocation = useLocation();
  const reset = resetParentState;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
      <p>
          <strong>投稿数: </strong>
          <Link to={{ ...currentLocation }} onClick={reset}>{postsCount}</Link>
      </p>
      <p>
          <strong>フォロー数: </strong>
          <Link to={"following"}>{followingsCount}</Link>
      </p>
      <p>
          <strong>フォロワー数: </strong>
          <Link to={"follower"}>{followersCount}</Link>
      </p>
    </div>
  );
};

export default UserCounts;