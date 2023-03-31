# Gloo Platform Portal UI

## Description

This is a portal starter for displaying your Open API schemas from a Solo backend. It is ready to drop in to an environment, but can also be updated with images and colors to better personalize the portal experience for your users.

This project is meant to be used with Gloo Platform API Portals.

## Technology

- This project was created with [Vite](https://vitejs.dev/), and configured to use React and TypeScript.
- The styles are extended with [Sass](https://sass-lang.com/).

## Setup

### Quick Start

Paste the following into a terminal to get started. Node 16+ is required. In this code snippet, [tmplr](https://github.com/loreanvictor/tmplr) is used to download and initialize the latest commit of this repository's main branch, and [yarn](https://yarnpkg.com/) is used as the package manager.

```
mkdir portal-test && cd portal-test && npx tmplr solo-io/dev-portal-starter#main && open http://localhost:4000 && make run-ui
```

### Switch Documentation Display Tool

Redocly is setup as the default display tool. However, Swagger is also ready for use simply by switching commented lines in `ApiSchemaDisplay.tsx`

If another tool entirely is preferred, then it's suggested to create a sibling file to `RedocDisplay.tsx` and `SwaggerDisplay.tsx` and then switching the component used inside of `ApiSchemaDisplay.tsx`

## Personalizing

### Color & Sizing Defaults

Although `_default-constants.scss` has almost all colors used and a limited amount of sizes, overriding changes should be done inside `_constants.scss` Detailed instructions can be found within that file.

### Logo

- The simplest way to replace the logo used in the top-left of the page is to replace the `logo.svg` file found at the top of the `/Assets` folder.

### Images & Icons

- Other images are intended as samples, but are reusable. They can be found at the top level of the `/Assets` folder as well, except for the favicon which is found in `/public`.
- All icons can be found, as the others, in the `/Assets` folder, inside `/Icons`. They are all svgs where the colors can be overriden with (s)css styling. If an icon is added and you want to insert it with our standard approach of `<Icon.some-icon-name />` you will need to also add a reference to it in the `Icons.tsx` file found in the same folder.

### Deeper Edits

We've tried to provide a solid, but non-obtrusive, amount of comments throughout the code. Hopefully enough to help get started with any larger changes that can be imagined.

## Different API Servicing the Site Itself

We have defaulted the API to an endpoint that makes some assumptions about the relationship between the site and Gloo Platform API Portals. If running it different, replace the value for `const restpointPrefix = "http://localhost:31080/v1";` found in `src/Apis/hooks.ts`
