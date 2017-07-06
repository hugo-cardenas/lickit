import Joi from 'joi-browser';
import VError from 'verror';
import path from 'path';

export default function createUrlResolver(config) {
    validateConfig(config);
    const { dir, extension } = config;
    return trackId => {
        return path.join(dir, trackId + '.' + extension);
    };
}

function validateConfig(config) {
    const { error } = Joi.validate(config, {
        extension: Joi.string().required(),
        dir: Joi.string().required(),
    });
    if (error) {
        throw new VError(error, 'Invalid track url resolver config %s', JSON.stringify(config));
    }
}
