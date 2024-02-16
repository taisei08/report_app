import { Link } from 'react-router-dom';
import { allFields } from 'interfaces/fields';
import { Box, Typography, makeStyles } from '@material-ui/core';

const getCategoryName = (id: number) => {
  const category = allFields.find(field => field.id === id);
  return category ? category.name : undefined;
};

interface CategoryProps {
  fieldId: number;
  subfieldId: number;
}

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  categoryContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Category: React.FC<CategoryProps> = ({ fieldId, subfieldId }) => {
  const classes = useStyles();
  const field: string | undefined = getCategoryName(fieldId);
  const subfield: string | undefined = getCategoryName(subfieldId);

  const renderCategoryLink = (categoryName: string | undefined) => {
    if (categoryName) {
      return (
        <Typography variant="body2" style={{marginRight: '0.5rem'}}>
          <Link
            to={`/search/${categoryName}`}
            className={classes.link}
            onClick={(event: React.MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
          >
            {categoryName}
          </Link>
        </Typography>
      );
    }
    return null;
  };

  return (
    <Box className={classes.categoryContainer}>
      <Typography variant="body2" style={{fontWeight: 'bold', fontSize: '0.9rem', marginRight: '0.2rem'}}>
        カテゴリ:
      </Typography>
      {renderCategoryLink(field)}
      {renderCategoryLink(subfield)}
    </Box>
  );
};

export default Category;