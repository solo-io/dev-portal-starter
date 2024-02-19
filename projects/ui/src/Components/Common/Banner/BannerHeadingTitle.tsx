import styled from "@emotion/styled";

const BannerHeadingTitleContainer = styled.div`
  display: flex;
  align-items: center;

  font-size: 48px;
  h1 {
    font-size: 48px;
  }
  line-height: 54px;
  margin-bottom: 15px;

  color: constants.$defaultColoredText;

  // Keep spacing for all nav items
  > * {
    margin-right: 18px;
  }

  svg {
    width: 46px;
    height: 46px;
  }
`;

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
    <BannerHeadingTitleContainer>
      {logo} <h1 style={stylingTweaks}>{text}</h1> {additionalInfo}
    </BannerHeadingTitleContainer>
  );
}
