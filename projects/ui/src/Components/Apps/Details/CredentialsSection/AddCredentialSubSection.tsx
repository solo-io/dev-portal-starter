import { Box, Input } from "@mantine/core";
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { DetailsPageStyles } from "../../../../Styles/shared/DetailsPageStyles";
import { Accordion } from "../../../Common/Accordion";
import { Button } from "../../../Common/Button";

/**
 * The form that names and creates a credential, followed by whatever shows the
 * created credential to the user.
 */
function AddCredentialSubSection<T>({
  kind,
  open,
  onClose,
  create,
  renderCreated,
}: {
  /** The credential's singular, title-case name, such as "API Key". */
  kind: string;
  open: boolean;
  onClose: () => void;
  create: (name: string) => Promise<T>;
  /**
   * Shows the created credential. Its secret comes back only from the create
   * call, so this is the one chance the user has to copy it; `onDone` drops it.
   */
  renderCreated: (created: T | undefined, onDone: () => void) => ReactNode;
}) {
  //
  // Form Fields
  //
  const [formName, setFormName] = useState("");

  //
  // Form
  //
  const formRef = useRef<HTMLFormElement>(null);
  const isFormDisabled = !open || !formName;
  useEffect(() => {
    // The form resets here when `open` changes.
    setFormName("");
  }, [open]);

  //
  // Form Submit
  //
  const [created, setCreated] = useState<T>();
  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const isValid = formRef.current?.reportValidity();
    if (!isValid || isFormDisabled) {
      return;
    }
    const res = await toast.promise(create(formName), {
      error: `There was an error creating the ${kind}.`,
      loading: `Creating the ${kind}...`,
      success: `Created the ${kind}!`,
    });
    onClose();
    setCreated(res);
  };

  //
  // Render
  //
  const lowerKind = kind.toLowerCase();
  return (
    <>
      <Accordion open={open}>
        <Box pb={"5px"}>
          <DetailsPageStyles.AddItemForm ref={formRef} onSubmit={onSubmit}>
            <Input
              id={`${lowerKind.replaceAll(" ", "-")}-name-input`}
              aria-label={`${lowerKind} name`}
              required
              placeholder={`${kind} Name`}
              disabled={!open}
              autoComplete="off"
              value={formName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormName(e.target.value)
              }
            />
            <Button disabled={isFormDisabled} type={"submit"}>
              ADD {kind}
            </Button>
          </DetailsPageStyles.AddItemForm>
        </Box>
      </Accordion>
      {renderCreated(created, () => setCreated(undefined))}
    </>
  );
}

export default AddCredentialSubSection;
