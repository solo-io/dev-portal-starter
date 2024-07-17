import { faker } from "@faker-js/faker";
import { API } from "../../Apis/api-types";
import { arrGen, getFakeImageURL } from "./generators";

export namespace gmg_generators {
  export function createListApisResponse(): API[] {
    return arrGen(23).map((_, i) => ({
      license: "some-license",
      termsOfService: "some-terms-of-service",
      description: faker.random.words(10),
      apiId: faker.random.words(3).toLocaleLowerCase().replaceAll(" ", "-"),
      contact: faker.name.firstName(),
      usagePlans: [],
      // apiProductDisplayName: `(${i.toString()}) ` + faker.animal.bear(),
      title: `(${i.toString()}) ` + faker.animal.bear(),
      customMetadata: {
        imageURL: getFakeImageURL(i),
        [faker.animal.crocodilia()]: faker.word.adjective(),
        [faker.animal.bear()]: faker.word.adjective(),
        [faker.animal.cat()]: faker.word.adjective(),
      },
    }));
  }
}
