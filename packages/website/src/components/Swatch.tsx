
type Props = JSX.IntrinsicElements['button'] & {
  selected?: boolean
  swatchStyle: React.CSSProperties
  swatchLabel: string
}

export const Swatch: React.FC<Props> = ({ selected = false, swatchStyle, swatchLabel, ...props }) => {
  const isSelectedClass = selected ? 'border border-gray-300 bg-gray-100' : ''

  return (
    <button
      { ...props }
      className={`w-12 h-12 rounded-full inline-flex items-center justify-center my-1 mr-2 ${isSelectedClass}`}
    >
      <div className='w-8 h-8 border border-gray-600 rounded-full bg-contain' style={swatchStyle}>
        <span className='sr-only'>{swatchLabel}</span>
      </div>
    </button>
  )
}
