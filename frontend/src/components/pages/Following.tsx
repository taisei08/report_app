import UserList from "components/utils/UserList";
import { useParams } from "react-router-dom";

const Following = () => {

  const Id = useParams()

  return (
    <div>
      <p>rmp</p>
      <UserList/>
    </div>
  )
};

export default Following;