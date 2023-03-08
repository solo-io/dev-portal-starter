import { NavLink } from "react-router-dom";
import { API } from "../../Apis/api-types";
import { Icon } from "../../Assets/Icons";
import { useMemo } from "react";

export function ApiSummaryGridCard({ api }: { api: API }) {
  const cardImage = useMemo(() => {
    if (api.apiId === "petstore-openapi-v2-full") {
      return "https://www.explorebranson.com/sites/default/files/styles/listing_image/public/listing_images/1119-amazing-pets-poodle.jpg?itok=IkjvNb8J";
    } else if (api.apiId === "gameofthrones-characters") {
      return "https://www.livecamcroatia.com/data/public/2019-04/dubrovnik-castle-1396267_1920.jpg";
    } else if (api.apiId === "Pokemon") {
      return "https://images.nintendolife.com/96205d207578a/pokemon-scarlet-and-violet-complete-paldea-region-pokedex-1.large.jpg";
    } else {
      return "https://img.huffingtonpost.com/asset/57f2730f170000f70aac9059.jpeg?ops=scalefit_960_noupscale";
    }
  }, [api.apiId]);

  return (
    <NavLink to={`/api-details/${api.apiId}`}>
      <div className="apiGridCard">
        <div className="content">
          <div className="apiImageHolder">
            <img src={cardImage} alt="" role="banner" />
          </div>
          <div className="details">
            <div>
              <h4 className="title">{api.title}</h4>
              <div className="description">{api.description}</div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="metaInfo">
            <Icon.SmallCodeGear />
            <div className="typeTitle" aria-label="API Type">
              OpenAPI
            </div>
          </div>
          <div className="typeIcon">
            <Icon.OpenApiIcon />
          </div>
        </div>
      </div>
    </NavLink>
  );
}
