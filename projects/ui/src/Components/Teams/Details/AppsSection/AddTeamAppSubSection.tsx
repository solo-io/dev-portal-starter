import { Box, Flex } from "@mantine/core";
import { Button } from "../../../Common/Button";

const AddTeamAppSubSection = ({ onClose }: { onClose: () => void }) => {
  return (
    <Box py={"10px"}>
      <Flex justify={"space-between"}>
        AddTeamAppSubsection
        <Button className="outline smallButton" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </Box>
  );
};

export default AddTeamAppSubSection;
