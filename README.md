# Demo Store by Commerce Layer

Demo Store is a fully static e-commerce solution (with SSR capability) that uses Commerce Layer. Our [Swag Store] is powered by Demo Store. Keep reading to tailor your own.

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

If you haven't done yet, install our Commerce Layer CLI and the Seeder plugin:

```sh
npm install -g @commercelayer/cli

commercelayer plugins:install seeder
```

Now you can login to your `Integration` API client from the CLI:

```sh
commercelayer applications:login \
  --clientId Oy5F2TbPYhOZsxy1tQd9ZVZ... \
  --clientSecret 1ZHNJUgn_1lh1mel06gGDqa... \
  --organization my-awesome-organization \
  --alias admin
```

```sh
# commercelayer seeder:seed -b custom -n multi_market_full
```

### Demo Store

#### Option 1 - fork it

Fork https://github.com/commercelayer/demo-store into your GitHub account.

##### Setup

```sh
git clone git@github.com:<github-username>/demo-store.git my-new-project
cd my-new-project
npm install
```

##### Seed

```sh
npm run seeder:seed -ws --if-present
```

##### Environment Variables

```sh
cp packages/website/.env.sample packages/website/.env.local

# edit "packages/website/.env.local" and fill
#  NEXT_PUBLIC_CL_CLIENT_ID=
#  NEXT_PUBLIC_CL_ENDPOINT=
```

##### countries.json

Edit `packages/website/data/json/countries.json` with your preferred editor.

Here you have a list of available countries for your e-commerce.

You have to replace all instances of `"market": xxx` with the related markets of your organization. Here the list from your logged-in application.

```sh
npm run markets -ws --if-present
```

##### Enjoy :rocket:

```sh
npm run dev
# http://localhost:3000/demo-store
```

#### Option 2 - submodule

##### Setup

```sh
mkdir my-new-project
cd my-new-project

git init
git submodule add git@github.com:commercelayer/demo-store.git

cat <<EOT >> package.json
{
  "private": true,
  "workspaces": [
    "demo-store/packages/*"
  ],
  "scripts": {
    "dev": "env $(awk 'NF > 0 && !/^#/ { print $0 }' .env.local | xargs) npm run dev -ws --if-present"
  },
  "license": "MIT"
}
EOT

npm install
```

##### Seed

```sh
npm run seeder:seed -ws --if-present
```

##### Environment Variables

```sh
cp ./demo-store/packages/website/.env.sample .env.local

# edit "packages/website/.env.local" and fill
#  NEXT_PUBLIC_CL_CLIENT_ID=
#  NEXT_PUBLIC_CL_ENDPOINT=
```

##### countries.json

Edit `packages/website/data/json/countries.json` with your preferred editor.

Here you have a list of available countries for your e-commerce.

You have to replace all instances of `"market": xxx` with the related markets of your organization. Here the list from your logged-in application.

```sh
npm run markets -ws --if-present
```

##### Enjoy :rocket:

```sh
npm run dev
# http://localhost:3000/demo-store
```

### JSON Data files

Demo Store is built around a set of data that are stored as json files (locally or remotely). This decision is taken to decouple the Demo Store from 3rd party applications.

To build your own Demo Store you'll have to create and manage these json data files.



## Lighthouse CI

```sh
npx -p @lhci/cli lhci autorun
```
