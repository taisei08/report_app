import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Box, Toolbar, Button, IconButton, InputBase, Container, Card } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import client from "lib/api/client";
import { signOut } from "lib/api/auth";
import { getAuthHeaders } from "lib/api/auth";
import { AuthContext } from "App";
import NotificationButton from "components/utils/header/NotificationButton";
import MenuButton from "./MenuButton";

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "inherit"
  },
  linkBtn: {
    textTransform: "none"
  },
  searchInput: {
    width: '95vw',
    color: 'black',
  },
  card: {
    backgroundColor: '#ffffff', 
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    padding: 3,
    width: '100vw',
  },
}));

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const classes = useStyles();
  const navigation = useNavigate();
  const [icon, setIcon] = useState<string | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formVisible, setFormVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn]);

  const handleSearch = () => {
    const cleanedSearchQuery: string = searchQuery.replace(/　/g, ' '); 
    const Query: string = encodeURIComponent(cleanedSearchQuery);
    console.log(Query); 
    navigation(`/search/${Query}`);
  };

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

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Container style={{paddingRight: '0px', display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
            <IconButton onClick={() => setFormVisible(prevData => !prevData)}>
              <SearchIcon style={{color: 'white'}}/>
            </IconButton>           
            <NotificationButton />
            <Button component={Link} to="/post" variant="contained">
              投稿
            </Button>
            <MenuButton icon={icon} id={id} handleSignOut={handleSignOut} />
          </Container>
        );
      } else {
        return (
          <Container style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
            <IconButton onClick={() => setFormVisible(prevData => !prevData)}>
              <SearchIcon style={{color: 'white'}}/>
            </IconButton>           
            <Button component={Link} to="/signin" color="inherit" className={classes.linkBtn}>
              サインイン
            </Button>
            <Button component={Link} to="/signup" color="inherit" className={classes.linkBtn}>
              新規登録
            </Button>
          </Container>
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
          <Link to="/">
            <img src="/logo_white.png" alt="logo" style={{maxWidth: '80px', position: 'relative', top: '3px'}} />
          </Link>
          <AuthButtons />
        </Toolbar>
      </AppBar>
      {formVisible && 
        <Container style={{display: 'flex', padding: 10, backgroundColor:'#f0f0f0'}}>
          <Card className={classes.card}> 
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
              className={classes.searchInput}
              autoFocus
              autoComplete="off"
            />
          </Card>
        </Container>
      }
    </>
  );
}

export default Header;
