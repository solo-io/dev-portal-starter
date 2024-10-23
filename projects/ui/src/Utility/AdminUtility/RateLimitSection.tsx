import { Box, Text } from "@mantine/core";
import { useState } from "react";
import { useListSubscriptionsForApp } from "../../Apis/gg_hooks";
import { Button } from "../../Components/Common/Button";
import { WarningAlert } from "../../Components/Common/WarningAlert";
import { useIsAdmin } from "../../Context/AuthContext";
import { RateLimitEditor, RateLimitEditorProps } from "./RateLimitEditor";

export const RateLimitSection = ({ ...props }: RateLimitEditorProps) => {
  //
  //  region State
  //
  const isAdmin = useIsAdmin();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: appSubscriptions } = useListSubscriptionsForApp(
    isExpanded && !props.isSubscription && isAdmin ? props.item.id : null
  );

  //
  // region Render
  //
  return (
    <>
      <Text size="lg" mb={isAdmin ? "10px" : "0px"}>
        Rate Limit
      </Text>
      {isAdmin && !isExpanded && !props.isSubscription ? (
        <Button size="xs" variant="outline" onClick={() => setIsExpanded(true)}>
          View Rate Limit Information
        </Button>
      ) : (
        <RateLimitEditor {...props} />
      )}

      {/* Admins will see this message when editing the App Rate Limits. */}
      {!props.isSubscription && !!appSubscriptions && (
        <Box mt={"10px"}>
          <WarningAlert>
            Please note that Subscriptions are able to override this Apps Rate
            Limit value.
            <Box mb="5px" />
            {Array.isArray(appSubscriptions) && (
              <>
                This App has {appSubscriptions.length} Subscription
                {appSubscriptions.length === 1 ? "" : "s"}.
              </>
            )}
          </WarningAlert>
        </Box>
      )}

      {/* Non-admins will see this message on their App details pages. */}
      {!props.isSubscription && !!props.inAppDetailsPage && !isAdmin && (
        <Box mt={"10px"}>
          <WarningAlert>
            Please note that Subscriptions are able to override this Apps Rate
            Limit value.
          </WarningAlert>
        </Box>
      )}
    </>
  );
};
