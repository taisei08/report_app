import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { AppBar, Toolbar, Button, IconButton, Container } from "@material-ui/core";
import client from "lib/api/client";
import { signOut } from "lib/api/auth";
import { getAuthHeaders } from "lib/api/auth";
import { AuthContext } from "App";
import NotificationButton from "./button/NotificationButton";
import MenuButton from "./button/MenuButton";
import SearchForm from "./button/SearchForm";

const Header = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigate();
  const [icon, setIcon] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn]);

  const handleSignOut = async () => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");
        Cookies.remove("_first_session");

        setIsSignedIn(false);
        navigation("/");
        console.log("Succeeded in sign out");
      } else {
        console.log("Failed in sign out");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await client.get("/users_index_for_header", {
        headers: getAuthHeaders(),
      });
      setIcon(response.data.iconPath.url);
      setId(response.data.userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <>
      <AppBar position="static" style={{ background: "#1976d2" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" />
          <Link to="/">
            <img src="/logo_white.png" alt="logo" style={{ maxWidth: '80px', position: 'relative', top: '3px'}} />
          </Link>
          <Container style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <SearchForm />
            {!loading &&
              (isSignedIn ? (
                <>
                  <NotificationButton />
                  <Button component={Link} to="/post" variant="contained">
                    投稿
                  </Button>
                  <MenuButton icon={icon} id={id} handleSignOut={handleSignOut} />
                </>
              ) : (
                <>
                  <Button component={Link} to="/signin" color="inherit">
                    サインイン
                  </Button>
                  <Button component={Link} to="/signup" color="inherit">
                    新規登録
                  </Button>
                </>
              ))}
          </Container>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;