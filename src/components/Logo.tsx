import { CommerceLayerGlyph, CommerceLayerLogotype } from '#assets/icons'

export const Logo: React.FC<JSX.IntrinsicElements['div']> = ({ className = '', ...props }) => {
  return (
    <div {...props} className={`text-black py-6 pb-6 ${className}`}>
      <CommerceLayerGlyph className='inline' aria-label='Commerce Layer logomark' width={32} />
      <CommerceLayerLogotype className='ml-4 hidden md:inline' width={192} aria-label='Commerce Layer logotype' />
    </div>
  )
}
