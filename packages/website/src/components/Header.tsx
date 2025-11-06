import { ShoppingBagOpen } from '#assets/icons'
import { Logo } from '#components/Logo'
import type { Props as NavigationProps } from '#components/Navigation'
import { Navigation } from '#components/Navigation'
import { Search } from '#components/Search'
import { useAuthContext } from '#contexts/AuthContext'
import { useSettingsContext } from '#contexts/SettingsContext'
import { Link } from '#i18n/Link'
import { CartLink, CustomerContainer, LineItemsCount } from '@commercelayer/react-components'
import { HostedCart } from '@commercelayer/react-components/orders/HostedCart'
import { MyAccountLink } from '@commercelayer/react-components/customers/MyAccountLink'
import { MyIdentityLink } from '@commercelayer/react-components/customers/MyIdentityLink'
import type { ChildrenFunction } from '@commercelayer/react-components/lib/esm/typings'
import { useEffect, useState } from 'react'
import { jwtDecode, jwtIsSalesChannel } from '@commercelayer/js-auth'
import { useRouter } from 'next/router'


export type HeaderProps = Partial<NavigationProps>

const CartQuantity: ChildrenFunction<{ quantity: number }> =  ({ quantity: propQuantity }) => {
  const [quantity, setQuantity] = useState<number>(-1)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const animation = 'animate-[ping_1s_cubic-bezier(0,0,0.2,1)_1]'
  const isVisible = propQuantity > 0


  useEffect(() => {
    if (propQuantity > 0) {
      setQuantity(propQuantity)
    }
  
    if (propQuantity !== quantity && quantity > 0) {
      setIsAnimating(true)
    }
  }, [propQuantity, quantity])

  return (
    <div className={`absolute bottom-0 translate-x-1/3 right-0 w-4 h-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <span className={`${isAnimating ? animation : ''} absolute inline-flex h-full w-full rounded-full bg-brand opacity-75`} onAnimationEnd={() => setIsAnimating(false)}></span>
      <div className='absolute h-full w-full text-white bg-brand rounded-full text-[.5rem] flex items-center justify-center'>{quantity}</div>
    </div>
  )
}

const CustomerLink: React.FC = () => {
  const { authorization, logoutCustomer } = useAuthContext()

  if (authorization?.accessToken == null) {
    return null
  }

  const decodedToken = jwtDecode(authorization.accessToken)

  if (!jwtIsSalesChannel(decodedToken.payload)) {
    return null
  }

  if (decodedToken.payload.owner?.type === 'Customer') {
    const returnUrlLink = typeof window !== 'undefined' ? window.location.href : undefined
    let returnUrl = returnUrlLink ? `&returnUrl=${returnUrlLink}` : ''
    returnUrl = ''

    return (
      <>
        <MyAccountLink className='text-brand hover:underline' target={returnUrl === '' ? '_blank' : undefined}>
          {({ href, label, ...props }) => <a {...props} href={`${href}${returnUrl}`}>My Account</a>}
        </MyAccountLink>
        <button className='text-brand hover:underline cursor-pointer' onClick={() => { logoutCustomer?.() }}>Logout</button>
      </>
    )
  }

  return (
    <MyIdentityLink
      className='text-brand hover:underline'
      clientId={decodedToken.payload.application.client_id}
      scope={decodedToken.payload.scope}
      label='Login'
      type='login'
    />
  )
}

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  const { authorization } = useAuthContext()
  const settings = useSettingsContext()
  const router = useRouter()
  const [cartOpen, setCartOpen] = useState<true | undefined>(undefined)

  useEffect(() => {
    const [pathname, queryString] = router.asPath.split('?')
    const searchParams = new URLSearchParams(queryString)
    if (searchParams.has('cl-cart--open')) {
      searchParams.delete('cl-cart--open')
      router.replace(`${pathname}${searchParams.toString() !== '' ? `?${searchParams.toString()}` : ''}`, undefined, { shallow: true })
      setCartOpen(true)
    }
  }, [router.asPath])

  return (
    <header className='border-b-gray-200  border-b pb-6 sticky top-0 bg-white z-50'>
      <nav className='flex items-center justify-between flex-wrap mb-4'>
        <div className='flex items-center flex-no-shrink text-white mr-6'>
          <Link href='/'><Logo /></Link>
        </div>
        <div className='flex gap-4 items-center w-auto grow justify-end'>
          <CustomerContainer isGuest={authorization?.ownerType == null || authorization.ownerType === 'guest'}>
            <CustomerLink />
          </CustomerContainer>
          {
            settings.locale?.isShoppable && authorization?.accessToken && (
              <>
                <HostedCart
                  open={cartOpen}
                  openAdd
                  style={{
                    background: {
                      zIndex: 51,
                    },
                    container: {
                      zIndex: 51,
                      backgroundColor: 'white'
                    }
                  }}
                  type="mini"
                />
                <CartLink
                  type='mini'
                  className='block lg:inline-block relative cursor-pointer'
                  label={(
                    <>
                      <ShoppingBagOpen />
                      <LineItemsCount>
                        {CartQuantity}
                      </LineItemsCount>
                    </>
                  )} />
              </>
            )
          }

          {/* {
            settings.locale?.isShoppable && auth.accessToken && (
              <Link href='/cart' className='block lg:inline-block relative'>
                <ShoppingBagOpen />
                <LineItemsCount>
                  {CartQuantity}
                </LineItemsCount>
              </Link>
            )
          } */}

        </div>
      </nav>
      <div className='flex items-center justify-between flex-wrap gap-4 relative'>
        {navigation && <Navigation navigation={navigation} className='order-2 lg:order-1' />}
        <Search className='order-1 grow lg:grow-0' />
      </div>
    </header>
  )
}
