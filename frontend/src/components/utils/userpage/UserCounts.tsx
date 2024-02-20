import { Grid, Typography } from '@material-ui/core';
import { Styles } from 'lib/styles';

interface UserCountsProps {
  postsCount: number;
  followingsCount: number;
  followersCount: number;
  resetParentState: () => void;
  setContentType: React.Dispatch<React.SetStateAction<string>>;
}

const UserCounts: React.FC<UserCountsProps> = ({
  postsCount,
  followingsCount,
  followersCount,
  resetParentState,
  setContentType
}) => {
  const classes = Styles();

  return (
    <Grid container spacing={0} justifyContent="flex-start">
      <CountLabel onClick={resetParentState} label="投稿数" count={postsCount} classes={classes} />
      <CountLabel onClick={() => setContentType('following')} label="フォロー数" count={followingsCount} classes={classes} />
      <CountLabel onClick={() => setContentType('followed')} label="フォロワー数" count={followersCount} classes={classes} />
    </Grid>
  );
};



interface CountLabelProps {
  onClick: () => void;
  label: string;
  count: number;
  classes: Record<string, string>;
}

const CountLabel: React.FC<CountLabelProps> = ({ onClick, label, count, classes }) => {
  return (
    <>
      <Typography variant="subtitle1" onClick={onClick} className={classes.countLabel}>
        <strong>{label}: </strong>
        {count}
      </Typography>
      {'　'}
    </>
  );
};

export default UserCounts;
