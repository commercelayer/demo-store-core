import { getRootNavigationLinks } from '#utils/catalog'
import lngDict from '#__mocks__/lngDict.json'
import { render, screen } from '@testing-library/react'
import { createCarouselPageComponent, createCatalog, createRouter, createTaxon, createTaxonomy } from 'jest.helpers'
import { I18nProvider } from 'next-localization'
import { HomePageComponent } from './HomePageComponent'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockReset()
})

test('home page', async () => {
  useRouter.mockImplementation(() => createRouter('/'))

  const taxon = createTaxon('1')
  const taxonomy = createTaxonomy('1', [taxon])
  const catalog = createCatalog('1', [taxonomy])
  const navigation = getRootNavigationLinks(catalog)

  const carouselPageComponent = createCarouselPageComponent('1')

  const { container } = render(
    <I18nProvider lngDict={lngDict} locale='en'>
      <HomePageComponent navigation={navigation} homepage={[carouselPageComponent]} />
    </I18nProvider>
  )

  const homepageComponents = await screen.findByTestId('homepage-components')

  expect(homepageComponents.childElementCount).toStrictEqual(1)

  expect(container).toMatchSnapshot()
})
