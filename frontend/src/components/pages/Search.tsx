import { useParams } from 'react-router-dom';
import SearchList from 'components/utils/search/SearchList';

const Search: React.FC = () => {
  const searchQuery = decodeURIComponent(useParams().query || '');
  return (
    <SearchList searchQuery={searchQuery} />
  );
}

export default Search;
