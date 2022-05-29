import { fireEvent, render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { InputRange } from './InputRange'


test('should match the snapshot', () => {
  const { container } = render(<InputRange />)

  expect(container).toMatchSnapshot()
})

test('should render with default properties', () => {
  const { getByTestId } = render(<InputRange />)

  expect(getByTestId('number-input-1')).toHaveValue(0)
  expect(getByTestId('number-input-2')).toHaveValue(100)
  expect(getByTestId('range-input-1')).toHaveValue('0')
  expect(getByTestId('range-input-2')).toHaveValue('100')
  expect(getByTestId('progress')).toHaveStyle({
    left: '0%',
    right: '0%'
  })
})

test('should render changing the default values', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 90]} />)

  expect(getByTestId('number-input-1')).toHaveValue(10)
  expect(getByTestId('number-input-2')).toHaveValue(90)
  expect(getByTestId('range-input-1')).toHaveValue('10')
  expect(getByTestId('range-input-2')).toHaveValue('90')
  expect(getByTestId('progress')).toHaveStyle({
    left: '10%',
    right: '10%'
  })
})

test('should change the lower defaultValue when "min" is set', () => {
  const { getByTestId } = render(<InputRange min={-10} />)

  expect(getByTestId('number-input-1')).toHaveValue(-10)
  expect(getByTestId('number-input-2')).toHaveValue(100)
  expect(getByTestId('range-input-1')).toHaveValue('-10')
  expect(getByTestId('range-input-2')).toHaveValue('100')
  expect(getByTestId('progress')).toHaveStyle({
    left: '0%',
    right: '0%'
  })
})

test('should change the upper defaultValue when "max" is set', () => {
  const { getByTestId } = render(<InputRange max={250} />)

  expect(getByTestId('number-input-1')).toHaveValue(0)
  expect(getByTestId('number-input-2')).toHaveValue(250)
  expect(getByTestId('range-input-1')).toHaveValue('0')
  expect(getByTestId('range-input-2')).toHaveValue('250')
  expect(getByTestId('progress')).toHaveStyle({
    left: '0%',
    right: '0%'
  })
})

test('should change the provided value if lower than "min"', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 90]} min={50} />)

  expect(getByTestId('number-input-1')).toHaveValue(50)
  expect(getByTestId('number-input-2')).toHaveValue(90)
  expect(getByTestId('range-input-1')).toHaveValue('50')
  expect(getByTestId('range-input-2')).toHaveValue('90')
  expect(getByTestId('progress')).toHaveStyle({
    left: '0%',
    right: '20%'
  })
})

test('should change the provided value if greater than "max"', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 90]} max={50} />)

  expect(getByTestId('number-input-1')).toHaveValue(10)
  expect(getByTestId('number-input-2')).toHaveValue(50)
  expect(getByTestId('range-input-1')).toHaveValue('10')
  expect(getByTestId('range-input-2')).toHaveValue('50')
  expect(getByTestId('progress')).toHaveStyle({
    left: '20%',
    right: '0%'
  })
})

test('should change the value when user slide without violating min-max rules', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 90]} min={10} max={90} />)

  const rangeInput1 = getByTestId('range-input-1')
  const rangeInput2 = getByTestId('range-input-2')

  act(() => {
    fireEvent.change(rangeInput1, { target: { value: '0' } })
  })

  expect(rangeInput1).toHaveValue('10')
  expect(rangeInput2).toHaveValue('90')

  act(() => {
    fireEvent.change(rangeInput1, { target: { value: '50' } })
  })

  expect(rangeInput1).toHaveValue('50')
  expect(rangeInput2).toHaveValue('90')

  act(() => {
    fireEvent.change(rangeInput2, { target: { value: '100' } })
  })

  expect(rangeInput1).toHaveValue('50')
  expect(rangeInput2).toHaveValue('90')

  act(() => {
    fireEvent.change(rangeInput2, { target: { value: '80' } })
  })

  expect(rangeInput1).toHaveValue('50')
  expect(rangeInput2).toHaveValue('80')
})

test('lower value cannot be greater than upper value', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 50]} min={10} max={90} />)

  const rangeInput1 = getByTestId('range-input-1')
  const rangeInput2 = getByTestId('range-input-2')

  act(() => {
    fireEvent.change(rangeInput1, { target: { value: '60' } })
  })

  expect(rangeInput1).toHaveValue('50')
  expect(rangeInput2).toHaveValue('50')

  act(() => {
    fireEvent.change(rangeInput1, { target: { value: '20' } })
  })

  act(() => {
    fireEvent.change(rangeInput2, { target: { value: '10' } })
  })

  expect(rangeInput1).toHaveValue('20')
  expect(rangeInput2).toHaveValue('20')
})

test('should render the progress bar correctly', () => {
  const { getByTestId } = render(<InputRange min={9} max={205} />)

  const rangeInput1 = getByTestId('range-input-1')
  const rangeInput2 = getByTestId('range-input-2')
  const progress = getByTestId('progress')

  expect(rangeInput1).toHaveValue('9')
  expect(rangeInput2).toHaveValue('205')
  expect(progress).toHaveStyle({
    left: '0%',
    right: '0%'
  })
})
