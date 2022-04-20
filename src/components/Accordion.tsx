import React, { useRef, useState } from 'react'

interface Props {
  title: React.ReactNode
  content: React.ReactNode
}

export const Accordion: React.FC<Props> = ({ title, content }) => {
  const [active, setActive] = useState(false)
  const [height, setHeight] = useState('0px')

  const contentSpace = useRef<HTMLDivElement>(null)

  function toggleAccordion() {
    setActive((prevState) => !prevState)
    setHeight(active ? '0px' : `${contentSpace.current?.scrollHeight}px`)
  }

  return (
    <div className="flex flex-col">
      <button
        className="py-6 box-border border-t border-gray-400 appearance-none cursor-pointer focus:outline-none flex items-center justify-between"
        onClick={toggleAccordion}
      >
        <div className="inline-block text-footnote light">{title}</div>
        { active ? '-' : '+' }
      </button>
      <div
        ref={contentSpace}
        style={{ maxHeight: `${height}` }}
        className="overflow-hidden transition-max-height duration-700 ease-in-out"
      >
        <div>{content}</div>
      </div>
    </div>
  )
}