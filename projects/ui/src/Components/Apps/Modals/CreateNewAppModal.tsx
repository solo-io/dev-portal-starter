import { Modal } from "../../Common/Modal";

const CreateNewAppModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal
      onClose={onClose}
      headContent={<div>create new app</div>}
      bodyContent={<>Okay</>}
    />
  );
};

export default CreateNewAppModal;
