export default {
  ecma: '2020',
  module: true,
  parse: {
    html5_comments: false
  },
  compress: {
    arguments: true,
    drop_console: true,
    ecma: '2020',
    keep_infinity: true,
    module: true,
    passes: 3,
    toplevel: true,
    unsafe: true,
    unsafe_arrows: false,
    unsafe_methods: true,
    unsafe_proto: true,
  },
  mangle: {
    module: true,
    toplevel: true
  },
  format: {
    comments: false,
    ecma: '2020'
  }
}
