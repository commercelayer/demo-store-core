import { Navigation } from '#components/Navigation'
import { Link } from '#i18n/Link'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { basePath } from '#next.config'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Catalog, getCatalog, Taxon as TaxonType, Taxonomy as TaxonomyType } from '#data/catalogs'
import { Page } from '#components/Page'

type Query = {
  locale: string
}

type Props = {
  catalog: Catalog
}

const Taxonomy: React.FC<{ taxonomy: TaxonomyType }> = ({ taxonomy }) => {
  return (
    <div>
      <h2 className='mt-16 block text-2xl font-semibold text-black'>{taxonomy.label}</h2>
      <div className="mt-6 space-y-12 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {
          taxonomy.taxons.map(taxon => (
            <Taxon key={taxon.key} taxon={taxon} />
          ))
        }
      </div>
    </div>
  )
}

const Taxon: React.FC<{ taxon: TaxonType }> = ({ taxon }) => {
  return (
    <Link href={`/search/${taxon.slug}`}>
      <a className='relative w-full h-80 xl:h-96 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1'>
        <img className="object-cover w-full h-full" src={`${basePath}${taxon.image}`} alt={taxon.description} />
        <div className='absolute inset-0 bg-gradient-to-b from-black to-black/0 opacity-50'></div>
        <div className="absolute p-4 top-0 inset-x-0 text-white leading-snug">
          <h3 className='text-lg font-semibold'>{taxon.label}</h3>
          <div className='text-md font-medium text-gray-300'>{taxon.description}</div>
        </div>
        <div className="absolute p-4 bottom-0 inset-x-0 text-white leading-snug text-lg">
          <div className='font-semibold'>View all {`->`}</div>
        </div>
      </a>
    </Link>
  )
}

const Home: NextPage<Props> = ({ catalog }) => {

  return (
    <Page>
      <Container>
        <Header />

        <Navigation />

        <Taxonomy taxonomy={catalog.taxonomies[0]} />
      </Container>
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths({
    paths: [],
    fallback: false
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale } = params!

  return {
    props: {
      catalog: getCatalog('AMER'),
      ...(await serverSideTranslations(locale))
    }
  }
}

export default Home
