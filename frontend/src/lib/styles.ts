import { makeStyles } from "@material-ui/core/styles";

export const Styles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

}));