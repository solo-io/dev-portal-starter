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
    <div className="bannerHeadingTitle" style={stylingTweaks}>
      {logo} <h1>{text}</h1> {additionalInfo}
    </div>
  );
}
