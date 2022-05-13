import { Taxon } from '#data/catalogs'
import { Link } from '#i18n/Link'

type Props = {
  taxons: Taxon[]
}

export const Navigation: React.FC<Props> = ({ taxons }) => {
  return (
    <>
      {
        taxons.map(taxon => (
          <Link key={taxon.key} href={`/search/${taxon.slug}`}><a className='text-back font-bold p-2 m-2'>{taxon.label}</a></Link>
        ))
      }
    </>
  )
}
