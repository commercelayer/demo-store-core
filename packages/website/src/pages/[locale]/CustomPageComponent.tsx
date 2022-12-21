import type { HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { CarouselPageComponent } from '#components/PageComponents/CarouselPageComponent'
import { GridPageComponent } from '#components/PageComponents/GridPageComponent'
import { HeroPageComponent } from '#components/PageComponents/HeroPageComponent'
import { MarkdownPageComponent } from '#components/PageComponents/MarkdownPageComponent'
import { ProductGridPageComponent } from '#components/PageComponents/ProductGridPageComponent'
import { Title } from '#components/Title'
import type { CustomPage } from '#utils/pages'
import type { NextPage } from 'next'

export type Props = HeaderProps & {
  page: CustomPage
  localeCodes: string[]
}

export const CustomPageComponent: NextPage<Props> = ({ navigation, page, localeCodes }) => {
  return (
    <Page localeCodes={localeCodes} navigation={navigation} title={page.title || undefined} description={page.description || undefined}>
      <div data-testid='page-components' className='mt-8 flex flex-col gap-8'>
        {page.title  && <Title title={page.title}></Title>}

        {
          page.components.map(component => {
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
