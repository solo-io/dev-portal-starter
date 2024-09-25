import { useEffect, useRef } from "react";
import { useCreateUserMutation, useGetCurrentUser } from "../Apis/gg_hooks";

const UserChecker = () => {
  // For Gloo Gateway:
  // If the user is logged into the IDP, but the portal server doesn't return data for it,
  // then the user will need to be created.
  const { error, mutate } = useGetCurrentUser();
  const { trigger: createUser } = useCreateUserMutation();
  const triedToCreateUser = useRef(false);

  useEffect(() => {
    if (
      // This error occurs when the user has logged in through their IDP,
      // but does not exist in the portal server DB.
      error?.message ===
        "logged in user is not found, this should not happen" &&
      !triedToCreateUser.current
    ) {
      setTimeout(async () => {
        // We can then create the current user.
        await createUser();
        // and then refetch their user information.
        mutate();
      }, 0);
      triedToCreateUser.current = true;
    }
  }, [error, createUser, mutate]);

  return null;
};

export default UserChecker;
