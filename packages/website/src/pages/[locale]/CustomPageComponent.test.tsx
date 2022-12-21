import { getRootNavigationLinks } from '#utils/catalog'
import type { CustomPage } from '#utils/pages'
import lngDict from '#__mocks__/lngDict.json'
import { act, render, screen } from '@testing-library/react'
import { createCarouselPageComponent, createCatalog, createRouter, createTaxon, createTaxonomy } from 'jest.helpers'
import { I18nProvider } from 'next-localization'
import { CustomPageComponent } from './CustomPageComponent'

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
  jest.useFakeTimers()

  useRouter.mockReset()
})

afterEach(() => {
  jest.clearAllTimers()
});

test('CustomPage component', async () => {
  useRouter.mockImplementation(() => createRouter('/'))

  const taxon = createTaxon('1')
  const taxonomy = createTaxonomy('1', [taxon])
  const catalog = createCatalog('1', [taxonomy])
  const navigation = getRootNavigationLinks(catalog)

  const carouselPageComponent = createCarouselPageComponent('1')

  const page: CustomPage = {
    slug: '/',
    title: 'Page title',
    description: 'Page description',
    components: [carouselPageComponent]
  }

  let container
  await act(async () => {
    ({ container } = render(
      <I18nProvider lngDict={lngDict} locale='en'>
        <CustomPageComponent localeCodes={['en', 'en-US', 'it-IT']} navigation={navigation} page={page} />
      </I18nProvider>
    ))

    jest.runAllTimers();
  })

  expect(container).toMatchSnapshot()

  const pageComponents = await screen.findAllByTestId('carousel-page-component')
  expect(pageComponents.length).toStrictEqual(1)

  const title = await screen.findByRole('heading', { level: 1 })
  expect(title).toHaveTextContent('Page title')
})
