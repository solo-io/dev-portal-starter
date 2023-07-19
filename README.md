# Gloo Platform Portal UI

## Description

This is an example Solo.io Gloo Platform Dev Portal frontend app, built with [Vite](https://vitejs.dev/), and configured to use React and Typescript. It can be used to view information about your APIs and usage plans, add or delete API keys, and view your OpenAPI schemas using an embedded [Redoc UI](https://github.com/Redocly/redoc) or [Swagger UI](https://swagger.io/tools/swagger-ui/) view. It also can be personalized with images and colors to match your branding and preferences.

## Initial Setup

1. Run the following to download and initialize the latest commit of this repository's main branch.

   - This command uses [tmplr](https://github.com/loreanvictor/tmplr) for personalization of your developer portal. Currently, this just includes adding your company name, which shows up on the home page and on the website title, but could include other customization options in the future. The tmplr setup can be re-run at any time by running `npx tmplr` from the project's root directory.

   ```shell
   mkdir portal-test && cd portal-test && npx tmplr solo-io/dev-portal-starter#main
   ```

2. Create a `.env.local` file in the `projects/ui` folder. Replace environment variable values to match your Gloo Platform Portal and oauth provider's installation. This file is ignored by git.

   ```shell
   VITE_PORTAL_SERVER_URL="/v1"
   VITE_CLIENT_ID="your-client-id"
   VITE_TOKEN_ENDPOINT="your-token-endpoint"
   VITE_AUTH_ENDPOINT="your-auth-endpoint"
   ```

   <details><summary>Sample values for Keycloak</summary>

   ```shell
   VITE_PORTAL_SERVER_URL="/v1"
   VITE_CLIENT_ID="your-client-id"   # the client registered in the Auth Server
   VITE_TOKEN_ENDPOINT="https://${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token"
   VITE_AUTH_ENDPOINT="https://${KEYCLOAK_URL}/realms/master/protocol/openid-connect/auth"
   VITE_LOGOUT_ENDPOINT="https://${KEYCLOAK_URL}/realms/master/protocol/openid-connect/logout"
   ```

   </details>

3. Run the following to output a docker image, replacing the image name.

   ```shell
   IMAGE_NAME="your-image-name" \
   make build-ui-image
   ```

_\*\*\* Note: If building the docker image without `make build-ui-image`, make sure to run `make build-ui` with your environment variables set first to get the UI changes.\*\*\*_

4. Push your docker image:

   ```shell
   docker push "your-image-name"
   ```

5. Follow [the instructions in the engineering-demos repo](https://github.com/solo-io/engineering-demos/blob/ad5f6e217a50c8fcc9d1aa6e442a2c9bbef47eb2/gloo-mesh/portal/multicluster/README.md) to set up dev portal resources. Use the same image name that you used to build the image for the portal-frontend deployment's `spec.template.containers.image` field.

## UI Iteration

**Prerequisites for Local Development**:

- Install [Node v16.14.2](https://nodejs.org/en/blog/release/v16.14.2) and [yarn](https://yarnpkg.com/)

The UI can be run locally with:

```shell
make run-ui
```

## UI Iteration with Storybook and Mock Data

UI iteration can also be done with [Storybook](https://storybook.js.org/). Storybook can run without any kubernetes resources set up. API responses are mocked using [react-magnetic-di](https://www.npmjs.com/package/react-magnetic-di) and [@faker-js/faker](https://fakerjs.dev/). See the documentation in `./projects/ui/src/stories/usage-plans/UsagePlansPage.stories.tsx` for how to set up new stories with mock data. The Storybook server can be run on [http:localhost:6006](http:localhost:6006) using the command:

```shell
make run-storybook
```

## Troubleshooting

If using a different architecture from `amd64`, you may replace `amd64` with your architecture in the `/Dockerfile` and in the `make build-ui-image` make target in `/Makefile`. If seeing the error: `exec /usr/local/bin/npx: exec format error` in your frontend deployment, changing the architecture to `arm64`, rebuilding, and pushing as described in the "UI Iteration" section may solve the issue.

## Personalization

### Re-Running Initial Setup

The initial setup with [tmplr](https://github.com/loreanvictor/tmplr) can be re-run at any time by running `npx tmplr` from the project's root directory.

### Switching the API Documentation Display

The API details page includes a button to toggle between the Redoc and Swagger views, showing the Redoc view by default. Swagger can be changed to be the default view by modifying `ApiSchemaDisplay.tsx`.

### Colors

[Sass](https://sass-lang.com/) and class names are used for styling, and Sass variables are used throughout the app.

Colors may be overridden in `./projects/ui/src/Styles/_constants.scss`. See `_default-constants.scss` for the variable names that can be overridden.

### Logo

The simplest way to replace the logo used in the top-left of the page is to replace the `logo.svg` file found at the top of the `/Assets` folder.

### Images & Icons

Other images are intended as samples, but are reusable. They can be found at the top level of the `/Assets` folder as well, except for the favicon which is found in `/public`.

All icons can be found, as the others, in the `/Assets` folder, inside `/Icons`. The icons are all SVGs where the colors can be overriden by styling them with Sass or by modifying the SVG file. If an icon is added and you want to insert it with our standard approach of `<Icon.some-icon-name />` you will need to also add a reference to it in the `Icons.tsx` file found in the same folder.

## Environment Variables

You can add these environment variables to a `.env.local` file in the `projects/ui` folder. All Vite environment variables need to start with `VITE_` in order for the app to be able to read them.

#### VITE_PORTAL_SERVER_URL

This is the URL for the Gloo Platform Portal REST server. The default value is `/v1`.

#### VITE_CLIENT_ID

The oauth client id. In Keycloak, this is shown in the client settings of your keycloak instances UI: `<your-keycloak-url>/auth`

#### VITE_TOKEN_ENDPOINT

This is the endpoint to get the oauth token. In Keycloak, this is the `token_endpoint` property from: `<your-keycloak-url>/realms/<your-realm>/.well-known/openid-configuration`

In Keycloak, it may look like:
`<your-keycloak-url>/realms/<your-realm>/protocol/openid-connect/token`

#### VITE_AUTH_ENDPOINT

This is the endpoint to get the PKCE authorization code. In Keycloak, this is the `authorization_code` property from: `<your-keycloak-url>/realms/<your-realm>/.well-known/openid-configuration`

In Keycloak, it may look like:
`<your-keycloak-url>/realms/<your-realm>/protocol/openid-connect/auth`

#### VITE_LOGOUT_ENDPOINT

This is the endpoint to end your session. In Keycloak, this is the `end_session_endpoint` property from: `<your-keycloak-url>/realms/<your-realm>/.well-known/openid-configuration`

In Keycloak, it may look like:
`<your-keycloak-url>/realms/<your-realm>/protocol/openid-connect/logout`

## Troubleshooting Keycloak

In your Keycloak administration console, make sure that "Direct Access Grants" is enabled in your client settings, and "Web Origins" is set to `*`

## Creating Releases

When making a new release, use the GitHub UI, and name your release in the format: v1.2.3. When the release is published, a new branch will be made (v1.2.x), and a build of that version will be tagged and published to gcr.io/solo-public/docs/portal-frontend:v1.2.3 (replacing v1.2.3 with your tag name).
