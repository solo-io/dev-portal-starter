import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { DiProvider, injectable } from "react-magnetic-di";
import { MemoryRouter } from "react-router-dom";
import { useGetCurrentUser } from "../../Apis/hooks";
import { Header } from "../../Components/Structure/Header";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Structure / Header",
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
//
// Variant: logged out
//
export const LoggedOut: Story = {
  decorators: [
    (Story) => {
      const useGetCurrentUserDi = injectable(useGetCurrentUser, () => ({
        isLoading: false,
      }));
      return (
        <MemoryRouter>
          <DiProvider use={[useGetCurrentUserDi]}>
            <Story />
          </DiProvider>
        </MemoryRouter>
      );
    },
  ],
};

//
// Variant: logged in
//
const loggedInUserData = {
  email: faker.animal.bear().replaceAll(" ", "_").toLowerCase() + "@test.com",
  name: faker.name.firstName(),
  username: faker.name.fullName().replaceAll(" ", "_").toLowerCase(),
};
export const LoggedIn: Story = {
  decorators: [
    (Story) => {
      const useGetCurrentUserDi = injectable(useGetCurrentUser, () => ({
        isLoading: false,
        data: loggedInUserData,
      }));
      return (
        <MemoryRouter>
          <DiProvider use={[useGetCurrentUserDi]}>
            <Story />
          </DiProvider>
        </MemoryRouter>
      );
    },
  ],
};
