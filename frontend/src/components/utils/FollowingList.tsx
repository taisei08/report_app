import { useState, useEffect, useContext } from 'react';
import client from "lib/api/client"
import { PostLists } from "interfaces/index"
import Avatar from 'react-avatar';
import { PostIdContext } from 'App';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { getAuthHeaders } from 'lib/api/auth';

const FollowingList = (props) => {
  const Id = useParams()
  const [follows, setFollows] = useState<PostLists[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allFollows, setAllFollows] = useState<PostLists[]>([]);
  const { sendPostId, setSendPostId } = useContext(PostIdContext);
  const [totalPages, setTotalPages] = useState(0); // 総ページ数


  useEffect(() => {
    // データを取得するための関数
    const fetchData = async () => {
      try {
        const [response, response1] = await Promise.all([
          client.get('/following', { params: {followerId: Id.userId} }),
          client.get('/follow_and_post_counts', {
            params: { userId: Id.userId },
            headers: getAuthHeaders(),
          })        ]);
        console.log("Response from server:", response1.data.length);
        console.log(response)
        setFollows(response.data.followings); // レスポンスのデータをstateにセット
        setAllFollows(prevPosts => response.data.followings); // すべてのポストを更新
        const totalItemCount = response1.data.followings; // 総件数を取得
        console.log(totalItemCount)
        const pageSize = 10; // ページあたりのアイテム数
        const pages = Math.ceil(totalItemCount / pageSize); // 総ページ数を計算
        setTotalPages(pages);

        console.log("Follows after setFollows:", follows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // fetchData関数を呼び出し


  }, [currentPage]); // useEffectがマウント時に一度だけ実行されるように空の依存リストを指定

  const handleChildLinkClick = (e) => {
    e.stopPropagation(); // 親へのイベント伝播を停止
  };

  const handlePostClick = (postId) => {
    // クリックされた投稿のIDを取り出して何かしらの処理を行う
    console.log('Clicked Post ID:', postId);
    setSendPostId(postId)
    window.location.href = `/article/${postId}`;
    // ここでサーバーサイドにデータを取りに行くなどの処理を追加可能
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  return (
<div>
  <h1>Post List</h1>
  <ul>
    {allFollows.map(post => (
      <li key={post.userId}>
        {/* アンカータグでリンクを作成 */}
        <Link
          to={`/article/${post.userId}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={(e) => {
            e.preventDefault(); // リンクのデフォルトの挙動をキャンセル
            handlePostClick(post.userId);
          
          }}
        >
          <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <div>
            <Link
            to={`/userpage/${post.userId}`}
            onClick={handleChildLinkClick}
            >
              <Avatar
              name={post.userName}
              size="40"
              round={true}
              src={post.iconPath.url}
              /> {/* Avatar コンポーネント */}
              <span style={{ marginLeft: '10px' }}>{post.userName}</span> {/* ユーザー名 */}
              </Link>
            </div>
          <p>Account Name: {post.accountName}</p>
          <p>Profile Statement: {post.profileStatement}</p>
          </div>
        </Link>
      </li>
    ))}
  </ul>
    <ReactPaginate
      pageCount={totalPages} // 総ページ数を指定
      marginPagesDisplayed={1} // 前後に表示するページ数
      pageRangeDisplayed={2} // 一度に表示するページ数
      onPageChange={handlePageChange}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
      breakLabel='...' // ... のテキストをカスタマイズ
    />
  </div>
  );
};

export default FollowingList;