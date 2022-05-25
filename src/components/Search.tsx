import { MagnifyingGlass } from '#assets/icons'
import { basePath } from '#next.config'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

export const Search: React.FC = () => {
  const i18n = useI18n();
  const router = useRouter()
  const [value, setValue] = useState<string>(
    typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('q') || '') : ''
  )

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault()

    router.push(`${event.currentTarget.action}?q=${value}`)
  }, [router, value])

  return (
    <div>
      <label htmlFor='email' className='relative py-3 rounded bg-gray-100 text-gray-400 focus-within:text-gray-600 block'>
        <MagnifyingGlass className='pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 left-3' />
        <form onSubmit={handleSubmit} action={`${basePath}/${router.query.locale}/search`}>
          <input onFocus={e => e.currentTarget.select()} onChange={e => setValue(e.currentTarget.value)} value={value} placeholder={i18n.t('general.search')} className='form-input appearance-none bg-transparent w-full pl-14 focus:outline-none focus:shadow-outline' />
        </form>
      </label>
    </div>
  )
}
