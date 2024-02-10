import React, { useRef, useContext, useEffect, useState } from "react"
import { useNavigate, Link, Navigate } from "react-router-dom"
import Avatar from "react-avatar"
import Cookies from "js-cookie"

import { makeStyles, Theme } from "@material-ui/core/styles"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';


import client from "lib/api/client"
import { signOut } from "lib/api/auth"
import { getAuthHeaders } from "lib/api/auth"

import { AuthContext } from "App"

import NotificationButton from "components/utils/NotificationButton"

const useStyles = makeStyles((theme: Theme) => ({
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
}))

const Form: React.FC = () => {

  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const cleanedSearchQuery = searchQuery.replace(/　/g, ' '); // 全角スペースを半角スペースに変換
    // ここでクリーンアップされたクエリを使って検索処理を行うなどの操作を実行
    console.log(cleanedSearchQuery); // 例えば、クリーンアップされたクエリをコンソールに表示 
    navigate(`/search/${cleanedSearchQuery}`);
    }
    ;

  return (
    <InputBase
      id="searchField"
      placeholder="検索..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing && searchQuery.trim() !== '') {
          e.preventDefault(); // デフォルトのEnterキーの動作を阻止
          handleSearch();
        }
      }}
      autoFocus
      endAdornment={
      <IconButton onClick={() => searchQuery.trim() !== '' && handleSearch()}>
        <SearchIcon />
      </IconButton>
      }
    />
  );
};

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext)
  const classes = useStyles()
  const navigation = useNavigate()
  const [icon, setIcon] = useState()
  const [id, setId] = useState()
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const refObject = useRef()


  useEffect(() => {
    // ログイン時にユーザーデータを取得する
    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn]);

  const handleSignOut = async (e) => {
    try {
      const res = await signOut()

      if (res.data.success === true) {
        // サインアウト時には各Cookieを削除
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
      // ユーザーデータをAPIから取得
      const response = await client.get("/users_index_for_header", {
        headers: getAuthHeaders(),
      });
      setIcon(response.data.iconPath.url);
      setId(response.data.userId)
      console.log(response.data.iconPath.url);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (destination: string) => {
    navigation(destination);
    handleMenuClose();
  };


  const AuthButtons = () => {
    // 認証完了後はサインアウト用のボタンを表示
    // 未認証時は認証用のボタンを表示
    if (!loading) {
      if (isSignedIn) {
        return (
          <>
            <Form/>
            <NotificationButton />
            <Button component={Link} to="/post" variant="contained" color="primary">
              投稿
            </Button>
            <IconButton
              ref = {refObject}
              color="inherit"
              className={classes.iconButton}
              onClick={(e) => {
                setMenuOpen(true)
              }}
            >
              <Avatar size="40" round={true} src={icon} />
            </IconButton>
            <Menu
              anchorEl={refObject.current}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() =>
                handleMenuItemClick(`/userpage/${id}`)
                }>
                マイページ
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick("settings/edit_user_name")}>
                設定
              </MenuItem>
              <MenuItem onClick={handleSignOut}>ログアウト</MenuItem>
            </Menu>
          </>
        );
      } else {
        return (
          <>
          <Form/>
          <Button
            component={Link}
            to="/signin"
            color="inherit"
            className={classes.linkBtn}
          >
            サインイン
          </Button>
          <Button
            component={Link}
            to="/signup"
            color="inherit"
            className={classes.linkBtn}
          >
            新規登録
          </Button>
          </>
        )
      }
    } else {
      return <></>
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.iconButton}
            color="inherit"
          >
          </IconButton>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            className={classes.title}
          >
            Sample
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header