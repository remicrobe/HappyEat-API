import express = require("express");
import {User} from "../database/entity/user.entity";
import {checkRequiredField} from "../utils/global";
import {createHash, randomUUID} from "crypto";
import {AppDataSource} from "../database/datasource";
import {Equal, MoreThan} from "typeorm";
import {ErrorHandler} from "../utils/error/error-handler";
import {tokenMiddleware} from "../middleware/checkApiToken";
import {Restaurant} from "../database/entity/restaurant.entity";
import {Vote} from "../database/entity/vote";
import {DateTime} from "luxon";

const userRouter = express.Router();


userRouter.post('/register', async (req, res) => {
    try {
        let { email, firstName, lastName, password, username } = req.body;

        if (!checkRequiredField([{type: 'email', object: email}, firstName, lastName, password])) {
            return res.sendStatus(422);
        }

        let user = new User();

        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.username = username;
        user.password = createHash('sha256').update(password).digest('hex');
        user.tokenCreatedAt = new Date();
        user.token = randomUUID();
        user.refreshtokenCreatedAt = new Date();
        user.refreshToken = randomUUID();

        let createdUser = await AppDataSource.getRepository(User).save(user);

        return res.send(createdUser)
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!checkRequiredField([{type: 'email', object: email}, password])) {
            return res.sendStatus(422);
        }

        let connectedUser = await AppDataSource.getRepository(User).findOneOrFail({
            where:{
                email: Equal(email),
                password: Equal(createHash('sha256').update(password).digest('hex'))
            }
        });

        connectedUser.tokenCreatedAt = new Date();
        connectedUser.token = randomUUID();
        connectedUser.refreshtokenCreatedAt = new Date();
        connectedUser.refreshToken = randomUUID();


        return res.send(await AppDataSource.getRepository(User).save(connectedUser))
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

userRouter.put('/', tokenMiddleware, async (req, res) => {
    try  {
        let { email, firstName, lastName, password, username } = req.body;

        let user: User = req.body.connectedCollab;

        if(email && checkRequiredField([{type: 'email', object: email}])) {
            user.email = email
        }
        if(firstName) {
            user.firstName = firstName;
        }
        if(lastName) {
            user.lastName = lastName;
        }
        if(username) {
            user.username = username;
        }
        if(password) {
            user.password = createHash('sha256').update(password).digest('hex');
        }

        return res.send(await AppDataSource.getRepository(User).save(user))
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

userRouter.get('/refresh-token/:refreshToken', async (req, res) => {
    try  {
        let { refreshToken } = req.params;

        if(!refreshToken) {
            return res.sendStatus(422)
        }

        let collab = await AppDataSource.getRepository(User).findOneByOrFail({
            refreshToken: refreshToken,
            refreshtokenCreatedAt: MoreThan(DateTime.now().minus({month: 3}).toJSDate())
        })

        collab.tokenCreatedAt = new Date();
        collab.token = randomUUID();
        collab.refreshtokenCreatedAt = new Date();
        collab.refreshToken = randomUUID();


        return res.send(await AppDataSource.getRepository(User).save(collab))
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

export {userRouter}