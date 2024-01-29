import { Link, useLocation } from 'react-router-dom';

const UserCounts = ({ id, postsCount, followingsCount, followersCount, resetParentState, setContentType }) => {
  const currentLocation = useLocation();
  const reset = resetParentState;
  const contentType = setContentType;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
      <p>
          <strong>投稿数: </strong>
          <div onClick={reset} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          {postsCount}
          </div>

      </p>
      <p>
          <strong>フォロー数: </strong>
          <div onClick={() => setContentType('following')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          {followingsCount}
          </div>
      </p>
      <p>
          <strong>フォロワー数: </strong>
          <div onClick={() => setContentType('followed')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          {followersCount}
          </div>
      </p>
    </div>
  );
};

export default UserCounts;