require('dotenv').config()
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
import axios from 'axios'

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || [];
  }
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'smplman',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'smplman project website' },
      { name: 'msapplication-TileColor', content: '#00a300' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#0e9e49'},
    ]
  },
  /*
  ** Modules
  */
  modules: [
    '@nuxtjs/axios',
    'nuxt-fontawesome',
  ],

  /*
  ** Plugins
  */
  plugins: [
    '~/plugins/filters.js'
  ],
  /*
  ** Axios
  */
  axios: {
    // proxyHeaders: false
    rejectUnauthorized: false
  },
  /*
  ** Fontawesome
  */
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.css',
    'highlight.js/styles/dracula.css'
  ],
  /*
  ** Environmnet Vars
  */
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    cockpit: {
      apiUrl: '',
      apiToken: '',
      baseUrl: ''
    }
  },
  /*
  ** Generate Routes
  */
  generate: {
    routes: async () => {
      // try {
      //   let { data } = await axios.post(process.env.POSTS_URL,
      //     JSON.stringify({
      //       filter: { published: true },
      //       sort: { _created: -1 },
      //       populate: 1
      //     }),
      //     {
      //       headers: { 'Content-Type': 'application/json' },
      //       rejectUnauthorized: false,
      //     })
      //   return data.entries.map((post) => {
      //     return {
      //       route: post.title_slug,
      //       payload: post
      //     }
      //   })
      // } catch (error) {
      //   return false;
      // }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }

      if (!isDev) {
        // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
        // for more information about purgecss.
        config.plugins.push(
          new PurgecssPlugin({
            // Specify the locations of any files you want to scan for class names.
            paths: glob.sync([
              path.join(__dirname, './pages/**/*.vue'),
              path.join(__dirname, './layouts/**/*.vue'),
              path.join(__dirname, './components/**/*.vue')
            ]),
            extractors: [
              {
                extractor: TailwindExtractor,
                // Specify the file extensions to include when scanning for
                // class names.
                extensions: ["html", "vue"]
              }
            ],
            whitelist: [
              "html",
              "body",
              "ul",
              "ol",
              "pre",
              "code",
              "blockquote"
            ],
            whitelistPatterns: [/\bhljs\S*/]
          })
        )
      }
    }
  }
}

