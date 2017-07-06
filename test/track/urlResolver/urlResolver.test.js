import path from 'path';
import createUrlResolver from 'src/track/urlResolver/urlResolver';

it('resolve url', async() => {
    const config = {
        extension: 'wav',
        dir: '/tmp/foo'
    };
    const resolveUrl = createUrlResolver(config);
    expect(resolveUrl(42)).toEqual(path.join('/tmp/foo/42.wav'));
});

const invalidConfigs = [
    {
        // extension: 'wav',
        dir: '/tmp/foo'
    },
    {
        extension: 'wav',
        // dir: '/tmp/foo'
    },
    {
        extension: 123,
        dir: '/tmp/foo'
    },
    {
        extension: 'wav',
        dir: []
    },
];

invalidConfigs.forEach((config, i) => {
    it('fail with invalid config #' + i, () => {
        try {
            createUrlResolver(config);
            throw new Error();
        } catch (error) {
            expect(error.message).toEqual(expect.stringContaining('Invalid track url resolver config'));
            expect(error.message).toEqual(expect.stringContaining(JSON.stringify(config)));
        }
    });
});
