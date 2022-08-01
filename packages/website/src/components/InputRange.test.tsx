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
    left: 'calc(0% - 0px)',
    right: 'calc(0% - 0px)'
  })
})

test('should render changing the default values', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 90]} />)

  expect(getByTestId('number-input-1')).toHaveValue(10)
  expect(getByTestId('number-input-2')).toHaveValue(90)
  expect(getByTestId('range-input-1')).toHaveValue('10')
  expect(getByTestId('range-input-2')).toHaveValue('90')
  expect(getByTestId('progress')).toHaveStyle({
    left: 'calc(10% - 1.6px)',
    right: 'calc(10% - 1.6px)'
  })
})

test('should change the lower defaultValue when "min" is set', () => {
  const { getByTestId } = render(<InputRange min={-10} />)

  expect(getByTestId('number-input-1')).toHaveValue(-10)
  expect(getByTestId('number-input-2')).toHaveValue(100)
  expect(getByTestId('range-input-1')).toHaveValue('-10')
  expect(getByTestId('range-input-2')).toHaveValue('100')
  expect(getByTestId('progress')).toHaveStyle({
    left: 'calc(0% - 0px)',
    right: 'calc(0% - 0px)'
  })
})

test('should change the upper defaultValue when "max" is set', () => {
  const { getByTestId } = render(<InputRange max={250} />)

  expect(getByTestId('number-input-1')).toHaveValue(0)
  expect(getByTestId('number-input-2')).toHaveValue(250)
  expect(getByTestId('range-input-1')).toHaveValue('0')
  expect(getByTestId('range-input-2')).toHaveValue('250')
  expect(getByTestId('progress')).toHaveStyle({
    left: 'calc(0% - 0px)',
    right: 'calc(0% - 0px)'
  })
})

test('should change the provided value if lower than "min"', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 90]} min={50} />)

  expect(getByTestId('number-input-1')).toHaveValue(50)
  expect(getByTestId('number-input-2')).toHaveValue(90)
  expect(getByTestId('range-input-1')).toHaveValue('50')
  expect(getByTestId('range-input-2')).toHaveValue('90')
  expect(getByTestId('progress')).toHaveStyle({
    left: 'calc(0% - 0px)',
    right: 'calc(20% - 3.2px)'
  })
})

test('should change the provided value if greater than "max"', () => {
  const { getByTestId } = render(<InputRange defaultValue={[10, 90]} max={50} />)

  expect(getByTestId('number-input-1')).toHaveValue(10)
  expect(getByTestId('number-input-2')).toHaveValue(50)
  expect(getByTestId('range-input-1')).toHaveValue('10')
  expect(getByTestId('range-input-2')).toHaveValue('50')
  expect(getByTestId('progress')).toHaveStyle({
    left: 'calc(20% - 3.2px)',
    right: 'calc(0% - 0px)'
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
    left: 'calc(0% - 0px)',
    right: 'calc(0% - 0px)'
  })
})

test('should set zIndex to 1 when minValue match the max value', () => {
  const { getByTestId } = render(<InputRange min={10} max={90} />)

  const rangeInput1 = getByTestId('range-input-1')

  expect(rangeInput1).not.toHaveStyle({
    zIndex: '1'
  })

  act(() => {
    fireEvent.change(rangeInput1, { target: { value: '90' } })
  })

  expect(rangeInput1).toHaveStyle({
    zIndex: '1'
  })

  act(() => {
    fireEvent.change(rangeInput1, { target: { value: '89' } })
  })

  expect(rangeInput1).not.toHaveStyle({
    zIndex: '1'
  })
})

test('should trigger onRelease when range changes and mouseUp event is triggered', () => {
  const onRelease = jest.fn()
  const { getByTestId } = render(<InputRange min={10} max={90} onRelease={onRelease} />)

  const rangeInput1 = getByTestId('range-input-1')
  const rangeInput2 = getByTestId('range-input-2')

  act(() => {
    fireEvent.mouseDown(rangeInput1)
    fireEvent.change(rangeInput1, { target: { value: '50' } })
  })

  expect(onRelease).not.toBeCalled()

  act(() => {
    fireEvent.mouseUp(rangeInput1)
  })

  act(() => {
    fireEvent.mouseDown(rangeInput2)
    fireEvent.change(rangeInput2, { target: { value: '80' } })
  })

  act(() => {
    fireEvent.mouseUp(rangeInput2)
  })

  expect(onRelease).toBeCalledTimes(2)
  expect(onRelease.mock.calls[0][0]).toStrictEqual([50, 90])
  expect(onRelease.mock.calls[1][0]).toStrictEqual([50, 80])
})

test('should trigger onRelease when range changes and keyUp event is triggered', () => {
  const onRelease = jest.fn()
  const { getByTestId } = render(<InputRange min={10} max={90} onRelease={onRelease} />)

  const rangeInput1 = getByTestId('range-input-1')
  const rangeInput2 = getByTestId('range-input-2')

  act(() => {
    fireEvent.keyDown(rangeInput1)
    fireEvent.change(rangeInput1, { target: { value: '20' } })
  })

  expect(onRelease).not.toBeCalled()

  act(() => {
    fireEvent.keyUp(rangeInput1)
  })

  act(() => {
    fireEvent.keyDown(rangeInput2)
    fireEvent.change(rangeInput2, { target: { value: '76' } })
  })

  act(() => {
    fireEvent.keyUp(rangeInput2)
  })

  expect(onRelease).toBeCalledTimes(2)
  expect(onRelease.mock.calls[0][0]).toStrictEqual([20, 90])
  expect(onRelease.mock.calls[1][0]).toStrictEqual([20, 76])
})

test('should trigger onRelease when range changes and touchEnd event is triggered', () => {
  const onRelease = jest.fn()
  const { getByTestId } = render(<InputRange min={10} max={90} onRelease={onRelease} />)

  const rangeInput1 = getByTestId('range-input-1')
  const rangeInput2 = getByTestId('range-input-2')

  act(() => {
    fireEvent.touchStart(rangeInput1)
    fireEvent.change(rangeInput1, { target: { value: '34' } })
  })

  expect(onRelease).not.toBeCalled()

  act(() => {
    fireEvent.touchEnd(rangeInput1)
  })

  act(() => {
    fireEvent.touchStart(rangeInput2)
    fireEvent.change(rangeInput2, { target: { value: '71' } })
  })

  act(() => {
    fireEvent.touchEnd(rangeInput2)
  })

  expect(onRelease).toBeCalledTimes(2)
  expect(onRelease.mock.calls[0][0]).toStrictEqual([34, 90])
  expect(onRelease.mock.calls[1][0]).toStrictEqual([34, 71])
})
