import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "react-avatar";
import Cookies from "js-cookie";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, InputBase } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import client from "lib/api/client";
import { signOut } from "lib/api/auth";
import { getAuthHeaders } from "lib/api/auth";
import { AuthContext } from "App";
import NotificationButton from "components/utils/header/NotificationButton";
import MenuButton from "./MenuButton";

const useStyles = makeStyles((theme: Theme) => ({
  whiteInput: {
    '& .MuiInputBase-input': {
      color: 'white',
    },
  },
  iconButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "inherit"
  },
  linkBtn: {
    textTransform: "none"
  }
}));

const Form: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const cleanedSearchQuery = searchQuery.replace(/　/g, ' '); // 全角スペースを半角スペースに変換
    console.log(cleanedSearchQuery); 
    navigate(`/search/${cleanedSearchQuery}`);
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

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const classes = useStyles();
  const navigation = useNavigate();
  const [icon, setIcon] = useState();
  const [id, setId] = useState();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  console.log(menuAnchorEl)

  useEffect(() => {
    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn]);

  const handleSignOut = async () => {
    try {
      const res = await signOut()

      if (res.data.success === true) {
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")
        Cookies.remove("_first_session")

        setIsSignedIn(false)
        navigation("/");

        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await client.get("/users_index_for_header", {
        headers: getAuthHeaders(),
      });
      setIcon(response.data.iconPath.url);
      setId(response.data.userId)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = (destination: string) => {
    navigation(destination);
    handleMenuClose();
  };

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <>
            <Form/>
            <NotificationButton />
            <Button component={Link} to="/post" variant="contained">
              投稿
            </Button>
            <MenuButton icon={icon} id={id} handleSignOut={handleSignOut} />
          </>
        );
      } else {
        return (
          <>
            <Form/>
            <Button component={Link} to="/signin" color="inherit" className={classes.linkBtn}>
              サインイン
            </Button>
            <Button component={Link} to="/signup" color="inherit" className={classes.linkBtn}>
              新規登録
            </Button>
          </>
        );
      }
    } else {
      return <></>
    }
  };

  return (
    <>
      <AppBar position="static" style={{ background: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" className={classes.iconButton} color="inherit" />
          <Typography component={Link} to="/" variant="h6" className={classes.title}>
            Sample
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;