import { makeStyles, Box } from '@material-ui/core';
import { Pagination, PaginationItem } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  paginationItem: {
    margin: theme.spacing(0, 1),
    color: theme.palette.primary.main,
    '&.Mui-selected': {
      backgroundColor: '#007bff',
      color: theme.palette.common.white,
    },
  },
}));

interface Props {
  totalPages: number;
  currentPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const CustomPagination: React.FC<Props> = ({ totalPages, currentPage, handlePageChange }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Pagination
        className={classes.paginationItem}
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        color="primary"
        renderItem={(item) => (
          <PaginationItem
            {...item}
            classes={{selected: classes.paginationItem}}
          />
        )}
        siblingCount={1}
        boundaryCount={1}
      />
    </Box>
  );
};

export default CustomPagination;
