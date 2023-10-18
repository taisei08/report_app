import { useState, useEffect, useContext } from 'react';
import client from "lib/api/client"
import { PostLists } from "interfaces/index"
import Avatar from 'react-avatar';
import { PostIdContext } from 'App';
import { Link } from 'react-router-dom';


const PostList = () => {
  const [posts, setPosts] = useState<PostLists[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<PostLists[]>([]);
  const { sendPostId, setSendPostId } = useContext(PostIdContext);

  useEffect(() => {
    // データを取得するための関数
    const fetchData = async () => {
      try {
        const response = await client.get(`/posts?page=${currentPage}`)
        console.log("Response from server:", response.data);
        const response2 = response.data
        const tempdata = response2.posts
        console.log(tempdata)
        setPosts(tempdata); // レスポンスのデータをstateにセット
        setAllPosts(prevPosts => [...prevPosts, ...tempdata]); // すべてのポストを更新

        console.log("Posts after setPosts:", posts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // fetchData関数を呼び出し


  }, [currentPage]); // useEffectがマウント時に一度だけ実行されるように空の依存リストを指定

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePostClick = (postId) => {
    // クリックされた投稿のIDを取り出して何かしらの処理を行う
    console.log('Clicked Post ID:', postId);
    setSendPostId(postId)
    window.location.href = `/article/${postId}`;
    // ここでサーバーサイドにデータを取りに行くなどの処理を追加可能
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
              <Avatar name={post.userName} size="40" round={true} /> {/* Avatar コンポーネント */}
              <span style={{ marginLeft: '10px' }}>{post.userName}</span> {/* ユーザー名 */}
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
  <button onClick={loadMore}>Load More</button>
</div>
  );
};

export default PostList