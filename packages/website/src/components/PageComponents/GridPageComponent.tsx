import { Link } from '#i18n/Link'
import type { GridPageComponent as GridPageComponentType } from '#utils/pages'

export const GridPageComponent: React.FC<{ component: GridPageComponentType }> = ({ component }) => {
  return (
    <div key={component.id} data-testid='grid-page-component' className='flex flex-wrap gap-4'>
      {
        component.items.map((item, index) => (
          <div key={index} className='relative rounded-lg overflow-hidden h-80 xl:h-96 grow shrink basis-[350px]'>
            <img loading='lazy' alt={item.image.alt} src={item.image.src} className='object-cover w-full h-full' />
            <div className='absolute inset-0 bg-gradient-to-b from-black to-black/0 opacity-50'></div>
            <div className='absolute top-1/2 -translate-y-1/2 text-white w-2/3 left-1/2 -translate-x-1/2 text-center p-4'>
              <div className='font-bold text-3xl mb-4'>{item.title}</div>
              <div className='leading-snug mb-4'>{item.description}</div>

              <Link href={item.linkHref} className='py-2 px-4 inline-block font-semibold rounded-md bg-violet-400 text-white text-sm'>
                {item.linkLabel}
              </Link>
            </div>
          </div>
        ))
      }
    </div>
  )
}
