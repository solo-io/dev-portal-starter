export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  const { disabled, ...rest } = props;

  return (
    <button
      {...rest}
      aria-disabled={disabled}
      className={`styledButton ${rest.className ?? ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      {rest.children}
    </button>
  );
}
