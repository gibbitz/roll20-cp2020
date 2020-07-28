module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3.6.5',
        targets: '> 0.25%, not dead',
        useBuiltIns: 'usage'
      }
    ]
  ]
}