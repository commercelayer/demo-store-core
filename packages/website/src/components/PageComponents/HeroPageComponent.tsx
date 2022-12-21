import { Link } from '#i18n/Link'
import type { HeroPageComponent as HeroPageComponentType } from '#utils/pages'

export const HeroPageComponent: React.FC<{ component: HeroPageComponentType }> = ({ component }) => {
  return (
    <div key={component.id} data-testid='hero-page-component'>
      <Link href={component.href} className='relative block rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1'>
        <div className='absolute inset-0 bg-gradient-to-b from-black to-black/0 opacity-50'></div>
        <img loading='lazy' alt={component.image.alt} src={component.image.src} className='object-cover w-full h-full' />
        <div className='absolute w-full text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
          <div className='font-bold text-2xl'>{component.title}</div>
        </div>
      </Link>
    </div>
  )
}
