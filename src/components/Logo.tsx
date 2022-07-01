import { CommerceLayerGlyph, CommerceLayerLogotype } from '#assets/icons'
import { rawDataOrganization } from '#data/organization'

export const Logo: React.FC<JSX.IntrinsicElements['div']> = ({ className = '', ...props }) => {
  return (
    <div {...props} className={`text-black py-6 pb-6 ${className}`}>
      {
        rawDataOrganization.logo_url ? (
          <img alt={`${rawDataOrganization.name} logo`} src={rawDataOrganization.logo_url} className='h-10' />
        ) : (
          <>
            <CommerceLayerGlyph width={32} className='m-1 inline' aria-label='Commerce Layer logomark' />
            <CommerceLayerLogotype width={192} className='ml-2 hidden md:inline' aria-label='Commerce Layer logotype' />
          </>

        )
      }
    </div>
  )
}
