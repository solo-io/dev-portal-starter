import { useContext } from "react";
import { AppUtilsContext } from "../../../Context/AppUtilsContext";
import { footerHeightPx } from "../../Structure/Footer";
import { headerHeightPx } from "../../Structure/Header.style";

const CustomHtmlPage = ({ customPageUrl }: { customPageUrl: string }) => {
  const { windowInnerWidth, windowInnerHeight } = useContext(AppUtilsContext);

  return (
    <iframe
      style={{
        width: `${windowInnerWidth}px`,
        height: `${windowInnerHeight - footerHeightPx - headerHeightPx}px`,
        position: "fixed",
      }}
      src={customPageUrl}
    />
  );
};

export default CustomHtmlPage;
