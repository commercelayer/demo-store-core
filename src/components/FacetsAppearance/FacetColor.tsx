import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import { useI18n } from 'next-localization'

export const FacetColor = ({ facetName, facetValues }: { facetName: string, facetValues: Primitives[] }) => {
  const i18n = useI18n();
  const { selectFacet, selectedFacets } = useCatalogContext()

  return (
    <>
      {
        facetValues.map(currentValue => {
          const isSelected = selectedFacets[facetName]?.includes(currentValue)
          const isSelectedClass = isSelected ? 'border border-gray-300 bg-gray-100' : ''

          return (
            <button
              key={currentValue.toString()}
              className={`w-12 h-12 rounded-full inline-flex items-center justify-center my-1 mr-2 ${isSelectedClass}`}
              onClick={() => selectFacet(facetName, currentValue)}
            >
              <div className='w-8 h-8 border border-gray-600 rounded-full' style={{ backgroundColor: `#${currentValue}` }}>
                <span className='sr-only'>{i18n.t(`facetValues.${currentValue.toString()}`) || currentValue.toString()}</span>
              </div>
            </button>
          )
        })
      }
    </>
  )
}
