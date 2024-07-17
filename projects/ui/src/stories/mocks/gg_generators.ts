import { faker } from "@faker-js/faker";
import { ApiProductSummary, App, Member, Team } from "../../Apis/api-types";
import { arrGen, getFakeImageURL } from "./generators";

export namespace gg_generators {
  export function createListApiProductsResponse(): ApiProductSummary[] {
    const createdAt = faker.datatype.number();
    return arrGen(23).map((_, i) => ({
      createdAt: createdAt.toString(),
      updatedAt: (createdAt + faker.datatype.number()).toString(),
      description: faker.random.words(10),
      id: faker.random.words(3).toLocaleLowerCase().replaceAll(" ", "-"),
      name: `(${i.toString()}) ` + faker.animal.bear(),
      versionsCount: faker.datatype.number({ min: 1, max: 20 }),
      apiProductMetadata: {
        imageURL: getFakeImageURL(i),
        [faker.animal.crocodilia()]: faker.word.adjective(),
        [faker.animal.bear()]: faker.word.adjective(),
        [faker.animal.cat()]: faker.word.adjective(),
      },
    }));
  }

  export function createTeam(teamId: string): Team {
    return {
      createdAt: "1",
      updatedAt: "2",
      description: "asdf",
      id: teamId,
      name: "test team",
    };
  }

  export function createListAppsForTeamResponse(): App[] {
    const createdAt = faker.datatype.number();
    return arrGen(23).map((_, i) => ({
      createdAt: createdAt.toString(),
      updatedAt: (createdAt + faker.datatype.number()).toString(),
      deletedAt: (createdAt + faker.datatype.number()).toString(),
      description: faker.random.words(10),
      id: faker.random.words(3).toLocaleLowerCase().replaceAll(" ", "-"),
      name: `(${i.toString()}) ` + faker.animal.bear(),
      idpClientId: faker.random
        .words(3)
        .toLocaleLowerCase()
        .replaceAll(" ", "-"),
      idpClientName: `(${i.toString()}) ` + faker.animal.bear(),
      idpClientSecret: faker.random
        .words(3)
        .toLocaleLowerCase()
        .replaceAll(" ", "-"),
      teamId: faker.random.words(3).toLocaleLowerCase().replaceAll(" ", "-"),
    }));
  }

  export function createListMembersForTeamResponse(): Member[] {
    const createdAt = faker.datatype.number();
    return arrGen(23).map((_, i) => ({
      createdAt: createdAt.toString(),
      updatedAt: (createdAt + faker.datatype.number()).toString(),
      id: faker.random.words(3).toLocaleLowerCase().replaceAll(" ", "-"),
      name: `(${i.toString()}) ` + faker.animal.bear(),
      username: `(${i.toString()}) ` + faker.animal.bear(),
      email: `fake-member-${i.toString()}@test.com`,
      synced: faker.datatype.boolean(),
    }));
  }
}
