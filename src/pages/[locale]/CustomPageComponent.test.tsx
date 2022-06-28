import { getRootNavigationLinks } from '#utils/catalog'
import lngDict from '#__mocks__/lngDict.json'
import { render, screen } from '@testing-library/react'
import { createCarouselPageComponent, createCatalog, createRouter, createTaxon, createTaxonomy } from 'jest.helpers'
import { I18nProvider } from 'next-localization'
import { CustomPageComponent } from './CustomPageComponent'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockReset()
})

test('CustomPage component', async () => {
  useRouter.mockImplementation(() => createRouter('/'))

  const taxon = createTaxon('1')
  const taxonomy = createTaxonomy('1', [taxon])
  const catalog = createCatalog('1', [taxonomy])
  const navigation = getRootNavigationLinks(catalog)

  const carouselPageComponent = createCarouselPageComponent('1')

  const { container } = render(
    <I18nProvider lngDict={lngDict} locale='en'>
      <CustomPageComponent navigation={navigation} components={[carouselPageComponent]} />
    </I18nProvider>
  )

  const pageComponents = await screen.findByTestId('page-components')

  expect(pageComponents.childElementCount).toStrictEqual(1)

  expect(container).toMatchSnapshot()
})
