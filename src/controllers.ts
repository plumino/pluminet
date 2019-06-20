import { Controller, ClassMiddleware, Get, Post } from '@overnightjs/core';
import Logger from '@ayana/logger';
import { Request, Response } from 'express';
import * as path from 'path';
import * as util from 'util';
import {Db} from 'mongodb';
import * as jwt from 'jsonwebtoken';
import * as argon from 'argon2';

@Controller('api')
export class BackendController {
    private logger: Logger;
    private mongo: Db;

    constructor(mongo: Db) {
        this.logger = Logger.get(BackendController);
        this.mongo = mongo;
    }

    @Post('getToken')
    public async getToken(req: Request, res: Response) {
        let pw = req.body.password;
        let uname = req.body.username;
        if (!pw || !uname) {
            return res.status(400).end();
        }
        let us = await this.mongo.collection('users').findOne({username: uname});
        if (!us) {
            return res.status(403).end();
        }
        let ver = await argon.verify(us.password, pw);
        if (!ver) {
            return res.status(403).end();
        }
        return res.status(200).send({
            
        });
    }
}