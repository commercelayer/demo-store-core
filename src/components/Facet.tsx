import { Facets, flattenProductVariants, LocalizedProductWithVariant } from '#data/products'
import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'
// import { MagnifyingGlass } from '#assets/icons'
import { useRouter } from 'next/router'

type Props = {
  products: LocalizedProductWithVariant[]
  facets: Facets
  onChange: (result: LocalizedProductWithVariant[]) => void
}

export const Facet: React.FC<Props> = ({ products, facets, onChange }) => {
  // const [searchText, setSearchText] = useState<string>('')
  const [selectedFacets, setSelectedFacets] = useState<{ [name: string]: Facets[string] }>({})
  const router = useRouter()

  const fuseOptions: Fuse.IFuseOptions<LocalizedProductWithVariant> = useMemo(() => ({
    useExtendedSearch: true,
    threshold: .3,
    keys: [
      'name',
      'description',
    ].concat(
      Object.keys(facets).map(facetName => `facets.${facetName}`)
    )
  }), [facets])

  useEffect(function manageOnRouterChange() {
    setSelectedFacets(typeof router.query.facets === 'string' ? JSON.parse(router.query.facets) : {})

    // if (typeof router.query.q === 'string') {
    //   setSearchText(router.query.q)
    // }
  }, [router])

  useEffect(function manageSearch() {
    const fuse = new Fuse(flattenProductVariants(products), fuseOptions)
    // const pattern = searchText

    const andExpression: Fuse.Expression[] = []

    Object.entries(selectedFacets).forEach(([facetName, facetValue]) => {
      if (facetValue) {
        andExpression.push({
          $or: facetValue.map(value => ({ $path: `facets.${facetName}`, $val: `="${value}"` }))
        })
      }
    })

    // if (pattern) {
    //   andExpression.push({
    //     $or: [
    //       { $path: 'name', $val: pattern },
    //       { $path: 'description', $val: pattern },
    //     ]
    //   })
    // }

    onChange(
      andExpression.length > 0
        ? uniqBy(fuse.search({ $and: andExpression }).map(r => r.item), 'variantCode')
        : products
    )

  }, [products, fuseOptions, onChange, selectedFacets])

  // const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  //   setSearchText(event.currentTarget.value)

  //   router.push({
  //     query: {
  //       ...router.query,
  //       q: event.currentTarget.value
  //     }
  //   }, undefined, { scroll: false })
  // }

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
    }, undefined, { scroll: false })
  }

  return (
    <div>
      {/* <label htmlFor='email' className='relative py-3 rounded bg-gray-100 text-gray-400 focus-within:text-gray-600 block'>
        <MagnifyingGlass className='pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 left-3' />
        <input onChange={handleInputChange} value={searchText} placeholder='search' className='form-input appearance-none bg-transparent w-full pl-14 focus:outline-none focus:shadow-outline' />
      </label> */}

      {
        Object.entries(facets).map(([facetName, facetValues]) => {
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
