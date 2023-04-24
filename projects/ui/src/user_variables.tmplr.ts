/**
 *
 * These variables are assigned with CLI input when initializing
 * the project with tmplr: https://github.com/loreanvictor/tmplr
 *
 * They can also be updated manually at any time.
 *
 */

/**
 * This checks if a `templateString` has been transformed by tmplr.
 * If it has not been transformed, the `defaultValue` is returned.
 * Otherwise, the transformed value is returned.
 */
function templateString(templateString: string, defaultValue: string) {
  if (/{{.*}}$/.test(templateString)) return defaultValue;
  return templateString;
}

//
// Project Settings
//
export const companyName = templateString(
  "{{ tmplr.company_name }}",
  "Acme Co."
);
document.title = companyName + " Portal";
