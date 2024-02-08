import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import client from "lib/api/client";
import { getAuthHeaders } from "lib/api/auth";
import UserInfo from "./posts/post_item/UserInfo";
import { Styles } from "lib/styles";
import { trimText } from "lib/function";
import { PostLists } from "interfaces";

interface FieldArticlesProps {
  fieldId: number;
}

const FieldArticles: React.FC<FieldArticlesProps> = ({ fieldId }) => {
  const importClasses = Styles();
  const [articles, setArticles] = useState<PostLists[]>([]);
  const navigate = useNavigate()
  

  useEffect(() => {
    fetchUserData();
  }, [fieldId]);

  const handlePostClick = (postId: number) => {
    console.log('Clicked Post ID:', postId);
    navigate(`/article/${postId}`)
  };

  const fetchUserData = async () => {
    try {
      const response = await client.get("/posts_of_field", {
        params: { fieldId: fieldId },
        headers: getAuthHeaders(),
      });
      setArticles(response.data.posts);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <Grid container spacing={2} wrap='nowrap' style={{width: '90vw', overflowX: 'scroll'}}>
      {articles && articles.length > 0 ? (
        articles.map((article) => (
          <Grid item key={article.postId} style={{ display: "inline-block" }}>
            <Card style={{ width: 275 , height: 275}}>
              <CardContent>
                <Link
                  to={`/article/${article.postId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePostClick(article.postId);
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item>
                      <UserInfo
                        userId={article.userId}
                        userName={article.userName}
                        iconPath={article.iconPath}
                        createdAt={article.createdAt}
                      />
                    </Grid>
                  </Grid>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", fontSize: "1.4rem" }}
                  >
                    <Link
                      to={`/article/${article.postId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePostClick(article.postId);
                      }}
                      className={importClasses.link} // ここでスタイルを適用
                    >
                      {trimText(article.title, 20)}
                    </Link>
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: "rgba(0, 0, 0, 0.6)" }}
                  >
                    {trimText(article.description, 40)}
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="body1">まだ投稿されていません。</Typography>
      )}
    </Grid>
  );
};

export default FieldArticles;
