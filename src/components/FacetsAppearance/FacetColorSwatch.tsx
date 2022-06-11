import { Swatch } from '#components/Swatch'
import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import { useI18n } from 'next-localization'

export const FacetColorSwatch = ({ facetName, facetValues }: { facetName: string, facetValues: Primitives[] }) => {
  const i18n = useI18n();
  const { selectFacet, selectedFacets } = useCatalogContext()

  return (
    <>
      {
        facetValues.map(currentValue => (
          <Swatch
            key={currentValue.toString()}
            swatchLabel={i18n.t(`facetValues.${currentValue.toString()}`) || currentValue.toString() }
            swatchStyle={{ backgroundColor: currentValue.toString() }}
            onClick={() => selectFacet(facetName, currentValue)}
            selected={selectedFacets[facetName]?.includes(currentValue) }
          />
        ))
      }
    </>
  )
}
