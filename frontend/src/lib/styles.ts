import { makeStyles } from "@material-ui/core/styles";

export const Styles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  linkStyle: {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  countLabel: {
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },  
  customBox: {
    width: '60vw',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
}));
