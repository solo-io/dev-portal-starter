import { css } from "@emotion/react";
import styled from "@emotion/styled";

namespace AccordionStyles {
  export const Accordion = styled.div<{ open: boolean }>(
    ({ open }) => css`
      // Height expand transition.
      display: grid;
      transition: 250ms grid-template-rows ease;
      grid-template-rows: ${open ? "1fr" : "0fr"};
    `
  );

  export const AccordionContent = styled.div`
    overflow: hidden;
  `;
}

export const Accordion = ({
  open,
  children,
}: {
  children: React.ReactNode;
  open: boolean;
}) => {
  return (
    <AccordionStyles.Accordion open={open}>
      <AccordionStyles.AccordionContent>
        {children}
      </AccordionStyles.AccordionContent>
    </AccordionStyles.Accordion>
  );
};
