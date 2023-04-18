import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../Assets/Icons";

const Breadcrumbs = ({
  items,
}: {
  items: { link?: string; label: string }[];
}) => {
  return (
    <div className="breadcrumbList">
      {items.map((it, idx) => {
        if (idx === items.length - 1 || !it.link) {
          return (
            <div key={idx} className="breadcrumbItem">
              {it.label}
            </div>
          );
        }
        return (
          <React.Fragment key={idx}>
            <Link to={it.link} className="breadcrumbItem">
              {it.label}
            </Link>
            <Icon.RightArrow />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
