# Commerce Layer Demo Store `types`

This package contains all `types` used by the Demo Store.

You can install it and use them to build your own Demo Store data and configuration files.

To build Demo Store data you'll probably need to write a script that converts data from your source to the Demo Store data format.

By using this package, that operation will be much easier to do and error-proof.

<img width="1158" alt="IntelliSense in Visual Studio Code" src="https://user-images.githubusercontent.com/1681269/208510718-23cd21e1-e602-41f7-8748-440bbb07d5ea.png">

## Create data

The Demo Store data are composed of a set of 8 JSON files usually located at `/data/json`.

* **catalogs.json**
  ```ts
  writeFileSync(
    'catalogs.json',
    JSON.stringify([{ ... }] satisfies RawDataCatalog[])
  )
  ```

* **countries.json**
  ```ts
  writeFileSync(
    'countries.json',
    JSON.stringify([{ ... }] satisfies RawDataCountry[])
  )
  ```

* **languages.json**
  ```ts
  writeFileSync(
    'languages.json',
    JSON.stringify([{ ... }] satisfies RawDataLanguage[])
  )
  ```

* **organization.json**
  ```ts
  writeFileSync(
    'organization.json',
    JSON.stringify({ ... } satisfies RawDataOrganization)
  )
  ```

* **pages.json**
  ```ts
  writeFileSync(
    'pages.json',
    JSON.stringify({
      '/': {
        'en': { ... }
      }
    } satisfies RawDataPages)
  )
  ```

* **products.json**
  ```ts
  writeFileSync(
    'products.json',
    JSON.stringify([{ ... }] satisfies RawDataProduct[])
  )
  ```

* **taxonomies.json**
  ```ts
  writeFileSync(
    'taxonomies.json',
    JSON.stringify([{ ... }] satisfies RawDataTaxonomy[])
  )
  ```

* **taxons.json**
  ```ts
  writeFileSync(
    'taxons.json',
    JSON.stringify([{ ... }] satisfies RawDataTaxon[])
  )
  ```

## Test data

This package is shipped with built-in tests.

You can use it inside a JavaScript file like so:

```js
//= runTestData.js

const { testJsonData } = require('@commercelayer/demo-store-types/dist/test')

testJsonData('./data/json/')
```

```sh
node runTestData.js
```

## Example

Here below you can find a working example with Node.js 18 that converts a list of products coming from an external service, to the Demo Store `products.json`.

Setup a new project from scratch:

```sh
mkdir demo
cd demo
npm init -y
npm install typescript @types/node tsm @commercelayer/demo-store-types
```

Create a new file `index.ts`:

```ts
//= index.ts

import type { RawDataProduct } from '@commercelayer/demo-store-types'
import { writeFile } from 'fs/promises'

(async () => {

  // this represent a list of products taken from an external source
  const remoteProducts: any[] = await fetch('https://run.mocky.io/v3/57f0a452-eae1-4f67-8a33-e4119e73c2db')
    .then(response => response.json())

  const demoStoreProducts: RawDataProduct[] = remoteProducts.map(
    ({ code, name, description, image_url }) => ({
      productCode: code.substring(0, 8),
      variantCode: code.substring(0, 8 + 6),
      sku: code,
      slug: `/${name.toLowerCase().replace(/[\W]+/g, '-').replace(/^-|-$/g, '')}/${code}`,
      name: {
        en: name.replace(/\s\(.*\)$/, '')
      },
      description: {
        en: description
      },
      images: [
        image_url
      ]
    }) satisfies RawDataProduct
  )

  await writeFile('products.json', JSON.stringify(demoStoreProducts, undefined, 2))

  console.log(demoStoreProducts)

})()
```

Just run:

```sh
node -r tsm index.ts
```

```ts
//= output

// [
//   {
//     "productCode": "5PANECAP",
//     "variantCode": "5PANECAP000000",
//     "sku": "5PANECAP000000FFFFFFXXXX",
//     "slug": "/black-five-panel-cap-with-white-logo/5PANECAP000000FFFFFFXXXX",
//     "name": {
//       "en": "Black Five-Panel Cap with White Logo"
//     },
//     "description": {
//       "en": "Soft-structured, five-panel, low-profile cap. 100% cotton, metal eyelets, nylon strap clip closure."
//     },
//     "images": [
//       "https://data.commercelayer.app/seed/images/skus/5PANECAP000000FFFFFFXXXX_FLAT.png"
//     ]
//   },
//   {
//     "productCode": "5PANECAP",
//     "variantCode": "5PANECAP9D9CA1",
//     "sku": "5PANECAP9D9CA1FFFFFFXXXX",
//     "slug": "/gray-five-panel-cap-with-white-logo/5PANECAP9D9CA1FFFFFFXXXX",
//     "name": {
//       "en": "Gray Five-Panel Cap with White Logo"
//     },
//     "description": {
//       "en": "Soft-structured, five-panel, low-profile cap. 100% cotton, metal eyelets, nylon strap clip closure."
//     },
//     "images": [
//       "https://data.commercelayer.app/seed/images/skus/5PANECAP9D9CA1FFFFFFXXXX_FLAT.png"
//     ]
//   },
//   {
//     "productCode": "APRONXXX",
//     "variantCode": "APRONXXX000000",
//     "sku": "APRONXXX000000FFFFFFXXXX",
//     "slug": "/black-apron-with-white-logo/APRONXXX000000FFFFFFXXXX",
//     "name": {
//       "en": "Black Apron with White Logo"
//     },
//     "description": {
//       "en": "This apron has a neck loop and long ties that are easy to adjust for any size. The two front pockets provide additional space for some much-needed cooking utensils, and together with our embroidered logo give the apron a sleek premium look."
//     },
//     "images": [
//       "https://data.commercelayer.app/seed/images/skus/APRONXXX000000FFFFFFXXXX_FLAT.png"
//     ]
//   }
// ]
```
