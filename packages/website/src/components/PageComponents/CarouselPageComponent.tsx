import { Carousel } from '#components/Carousel'
import { Link } from '#i18n/Link'
import type { CarouselPageComponent as CarouselPageComponentType } from '#utils/pages'

export const CarouselPageComponent: React.FC<{ component: CarouselPageComponentType }> = ({ component }) => {
  return (
    <div key={component.id} data-testid='carousel-page-component'>
      <Carousel slides={component.slides.map((slide, index) => (
        <div key={index} className='relative rounded-lg overflow-hidden w-full max-h-[70vh] min-h-[24rem]'>
          <img alt={slide.image.alt} src={slide.image.src} className='object-cover object-center w-full rounded-lg' />
          <div className='hidden md:block absolute inset-0 bg-gradient-to-b from-black to-black/0 opacity-50'></div>

          <div className='flex justify-center relative -top-4 md:text-white md:absolute md:pr-10 md:top-1/2 md:right-0 md:w-1/2 md:-translate-y-1/2'>
            <div className='bg-white w-11/12 rounded-md flex justify-center py-4 md:bg-transparent'>
              <div className='w-11/12'>
                <div className='font-bold text-xl md:text-3xl mb-4'>{slide.title}</div>
                <div className='leading-snug mb-4'>{slide.description}</div>
                <Link href={slide.linkHref} className='py-2 px-4 inline-block font-semibold rounded-md bg-violet-400 text-white text-sm w-full text-center md:w-auto'>
                  {slide.linkLabel}
                </Link>
              </div>
            </div>
          </div>

        </div>
      ))} />
    </div>
  )
}
