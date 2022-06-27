import { Tag } from '#components/Tag'
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
          <Tag
            key={currentValue.toString()}
            onClick={() => selectFacet(facetName, currentValue)}
            selected={selectedFacets[facetName]?.includes(currentValue) }
          >
            {i18n.t(`search.values.${currentValue.toString()}`) || currentValue.toString()}
          </Tag>
        ))
      }
    </>
  )
}
