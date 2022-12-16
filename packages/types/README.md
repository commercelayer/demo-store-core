# Commerce Layer Demo Store `types`

This package contains all `types` used by the Demo Store.

You can install it and use them to build your own Demo Store data and configuration files.

To build Demo Store data you'll probably need to create a scripts that converts data from your source to the Demo Store data format.

Using this package, that operation will be much easier and error-proof.

<img width="869" alt="IntelliSense in Visual Studio Code" src="https://user-images.githubusercontent.com/1681269/186433307-b309ab45-68b7-4a7e-ac10-df2874189e1b.png">

Here below a working example with Node.js 18:

```sh
mkdir demo
cd demo
npm init -y
npm install -D typescript tsm @commercelayer/demo-store-types
```

```ts
//= index.ts

(async () => {
  // this represent a list of products taken from an external source
  const remoteProducts: any[] = await fetch('https://run.mocky.io/v3/57f0a452-eae1-4f67-8a33-e4119e73c2db')
    .then(response => response.json())

  const demoStoreProducts: RawDataProduct[] = remoteProducts.map(product => ({
    productCode: product.code.substring(0, 8),
    variantCode: product.code.substring(0, 8 + 6),
    sku: product.code,
    slug: `/${product.name.toLowerCase().replace(/[\W]+/g, '-').replace(/^-|-$/g, '')}/${product.code}`,
    name: {
      en: product.name.replace(/\s\(.*\)$/, '')
    },
    description: {
      en: product.description
    },
    images: [
      product.image_url
    ]
  }))

  console.log(demoStoreProducts)
})()

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

```sh
node -r tsm index.ts
```