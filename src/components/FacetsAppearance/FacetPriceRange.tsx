import { InputRange } from '#components/InputRange'
import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const toNumber = (facetValue: Primitives): number | null =>  {
  if (typeof facetValue !== 'undefined' && typeof facetValue !== 'number' && typeof facetValue !== 'string') {
    console.error(`Cannot convert "${facetValue}" to number. Facet value is not valid for a Range appearance type.`)
    return null
  }

  return typeof facetValue === 'string' ? parseFloat(facetValue) : facetValue
}

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null
}

export const FacetPriceRange = ({ facetName, facetValues }: { facetName: string, facetValues: Primitives[] }) => {
  const { selectFacet, selectedFacets, currencyCode } = useCatalogContext()
  const router = useRouter()

  const selectedFacet = selectedFacets[facetName] || []

  const minValue = toNumber(selectedFacet[0])
  const maxValue = toNumber(selectedFacet[1])

  const defaultValue = minValue && maxValue ? [minValue, maxValue] as const : undefined

  const sortedPrice = useMemo(
    () => facetValues
      .map(toNumber)
      .filter(isNotNull)
      .sort((a, b) => a - b),
    [facetValues]
  )

  const formatter = useMemo(
    () => new Intl.NumberFormat(router.query.locale, currencyCode ? {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0
    } : {}),
    [router, currencyCode]
  )

  return (
    <div className='mt-2'>
      <InputRange
        min={Math.floor(sortedPrice[0])}
        max={Math.ceil(sortedPrice[sortedPrice.length - 1])}
        step={1}
        defaultValue={defaultValue}
        onRelease={(value) => selectFacet(facetName, value)}
        format={formatter.format}
      />
    </div>
  )
}
