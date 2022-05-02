export const Logo: React.FC<JSX.IntrinsicElements['div']> = ({ className = '', ...props }) => {
  return (
    <div {...props} className={`py-6 pb-6 ${className}`}>
      <img className='inline' alt='Commerce Layer logomark' width={32} src='https://data.commercelayer.app/assets/logos/glyph/black/commercelayer_glyph_black.svg' />
      <img className='ml-4 hidden md:inline' width={192} alt='Commerce Layer logotype' src='https://data.commercelayer.app/assets/logos/logotype/black/commercelayer_logotype_black.svg' />
    </div>
  )
}
