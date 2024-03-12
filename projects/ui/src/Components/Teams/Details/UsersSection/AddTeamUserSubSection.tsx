import { Box } from "@mantine/core";
import { Accordion } from "../../../Common/Accordion";

const AddTeamUserSubSection = ({
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Accordion open={open}>
      <Box pb={"10px"}>AddTeamUserSubsection</Box>
    </Accordion>
  );
};

export default AddTeamUserSubSection;
