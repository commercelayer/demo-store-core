import { useEffect, useState } from 'react'

type Props = {
  Icon: React.FC
  onSelect?: (selected: boolean) => void
}

export const Icon: React.FC<Props> = ({ Icon, onSelect = () => {} }) => {
  const [selected, setSelected] = useState<boolean>(false)

  useEffect(() => {
    onSelect(selected)
  }, [onSelect, selected])

  return (
    <div
      className={`rounded cursor-pointer p-1 transition-colors ${selected ? 'bg-black text-white' : ''}`}
      onClick={() => setSelected(v => !v)}
    >
      <Icon />
    </div>
  )
}
