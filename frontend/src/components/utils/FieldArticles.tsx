import { useState, useEffect } from "react";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";


const FieldArticles = ( props ) => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    // ページが読み込まれたときにユーザーデータを取得する
    fetchUserData();
  }, [props.fieldId]);

  const handlePostClick = (postId) => {
    // クリックされた投稿のIDを取り出して何かしらの処理を行う
    console.log('Clicked Post ID:', postId);
    window.location.href = `/article/${postId}`;
    // ここでサーバーサイドにデータを取りに行くなどの処理を追加可能
  };
  
  const handleChildLinkClick = (e) => {
    e.stopPropagation(); // 親へのイベント伝播を停止
  };

  const fetchUserData = async () => {
    try {
      // ユーザーデータをAPIから取得
      const response = await client.get("/posts_of_field", {
        params: { fieldId: props.fieldId},
        headers: getAuthHeaders(),
      });
      setArticles(response.data.posts);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div style={{ width: "700px", height: "250px", overflowX: "auto", whiteSpace: "nowrap" }}>
      {articles && articles.length > 0 && articles.map((article) => (
        <div key={article.id} style={{ width: "200px", height: "200px", margin: "8px", backgroundColor: "#e0e0e0", display: "inline-block" }}>
        <Link
          to={`/article/${article.postId}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={(e) => {
            e.preventDefault(); // リンクのデフォルトの挙動をキャンセル
            handlePostClick(article.postId);
          
          }}
        >          

            <div>
            <Link
            to={`/userpage/${article.userId}`}
            onClick={handleChildLinkClick}
            >
              <Avatar
              name={article.accountName}
              size="40"
              round={true}
              src={article.iconPath}
              /> {/* Avatar コンポーネント */}
              <span style={{ marginLeft: '10px' }}>{article.userName}</span> {/* ユーザー名 */}
              </Link>
            </div>
            <div>
              <h3>
                {/* リンクの中にもLinkコンポーネントを使う */}
                <Link
                  to={`/article/${article.postId}`}
                  onClick={(e) => {
                    e.preventDefault(); // リンクのデフォルトの挙動をキャンセル
                    handlePostClick(article.postId);
                  }}
                >
                  {article.title}
                </Link>
              </h3>
              <p>{article.description}</p>
            </div>
          </Link>

        </div>
      ))}
    </div>
  );
};

export default FieldArticles;
