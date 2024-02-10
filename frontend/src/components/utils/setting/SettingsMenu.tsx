import { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Drawer, List, ListItem, ListItemText, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#f5f5f5', // ドロワーの背景色
    borderRadius: '0 10px 10px 0', // 右端を丸くする
  },
  menuTitle: {
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#1e90ff',
    color: '#fff', // 白色のテキスト色
  },
  menuItem: {
    '&:hover': {
      borderLeft: `4px solid ${theme.palette.primary.main}`, // ホバー時に枠線を表示する
    },
  },
  menuItemText: {
    paddingLeft: theme.spacing(1), // ListItemText の余白を調整
  },
  menuButton: {
    position: 'fixed',
    top: 80,
    left: 35,
  },
}));

const SettingsMenu = () => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerOpen}
        className={classes.menuButton}
        style={{ 
          borderRadius: "50%", 
          border: "1px solid gray",
          boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        open={openDrawer}
        onClose={handleDrawerClose}
      >
        <Box className={classes.menuTitle}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            設定メニュー
          </Typography>
        </Box>
        <List>
          {[
            { text: "アカウント", to: "/settings/edit_user_name" },
            { text: "パスワード", to: "/settings/edit_password" },
            { text: "メールアドレス", to: "/settings/edit_email" },
            { text: "プロフィール", to: "/settings/edit_profile" },
            { text: "分野", to: "/settings/edit_interests" },
            { text: "アカウントの消去", to: "/settings/delete_account" },
          ].map((item) => (
            <ListItem
              button
              component={Link}
              to={item.to}
              className={classes.menuItem}
              key={item.text}
            >
              <ListItemText primary={item.text} className={classes.menuItemText} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SettingsMenu;