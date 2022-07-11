import { CommerceLayerGlyph, CommerceLayerLogotype } from '#assets/icons'
import { useSettingsContext } from '#contexts/SettingsContext'

export const Logo: React.FC<JSX.IntrinsicElements['div']> = ({ className = '', ...props }) => {
  const settings = useSettingsContext()

  return (
    <div {...props} className={`text-black py-6 pb-6 ${className}`}>
      {
        settings.organization?.logo_url ? (
          <img alt={`${settings.organization?.name} logo`} src={settings.organization?.logo_url} className='h-10' />
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
