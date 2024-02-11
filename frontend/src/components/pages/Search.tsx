import { useParams } from 'react-router-dom';
import SearchList from 'components/utils/search/SearchList';

const Search: React.FC = () => {
  const Query = useParams();
  const searchQuery = Query.query || ''; // undefined が渡された場合に空文字列になるようにデフォルト値を設定
  return (
    <>
      <SearchList searchQuery={searchQuery} />
    </>
  );
}

export default Search;
