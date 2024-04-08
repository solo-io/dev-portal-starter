import { HomePageStyles } from "./HomePage.style";

export function HomePageCategoryCard({
  imageSrc,
  imageAlt,
  categoryDescription,
  categoryName,
}: {
  imageSrc: React.ImgHTMLAttributes<HTMLImageElement>["src"];
  imageAlt: string;
  categoryName: string;
  categoryDescription: string;
}) {
  return (
    <HomePageStyles.CategoriesCard>
      <HomePageStyles.CategoryImageHolder>
        <img src={imageSrc} alt={imageAlt} role="banner" />
      </HomePageStyles.CategoryImageHolder>
      <HomePageStyles.CategoryName>{categoryName}</HomePageStyles.CategoryName>
      <HomePageStyles.CategoryDescription>
        {categoryDescription}
      </HomePageStyles.CategoryDescription>
    </HomePageStyles.CategoriesCard>
  );
}
