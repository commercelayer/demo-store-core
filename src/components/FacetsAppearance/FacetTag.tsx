import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import { useI18n } from 'next-localization'

export const FacetTag = ({ facetName, facetValues }: { facetName: string, facetValues: Primitives[] }) => {
  const i18n = useI18n();
  const { selectFacet, selectedFacets } = useCatalogContext()

  return (
    <>
      {
        facetValues.map(currentValue => (
          <button
            key={currentValue.toString()}
            className={`m-2 ml-0 ${selectedFacets[facetName]?.includes(currentValue) ? 'bg-gray-400' : 'bg-gray-100'} rounded px-2`}
            onClick={() => selectFacet(facetName, currentValue)}
          >{
              i18n.t(`facetValues.${currentValue.toString()}`) || currentValue.toString()
            }</button>
        ))
      }
    </>
  )
}
