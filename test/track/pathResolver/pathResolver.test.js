import path from 'path';
import createPathResolver from 'src/track/pathResolver/pathResolver';

it('resolve path', async () => {
  const config = {
    extension: 'wav',
    dir: '/tmp/foo'
  };
  const resolvePath = createPathResolver(config);
  expect(resolvePath(42)).toEqual(path.join('/tmp/foo/42.wav'));
});

const invalidConfigs = [
  {
    // extension: 'wav',
    dir: '/tmp/foo'
  },
  {
    extension: 'wav'
    // dir: '/tmp/foo'
  },
  {
    extension: 123,
    dir: '/tmp/foo'
  },
  {
    extension: 'wav',
    dir: []
  }
];

invalidConfigs.forEach((config, i) => {
  it('fail with invalid config #' + i, () => {
    try {
      createPathResolver(config);
      throw new Error();
    } catch (error) {
      expect(error.message).toEqual(
        expect.stringContaining('Invalid track path resolver config')
      );
      expect(error.message).toEqual(
        expect.stringContaining(JSON.stringify(config))
      );
    }
  });
});
