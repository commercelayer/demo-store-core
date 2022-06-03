import type React from 'react'

type Props = JSX.IntrinsicElements['button'] & {

}

export const Hamburger: React.FC<Props> = ({ className, ...props }) => {
  return (
    <button {...props} className={`w-11 h-11 flex flex-col items-center justify-center space-y-1 bg-black rounded ${className}`} aria-label='Open menu' type='button' aria-controls='menu'>
      <span className='w-4 h-0.5 bg-white'></span>
      <span className='w-4 h-0.5 bg-white'></span>
      <span className='w-4 h-0.5 bg-white'></span>
    </button>
  )
}
