import { useMediaQuery } from "@material-ui/core";
import HeaderMobile from "components/utils/header/HeaderMobile";
import HeaderWide from "components/utils/header/HeaderWide";

const Header: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderWide />}
    </>
  );
}

export default Header;
