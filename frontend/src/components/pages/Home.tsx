import React, { useContext } from "react"
import PostList from "components/utils/PostList"
import { Link } from "react-router-dom";
import { AuthContext } from "App"

// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  console.log(currentUser);

  return (
          <>
            <div>
      <PostList/>
    </div>
              {/* Post コンポーネントへのリンクを追加 */}
              <Link to="/postpage">投稿一覧へ</Link>
              <br>
              </br>
              <Link to="/post">投稿</Link>
              <Link to="/userpage">ユーザーページ</Link>
              <Link to="/userpage2">ユーザーページ2</Link>

          </>
  )
}

export default Home