import type { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import { injectable } from "react-magnetic-di";
import { MemoryRouter, useParams } from "react-router-dom";
import { App, Member, Team } from "../../../Apis/api-types";
import {
  useGetTeamDetails,
  useListAppsForTeam,
  useListMembersForTeam,
} from "../../../Apis/gg_hooks";
import TeamDetailsPage from "../../../Components/Teams/Details/TeamDetailsPage";
import { AppContextProvider } from "../../../Context/AppContext";
import { AuthContextProvider } from "../../../Context/AuthContext";
import { makeDiProviderDecoratorFromUseArray } from "../../decorators/decorators";
import { gg_generators } from "../../mocks/gg_generators";
import { createSwrInjectable } from "../../mocks/utils/injectables";

const meta = {
  title: "GG / TeamDetailsPage",
  component: TeamDetailsPage,
} satisfies Meta<typeof TeamDetailsPage>;

export default meta;
type DiProps = {
  useParams: { teamId: string };
  useGetTeamDetails: Team;
  useListAppsForTeam: App[];
  useListMembersForTeam: Member[];
};
type Story = StoryObj<ComponentProps<typeof TeamDetailsPage> & DiProps>;

const teamId = "1";
export const Default: Story = {
  args: {
    useParams: { teamId },
    useGetTeamDetails: gg_generators.createTeam(teamId),
    useListAppsForTeam: gg_generators.createListAppsForTeamResponse(),
    useListMembersForTeam: gg_generators.createListMembersForTeamResponse(),
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter>
          <AuthContextProvider>
            <AppContextProvider>
              <Story />
            </AppContextProvider>
          </AuthContextProvider>
        </MemoryRouter>
      );
    },
    makeDiProviderDecoratorFromUseArray((args) => [
      injectable(useParams, () => args.useParams),
      createSwrInjectable(useGetTeamDetails, args.useGetTeamDetails),
      createSwrInjectable(useListAppsForTeam, args.useListAppsForTeam),
      createSwrInjectable(useListMembersForTeam, args.useListMembersForTeam),
    ]),
  ],
};
