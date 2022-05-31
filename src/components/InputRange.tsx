import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './InputRange.module.scss'

type Props = {
  defaultValue?: readonly [number, number]
  min?: number
  max?: number
  step?: number
  onRelease?: (value: number[]) => void
  format?: (value: number) => string
}

export const InputRange: React.FC<Props> = ({ min = 0, max = 100, defaultValue = [min, max], step = 1, onRelease = () => {}, format = value => value.toString() }) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const minLabelRef = useRef<HTMLDivElement>(null)
  const minInputRef = useRef<HTMLInputElement>(null)
  const maxLabelRef = useRef<HTMLDivElement>(null)

  const [defaultMinValue, defaultMaxValue] = defaultValue

  const [minValue, setMinValue] = useState<number>(defaultMinValue < min ? min : defaultMinValue)
  const [maxValue, setMaxValue] = useState<number>(defaultMaxValue > max ? max : defaultMaxValue)

  const gap = 0

  useLayoutEffect(function handleUI() {
    const leftPercentage = (((minValue - min) / (max - min)) * 100)
    const rightPercentage = (100 -((maxValue - min) / (max - min)) * 100)
    const styleLeft = `calc(${leftPercentage}% - ${16 / 100 * leftPercentage}px)`
    const styleRight = `calc(${rightPercentage}% - ${16 / 100 * rightPercentage}px)`

    if (progressRef.current) {
      progressRef.current.style.left = styleLeft
      progressRef.current.style.right = styleRight
    }

    if (minLabelRef.current) {
      minLabelRef.current.style.left = styleLeft
    }

    if (maxLabelRef.current) {
      maxLabelRef.current.style.right = styleRight
    } 

    if (minInputRef.current) {
      if (minValue === max) {
        minInputRef.current.style.zIndex = '1'
      } else {
        minInputRef.current.style.zIndex = ''
      }
    }
  }, [minValue, maxValue, min, max])

  useEffect(function handleDefaultValueChange() {
    setMinValue(defaultMinValue < min ? min : defaultMinValue)
    setMaxValue(defaultMaxValue > max ? max : defaultMaxValue)
  }, [defaultMinValue, defaultMaxValue, min, max])

  const handleMinValueChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const minVal = event.currentTarget.valueAsNumber
    const maxVal = maxValue

    if ((maxVal - minVal) < gap) {
      setMinValue(maxVal - gap)
    } else {
      setMinValue(minVal)
    }
  }

  const handleMaxValueChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const minVal = minValue
    const maxVal = event.currentTarget.valueAsNumber

    if ((maxVal - minVal) < gap) {
      setMaxValue(minVal + gap)
    } else {
      setMaxValue(maxVal)
    }
  }

  const handleRelease = () => {
    onRelease([minValue, maxValue])
  }

  return (
    <div>
      <div data-testid='number-input-container' className={styles.numberInput}>
        <div className='field'>
          <span>Min</span>
          <input data-testid='number-input-1' onChange={handleMinValueChange} type='number' min={min} value={minValue} step={step} />
        </div>
        <div className='separator'>-</div>
        <div className='field'>
          <span>Max</span>
          <input data-testid='number-input-2' onChange={handleMaxValueChange} type='number' max={max} value={maxValue} step={step} />
        </div>
      </div>
      <div className={styles.slider}>
        <div data-testid='progress' className='progress' ref={progressRef}></div>
      </div>
      <div data-testid='range-input' className={styles.rangeInput}>
        <div aria-hidden={true} ref={minLabelRef} className='text-gray-400 text-xs top-3 absolute left-0'>{format(minValue)}</div>
        <input className='cursor-grab' ref={minInputRef} data-testid='range-input-1' onChange={handleMinValueChange} onMouseUp={handleRelease} onTouchEnd={handleRelease} onKeyUp={handleRelease} type='range' min={min} max={max} value={minValue} step={step} />
        <div aria-hidden={true} ref={maxLabelRef} className='text-gray-400 text-xs top-3 absolute right-0'>{format(maxValue)}</div>
        <input className='cursor-grab' data-testid='range-input-2' onChange={handleMaxValueChange} onMouseUp={handleRelease} onTouchEnd={handleRelease} onKeyUp={handleRelease} type='range' min={min} max={max} value={maxValue} step={step} />
      </div>
    </div>
  )
}