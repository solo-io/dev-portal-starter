import { faker } from "@faker-js/faker";

const { number: numgen } = faker.datatype;

export const arrGen = <T = any>(
  length: number | { min?: number; max?: number } = 3
): T[] => {
  return Array.from({
    length: typeof length === "number" ? length : numgen(length),
  });
};
