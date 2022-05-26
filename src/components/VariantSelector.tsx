import type { LocalizedProduct, LocalizedProductWithVariant, LocalizedVariant } from '#utils/products'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { compareVariants, getOptions } from './VariantSelector.utils'

type Props = {
  product: LocalizedProductWithVariant
  onChange?: (product: LocalizedProduct) => void
}

export const VariantSelector: React.FC<Props> = ({ product, onChange = () => {} }) => {
  const router = useRouter()
  const [currentVariant, setCurrentVariant] = useImmer<LocalizedVariant[]>(product.variant)

  const options = useMemo(() => {
    const variants = product.variants.map(v => v.variant)
    return getOptions(variants, currentVariant)
  }, [product, currentVariant])

  const currentProduct = useMemo(() => {
    return product.variants.find(({ variant }) => compareVariants(variant, currentVariant))
  }, [product, currentVariant])

  useEffect(function manageDefaultVariants() {
    currentVariant.forEach((c, index) => {
      const exists =
        options[index].find((option) => {
          return option.value === c.value
        }) !== undefined

      if (!exists) {
        setCurrentVariant((draft) => {
          draft[index] = options[index][0]
        })
      }
    })
  }, [currentVariant, setCurrentVariant, options])

  useEffect(function updateUrlWhenProductCodeChanges() {
    if (currentProduct) {
      onChange(currentProduct)
    }

    if (currentProduct && router.isReady && router.query.slug && (router.query.slug as string[]).join('/') !== currentProduct.slug) {
      router.push({
        query: {
          ...router.query,
          slug: currentProduct.slug.split('/')
        }
      })
    }
  }, [router, currentProduct, onChange])

  return (
    <div>
      {
        options.map((variants, index) => (
          <p key={variants[0].name}>
            {
              variants.map(variant => (
                <span
                  key={variant.value}
                  style={{ borderBottom: currentVariant[index]?.value === variant.value ? '1px solid' : 'none' }}
                  onClick={() => {
                    setCurrentVariant((draft) => {
                      draft[index] = variant
                    })
                  }}
                >
                  &nbsp;{variant.label}&nbsp;
                </span>
              ))
            }
          </p>
        ))
      }
    </div>
  )
}
