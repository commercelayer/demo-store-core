import { LocalizedProductWithVariant, LocalizedVariant } from '#data/products'
import uniqBy from 'lodash/uniqBy'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'

type Props = {
  product: LocalizedProductWithVariant
}

const filterPrevious = (current: LocalizedVariant[], variants: LocalizedVariant[], index: number, memo = true): boolean => {
  if (index === 0) {
    return memo
  }

  return (memo =
    current[index - 1] &&
    variants[index - 1].value ===
    current[index - 1].value &&
    filterPrevious(current, variants, index - 1))
}

export const VariantSelector: React.FC<Props> = ({ product }) => {
  const router = useRouter()
  const [currentVariant, setCurrent] = useImmer<LocalizedVariant[]>(product.variant)

  const variants = product.variants.map(v => v.variant)

  const options = new Array(variants[0].length).fill(undefined).map((_, index) => {
    return uniqBy(
      variants
        .filter((variants) => filterPrevious(currentVariant, variants, index))
        .map((p) => p[index]),
      "value"
    )
  })

  useEffect(() => {
    currentVariant.forEach((c, index) => {
      const exists =
        options[index].find((option) => {
          return option.value === c.value
        }) !== undefined

      if (!exists) {
        setCurrent((draft) => {
          draft[index] = options[index][0]
        })
      }
    })
  }, [currentVariant, setCurrent, options])

  const currentProductCode = useMemo(() => product.variants.find(v => JSON.stringify(v.variant.map(v => v.value)) === JSON.stringify(currentVariant.map(v => v.value)))?.code, [product, currentVariant])

  useEffect(() => {
    if (currentProductCode && router.query.code !== currentProductCode) {
      router.push({
        query: {
          ...router.query,
          code: currentProductCode
        }
      })
    }
  }, [router, currentProductCode])

  return (
    <div>
      {
        options.map((option, index) => (
          <p key={index}>
            {option.map((o) => (
              <span
                style={{
                  borderBottom:
                    currentVariant[index]?.value === o.value ? "1px solid" : "none"
                }}
                key={o.value}
                onClick={() => {
                  setCurrent((draft) => {
                    draft[index] = o
                  })
                }}
              >
                &nbsp;{o.label}&nbsp;
              </span>
            ))}
          </p>
        ))
      }
    </div>
  )
}
