import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Notification } from 'interfaces';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: 'black',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

interface Props {
  notification: Notification;
  setShowNotifications: (showNotifications: boolean) => void;
}

const NotificationMessage: React.FC<Props> = ({ notification, setShowNotifications }) => {
  const classes = useStyles();

  const handleNotifications = () => {
    setShowNotifications(false);
  }

  switch (notification.action) {
    case 'review':
      return (
        <>
          <Typography variant='body2'>
            <Link to={`/userpage/${notification.activeUserId}`} className={classes.link} onClick={handleNotifications}>
              {`${notification.accountName}(${notification.userName})`}
            </Link>
            さんがあなたの投稿:
            <Link to={`/article/${notification.postId}`} className={classes.link} onClick={handleNotifications}>
              {`${notification.title}`}
            </Link>
            に
            <Link
              to={{
                pathname: `/article/${notification.postId}`,
                search: `?id=${notification.reviewId}&type=reviewId`,
              }}
              className={classes.link}
              onClick={handleNotifications}
            >
              レビュー
            </Link>
            しました
          </Typography>
        </>
      );
    case 'follow':
      return (
        <>
          <Typography variant='body2'>
            <Link to={`/userpage/${notification.activeUserId}`} className={classes.link} onClick={handleNotifications}>
              {`${notification.accountName}(${notification.userName})`}
            </Link>
            さんがあなたをフォローしました
          </Typography>
        </>
      );
    case 'like':
      if (notification.postId && !notification.reviewId && !notification.replyId) {
        return (
          <>
            <Typography variant='body2'>
              <Link to={`/userpage/${notification.activeUserId}`} className={classes.link} onClick={handleNotifications}>
                {`${notification.accountName}(${notification.userName})`}
              </Link>
              さんがあなたの投稿:
              <Link to={`/article/${notification.postId}`} className={classes.link} onClick={handleNotifications}>
                {`${notification.title}`}
              </Link>
              をいいねしました
            </Typography>
          </>
        );
      } else if (notification.reviewId && !notification.replyId) {
        return (
          <>
            <Typography variant='body2'>
              <Link to={`/userpage/${notification.activeUserId}`} className={classes.link} onClick={handleNotifications}>
                {`${notification.accountName}(${notification.userName})`}
              </Link>
              さんがあなたの
              <Link
                to={{
                  pathname: `/article/${notification.postId}`,
                  search: `?id=${notification.reviewId}&type=reviewId`,
                }}
                className={classes.link}
                onClick={handleNotifications}
              >
                レビュー
              </Link>
              にいいねしました
            </Typography>
          </>
        );
      } else if (notification.replyId) {
        return (
          <>
            <Typography variant='body2'>
              <Link to={`/userpage/${notification.activeUserId}`} className={classes.link} onClick={handleNotifications}>
                {`${notification.accountName}(${notification.userName})`}
              </Link>
              さんがあなたの
              <Link
                to={{
                  pathname: `/article/${notification.postId}`,
                  search: `?id=${notification.reviewId}&type=reviewId`,
                }}
                className={classes.link}
                onClick={handleNotifications}
              >
                リプライ
              </Link>
              にいいねしました
            </Typography>
          </>
        );
      } else {
        return null;
      }
    default:
      return null;
  }
};

export default NotificationMessage;