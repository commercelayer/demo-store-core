import { basePath } from '#next.config'
import Head from 'next/head'

type Props = {
  title?: string
  description?: string
}

export const Page: React.FC<Props> = ({
  children,
  title,
  description = 'Commerce Layer is a transactional commerce API that lets you add multi-market ecommerce to any digital experience, with ease.'
}) => {
  return (
    <>
      <Head>
        <title>{`${title ? `${title} - ` : ''}Commerce Layer Store`}</title>
        <meta name='description' content={description} />
        <link rel='icon' href={basePath + '/favicon.ico'} />
      </Head>

      <main>
        { children }
      </main>
    </>
  )
}
