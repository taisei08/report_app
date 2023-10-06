import { useState, useEffect } from 'react';
import client from "lib/api/client"
import { Posts } from "interfaces/index"


const PostList = () => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Posts[]>([]);


  useEffect(() => {
    // データを取得するための関数
    const fetchData = async () => {
      try {
        const response = await client.get(`/posts?page=${currentPage}`)
        console.log("Response from server:", response.data.posts);
        setPosts(response.data.posts); // レスポンスのデータをstateにセット
        setAllPosts(prevPosts => [...prevPosts, ...response.data.posts]); // すべてのポストを更新

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

  return (
    <div>
      <h1>Post List</h1>
      <ul>
        {allPosts.map(post => (
          <li key={post.post_id}>{post.title} {post.description}</li>
        ))}
      </ul>  
      <button onClick={loadMore}>Load More</button>
    </div>
  );
};

export default PostList