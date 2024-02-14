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
}

const NotificationMessage: React.FC<Props> = ({ notification }) => {
  const classes = useStyles();

  switch (notification.action) {
    case 'review':
      return (
        <>
          <Typography variant='body2'>
            <Link to={`/userpage/${notification.activeUserId}`} className={classes.link}>
              {`${notification.accountName}(${notification.userName})`}
            </Link>
            さんがあなたの投稿:
            <Link to={`/article/${notification.postId}`} className={classes.link}>
              {`${notification.title}`}
            </Link>
            に
            <Link
              to={{
                pathname: `/article/${notification.postId}`,
                search: `?id=${notification.reviewId}&type=reviewId`,
              }}
              className={classes.link}
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
            <Link to={`/userpage/${notification.activeUserId}`} className={classes.link}>
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
              <Link to={`/userpage/${notification.activeUserId}`} className={classes.link}>
                {`${notification.accountName}(${notification.userName})`}
              </Link>
              さんがあなたの投稿:
              <Link to={`/article/${notification.postId}`} className={classes.link}>
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
              <Link to={`/userpage/${notification.activeUserId}`} className={classes.link}>
                {`${notification.accountName}(${notification.userName})`}
              </Link>
              さんがあなたの
              <Link
                to={{
                  pathname: `/article/${notification.postId}`,
                  search: `?id=${notification.reviewId}&type=reviewId`,
                }}
                className={classes.link}
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
              <Link to={`/userpage/${notification.activeUserId}`} className={classes.link}>
                {`${notification.accountName}(${notification.userName})`}
              </Link>
              さんがあなたの
              <Link
                to={{
                  pathname: `/article/${notification.postId}`,
                  search: `?id=${notification.reviewId}&type=reviewId`,
                }}
                className={classes.link}
              >
                リプライ
              </Link>
              にいいねしました
            </Typography>
          </>
        );
      } else {
        return '不明なアクション';
      }
    default:
      return '不明なアクション';
  }
};

export default NotificationMessage;