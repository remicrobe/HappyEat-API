import express = require("express");
import {checkRequiredField} from "../utils/global";
import {Restaurant} from "../database/entity/restaurant.entity";
import {AppDataSource} from "../database/datasource";
import {ErrorHandler} from "../utils/error/error-handler";
import {tokenMiddleware} from "../middleware/checkApiToken";
import {Vote} from "../database/entity/vote";
import {MoreThan} from "typeorm";
import {DateTime} from "luxon";
import {broadcastPleaseReload} from "../socket/broadcastPleaseReload";

const voteRouter = express.Router();


voteRouter.get('/getTodayVote', tokenMiddleware, async (req, res) => {
    try  {
        let todayVote = await AppDataSource.getRepository(Vote).find({
            where: {
                createdAt: MoreThan(DateTime.now().startOf('day').toJSDate())
            },
            relations: {
                restaurant: true,
                user: true
            }
        })

        return res.send(todayVote)
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

voteRouter.post('/:restaurantId', tokenMiddleware, async (req, res) => {
    try  {
        let restaurant = await AppDataSource.getRepository(Restaurant).findOneByOrFail({id:parseInt(req.params.restaurantId)})

        let todayVote = await AppDataSource.getRepository(Vote).findOne({
            where: {
                createdAt: MoreThan(DateTime.now().startOf('day').toJSDate()),
                user: req.body.connectedCollab,
                restaurant: {
                    id: restaurant.id
                }
            },
            relations: {
                restaurant: true,
                user: true
            }
        })

        if(todayVote) {
            await AppDataSource.getRepository(Vote).remove(todayVote);
            broadcastPleaseReload()
            let newVoteArray = await AppDataSource.getRepository(Vote).find({
                where:{
                    createdAt: MoreThan(DateTime.now().startOf('day').toJSDate()),
                    restaurant:{
                        id:restaurant.id
                    }
                },
                relations:{
                    user: true
                }
            })
            let voteUsers = newVoteArray.map(vote => vote.user)

            return res.send(voteUsers);
        } else {
            let newVote = new Vote();
            newVote.user = req.body.connectedCollab;
            newVote.restaurant = restaurant;
            await AppDataSource.getRepository(Vote).save(newVote)
            let newVoteArray = await AppDataSource.getRepository(Vote).find({
                where:{
                    createdAt: MoreThan(DateTime.now().startOf('day').toJSDate()),
                    restaurant:{
                        id:restaurant.id
                    }
                },
                relations: {
                    user: true
                }
            })
            let voteUsers = newVoteArray.map(vote => vote.user)

            broadcastPleaseReload()
            return res.send(voteUsers);
        }
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});


export { voteRouter }