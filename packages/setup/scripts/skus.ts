import type { Facet } from '../../website/src/utils/facets'
import fs from 'fs'
import path from 'path'
import type { RawDataProduct } from '../../types'
import skus from '../data/skus.json'

const makeVariants = (code: string, name: string): Facet => {
  const [, _baseProduct, _colorA, _colorB, size] = code.match(/^(\w{8})(\w{6})(\w{6})(\w{4})$/) || []
  const [, sizeLabel] = name.match(/\((.*)\)$/) || []

  // TODO: review these product data.

  let colorA = ['000000', 'FFFFFF', 'E7DDC7'].includes(_colorA || '') ? _colorA : 'C2C2C2'

  if (code === 'GLCS21PXXXXXXXFFFFFFXXXX' || code === 'GLCS21UXXXXXXXFFFFFFXXXX') {
    colorA = '000000'
  }

  if (code === 'IPC12PMXXXXXXX000000XXXX') {
    colorA = 'FFFFFF'
  }

  return {
    color: `#${colorA}`,
    ...(size !== 'XXXX' ? { size: sizeLabel } : {})
  }
}

const products: RawDataProduct[] = skus.map(sku => {
  const imageFilename = (sku.image_url.match(/\/([^/]+)$/i) || [])[1]
  return {
    productCode: sku.code.substring(0, 8),
    variantCode: sku.code.substring(0, 8 + 6),
    sku: sku.code,
    slug: `/${sku.name.toLowerCase().replace(/[\W]+/g, '-').replace(/^-|-$/g, '')}/${sku.code}`,
    name: {
      en: sku.name.replace(/\s\(.*\)$/, ''),
      it: sku.name.replace(/\s\(.*\)$/, '')
    },
    description: {
      en: sku.description,
      it: sku.description
    },

    // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files
    images: [
      `https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/${imageFilename}`,
      `https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/${imageFilename}`
    ],

    ...makeVariants(sku.code, sku.name),
    // details: [
    //   {
    //     title: {
    //       en: 'Details'
    //     },
    //     content: {
    //       en: 'Eh .. put something here!'
    //     }
    //   },
    //   {
    //     title: {
    //       en: 'Delivery & returns'
    //     },
    //     content: {
    //       en: 'Same as above :)'
    //     }
    //   }
    // ]
  }
})

fs.writeFileSync(
  path.resolve(__dirname, '..', '..', 'website', 'data', 'json', 'products.json'),
  JSON.stringify(products, undefined, 2)
)
