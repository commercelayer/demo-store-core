import React, { useRef, useState } from 'react'

interface Props {
  title: React.ReactNode
  children: React.ReactNode
}

export const Accordion: React.FC<Props> = ({ title, children }) => {
  const [active, setActive] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  function toggleAccordion() {
    setActive((prevState) => !prevState)
  }

  return (
    <div className="flex flex-col">
      <button data-testid="title" className='title py-6 box-border border-t border-gray-400 appearance-none cursor-pointer focus:outline-none flex items-center justify-between' onClick={toggleAccordion}>
        <div className="inline-block text-footnote light">{title}</div>
        <div className='icon'>{active ? '-' : '+'}</div>
      </button>
      <div
        data-testid="content"
        ref={contentRef}
        style={{ maxHeight: active ? `${contentRef.current?.scrollHeight}px` : undefined }}
        className='content overflow-hidden transition-all max-h-0 duration-700 ease-in-out;'
      >
        <div>{children}</div>
      </div>
    </div>
  )
}