//
// From https://stackoverflow.com/a/65996386
// navigator.clipboard.writeText doesn't always work.
//
export async function copyToClipboard(textToCopy: string) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

export function downloadFile(filename: string, text: string) {
  const el = document.createElement("a");
  el.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  el.setAttribute("download", filename);
  el.setAttribute("target", "_blank");
  el.style.display = "none";
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}

export function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

/**
 * Returns the date formatted like MM/DD/YYYY (or local equivalent)
 */
export const formatDateToMMDDYYYY = (d: Date) => {
  // Locale left out so it defaults to local equivalent
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const jwtDecode = (t: string) => {
  return {
    header: JSON.parse(window.atob(t.split(".")[0])),
    payload: JSON.parse(window.atob(t.split(".")[1])),
  };
};

// Since enum can't be passed as a generic with type constraints, this is used to
// limit what can be passed into the function
export type StandardEnum<T> = {
  [id: string]: T | string;
  [nu: number]: string;
};

// Pass back all enum values as an array
export function getEnumValues<Enum>(pEnum: StandardEnum<Enum>): Enum[] {
  return (
    Object.entries(pEnum)
      // filter out any number keys - these only represent values (which are used in enums to easily find key name)
      .filter(([key]) => isNaN(key as any))
      .map(([, val]) => val as Enum)
  );
}

/**
 * @param {string} input - String to capitalize first letter
 */
export function capitalize(input: string) {
  return input[0].toUpperCase() + input.substring(1);
}
