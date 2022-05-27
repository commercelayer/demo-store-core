import { useEffect, useRef, useState } from 'react'
import styles from './InputRange.module.scss'

type Props = {
  defaultValue?: [number, number]
  min?: number
  max?: number
  step?: number
}

export const InputRange: React.FC<Props> = ({ min = 0, max = 100, defaultValue = [min, max], step = 1 }) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const [minValue, setMinValue] = useState<number>(defaultValue[0] < min ? min : defaultValue[0])
  const [maxValue, setMaxValue] = useState<number>(defaultValue[1] > max ? max : defaultValue[1])

  const gap = 0

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.left = ((minValue / max) * 100) + "%"
      progressRef.current.style.right = 100 - (maxValue / max) * 100 + "%"
    }
  }, [minValue, maxValue, max])

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
        <input data-testid='range-input-1' onChange={handleMinValueChange} type='range' min={min} max={max} value={minValue} step={step} />
        <input data-testid='range-input-2' onChange={handleMaxValueChange} type='range' min={min} max={max} value={maxValue} step={step} />
      </div>
    </div>
  )
}