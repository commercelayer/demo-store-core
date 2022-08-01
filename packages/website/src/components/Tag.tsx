
type Props = JSX.IntrinsicElements['button'] & {
  selected?: boolean
}

export const Tag: React.FC<Props> = ({ selected = false, children, ...props }) => {
  const isSelectedClass = selected ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'

  return (
    <button
      { ...props }
      className={`my-2 mr-2 rounded py-2 px-4 ${isSelectedClass}`}
    >
      {children}
    </button>
  )
}
