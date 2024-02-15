import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { IconButton, InputBase } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  whiteInput: {
    '& .MuiInputBase-input': {
      color: 'white',
    },
  },
}));

const SearchForm: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const cleanedSearchQuery = searchQuery.replace(/　/g, ' '); // 全角スペースを半角スペースに変換
    const Query = encodeURIComponent(cleanedSearchQuery);
    console.log(Query); 
    navigate(`/search/${Query}`);
  };

  return (
    <InputBase
      id="searchField"
      placeholder="検索..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing && searchQuery.trim() !== '') {
          e.preventDefault(); 
          handleSearch();
        }
      }}
      className={classes.whiteInput}
      autoFocus
      endAdornment={
        <IconButton onClick={() => searchQuery.trim() !== '' && handleSearch()}>
          <SearchIcon style={{color: 'white'}}/>
        </IconButton>
      }
    />
  );
};

export default SearchForm;