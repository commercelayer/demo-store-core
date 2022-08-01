import type { HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { CarouselPageComponent } from '#components/PageComponents/CarouselPageComponent'
import { GridPageComponent } from '#components/PageComponents/GridPageComponent'
import { HeroPageComponent } from '#components/PageComponents/HeroPageComponent'
import { MarkdownPageComponent } from '#components/PageComponents/MarkdownPageComponent'
import { ProductGridPageComponent } from '#components/PageComponents/ProductGridPageComponent'
import type { CustomPage } from '#utils/pages'
import type { NextPage } from 'next'

export type Props = HeaderProps & {
  components: CustomPage['components']
}

export const CustomPageComponent: NextPage<Props> = ({ navigation, components }) => {
  return (
    <Page navigation={navigation}>
      <div data-testid='page-components' className='mt-8 flex flex-col gap-8'>
        {
          components.map(component => {
            switch (component.type) {

              case 'carousel':
                return <CarouselPageComponent key={component.id} component={component} />

              case 'hero':
                return <HeroPageComponent key={component.id} component={component} />

              case 'grid':
                return <GridPageComponent key={component.id} component={component} />

              case 'product-grid':
                return <ProductGridPageComponent key={component.id} component={component} />

              case 'markdown':
                return <MarkdownPageComponent key={component.id} component={component} />

              default:
                ((_: never): void => { })(component)
                break;
            }
          })
        }
      </div>
    </Page>
  )
}
