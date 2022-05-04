import { Catalog, Taxon, Taxonomy } from '#data/catalogs'
import { render, screen, within } from '@testing-library/react'
import { I18nProvider } from 'next-localization'

import Home from './index.page'

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
    references: [
      'APRONXXX000000FFFFFFXXXX'
    ]
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
    <I18nProvider lngDict={{ general: { title: 'Welcome to' } }} locale='en'>
      <Home catalog={catalog} />
    </I18nProvider>
  )

  const main = within(screen.getByRole('main'))

  expect(
    main.getByRole('heading', { level: 2, name: /Shop by categories/i })
  ).toBeDefined()

  expect(container).toMatchSnapshot()
})
