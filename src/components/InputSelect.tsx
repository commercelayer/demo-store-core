import styles from './InputSelect.module.scss'

type Option = {
  value: string
  label: string
}

type Props = JSX.IntrinsicElements['select'] & {
  options: Option[]
}

export const InputSelect: React.FC<Props> = ({ options, className = '', ...props }) => {
  return (
    <select className={`${className} ${styles.inputSelect}`} {...props}>
      {
        options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))
      }
    </select>
  )
}
