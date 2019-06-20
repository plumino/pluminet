import {Server} from '@overnightjs/core';
import {BackendController} from './controllers';
import Logger from '@ayana/logger';
import * as express from 'express';
import {Db} from 'mongodb';

import * as util from 'util';

export class PluminetServer extends Server {
    private logger: Logger;
    private mongo: Db;

    constructor(mongo: Db) {
        super();

        const logger = this.logger = Logger.get(PluminetServer);

        this.app.use(require('morgan')('dev', {
            stream: {
                write(line: string) {
                    logger.debug(line.replace(/[\n\t\r]/g, ''));
                }
            }
        }));
        this.app.use(express.json());

        this.mongo = mongo;

        this.setupControllers();
    }

    private setupControllers() {
        const backend = new BackendController(this.mongo);

        const controllers = [backend];

        this.logger.debug('Controllers registered: ' + util.inspect(controllers, false, 0, true));
        super.addControllers(controllers);
    }

    public start(port: number, callback: () => void) {
        this.app.listen(port, callback);
    }
}