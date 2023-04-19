/**
 * MAIN COMPONENT
 **/
export function BannerHeadingTitle({
  text,
  logo,
  additionalInfo,
  stylingTweaks,
}: {
  text: string;
  logo?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  stylingTweaks?: {
    fontSize?: string;
    lineHeight?: string;
  };
}) {
  return (
    <div className="bannerHeadingTitle">
      {logo} <h1 style={stylingTweaks}>{text}</h1> {additionalInfo}
    </div>
  );
}
