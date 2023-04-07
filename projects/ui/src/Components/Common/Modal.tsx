import { Modal as MantineModal } from "@mantine/core";

export function Modal({
  onClose,
  headContent,
  title,
  bodyContent,
}: {
  onClose: () => any;
  headContent: JSX.Element; // ususally just an icon
  title?: string;
  bodyContent?: JSX.Element;
}) {
  // The modal "mask" is overriden in "main.scss" rather than with
  //   the overlayProps so that we have easy access to our
  //   color constants.
  return (
    <MantineModal opened={true} onClose={onClose} centered>
      <div className="modalBox">
        <div className="modalHeader">{headContent}</div>
        {!!title && <div className="modalTitle">{title}</div>}
        {!!bodyContent && <div className="modalBody">{bodyContent}</div>}
      </div>
    </MantineModal>
  );
}
