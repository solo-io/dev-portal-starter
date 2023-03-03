function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button {...props} className={`button ${props.className ?? ""}`}>
      {props.children}
    </button>
  );
}

export default Button;
