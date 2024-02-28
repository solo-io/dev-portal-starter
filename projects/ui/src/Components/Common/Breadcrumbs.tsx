import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../Assets/Icons";
import { AppContext } from "../../Context/AppContext";
import { ContentWidthDiv } from "../../Styles/ContentWidthHelpers";

const BreadcrumbList = styled(ContentWidthDiv)`
  padding-top: 20px;
  padding-bottom: 5px;
  min-height: 51px;

  display: flex;
  align-items: center;
  gap: 10px;
`;

const BreadcrumbItemLink = styled(Link)(
  ({ theme }) => css`
    color: ${theme.augustGrey};
    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
    &:active {
      color: ${theme.oceanBlue};
      text-decoration: underline;
    }
  `
);

const BreadcrumbItem = styled.div(
  ({ theme }) => css`
    color: ${theme.oceanBlue};
  `
);

const Breadcrumbs = ({
  items,
}: {
  items: { link?: string; label: string }[];
}) => {
  const { pageContentIsWide } = useContext(AppContext);

  return (
    <BreadcrumbList pageContentIsWide={pageContentIsWide}>
      {items.map((it, idx) => {
        if (idx === items.length - 1 || !it.link) {
          return <BreadcrumbItem key={idx}>{it.label}</BreadcrumbItem>;
        }
        return (
          <React.Fragment key={idx}>
            <BreadcrumbItemLink to={it.link}>{it.label}</BreadcrumbItemLink>
            <Icon.RightArrow />
          </React.Fragment>
        );
      })}
    </BreadcrumbList>
  );
};

export default Breadcrumbs;
