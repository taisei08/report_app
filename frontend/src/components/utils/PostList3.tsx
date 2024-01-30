import { Fragment, useState, useEffect, useContext, useRef } from 'react';
import client from "lib/api/client"
import { PostLists } from "interfaces/index"
import Avatar from 'react-avatar';
import { PostIdContext } from 'App';
import { Link } from 'react-router-dom';
import Rating from 'react-rating';



const PostList3 = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tempPosts, setTempPosts] = useState<PostLists[]>([]);
  const [allPosts, setAllPosts] = useState<PostLists[]>([]);
  const { sendPostId, setSendPostId } = useContext(PostIdContext);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // データを取得するための関数
    const fetchData = async () => {
      try {
        console.log(props.searchQuery)
        const response = await client.get(`/posts_search?page=${currentPage}`,
        { params: {q: props.searchQuery}})
        console.log("Response from server:", response.data);
        const response2 = response.data
        const tempdata = response2.posts
        console.log(tempdata)
        setAllPosts(prevPosts => [...prevPosts, ...tempdata]); // すべてのポストを更新
        setTempPosts(tempdata)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // fetchData関数を呼び出し


  }, [currentPage]); // useEffectがマウント時に一度だけ実行されるように空の依存リストを指定

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        
        console.log("mogerpogmerepm")
        const response = await client.get(`/posts_search?page=1`,
        { params: {q: props.searchQuery}})
        console.log("Response from server:", response.data);
        const response2 = response.data
        const tempdata = response2.posts
        console.log(tempdata)
        setAllPosts(tempdata); // すべてのポストを更新

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // fetchData関数を呼び出し
    
    // ここに初回レンダリング時に実行したくない副作用を記述します。
  }, [props.searchQuery]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

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


  return (

<div>
  <h1>検索結果: {allPosts.length}件</h1>
  <ul>
    {allPosts.map(post => (
      <li key={post.postId}>
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
              /> 
              <span style={{ marginLeft: '10px' }}>{post.userName}</span>
              </Link>
            </div>
            <div>
              <span>Last Updated: {post.createdAt}</span> 
            </div>
            <div>
              <h3>
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
            Tags: {post.tags.map(tag => (
              <Fragment key={Object.keys(tag)}>
                <div style={{ display: 'inline-block', border: '1px solid #ccc', padding: '4px', margin: '4px' }}>
                  <Link
                    to={`/search/${tag.tagName}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // ここにクリック時の処理を追加
                    }}
                  >
                    {Object.values(tag.tagName)}
                  </Link>
                </div>
              </Fragment>
            ))}            </div>
          </div>
        </Link>
      </li>
    ))}
  </ul>
  {console.log(tempPosts.length)}
  {tempPosts.length === 20 && (
  <button onClick={loadMore}>Load More</button>
  )}
  </div>
  );

};
export default PostList3