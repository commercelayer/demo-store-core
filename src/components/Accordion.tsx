import React, { useRef, useState } from 'react'

import styles from './Accordion.module.scss'

interface Props {
  title: React.ReactNode
  content: React.ReactNode
}

/** @tw sm:border-t-0 md:border-t-0 lg:border-t-0 */
/** @tw sm:max-h-full md:max-h-full lg:max-h-full */
/** @tw sm:invisible md:invisible lg:invisible */
export const Accordion: React.FC<Props> = ({ title, content }) => {
  const [active, setActive] = useState(false)

  const contentSpace = useRef<HTMLDivElement>(null)

  function toggleAccordion() {
    setActive((prevState) => !prevState)
  }

  return (
    <div className="flex flex-col">
      <button className={`title ${styles.title}`} onClick={toggleAccordion}>
        <div className="inline-block text-footnote light">{title}</div>
        <div className='icon'>{active ? '-' : '+'}</div>
      </button>
      <div
        ref={contentSpace}
        style={{ maxHeight: active ? `${contentSpace.current?.scrollHeight}px` : undefined }}
        className={`body ${styles.body}`}
      >
        <div>{content}</div>
      </div>
    </div>
  )
}