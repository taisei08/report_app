import { useMediaQuery } from "@material-ui/core";
import HeaderMobile from "./HeaderMobile";
import HeaderWide from "./HeaderWide";

const Header: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderWide />}
    </>
  );
}

export default Header;
