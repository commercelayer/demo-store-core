import type { Facets, LocalizedProductWithVariant } from '#data/products'
import type Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useCatalog } from 'src/useCatalog'

type Props = {
  products: LocalizedProductWithVariant[]
  facets: Facets
  onChange: (result: LocalizedProductWithVariant[]) => void
}

export const Facet: React.FC<Props> = ({ products: productSelection, facets: initialFacets, onChange }) => {
  const { products: contextProducts } = useCatalog()

  const [facetsFromParent, setFacetsFromParent] = useState(initialFacets)
  const [availableFacets, setAvailableFacets] = useState(initialFacets)
  const [searchText, setSearchText] = useState<string>('')
  const [prevSearchText, setPrevSearchText] = useState<string>('')
  const [selectedFacets, setSelectedFacets] = useState<{ [name: string]: Facets[string] }>({})
  const router = useRouter()

  const isFiltering = Object.entries(selectedFacets).length > 0

  const products = useMemo(
    () => isFiltering ? contextProducts : productSelection.map(ps => contextProducts.find(cp => cp.code === ps.code)!),
    [isFiltering, contextProducts, productSelection]
  )

  useEffect(function manageOnRouterChange() {
    if (typeof router.query.facets === 'string') {
      try {
        setSelectedFacets(JSON.parse(router.query.facets))
      } catch (e) {
        console.error('The query param "facets" is not a stringified JSON.', e)
      }
    }

    if (typeof router.query.q === 'string') {
      setSearchText(router.query.q)
    }
  }, [router])

  useEffect(function manageSearch() {
    (async () => {
      const { flattenProductVariants, getFacets } = await import('#data/products')

      const resultFromFreeTextSearch = await freeTextSearch(products, searchText)

      const newFacets = getFacets(flattenProductVariants(resultFromFreeTextSearch))

      const result = await facetSearch(resultFromFreeTextSearch, selectedFacets)

      onChange(result)

      if (false
        || prevSearchText !== searchText
        || JSON.stringify(facetsFromParent) !== JSON.stringify(initialFacets)
        || JSON.stringify(availableFacets) !== JSON.stringify(newFacets)
      ) {
        setAvailableFacets(newFacets)
        setPrevSearchText(searchText)
        setFacetsFromParent(initialFacets)
      }
    })()
  }, [products, onChange, prevSearchText, searchText, selectedFacets, facetsFromParent, initialFacets, contextProducts, availableFacets])

  const handleFacetChange = (facetName: string, value: string) => {
    const facets = { ...selectedFacets }

    facets[facetName] = facets[facetName] || []
    const facet = facets[facetName] || []

    if (Array.isArray(facet)) {
      const index = facet.indexOf(value)
      index > -1 ? facet.splice(index, 1) : facet.push(value)

      if (facet.length === 0) {
        delete facets[facetName]
      }
    }

    setSelectedFacets(facets)

    router.push({
      query: {
        ...router.query,
        facets: JSON.stringify(facets)
      }
    }, undefined, { scroll: false, shallow: true })
  }

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
                    onClick={() => handleFacetChange(facetName, currentValue)}
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

async function freeTextSearch(products: LocalizedProductWithVariant[], query: string): Promise<LocalizedProductWithVariant[]> {
  const Fuse = (await import('fuse.js')).default

  if (query === '') {
    return products
  }

  const fuse = new Fuse(products, {
    useExtendedSearch: false,
    threshold: .3,
    keys: [
      'name',
      'description',
    ]
  })

  return fuse.search({
    $or: [
      { $path: 'name', $val: query },
      { $path: 'description', $val: query },
    ]
  }).map(r => r.item)
}

async function facetSearch(products: LocalizedProductWithVariant[], facets: { [name: string]: Facets[string] }): Promise<LocalizedProductWithVariant[]> {
  const Fuse = (await import('fuse.js')).default

  const andExpression: Fuse.Expression[] = []

  Object.entries(facets).forEach(([facetName, facetValue]) => {
    if (facetValue) {
      andExpression.push({
        $or: facetValue.map(value => ({ $path: `facets.${facetName}`, $val: `="${value}"` }))
      })
    }
  })

  if (andExpression.length <= 0) {
    return products
  }

  const fuse = new Fuse(products, {
    useExtendedSearch: true,
    threshold: .3,
    keys: Object.keys(facets).map(facetName => `facets.${facetName}`)
  })

  return uniqBy(fuse.search({ $and: andExpression }).map(r => r.item), 'variantCode')
}