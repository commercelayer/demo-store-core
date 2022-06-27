import { getRootNavigationLinks } from '#utils/catalog'
import { getProductWithVariants } from '#utils/products'
import lngDict from '#__mocks__/lngDict.json'
import productsJson from '#__mocks__/products.json'
import { render, screen } from '@testing-library/react'
import { createCatalog, createRouter, createTaxon, createTaxonomy } from 'jest.helpers'
import { I18nProvider } from 'next-localization'
import { ProductPageComponent } from './ProductPageComponent'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockReset()
})

test('product detail page', async () => {
  const locale = 'en'
  const product = {
    ...getProductWithVariants('BODYBSSS000000FFFFFF12MX', locale, productsJson),
    details: [
      {
        title: 'Details',
        content: 'Text for "details"'
      }
    ]
  }


  useRouter.mockImplementation(() => createRouter(`/${product.slug}`))

  const taxon = createTaxon('1')
  const taxonomy = createTaxonomy('1', [taxon])
  const catalog = createCatalog('1', [taxonomy])
  const navigation = getRootNavigationLinks(catalog)

  const { container } = render(
    <I18nProvider lngDict={lngDict} locale={locale}>
      <ProductPageComponent navigation={navigation} product={product} />
    </I18nProvider>
  )

  const productDetails = screen.queryAllByTestId('product-detail')

  expect(productDetails.length).toStrictEqual(2)

  expect(productDetails[0].querySelector('[data-testid="accordion-title"]')).toHaveTextContent('Product info+')
  expect(productDetails[1].querySelector('[data-testid="accordion-title"]')).toHaveTextContent('Details')

  expect(productDetails[0].querySelector('[data-testid="accordion-content"]')).toHaveTextContent(product.description)
  expect(productDetails[1].querySelector('[data-testid="accordion-content"]')).toHaveTextContent('Text for "details"')

  expect(container).toMatchSnapshot()
})
