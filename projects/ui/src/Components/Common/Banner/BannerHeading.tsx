import Banner from "../../../Assets/banner.png";

export function BannerHeadingTitle({
  text,
  logo,
  additionalInfo,
  stylingTweaks,
}: {
  text: string;
  logo?: React.ReactNode;
  additionalInfo: React.ReactNode;
  stylingTweaks: {
    fontSize?: string;
    lineHeight?: string;
  };
}) {
  return (
    <div className="bannerHeadingTitle" style={stylingTweaks}>
      {logo} <h1>{text}</h1> {additionalInfo}
    </div>
  );
}

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
