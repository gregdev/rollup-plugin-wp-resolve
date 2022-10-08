const ns        = '@wordpress/'
const nsExclude = ['icons', 'interface']

const external = {
  'jquery'   : 'window.jQuery',
  'lodash-es': 'window.lodash',
  'lodash'   : 'window.lodash',
  'moment'   : 'window.moment',
  'react-dom': 'window.ReactDOM',
  'react'    : 'window.React',
}

const wordpressMatch = new RegExp(`^${ns}(?!(${nsExclude.join('|')})).*$`) // /^@wordpress\/(?!(icons|interface)).*$/

export default function wpResolve () {
  return {
    name: 'wp-resolve',
    options: (options) => {
      if (!Array.isArray(options.external)) {
        options.external = [options.external].filter(Boolean)
      }

      options.external = options.external.concat(Object.keys(external))
      options.external.push(wordpressMatch)

      const outputGlobals = options.output.globals

      const resolveGlobals = (id) => {
        if (typeof outputGlobals === 'object' && outputGlobals.hasOwnProperty(id) && outputGlobals[id]) {
          return outputGlobals[id]
        }

        if (typeof outputGlobals === 'function') {
          const configGlobalId = outputGlobals(id)

          if (configGlobalId && configGlobalId !== id) {
            return configGlobalId
          }
        }

        if (external.hasOwnProperty(id) && external[id]) {
          return external[id]
        }

        if (wordpressMatch.test(id)) {
          // convert @namespace/component-name to namespace.componentName
          return id.replace(new RegExp(`^${ns}`), 'wp.').replace(/\//g, '.').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        }
      }

      options.output.globals = resolveGlobals

      return options
    }
  }
}
