import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import { useI18n } from 'next-localization'
import { InputRange } from './InputRange'

const Price = ({ facetValues }: { facetValues: Primitives[] }) => {
  // @ts-ignore
  const sortedPrice = facetValues.map(dd => dd.replace(/\$/g, '')).map(parseFloat).sort((a, b) => a - b)

  return <InputRange min={sortedPrice[0]} max={sortedPrice[sortedPrice.length - 1]} />
}

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
                  facetName === 'price.formatted_amount' && <Price facetValues={facetValues} />
                }
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
