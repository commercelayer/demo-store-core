import { useMemo } from 'react'
import { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './Carousel.module.scss'

type Props = {
  slides: JSX.Element[]
}

export const Carousel: React.FC<Props> = ({ slides }) => {
  const keyToForceReRender = useMemo(() => Math.random() * slides.length, [slides])

  return (
    <Swiper
      key={keyToForceReRender}
      modules={[Navigation, Pagination, Keyboard, Mousewheel]}
      keyboard={{
        enabled: true,
      }}
      mousewheel={{
        forceToAxis: true
      }}
      className={styles.carousel}
      navigation={true}
      pagination={true}
      spaceBetween={50}
      slidesPerView={'auto'}
    >
      {
        slides.map(Item => (
          <SwiperSlide key={Item.key} className='select-none'>
            { Item }
          </SwiperSlide>
        ))
      }
    </Swiper>
  )
}
