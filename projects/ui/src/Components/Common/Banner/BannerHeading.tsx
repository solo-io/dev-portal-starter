import Banner from "../../../Assets/banner.png";

/**
 * MAIN COMPONENT
 **/
export function BannerHeading({
  title,
  description,
  fullIcon,
  additionalContent,
  tall,
}: {
  title: React.ReactNode;
  description: string;
  fullIcon?: React.ReactNode;
  additionalContent?: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div className={`bannerHeading ${tall ? "tall" : ""}`}>
      <div className="bannerContent">
        {!!fullIcon && <div className="bigLeftIcon">{fullIcon}</div>}
        <div className="coreContent">
          {title}
          <div className="description">{description}</div>
          {!!additionalContent && (
            <div className="additionalContent">{additionalContent}</div>
          )}
        </div>
      </div>

      <div className="banner">
        <img src={Banner} alt="" role="banner" />
      </div>
    </div>
  );
}
