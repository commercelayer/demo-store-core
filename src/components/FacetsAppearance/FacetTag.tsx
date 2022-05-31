import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import { useI18n } from 'next-localization'

export const FacetTag = ({ facetName, facetValues }: { facetName: string, facetValues: Primitives[] }) => {
  const i18n = useI18n();
  const { selectFacet, selectedFacets } = useCatalogContext()

  return (
    <>
      {
        facetValues.map(currentValue => {
          const isSelected = selectedFacets[facetName]?.includes(currentValue)

          return (
            <button
              key={currentValue.toString()}
              className={`my-2 mr-2 ${isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'} rounded py-2 px-4`}
              onClick={() => selectFacet(facetName, currentValue)}
            >
              {i18n.t(`facetValues.${currentValue.toString()}`) || currentValue.toString()}
            </button>
          )
        })
      }
    </>
  )
}
