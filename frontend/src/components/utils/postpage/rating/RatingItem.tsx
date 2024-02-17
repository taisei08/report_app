import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import UserInfo from "components/utils/posts/post_item/UserInfo";
import CustomRating from "components/utils/CustomRating";
import { RatingData } from "components/pages/post/RatingList";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  userInfoLink: {
    textDecoration: "none",
    color: "inherit",
  },
  userName: {
    color: "rgba(0, 0, 0, 0.6)",
  },
}));

interface Props {
  rating: RatingData;
}

const RatingItem: React.FC<Props> = ({ rating }) => {
  const classes = useStyles();

  return (
    <Box key={rating.userId}>
      <Link
        to={`/userpage/${rating.userId}`}
        className={classes.userInfoLink}
      >
        <Card className={classes.card}>
          <CardContent>
            <UserInfo
              userId={rating.userId}
              userName={rating.userName}
              iconPath={rating.iconPath}
            />
            <Typography variant="body1" className={classes.userName}>
              {rating.accountName}
            </Typography>
            <CustomRating postId={rating.id} initialRating={rating.value} readOnly={true}/>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};

export default RatingItem;
