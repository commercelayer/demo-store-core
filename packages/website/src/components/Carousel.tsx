import React, { useMemo } from 'react'
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
import { Swiper, type SwiperProps, SwiperSlide } from 'swiper/react'

import styles from './Carousel.module.scss'

type Props = {
  slides: React.JSX.Element[]
  options?: SwiperProps
}

export const Carousel: React.FC<Props> = ({ slides, options = {} }) => {
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
      {...options}
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
