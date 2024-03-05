import { StyledMantineModal } from "./Modal.style";

export interface ModalProps {
  onClose: () => any;
  headContent: JSX.Element; // ususally just an icon
  title?: string;
  bodyContent?: JSX.Element;
  /** The clasNames are applied to the .mantine-Modal-root, which is outside the modal and page overlay. */
  className?: string;
}

export function Modal({
  onClose,
  headContent,
  title,
  bodyContent,
  className,
}: ModalProps) {
  // The modal "mask" is overriden in "main.scss" rather than with
  //   the overlayProps so that we have easy access to our
  //   color constants.
  return (
    <StyledMantineModal
      opened={true}
      onClose={onClose}
      className={className}
      centered
    >
      <div className="modalBox">
        <div className="modalHeader">{headContent}</div>
        {!!title && <div className="modalTitle">{title}</div>}
        {!!bodyContent && <div className="modalBody">{bodyContent}</div>}
      </div>
    </StyledMantineModal>
  );
}
