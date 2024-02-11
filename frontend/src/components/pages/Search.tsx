import SearchList from 'components/utils/search/SearchList';
import { useParams } from 'react-router-dom';

// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Search: React.FC = () => {
  const Query = useParams()
  return (
    <>
      <SearchList searchQuery={Query.query}/>
    </>

  )
}

export default Search;