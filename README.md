# Demo Store by Commerce Layer

Demo Store is a fully static e-commerce solution (with SSR capability) that uses Commerce Layer. Keep reading to tailor your own.

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io/) is a multi-market commerce API and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, wearable, voice, or IoT device, with ease. Compose your stack with the best-of-breed tools you already mastered and love. Make any experience shoppable, anywhere, through a blazing-fast, enterprise-grade, and secure API.

## :battery: Batteries included

Demo Store comes with built-in search engine with facets, product variants and catalog management, integration with Commerce Layer (of course) using react-component and hosted application.

## Getting started

If you haven't had experience before with Commerce Layer, go [here](https://docs.commercelayer.io/developers/) and start the tutorial. Configuring a Demo Store expects that you already have a configured Organization with at least few products and one market.

If you prefer to start from scratch you can create a new Organization and use the following commands to configure a `Commerce Layer's Demo Store` like project.

Steps:

1. Organization setup on [dashboard.commercelayer.io](https://dashboard.commercelayer.io)
    1. API Clients (`Sales channel` and `Integration`)
    2. Local setup (cli + seeder + application login)
2. Download Demo Store
    1. `cp .env.sample .env.local`
    2. Paste Sales channel client id
    3. Update data json with `market` number

### Organization

Once the Organization is created, you need to create two [API clients](https://docs.commercelayer.io/developers/api-clients): one `Sales channel` and one `Integration`.

If you haven't done yet, install our [Commerce Layer CLI](https://www.npmjs.com/package/@commercelayer/cli), the [seeder plugin](https://www.npmjs.com/package/@commercelayer/cli-plugin-seeder) and the [imports plugin](https://www.npmjs.com/package/@commercelayer/cli-plugin-imports):

```sh
npm install -g @commercelayer/cli

commercelayer plugins:install seeder
commercelayer plugins:install imports
```

Now you can login to your `Integration` API client from the CLI:

```sh
commercelayer applications:login \
  --clientId Oy5F2TbPYhOZsxy1tQd9ZVZ... \
  --clientSecret 1ZHNJUgn_1lh1mel06gGDqa... \
  --organization my-awesome-organization \
  --alias cli-admin
```

### Demo Store

It's time to clone the repository. There are two ways to use Demo Store:
1. Fork and clone the [`demo-store`](https://github.com/commercelayer/demo-store) repository. This is using Demo Store core as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules), in this way you don't have to care about the whole source code but you can concentrate on you data.

    ```sh
    git clone git@github.com:<github-username>/demo-store-lite.git my-new-project
    cd my-new-project
    git submodule update --init
    npm install

    cp -r ./demo-store/packages/website/data/json ./data/json
    cp ./demo-store/packages/website/.env.sample.submodule .env.local
    ```


2. Fork and clone the [`demo-store-core`](https://github.com/commercelayer/demo-store-core) with all the source code. This is usefull if you want to customize the whole experience.

    ```sh
    git clone git@github.com:<github-username>/demo-store.git my-new-project
    cd my-new-project
    npm install

    cp ./packages/website/.env.sample ./packages/website/.env.local
    ```

### Environment Variables

Edit `.env.local` and fill all the missing information:

```properties
# this is the 'sales channel' client id
NEXT_PUBLIC_CL_CLIENT_ID=er34TWFcd24RFI8KJ52Ws6q...

# this is the 'base endpoint'
NEXT_PUBLIC_CL_ENDPOINT=https://my-awesome-organization.commercelayer.io
```

### Seed

The following script will populate your organizzation with all resources for a multi-market e-commerce. These are the same we are using for our [Demo Store](https://commercelayer.github.io/demo-store-core).

This step is *optional*. If you already have a well configured organization you can skip it.

```sh
npm run seeder:seed -ws --if-present
```

### countries.json

Edit `json/countries.json` with your preferred editor.

Here you have a list of available countries for your e-commerce.

You have to replace all instances of `"market": xxx` with the related markets of your organization. Here the list from your logged-in application.

```sh
npm run markets -ws --if-present
```

### Enjoy :rocket:

```sh
npm run dev

# http://localhost:3000/
```

### JSON Data files

Demo Store is built around a set of data that are stored as json files (locally or remotely). This decision is taken to decouple the Demo Store from 3rd party applications.

To build your own Demo Store you'll have to create and manage these json data files.



## Lighthouse CI

```sh
npx -p @lhci/cli lhci autorun
```

## Troubleshooting

1. **Q.** Even if I changed `NEXT_PUBLIC_JSON_DATA_FOLDER` or `NEXT_PUBLIC_LOCALE_DATA_FOLDER`, the website is still refering to previous json files.

    **A.** These two env variables reflect as `alias` for Webpack. Starting from Webpack 5, it introduced caching for faster builds. Changing these two env variables will not invalidate the Webpack cache. You should remove `.next` folder manually.
