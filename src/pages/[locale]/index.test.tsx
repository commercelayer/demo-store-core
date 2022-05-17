import { Catalog, Taxon, Taxonomy } from '#data/catalogs'
import { getRootNavigationLinks } from '#models/catalog'
import { render, screen, within } from '@testing-library/react'
import { I18nProvider } from 'next-localization'
import HomePage from './index.page'


jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {
        locale: 'en-US'
      },
      asPath: '',
    };
  },
}));

test('home', () => {
  const taxon: Taxon = {
    key: 'taxon_1',
    label: 'Accessories',
    description: 'Accessories',
    slug: 'accessories',
    name: 'All Accessories',
    image: '/assets/images/samsung-case-samsung-galaxy-s21-plus-lifestyle-4-60f836d4aaa9d.png',
    products: [],
    taxons: []
  }

  const taxonomy: Taxonomy = {
    key: 'taxonomy_1',
    label: 'Shop by categories',
    name: 'Default Category',
    taxons: [taxon]
  }

  const catalog: Catalog = {
    key: 'catalog_1',
    name: 'AMER',
    taxonomies: [taxonomy]
  }

  const { container } = render(
    <I18nProvider lngDict={{ general: { viewAll: 'View all' } }} locale='en'>
      <HomePage navigation={getRootNavigationLinks(catalog)} taxonomies={catalog.taxonomies} />
    </I18nProvider>
  )

  const main = within(screen.getByRole('main'))

  expect(
    main.getByRole('heading', { level: 2, name: /Shop by categories/i })
  ).toBeDefined()

  expect(container).toMatchSnapshot()
})
