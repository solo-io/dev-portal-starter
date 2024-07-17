import { faker } from "@faker-js/faker";

const { number: numgen } = faker.datatype;

export const arrGen = <T = any>(
  length: number | { min?: number; max?: number } = 3
): T[] => {
  return Array.from({
    length: typeof length === "number" ? length : numgen(length),
  });
};

// Pexels is a free stock photo website.
// - All photos and videos on Pexels are free to use.
// - Attribution is not required.
// - https://www.pexels.com/
const fakeImageURLs = [
  "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
  "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
  "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
  "https://images.pexels.com/photos/53435/tree-oak-landscape-view-53435.jpeg",
  "https://images.pexels.com/photos/5504037/pexels-photo-5504037.jpeg",
  "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg",
  "https://images.pexels.com/photos/2547972/pexels-photo-2547972.jpeg",
  "https://images.pexels.com/photos/122442/berries-blueberries-raspberries-fruit-122442.jpeg",
  "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
  "https://images.pexels.com/photos/69776/tulips-bed-colorful-color-69776.jpeg",
  "https://images.pexels.com/photos/45987/pexels-photo-45987.jpeg",
];

export function getFakeImageURL(idx?: number) {
  if (idx === undefined) {
    idx = Math.floor(Math.random() * fakeImageURLs.length);
  }
  return fakeImageURLs[idx % fakeImageURLs.length];
}
