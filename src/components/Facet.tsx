import type { Facets, LocalizedProductWithVariant } from '#data/products'
import type Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useCatalogContext } from 'src/useCatalog'

type Props = {
  products: LocalizedProductWithVariant[]
  facets: Facets
  onChange: (result: LocalizedProductWithVariant[]) => void
}

export const Facet: React.FC<Props> = ({ products: productSelection, facets: initialFacets, onChange }) => {
  const { products: contextProducts } = useCatalogContext()

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

  const fuseOptions = useMemo<Fuse.IFuseOptions<LocalizedProductWithVariant>>(
    () => ({
      useExtendedSearch: true,
      threshold: .3,
      keys: [
        'name',
        'description',
      ].concat(
        Object.keys(availableFacets).map(facetName => `facets.${facetName}`)
      )
    }),
    [availableFacets]
  )

  useEffect(function manageOnRouterChange() {
    setSelectedFacets(typeof router.query.facets === 'string' ? JSON.parse(router.query.facets) : {})

    if (typeof router.query.q === 'string') {
      setSearchText(router.query.q)
    }
  }, [router])

  useEffect(function manageSearch() {
    (async () => {
      const Fuse = (await import('fuse.js')).default
      const { flattenProductVariants, getFacets } = await import('#data/products')

      let result = products

      // search by Text
      if (searchText) {
        const fuse = new Fuse(products, fuseOptions)

        result = fuse.search({
          $or: [
            { $path: 'name', $val: searchText },
            { $path: 'description', $val: searchText },
          ]
        }).map(r => r.item)
      }

      const newFacets = getFacets(flattenProductVariants(result))

      // search by Facets
      const andExpression: Fuse.Expression[] = []

      Object.entries(selectedFacets).forEach(([facetName, facetValue]) => {
        if (facetValue) {
          andExpression.push({
            $or: facetValue.map(value => ({ $path: `facets.${facetName}`, $val: `="${value}"` }))
          })
        }
      })

      if (andExpression.length > 0) {
        const fuse = new Fuse(result, fuseOptions)
        result = uniqBy(fuse.search({ $and: andExpression }).map(r => r.item), 'variantCode')
      }

      onChange(result)

      // console.log('result', result)
      // console.log('outside', newFacets)

      if (false
        || prevSearchText !== searchText
        || JSON.stringify(facetsFromParent) !== JSON.stringify(initialFacets)
        || JSON.stringify(availableFacets) !== JSON.stringify(newFacets)
      ) {
        // console.log('inside', newFacets)
        setAvailableFacets(newFacets)
        setPrevSearchText(searchText)
        setFacetsFromParent(initialFacets)
      }
    })()
  }, [products, onChange, prevSearchText, searchText, selectedFacets, facetsFromParent, fuseOptions, initialFacets, contextProducts, availableFacets])

  const handleFacetChange = (facetName: string, currentValue: string) => {
    const facets = (typeof router.query.facets === 'string' ? JSON.parse(router.query.facets) : {}) as Facets

    facets[facetName] = facets[facetName] || []
    const facet = facets[facetName] || []
    if (Array.isArray(facet)) {
      const index = facet.indexOf(currentValue)
      index > -1 ? facet.splice(index, 1) : facet.push(currentValue)

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
