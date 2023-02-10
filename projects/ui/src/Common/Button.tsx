function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  //
  // Render
  //
  const defaultClassName =
    "sl-button sl-m-1 sl-h-sm sl-text-base sl-font-medium sl-px-2.5 sl-bg-primary hover:sl-bg-primary-dark active:sl-bg-primary-darker disabled:sl-bg-canvas-100 sl-text-on-primary disabled:sl-text-body sl-rounded sl-border-transparent sl-border disabled:sl-opacity-70";
  return (
    <button
      {...props}
      className={
        !!props.className
          ? `${defaultClassName} ${props.className}`
          : defaultClassName
      }
    >
      {props.children}
    </button>
  );
}

export default Button;
