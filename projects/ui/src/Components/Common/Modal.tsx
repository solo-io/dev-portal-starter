import { Modal as AntdModal } from "antd";

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
  //   the maskStyles class so that we have easy access to our
  //   color constants.
  return (
    <AntdModal open={true} onCancel={onClose} footer={null}>
      <div className="modalBox">
        <div className="modalHeader">{headContent}</div>
        {!!title && <div className="modalTitle">{title}</div>}
        {!!bodyContent && <div className="modalBody">{bodyContent}</div>}
      </div>
    </AntdModal>
  );
}
