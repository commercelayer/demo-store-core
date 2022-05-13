import { MagnifyingGlass } from '#assets/icons'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { basePath } from '#next.config'
import { useI18n } from 'next-localization'

export const Search: React.FC = () => {
  const i18n = useI18n();
  const [value, setValue] = useState<string>('')
  const router = useRouter()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault()

    router.push(`${event.currentTarget.action}?q=${value}`)
  }, [router, value])

  return (
    <div>
      <label htmlFor='email' className='relative py-3 rounded bg-gray-100 text-gray-400 focus-within:text-gray-600 block'>
        <MagnifyingGlass className='pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 left-3' />
        <form onSubmit={handleSubmit} action={`${basePath}/${router.query.locale}/search`}>
          <input onChange={e => setValue(e.currentTarget.value)} value={value} placeholder={i18n.t('general.search')} className='form-input appearance-none bg-transparent w-full pl-14 focus:outline-none focus:shadow-outline' />
        </form>
      </label>
    </div>
  )
}
