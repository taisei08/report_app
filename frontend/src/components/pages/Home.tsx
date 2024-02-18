import { useContext } from "react"
import { Grid, Box } from "@material-ui/core";
import PostList from "components/utils/posts/PostList"
import { AuthContext } from "App"
import NewsSection from "components/utils/NewsSection";

const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  console.log(currentUser);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
        <Box>
          {isSignedIn && <NewsSection />}
        </Box>
        <Box style={{ marginTop: '5rem' }}>
          <PostList />
        </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Home