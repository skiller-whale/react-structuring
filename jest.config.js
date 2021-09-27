module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': require.resolve('babel-jest')
  },
  moduleDirectories: ['node_modules', 'src']
};
