import { useCatalogContext } from '#contexts/CatalogContext'
import { useI18n } from 'next-localization'

export const Facet: React.FC = () => {
  const { availableFacets, selectedFacets, selectFacet } = useCatalogContext()
  const i18n = useI18n();

  return (
    <div>
      {
        Object.entries(availableFacets).map(([facetName, facetValues]) => {
          if (facetValues.length > 0) {
            return (
              <div key={facetName}>
                <div className='font-bold mt-4'>{i18n.t(`facets.${facetName}`)}</div>
                {
                  facetValues.map(currentValue => (
                    <button
                      key={currentValue.toString()}
                      className={`m-2 ${selectedFacets[facetName]?.includes(currentValue) ? 'bg-gray-400' : 'bg-gray-100'} rounded px-2`}
                      onClick={() => selectFacet(facetName, currentValue)}
                    >{i18n.t(`facetValues.${currentValue.toString()}`) || currentValue.toString()}</button>
                  ))
                }
              </div>
            )
          }
        })
      }
    </div>
  )
}
