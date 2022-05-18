import { Container } from '#components/Container'
import { Facet } from '#components/Facet'
import { Footer } from '#components/Footer'
import { Header, HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import type { Props as SubNavigationProps } from '#components/SubNavigation'
import { SubNavigation } from '#components/SubNavigation'
import { findTaxonBySlug, flattenProductsFromTaxon, getCatalog, Taxon } from '#data/catalogs'
import { Facets, flattenProductVariants, getFacets, LocalizedProductWithVariant } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getNavigationLinks, getRootNavigationLinks } from '#models/catalog'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useState } from 'react'


type Query = {
  locale: string
  slug: string[]
}

type Props = HeaderProps & SubNavigationProps & {
  products: LocalizedProductWithVariant[]
  facets: Facets
}

const SearchSlugPage: NextPage<Props> = ({ navigation, products, subNavigation, facets }) => {
  const [result, setResult] = useState<LocalizedProductWithVariant[]>(products)

  return (
    <Page>
      <Container>
        <Header navigation={navigation} />

        <Facet products={products} facets={facets} onChange={setResult} />

        <h2 className='mt-16 block text-2xl font-semibold text-black'>{subNavigation.current.text}</h2>

        <SubNavigation subNavigation={subNavigation} />

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            result.map(product => (
              <ProductCard key={product.code} product={product} />
            ))
          }
        </div>
      </Container>

      <Footer />
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths((localeCode) => {
    const locale = getLocale(localeCode)

    const catalog = getCatalog(locale)

    const slugs = catalog.taxonomies.flatMap(taxonomy => taxonomy.taxons.flatMap(getFlatSlug))

    function getFlatSlug(taxon: Taxon): string[] {
      return [taxon.slug].concat(taxon.taxons?.flatMap(getFlatSlug) || [])
    }

    return {
      fallback: false,
      paths: slugs.map(slug => ({
        params: {
          slug: slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, slug } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale, true)

  const taxon = findTaxonBySlug(catalog, slug.join('/'))

  const products = flattenProductsFromTaxon(taxon.result)

  const flattenProducts = flattenProductVariants(products)

  return {
    props: {
      subNavigation: getNavigationLinks(taxon),
      products,
      facets: getFacets(flattenProducts),
      navigation: getRootNavigationLinks(catalog),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default SearchSlugPage
