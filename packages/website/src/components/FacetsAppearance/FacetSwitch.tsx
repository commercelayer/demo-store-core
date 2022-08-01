import { InputSwitch } from '#components/InputSwitch'
import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'

export const FacetSwitch = ({ facetName, facetValues }: { facetName: string, facetValues: Primitives[] }) => {
  const { selectFacet, selectedFacets } = useCatalogContext()

  return (
    <>
      {
        facetValues.map(currentValue => (
          <InputSwitch
            key={currentValue.toString()}
            onClick={() => selectFacet(facetName, currentValue)}
            defaultChecked={selectedFacets[facetName]?.includes(currentValue)}
          />
        ))
      }
    </>
  )
}
