import { Box } from "@mantine/core";
import { Accordion } from "../../../Common/Accordion";

const AddTeamAppSubSection = ({
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Accordion open={open}>
      <Box pb={"10px"}>AddTeamAppSubsection</Box>
    </Accordion>
  );
};

export default AddTeamAppSubSection;
