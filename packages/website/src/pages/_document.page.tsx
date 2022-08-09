import { NEXT_PUBLIC_DEFAULT_LANGUAGE } from '#utils/envs'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return await Document.getInitialProps(ctx)
  }

  render() {
    const locale = this.props.__NEXT_DATA__.query.locale as unknown as string | string[] | undefined

    if (Array.isArray(locale)) {
      throw new Error('The query "locale" cannot be an array!')
    }

    return (
      <Html lang={locale || NEXT_PUBLIC_DEFAULT_LANGUAGE}>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
        </Head>
        <body className='bg-pageBackground'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
