import { useContext } from "react";
import { AppUtilsContext } from "../../../Context/AppUtilsContext";
import { CustomPage } from "../../../user_variables.tmplr";
import { footerHeightPx } from "../../Structure/Footer";
import { headerHeightPx } from "../../Structure/Header.style";

const CustomHtmlPage = ({
  customPage,
  customPageUrl,
}: {
  customPage: CustomPage;
  customPageUrl: string;
}) => {
  const { windowInnerWidth, windowInnerHeight } = useContext(AppUtilsContext);

  return (
    <iframe
      title={customPage.title}
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
