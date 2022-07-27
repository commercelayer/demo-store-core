import { createCatalog, createTaxon, createTaxonomy } from 'jest.helpers'
import { getBreadcrumbs, getRootNavigationLinks, getSlugs } from './catalog'
import { deepFind } from './collection'

const taxon1A1 = createTaxon('1A1')
const taxon1A = createTaxon('1A', [taxon1A1])
const taxon1B = createTaxon('1B')
const taxon1 = createTaxon('1', [taxon1A, taxon1B])
const taxon2 = createTaxon('2')
const taxon3 = createTaxon('3')
const taxonomy1 = createTaxonomy('1', [taxon1, taxon2])
const taxonomy2 = createTaxonomy('2', [taxon3])
const catalog1 = createCatalog('1', [taxonomy1, taxonomy2])

describe('getRootNavigationLinks', () => {
  it('should be able to generage root navigation links given a catalog with different taxonomies and taxons', () => {
    const rootNavigationLinks = getRootNavigationLinks(catalog1)

    expect(rootNavigationLinks).toStrictEqual([
      {
        key: 'taxon-key-1',
        href: '/search/taxon-slug-1',
        text: 'Label for 1',
        description: 'taxon-description-1'
      },
      {
        key: 'taxon-key-2',
        href: '/search/taxon-slug-2',
        text: 'Label for 2',
        description: 'taxon-description-2'
      }
    ])
  })
})

describe('getBreadcrumbs', () => {
  it('should be able to get parent, current and children navigation given a taxon deepFind result', () => {
    const taxon = deepFind([taxon1, taxon2, taxon3], 'taxons', 'slug', 'taxon-slug-1A')

    if (!taxon) {
      throw new Error('"taxon1" should contains "taxon1A"')
    }

    const breadcrumbs = getBreadcrumbs(taxon)

    expect(breadcrumbs).toStrictEqual({
      parent: [
        {
          key: taxon1.id,
          href: `/search/${taxon1.slug}`,
          text: taxon1.label,
          description: taxon1.description
        },
        {
          key: taxon1A.id,
          href: `/search/${taxon1A.slug}`,
          text: taxon1A.label,
          description: taxon1A.description
        }
      ],
      current: {
        key: taxon1A.id,
        href: `/search/${taxon1A.slug}`,
        text: taxon1A.label,
        description: taxon1A.description
      },
      children: [{
        key: taxon1A1.id,
        href: `/search/${taxon1A1.slug}`,
        text: taxon1A1.label,
        description: taxon1A1.description
      }],
    })
  })
})

describe('getSlugs', () => {
  it('should return ALL taxon-slugs', () => {
    const slugs = getSlugs(catalog1)

    expect(slugs).toStrictEqual([
      'taxon-slug-1',
      'taxon-slug-1A',
      'taxon-slug-1A1',
      'taxon-slug-1B',
      'taxon-slug-2',
    ])
  })
})
