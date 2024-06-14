import { Flex, Text } from "@mantine/core";

type EmptyDataProps =
  | {
      topic: string;
      message?: string;
    }
  | {
      topicMessageOverride: string;
    };
export function EmptyData(props: EmptyDataProps) {
  return (
    <Flex justify={"center"}>
      <Text color="gray.6" italic>
        {"topicMessageOverride" in props ? (
          <>{props.topicMessageOverride}</>
        ) : (
          <>No {props.topic} results were found</>
        )}
      </Text>
      {"message" in props && !!props.message && (
        <Text color="gray.6" italic>
          {props.message}
        </Text>
      )}
    </Flex>
  );
}
