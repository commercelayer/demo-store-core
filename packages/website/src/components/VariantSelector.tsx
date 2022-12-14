import type { LocalizedProduct, LocalizedProductWithVariant, Variant } from '#utils/products'
import variantsConfig from '#config/variants.config'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { Swatch } from './Swatch'
import { Tag } from './Tag'
import { compareVariants, getOptions } from './VariantSelector.utils'
import { stringToBackground } from '#utils/css'

type Props = {
  product: LocalizedProductWithVariant
  onChange?: (product: LocalizedProduct) => void
}

export const VariantSelector: React.FC<Props> = ({ product, onChange = () => {} }) => {
  const router = useRouter()
  const i18n = useI18n();
  const [currentVariant, setCurrentVariant] = useImmer<Variant[]>(product.variant)

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
      }, undefined, { scroll: false })
    }
  }, [router, currentProduct, onChange])

  return (
    <div>
      {
        options.map((variants, index) => {
          const variantName = variants[0].name
          const config = variantsConfig.find(variantConfig => variantConfig.field === variantName)

          if (!config) {
            console.error(`Variant configuration for ${variantName} is missing!`)
            return null
          }

          return (
            <div key={variantName} className='my-6'>
              <p className='text-gray-800 text-lg font-semibold'>{i18n.t(`search.variants.${variantName}`) || variantName}</p>
              {
                variants.map(variant => {
                  const selected = currentVariant[index]?.value === variant.value
                  switch (config.appearance) {
                    case 'colorSwatch':
                      return (
                        <Swatch
                          key={`${variantName}-${variant.value}`}
                          swatchLabel={i18n.t(`search.values.${variant.value}`) || variant.value}
                          swatchStyle={stringToBackground(variant.value)}
                          selected={selected}
                          onClick={() => {
                            setCurrentVariant((draft) => {
                              draft[index] = variant
                            })
                          }}
                        />
                      )
                    case 'tag':
                      return (
                        <Tag
                          key={`${variantName}-${variant.value.toString()}`}
                          selected={selected}
                          onClick={() => {
                            setCurrentVariant((draft) => {
                              draft[index] = variant
                            })
                          }}
                        >
                          {i18n.t(`search.values.${variant.value.toString()}`) || variant.value.toString()}
                        </Tag>
                      )
                  }
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}
