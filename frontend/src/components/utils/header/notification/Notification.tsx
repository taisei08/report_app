import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Button, Container, Card, CardContent, Typography } from '@material-ui/core';
import client from 'lib/api/client';
import { getAuthHeaders } from 'lib/api/auth';
import NotificationMessage from './NotificationMessage';
import { Notification } from 'interfaces';

const useStyles = makeStyles((theme) => ({
  notificationBox: {
    position: 'absolute',
    background: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.5)',
    padding: theme.spacing(2),
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
    width: 'calc(min(300px, 80vw))',
    maxHeight: '500px',
    color: '#333',
    zIndex: 1000,
    left: '10%',
    right: '55%',
    transform: 'translateX(-50%)',
    overflowY: 'auto',
    borderRadius: '10px', // 任意の値を設定して角を丸くします
  },  
  notificationItem: {
    marginBottom: theme.spacing(1),
    borderBottom: '1px solid #ccc',
    paddingBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: 'black',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const Notifications: React.FC = () => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [moreNotifications, setMoreNotifications] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await client.get(`/notifications?page=${currentPage}`, { headers: getAuthHeaders() });
        setNotifications(prevNotifications => [...prevNotifications, ...response.data.notifications]);

        if (response.data.notifications.length < 10) {
          setMoreNotifications(false);
        }

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <Box className={classes.notificationBox}>
      <Typography variant="h5" style={{fontWeight: 'bold', marginBottom: '10px'}}>
        通知
      </Typography>
      {notifications.map((notification, index) => (
        <Card key={index} className={classes.notificationItem}>
          <CardContent style={{display: 'flex', alignItems: 'center'}}>
            <Link to={`/userpage/${notification.activeUserId}`}>
              <Avatar
                className={classes.avatar}
                src={notification.iconPath}
              />
            </Link>
            <NotificationMessage notification={notification} />
          </CardContent>
          <CardContent style={{display: 'flex', alignItems: 'center'}}>
          </CardContent>
        </Card>
      ))}
      {moreNotifications && (
        <Container style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <Button onClick={loadMore} variant="contained" style={{ width: '50vw', backgroundColor: 'white' }}>
            さらに読み込む
          </Button>
        </Container>
      )}
    </Box>
  );
};

export default Notifications;
