module.exports = {
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['*'],
        root: ['.'],
        alias: {
          '@ui': './src/components/UI', // path to your app folder
        },
      },
    ],
  ],
}
