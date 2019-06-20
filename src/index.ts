import Logger, { LogLevel } from '@ayana/logger';
import { PluminetServer } from './server';
import TOML from 'toml';
import * as path from 'path';
import * as fs from 'fs';
import Configuration from './configuration';
import {MongoClient} from 'mongodb';

const logger = Logger.get('bootstrap');

var config: Configuration;

try {
    config = TOML.parse(fs.readFileSync(path.join(__dirname, '../config.toml'), 'utf-8')) as Configuration;
} catch (e) {
    logger.error('Failed to load config.');
    logger.error(new Error(e)); // wrap to prevent crashes
    process.exit(-1);
}

if (config.debug) {
    Logger.getDefaultTransport().setLevel(LogLevel.DEBUG); // globally sets the min log level to debug, in production this doesn't happen
    logger.warn('Pluminet is running in development mode. Set the "debug" property in the config file to false to disable debug output.');
}

logger.info('Pluminet is starting now.');

MongoClient.connect(config.mongo.url, (err, client) => {
    if (err) {
        logger.error('Failed to connect to MongoDB.');
        logger.error(err);
        process.exit(-1);
    }

    const db = client.db('pluminet');
    const server = new PluminetServer(db);
    server.start(config.port, () => {
        logger.info(`Running on port ${config.port}.`);
    });
})