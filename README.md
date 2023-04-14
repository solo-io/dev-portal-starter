# Gloo Platform Portal UI

## Description

This is an example Solo.io Gloo Platform Dev Portal frontend app, built with [Vite](https://vitejs.dev/), and configured to use React and Typescript. It can be used to view information about your APIs and usage plans, add or delete API keys, and view your OpenAPI schemas using an embedded [Redoc UI](https://github.com/Redocly/redoc) or [Swagger UI](https://swagger.io/tools/swagger-ui/) view. It also can be personalized with images and colors to match your branding and preferences.

## Initial Setup

1. Install [Node v16.14.2](https://nodejs.org/en/blog/release/v16.14.2) and [yarn](https://yarnpkg.com/).

2. Run the following, which uses [tmplr](https://github.com/loreanvictor/tmplr) to download and initialize the latest commit of this repository's main branch.

   ```shell
   mkdir portal-test && cd portal-test && npx tmplr solo-io/dev-portal-starter#main
   ```

3. Run the following to output a docker image (replace username):

   ```shell
   IMAGE_NAME=username/portal-frontend make build-ui-image
   ```

_\*\*\* Note: If building the docker image without `make build-ui-image`, make sure to run `make build-ui` first to get the UI changes.\*\*\*_

4. Follow [the instructions in the engineering-demos repo](https://github.com/solo-io/engineering-demos/blob/ad5f6e217a50c8fcc9d1aa6e442a2c9bbef47eb2/gloo-mesh/portal/multicluster/README.md) to set up dev portal resources. Use the same image name that you used to build the image for the portal-frontend deployment's `spec.template.containers.image` field.

## UI Iteration

The following steps can be used to iterate on the UI after following the previous setup instructions.

1. Build the docker image (replace "username").

   ```shell
   IMAGE_NAME=username/portal-frontend make build-ui-image
   ```

2. Push to docker hub (replace "username"). This is required to see UI updates if the kubernetes portal-frontend deployment has `imagePullPolicy: Always`.

   ```shell
   docker push username/portal-frontend:latest
   ```

3. Restart the portal-frontend deployment to see the reloaded image (make sure that the `spec.template.containers.image` field in the deployment yaml matches your image name).
   ```shell
   k rollout restart -n gloo-mesh-addons deploy/portal-frontend
   ```

## UI Iteration with Storybook and Mock Data

Since building and pushing the image using the previous steps can take a while, UI iteration can also be done with [Storybook](https://storybook.js.org/). Storybook can run without any kubernetes resources set up. API responses are mocked using [react-magnetic-di](https://www.npmjs.com/package/react-magnetic-di) and [@faker-js/faker](https://fakerjs.dev/). The storybook server can be run on http:localhost:6006 using the command:

```shell
make run-storybook
```

### Switching the API Documentation Display

The API details page includes a button to toggle between the Redocly and Swagger view, showing Redocly by default. Swagger can be changed to the default view by modifying `ApiSchemaDisplay.tsx`

## Personalization

### Colors

The styles are extended with [Sass](https://sass-lang.com/), and Sass variables are used throughout the app.

Colors may be overridden in `./projects/ui/src/Styles/_constants.scss`. See `_default-constants.scss` for the variable names that can be overridden.

### Logo

The simplest way to replace the logo used in the top-left of the page is to replace the `logo.svg` file found at the top of the `/Assets` folder.

### Images & Icons

Other images are intended as samples, but are reusable. They can be found at the top level of the `/Assets` folder as well, except for the favicon which is found in `/public`.

All icons can be found, as the others, in the `/Assets` folder, inside `/Icons`. They are all svgs where the colors can be overriden with (s)css styling. If an icon is added and you want to insert it with our standard approach of `<Icon.some-icon-name />` you will need to also add a reference to it in the `Icons.tsx` file found in the same folder.

### Deeper Edits

We've tried to provide a solid, but non-obtrusive, amount of comments throughout the code. Hopefully enough to help get started with any larger changes that can be imagined.

## Environment Variables

### VITE_RESTPOINT

The `VITE_RESTPOINT` environment variable changes this prefix for installations where the portal server is hosted elsewhere. A different endpoint prefix can be applied to all of the make targets (e.g. `VITE_RESTPOINT=http://example.com/my-portal-endpoint make build-ui`). The default value is `/portal-server/v1`.
