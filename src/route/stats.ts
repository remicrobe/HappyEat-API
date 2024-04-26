import express = require("express");
import {tokenMiddleware} from "../middleware/checkApiToken";
import {AppDataSource} from "../database/datasource";
import {User} from "../database/entity/user.entity";
import {Vote} from "../database/entity/vote";
import {DateTime} from "luxon";
import {Restaurant} from "../database/entity/restaurant.entity";

const statsRouter = express.Router();

statsRouter.get('/user/mostVoted/:period', tokenMiddleware, async (req, res) => {
    try {
        let userIdMostVotedQuery = AppDataSource.getRepository(User).createQueryBuilder('user')
            .leftJoinAndSelect('user.vote', 'vote')
            .addSelect('COUNT(vote.id)', 'voteCount')
            .groupBy('user.id')
            .orderBy('voteCount','DESC')

        let period = req.params.period
        if(period === 'month') {
            userIdMostVotedQuery = userIdMostVotedQuery.where('vote.createdAt > :date', { date: DateTime.now().minus({month: 1}).toJSDate()})
        } else if (period === 'week') {
            userIdMostVotedQuery = userIdMostVotedQuery.where('vote.createdAt > :date', { date: DateTime.now().minus({day: 7}).toJSDate()})
        }

        let userIdMostVoted = await userIdMostVotedQuery.getRawOne()

        let userInfoMostVoted = {
            userInfo: await AppDataSource.getRepository(User).findOneByOrFail({
                id: userIdMostVoted.userId,
            }),
            votesNumber: userIdMostVoted.voteCount
        }

        res.send(userInfoMostVoted)
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

statsRouter.get('/user/all/', tokenMiddleware, async (req, res) => {
    try {
        let userIdMostVoted = await AppDataSource.getRepository(User).createQueryBuilder('user')
            .leftJoinAndSelect('user.vote', 'vote')
            .addSelect('COUNT(vote.id)', 'voteCount')
            .groupBy('user.id')
            .orderBy('voteCount','DESC')
            .getRawMany();

        let userInfoMostVoted = await Promise.all(userIdMostVoted.map(async rawData => {
            const userInfo = await AppDataSource.getRepository(User).findOneByOrFail({
                id: rawData.user_id,
            });
            return {
                userInfo: userInfo,
                votesNumber: rawData.voteCount
            };
        }));

        res.send(userInfoMostVoted)
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

statsRouter.get('/resto/mostVoted/:period', tokenMiddleware, async (req, res) => {
    try {
        let restoIdMostVotedQuery = AppDataSource.getRepository(Restaurant).createQueryBuilder('resto')
            .leftJoinAndSelect('resto.vote', 'vote')
            .addSelect('COUNT(vote.id)', 'voteCount')
            .groupBy('resto.id')
            .orderBy('voteCount','DESC')

        let period = req.params.period
        if(period === 'month') {
            restoIdMostVotedQuery = restoIdMostVotedQuery.where('vote.createdAt > :date', { date: DateTime.now().minus({month: 1}).toJSDate()})
        } else if (period === 'week') {
            restoIdMostVotedQuery = restoIdMostVotedQuery.where('vote.createdAt > :date', { date: DateTime.now().minus({day: 7}).toJSDate()})
        }

        let restoIdMostVoted = await  restoIdMostVotedQuery.getRawOne()

        let restoInfoMostVoted = {
            restoInfo: await AppDataSource.getRepository(Restaurant).findOneByOrFail({
                id: restoIdMostVoted.userId,
            }),
            votesNumber: restoIdMostVoted.voteCount
        }

        res.send(restoInfoMostVoted)
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

statsRouter.get('/resto/all/', tokenMiddleware, async (req, res) => {
    try {
        let restoIdMostVoted = await AppDataSource.getRepository(Restaurant).createQueryBuilder('resto')
            .leftJoinAndSelect('resto.vote', 'vote')
            .addSelect('COUNT(vote.id)', 'voteCount')
            .groupBy('resto.id')
            .orderBy('voteCount','DESC')
            .getRawMany();

        let restoInfoMostVoted = await Promise.all(restoIdMostVoted.map(async rawData => {
            const restoInfo = await AppDataSource.getRepository(Restaurant).findOneByOrFail({
                id: rawData.resto_id,
            });
            return {
                restoInfo: restoInfo,
                votesNumber: rawData.voteCount
            };
        }));

        res.send(restoInfoMostVoted)
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

export {statsRouter}