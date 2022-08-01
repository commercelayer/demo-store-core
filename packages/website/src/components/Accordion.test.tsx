import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { Accordion } from './Accordion'

beforeEach(() => {
  jest.clearAllMocks()
})

test('should have a title and some content', () => {
  const { getByTestId } = render(
    <Accordion title={<div>Title</div>}>
      <div>
        Content!
      </div>
    </Accordion>
  )

  expect(getByTestId('accordion-title')).toHaveTextContent('Title')
  expect(getByTestId('accordion-content')).toHaveTextContent('Content!')
})

test('should have a title and some content', () => {
  const { getByTestId } = render(
    <Accordion title={<div>Title</div>}>
      <div>
        Content!
      </div>
    </Accordion>
  )

  const content = getByTestId('accordion-content')

  jest
    .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
    .mockReturnValue(123);

  expect(content).not.toHaveStyle('max-height: 123px;')

  act(() => {
    fireEvent.click(getByTestId('accordion-title'))
  })

  expect(content).toHaveStyle('max-height: 123px;')
})