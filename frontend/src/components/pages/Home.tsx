import React, { useContext } from "react"
import PostList from "components/utils/PostList"
import { Link } from "react-router-dom";
import { AuthContext } from "App"
import InterestForm from "components/utils/InterestForm";

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
              <br>
              </br>
          </>
  )
}

export default Home