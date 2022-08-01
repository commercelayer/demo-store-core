import React, { useLayoutEffect, useRef, useState } from 'react'

interface Props {
  title: React.ReactNode
  children: React.ReactNode
  'data-testid'?: string
}

export const Accordion: React.FC<Props> = ({ 'data-testid': dataTestid, title, children }) => {
  const [active, setActive] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  function toggleAccordion() {
    setActive((prevState) => !prevState)
  }

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`

      if (!active) {
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.style.maxHeight = ``
          }
        })
      }
    }
  }, [active])

  return (
    <div data-testid={dataTestid} className='flex flex-col'>
      <button
        data-testid='accordion-title'
        className='accordion-title py-6 box-border border-t border-t-gray-400 appearance-none cursor-pointer focus:outline-none flex items-center justify-between'
        onClick={toggleAccordion}>
        <div className='inline-block text-footnote light'>{title}</div>
        <div className='accordion-icon'>{active ? '-' : '+'}</div>
      </button>
      <div
        data-testid='accordion-content'
        ref={contentRef}
        onTransitionEnd={(e) => {
          if (active) {
            e.currentTarget.style.maxHeight = 'none'
          }
        }}
        className='accordion-content overflow-hidden transition-all max-h-0 duration-400 ease-in-out'
      >
        <div className='border-t border-t-gray-100'>{children}</div>
      </div>
    </div>
  )
}
