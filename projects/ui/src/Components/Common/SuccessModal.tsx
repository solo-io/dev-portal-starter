import { Icon } from "../../Assets/Icons";
import { Modal } from "./Modal";

export function SuccessModal({ onClose }: { onClose: () => any }) {
  return (
    <Modal
      onClose={onClose}
      headContent={<Icon.SuccessCheckmark />}
      title={"Key Generated Successfully!"}
    />
  );
}
