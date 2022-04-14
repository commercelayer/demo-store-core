import { render, screen, within } from '@testing-library/react'
import { I18nProvider } from 'next-localization'

import Home from './index.page'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

test('home', () => {
  render(
    <I18nProvider lngDict={{ general: { title: 'Welcome to' } }} locale="en">
      <Home />
    </I18nProvider>
  )
  const main = within(screen.getByRole('main'))
  expect(
    main.getByRole('heading', { level: 1, name: /welcome to next\.js!/i })
  ).toBeDefined()

  const footer = within(screen.getByRole('contentinfo'))
  const link = within(footer.getByRole('link'))
  expect(link.getByRole('img', { name: /vercel logo/i })).toBeDefined()
})
