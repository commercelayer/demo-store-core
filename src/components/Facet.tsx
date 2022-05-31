import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import facetsConfig from 'config/facets.config'
import { useI18n } from 'next-localization'
import { FacetColor, FacetPriceRange, FacetTag } from './FacetsAppearance'

const FacetAppearance: React.FC<{ facetName: string, facetValues: Primitives[] }> = ({ facetName, facetValues }) => {
  const config = facetsConfig.find(facetConfig => facetConfig.field === facetName)

  if (!config) {
    console.error(`Facet configuration for ${facetName} is missing!`)
    return null
  }

  switch (config.type) {
    case 'priceRange':
      return <FacetPriceRange facetName={facetName} facetValues={facetValues} />
    case 'color':
      return <FacetColor facetName={facetName} facetValues={facetValues} />
    case 'tag':
      return <FacetTag facetName={facetName} facetValues={facetValues} />
  }
}

export const Facet: React.FC = () => {
  const i18n = useI18n();
  const { availableFacets } = useCatalogContext()

  return (
    <div>
      {
        Object.entries(availableFacets).map(([facetName, facetValues]) => {
          if (facetValues.length > 0) {
            return (
              <div key={facetName}>
                <div className='font-bold mt-4'>{i18n.t(`facets.${facetName}`) || `facets.${facetName}`}</div>
                <FacetAppearance facetName={facetName} facetValues={facetValues} />
              </div>
            )
          }
        })
      }
    </div>
  )
}
