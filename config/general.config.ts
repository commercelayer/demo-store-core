import type { GeneralConfig } from '@typings/general.config.d'

const generalConfig: GeneralConfig = {
  productSlugRegExp: /^.*\/(?<productCode>[A-Z0-9]+)$/
}

export default generalConfig
