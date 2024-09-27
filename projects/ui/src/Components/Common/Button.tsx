import {
  ButtonProps,
  DefaultMantineColor,
  Button as MantineButton,
  Text,
  TextProps,
} from "@mantine/core";
import { MouseEventHandler } from "react";
import { borderRadiusConstants } from "../../Styles/constants";

const colorMap: {
  [key: string]: {
    button: DefaultMantineColor;
    lightButton?: DefaultMantineColor;
    text: DefaultMantineColor;
  };
} = {
  success: {
    button: "green",
    text: "green.0",
  },
  primary: {
    button: "blue.6",
    text: "white",
  },
  secondary: {
    button: "gray.4",
    text: "gray.9",
  },
  warning: {
    button: "yellow.6",
    text: "red.6",
  },
  danger: {
    lightButton: "red.4",
    button: "red.6",
    text: "red.0",
  },
};

export type ButtonVariant = "outline" | "subtle" | "light" | "filled";

export function Button(
  props: {
    color?: "primary" | "success" | "warning" | "danger" | "secondary";
    variant?: ButtonVariant;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /**
     * `isText` defaults to true, and can be set to false to render the contents directly under the button.
     * This can be used when rendering a single SVG inside the button.
     */
    isText?: boolean;
    title?: string;
  } & ButtonProps
) {
  // default to a primary, filled button.
  const color = props.color ?? "primary";
  const variant = props.variant ?? "filled";
  const isText = props.isText ?? true;

  const colorInfo = colorMap[color];

  //
  // Text
  //
  let textColor = colorInfo.text;
  if (variant === "filled") {
    textColor = colorInfo.text;
  } else {
    textColor = colorInfo.button;
  }
  const textProps: TextProps = {
    sx: !props.size ? { fontWeight: 600, fontSize: "14px" } : undefined,
    size: props.size,
    color: textColor,
  };

  //
  // Button
  //
  let buttonColor = colorInfo.button;
  if (variant === "light") {
    if (!!colorInfo.lightButton) {
      buttonColor = colorInfo.lightButton;
    } else {
      buttonColor = colorInfo.text;
    }
  }
  const buttonProps: ButtonProps = {
    sx: { borderRadius: borderRadiusConstants.xs },
    ...props,
    variant,
    color: buttonColor,
  };

  //
  // Render
  //
  return (
    <MantineButton {...buttonProps}>
      {!!isText ? (
        <Text {...textProps}>{props.children}</Text>
      ) : (
        <>{props.children}</>
      )}
    </MantineButton>
  );
}
