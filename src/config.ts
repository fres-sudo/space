import type { ThemeConfig } from '@/types'

export const themeConfig: ThemeConfig = {
  // SITE INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  site: {
    // site title
    title: 'Francesco Calicchio',
    // site subtitle
    subtitle: 'Software Craftsmanship, Critical Thinking and Every day life',
    // site description
    description: 'Software Craftsmanship, Critical Thinking and Every day life',
    // use i18n title/subtitle/description from src/i18n/ui.ts instead of static ones above
    i18nTitle: true, // true, false
    // author name
    author: 'fres',
    // site url
    url: 'https://fres.space',
    // favicon url
    // recommended formats: svg, png or ico
    favicon: '/icons/favicon.svg', // or https://example.com/favicon.svg
  },
  // SITE INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // COLOR SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  color: {
    mode: 'auto',
    light: {
      primary: 'oklch(25% 0.12 140)',         // darker forest green
      secondary: 'oklch(15% 0.03 30)',        // dark brown
      background: 'oklch(97% 0.01 60)',       // warm off-white
      highlight: 'oklch(45% 0.18 130 / 0.25)', // deep green highlight
    },
    dark: {
      primary: 'oklch(80% 0.10 145)',         // light moss (slightly less bright)
      secondary: 'oklch(90% 0.02 60)',        // warm off-white
      background: 'oklch(0.184 0.01 182.67)',        // dark brown-black
      highlight: 'oklch(60% 0.15 135 / 0.3)', // muted forest accent
    },
  },
  // COLOR SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // GLOBAL SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  global: {
    // default language
    locale: 'en', // de, en, es, fr, ja, ko, pl, pt, ru, zh, zh-tw
    // more languages
    // not fill in the locale code above again, can be an empty array []
    moreLocales: ['en', 'it'],
    fontStyle: 'serif', // sans, serif
    // date format for posts
    dateFormat: 'DD-MM-YYYY', // YYYY-MM-DD, MM-DD-YYYY, DD-MM-YYYY, MONTH DAY YYYY, DAY MONTH YYYY
    // enable table of contents for all posts by default
    toc: true, // true, false
    // enable KaTeX for mathematical formulas rendering
    katex: true, // true, false
    // reduce animations and transitions to improve performance
    reduceMotion: false, // true, false
  },
  // GLOBAL SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // COMMENT SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  comment: {
    enabled: true,
    waline: {
      serverURL: 'https://comment.fres.space',
      emoji: [
        'https://unpkg.com/@waline/emojis@1.2.0/tw-emoji',
      ],
      search: false,
      imageUploader: false,
    },
  },
  // COMMENT SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // SEO SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  seo: {
    twitterID: '@shelovesfres',
    verification: {
      bing: '0D27A7818649ECAF77E548D149084C55',
      yandex: '8b438d54ba013094',
    },
    umamiAnalyticsID: 'a6ed80a-50a0-407b-b5cb-d0d373b555f5',
    follow: {
      feedID: '',
      userID: '',
    },
    // apiflash access key
    // automatically generate website screenshots for open graph images
    // get your access key at: https://apiflash.com/
    apiflashKey: '',
  },
  // SEO SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // FOOTER SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  footer: {
    // social links
    links: [
      {
        name: 'RSS',
        url: '/atom.xml', // or /rss.xml
      },
      {
        name: 'GitHub',
        url: 'https://github.com/fres-sudo/space',
      },
      {
        name: 'Email',
        url: 'me@fres.space',
      },
      // {
      //   name: 'X',
      //   url: 'https://x.com/radishzz_',
      // },
    ],
    // year of website start
    startYear: 2025,
  },
  // FOOTER SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // PRELOAD SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  preload: {
    // image hosting url
    // optimize remote images in Markdown files to avoid cumulative layout shift
    imageHostURL: 'image.fres.space',
    // custom google analytics js
    // for users who route analytics javascript to a customized domain
    // See https://gist.github.com/xiaopc/0602f06ca465d76bd9efd3dda9393738
    customGoogleAnalyticsJS: '',
    // custom umami analytics js
    // for users who deploy umami on their own, or route analytics javascript to a customized domain
    // see https://github.com/umami-software/umami/discussions/1026
    customUmamiAnalyticsJS: 'https://js.radishzz.cc/jquery.min.js',
  },
  // PRELOAD SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END
}

export default themeConfig

export const defaultLocale = themeConfig.global.locale
export const moreLocales = themeConfig.global.moreLocales
export const allLocales = [defaultLocale, ...moreLocales]
