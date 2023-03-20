export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button {...props} className={`styledButton ${props.className ?? ""}`}>
      {props.children}
    </button>
  );
}
