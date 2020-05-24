module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // https://github.com/babel/babel/issues/9849#issuecomment-592668815
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
};
