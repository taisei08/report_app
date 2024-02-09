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
    padding: theme.spacing(0.25, 0.5), // 上下0.25、左右0.5のパディングを追加
    borderRadius: theme.shape.borderRadius, // ボーダーラジウスを適用
    border: '1px solid #ccc',
    backgroundColor: 'white', // ボタンの背景色を白に設定
    color: theme.palette.text.primary, // テキストカラーをテキストのプライマリカラーに設定
    '&:hover': {
      backgroundColor: theme.palette.action.hover, // マウスホバー時の背景色をテーマの hover 色に設定
    },
  },
  countLabel: {
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  }  
}));