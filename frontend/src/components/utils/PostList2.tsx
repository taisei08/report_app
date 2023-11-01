import { useState, useEffect, useContext } from 'react';
import client from "lib/api/client"
import { PostLists } from "interfaces/index"
import Avatar from 'react-avatar';
import { PostIdContext } from 'App';
import { Link } from 'react-router-dom';
import Rating from 'react-rating';
import ReactPaginate from 'react-paginate';

const PostList2 = (props) => {
  const [posts, setPosts] = useState<PostLists[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<PostLists[]>([]);
  const { sendPostId, setSendPostId } = useContext(PostIdContext);
  const [totalPages, setTotalPages] = useState(0); // 総ページ数


  useEffect(() => {
    // データを取得するための関数
    const fetchData = async () => {
      try {
        const [response, response1] = await Promise.all([
          client.get(`/posts_by_user?page=${currentPage}`, { params: {userId: props.id} }),
          client.get('/post_counts', { params: {userId: props.id} }),
        ]);
        console.log("Response from server:", response1.data.length);
        const response2 = response.data
        const response3 = response1.data
        const tempdata = response2.posts
        console.log(tempdata)
        setPosts(tempdata); // レスポンスのデータをstateにセット
        setAllPosts(prevPosts => tempdata); // すべてのポストを更新
        const totalItemCount = response3.length; // 総件数を取得
        console.log(totalItemCount)
        const pageSize = 10; // ページあたりのアイテム数
        const pages = Math.ceil(totalItemCount / pageSize); // 総ページ数を計算
        setTotalPages(pages);

        console.log("Posts after setPosts:", posts);
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
    {allPosts.map(post => (
      <li key={post.postId}>
        {/* アンカータグでリンクを作成 */}
        <Link
          to={`/article/${post.postId}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={(e) => {
            e.preventDefault(); // リンクのデフォルトの挙動をキャンセル
            handlePostClick(post.postId);
          
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
              src={post.iconPath}
              /> {/* Avatar コンポーネント */}
              <span style={{ marginLeft: '10px' }}>{post.userName}</span> {/* ユーザー名 */}
              </Link>
            </div>
            <div>
              <span>Last Updated: {post.createdAt}</span> {/* 最終更新日 */}
            </div>
            <div>
              <h3>
                {/* リンクの中にもLinkコンポーネントを使う */}
                <Link
                  to={`/article/${post.postId}`}
                  onClick={(e) => {
                    e.preventDefault(); // リンクのデフォルトの挙動をキャンセル
                    handlePostClick(post.postId);
                  }}
                >
                  {post.title}
                </Link>
              </h3>
              <p>{post.description}</p>
              <Rating readonly initialRating={post.averageRating} fractions={2} />

            </div>
            <div>
              {console.log(post.postId)}
              Tags: {post.tags.map(tag => <span key={Object.keys(tag)}>{Object.values(tag)}</span>)} {/* タグの表示 */}
            </div>
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

export default PostList2