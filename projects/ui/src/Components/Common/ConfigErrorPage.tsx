import styled from "@emotion/styled";

/**
 * Shown in place of the whole portal when an environment variable is set to a
 * value the app cannot interpret (see `configErrors` in
 * `user_variables.tmplr.ts`).
 *
 * Deliberately standalone: it renders before the app's providers, so it takes
 * no theme, no router and no data. Whatever is misconfigured, this screen still
 * appears, and it addresses the operator who set the variable rather than the
 * end user who cannot act on it.
 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
  color: #2f2f2f;

  .details {
    max-width: 700px;
  }

  ul {
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
    font-family: monospace;
  }
`;

export function ConfigErrorPage({ errors }: { errors: string[] }) {
  return (
    <Container>
      <div className="details">
        <h1>Portal configuration error</h1>
        <p>
          The portal did not start because it was given a value it cannot
          interpret:
        </p>
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
        <p>
          Correct the environment variables on the portal frontend deployment,
          then restart it.
        </p>
      </div>
    </Container>
  );
}
