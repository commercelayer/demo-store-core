import { useEffect, useRef, useState } from 'react'
import styles from './InputRange.module.scss'

type Props = {
  defaultValue?: readonly [number, number]
  min?: number
  max?: number
  step?: number
  onChange?: (value: number[]) => void
  format?: (value: number) => string
}

export const InputRange: React.FC<Props> = ({ min = 0, max = 100, defaultValue = [min, max], step = 1, onChange = () => {}, format = value => value.toString() }) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const minLabelRef = useRef<HTMLDivElement>(null)
  const maxLabelRef = useRef<HTMLDivElement>(null)

  const [minValue, setMinValue] = useState<number>(defaultValue[0] < min ? min : defaultValue[0])
  const [maxValue, setMaxValue] = useState<number>(defaultValue[1] > max ? max : defaultValue[1])

  const gap = 0

  useEffect(() => {
    const leftPercentage = parseFloat((((minValue - min) / (max - min)) * 100).toFixed(2))
    const rightPercentage = parseFloat((100 -((maxValue - min) / (max - min)) * 100).toFixed(2))

    if (progressRef.current) {
      progressRef.current.style.left = `calc(${leftPercentage}% - ${16 / 100 * leftPercentage}px)`
      progressRef.current.style.right = `calc(${rightPercentage}% - ${16 / 100 * rightPercentage}px)`
    }

    if (minLabelRef.current) {
      minLabelRef.current.style.left = `calc(${leftPercentage}% - ${16 / 100 * leftPercentage}px)`
    }

    if (maxLabelRef.current) {
      maxLabelRef.current.style.right = `calc(${rightPercentage}% - ${16 / 100 * rightPercentage}px)`
    }


  }, [minValue, maxValue, min, max])

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

  const handleOnRelease = () => {
    onChange([minValue, maxValue])
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
        <input data-testid='range-input-1' onChange={handleMinValueChange} onMouseUp={handleOnRelease} onTouchEnd={handleOnRelease} onKeyUp={handleOnRelease} type='range' min={min} max={max} value={minValue} step={step} />
        <div aria-hidden={true} ref={maxLabelRef} className='text-gray-400 text-xs top-3 absolute right-0'>{format(maxValue)}</div>
        <input data-testid='range-input-2' onChange={handleMaxValueChange} onMouseUp={handleOnRelease} onTouchEnd={handleOnRelease} onKeyUp={handleOnRelease} type='range' min={min} max={max} value={maxValue} step={step} />
      </div>
    </div>
  )
}