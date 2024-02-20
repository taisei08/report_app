import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  tag: {
    display: 'inline-block',
    border: '1px solid #ccc',
    padding: theme.spacing(0.25),
    margin: theme.spacing(0.25),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.8rem',
    transition: 'background-color 0.1s',
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

interface Tags {
  tagId: number;
  tagName: string;
}

const Tag: React.FC<Tags>  = ({ tagId, tagName }) => {
  const classes = useStyles();
  const query: string = encodeURIComponent(tagName);

  return (
    <Fragment key={tagId}>
      <Box className={classes.tag}>
        <Link
        to={`/search/${query}`}
        onClick={(e) => e.stopPropagation()}
        style={{ textDecoration: 'none', color: 'inherit' }}>
          {tagName}
        </Link>
      </Box>
    </Fragment>
  );
};

export default Tag;
