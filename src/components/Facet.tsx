import { useCatalogContext } from '#contexts/CatalogContext'

export const Facet: React.FC = () => {
  const { availableFacets, selectedFacets, selectFacet } = useCatalogContext()

  return (
    <div>
      {
        Object.entries(availableFacets).map(([facetName, facetValues]) => {
          return (
            <div key={facetName}>
              <div className='font-bold mt-4'>{facetName}</div>
              {
                facetValues && facetValues.map(currentValue => (
                  <button
                    key={currentValue}
                    className={`m-2 ${selectedFacets[facetName]?.includes(currentValue) ? 'bg-gray-400' : 'bg-gray-100'} rounded px-2`}
                    onClick={() => selectFacet(facetName, currentValue)}
                  >{currentValue}</button>
                ))
              }
            </div>
          )
        })
      }
    </div>
  )
}
