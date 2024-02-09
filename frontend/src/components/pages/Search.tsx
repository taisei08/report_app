import React, { useContext } from "react"
import PostList3 from "components/utils/posts/PostList3";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { AuthContext } from "App"

// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Search: React.FC = () => {
  const Query = useParams()
  return (
    <div>
      <PostList3 searchQuery={Query.query}/>
    </div>

  )
}

export default Search;