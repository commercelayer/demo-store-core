import { MagnifyingGlass } from '#assets/icons'
import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

type Props = JSX.IntrinsicElements['div'] & {
  
}

export const Search: React.FC<Props> = ({ className }) => {
  const i18n = useI18n();
  const router = useRouter()

  const [value, setValue] = useState<string>(
    typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('q') || '') : ''
  )

  useEffect(function manageOnRouterChange() {
    if (typeof router.query.q === 'string') {
      setValue(router.query.q)
    } else {
      setValue('')
    }
  }, [router])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault()

    router.push(`${event.currentTarget.action}?q=${value}`)
  }, [router, value])

  return (
    <div className={className}>
      <label htmlFor='email' className='relative py-2.5 rounded bg-gray-100 text-gray-400 focus-within:text-gray-600 block'>
        <MagnifyingGlass className='pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 left-3' />
        <form onSubmit={handleSubmit} action={`${NEXT_PUBLIC_BASE_PATH}/${router.query.locale}/search`}>
          <input onFocus={e => e.currentTarget.select()} onChange={e => setValue(e.currentTarget.value)} value={value} placeholder={i18n.t('general.search')} className='form-input appearance-none bg-transparent w-full pl-14 focus:outline-none focus:shadow-outline' />
        </form>
      </label>
    </div>
  )
}
