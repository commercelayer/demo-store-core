import { Title } from '#components/Title'
import type { MarkdownPageComponent as MarkdownPageComponentType } from '#utils/pages'
import { useRemarkSync } from 'react-remark'

export const MarkdownPageComponent: React.FC<{ component: MarkdownPageComponentType }> = ({ component }) => {
  const reactContent = useRemarkSync(component.content, {
    rehypeReactOptions: {
      components: {
        // @ts-expect-error
        h1: (props) => <Title title={props.children}></Title>,
        // @ts-expect-error
        h2: (props) => <h2 className='text-lg font-semibold text-black mt-8 mb-3' {...props} />,
        // @ts-expect-error
        img: ({alt, ...props}) => <img loading='lazy' alt={alt} {...props} />,
      }
    }
  })

  return (
    <div className='-mt-8' data-testid='markdown-page-component'>
      {reactContent}
    </div>
  )
}
