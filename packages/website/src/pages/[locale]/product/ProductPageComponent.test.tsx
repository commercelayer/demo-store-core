import { getRootNavigationLinks } from '#utils/catalog'
import { getProductWithVariants } from '#utils/products'
import lngDict from '#__mocks__/lngDict.json'
import productsJson from '#__mocks__/products'
import { act, render, screen } from '@testing-library/react'
import { createCatalog, createRouter, createTaxon, createTaxonomy } from 'jest.helpers'
import { I18nProvider } from 'next-localization'
import { ProductPageComponent } from './ProductPageComponent'

jest.mock('#data/languages', () => ({
  getRawDataLanguages: () => ([
    {
      "name": "English",
      "code": "en",
      "catalog": "AMER"
    },
    {
      "name": "Italiano",
      "code": "it",
      "catalog": "AMER"
    }
  ])
}))

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  jest.useFakeTimers();

  useRouter.mockReset()
})

afterEach(() => {
  jest.clearAllTimers()
});

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

  let container
  await act(async () => {
    ({ container } = render(
      <I18nProvider lngDict={lngDict} locale={locale}>
        <ProductPageComponent localeCodes={['en', 'en-US', 'it-IT']} navigation={navigation} product={product} />
      </I18nProvider>
    ))

    jest.runAllTimers();
  })


  const productDetails = screen.queryAllByTestId('product-detail')

  expect(productDetails.length).toStrictEqual(2)

  expect(productDetails[0].querySelector('[data-testid="accordion-title"]')).toHaveTextContent('Product info+')
  expect(productDetails[1].querySelector('[data-testid="accordion-title"]')).toHaveTextContent('Details')

  expect(productDetails[0].querySelector('[data-testid="accordion-content"]')).toHaveTextContent(product.description)
  expect(productDetails[1].querySelector('[data-testid="accordion-content"]')).toHaveTextContent('Text for "details"')

  expect(container).toMatchSnapshot()
})
