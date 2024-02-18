import { Tabs, Tab, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tab: {
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
    '&.Mui-selected': {
      color: '#007bff',
      backgroundColor: theme.palette.common.white,
      fontWeight: 'bold', // 文字を太くする
    },
  },
}));

interface Props {
  contentType: string;
  handleTabChange: (newValue: string) => void;
}

const TabSwitcher: React.FC<Props> = ({ contentType, handleTabChange }) => {
  const classes = useStyles();

  const handleChange = (e: any, newValue: string) => {
    handleTabChange(newValue);
  };

  return (
    <Tabs
      value={contentType}
      onChange={handleChange}
      variant="fullWidth"
      TabIndicatorProps={{ style: { background: '#007bff' } }}
    >
      <Tab className={classes.tab} label="投稿" value="post" />
      <Tab className={classes.tab} label="レビュー" value="review" />
      <Tab className={classes.tab} label="いいねした投稿" value="like" />
      <Tab value="following" style={{display: 'none'}} />
      <Tab value="followed" style={{display: 'none'}} />
    </Tabs>
  );
};

export default TabSwitcher;
