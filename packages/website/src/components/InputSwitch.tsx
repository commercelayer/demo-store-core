import styles from './InputSwitch.module.scss'

type Props = JSX.IntrinsicElements['input'] & {
  
}

export const InputSwitch: React.FC<Props> = ({ className = '', ...props }) => {
  return (
    <input
      className={`${styles.switchInput} ${className} appearance-none w-9 rounded-full h-5 align-top bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm`}
      type='checkbox' role='switch' {...props} />
  )
}
