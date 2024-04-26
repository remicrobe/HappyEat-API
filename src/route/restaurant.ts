import express = require("express");
import {checkRequiredField} from "../utils/global";
import {Restaurant} from "../database/entity/restaurant.entity";
import {AppDataSource} from "../database/datasource";
import {ErrorHandler} from "../utils/error/error-handler";
import {tokenMiddleware} from "../middleware/checkApiToken";
import {In, MoreThan, Not} from "typeorm";
import {DateTime} from "luxon";
import {Vote} from "../database/entity/vote";
import {broadcastPleaseReload} from "../socket/broadcastPleaseReload";

const restaurantRouter = express.Router();


restaurantRouter.post('/create', tokenMiddleware, async (req, res) => {
    try  {
        let { name, emoji } = req.body;

        if (!checkRequiredField([name, emoji])) {
            return res.sendStatus(422);
        }

        let restau = new Restaurant();
        restau.emoji = emoji;
        restau.name = name;

        res.send(await AppDataSource.getRepository(Restaurant).save(restau));
        broadcastPleaseReload()
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

restaurantRouter.delete('/:id', tokenMiddleware, async (req, res) => {
    try  {
        let { id } = req.params;

        if (!checkRequiredField([id, parseInt(id)])) {
            return res.sendStatus(422);
        }

        let restaurantToDelete = await AppDataSource.getRepository(Restaurant).findOneByOrFail({id: parseInt(id)})

        let votes = await AppDataSource.getRepository(Vote).findBy({restaurant: {id: restaurantToDelete.id}})
        await AppDataSource.getRepository(Vote).remove(votes)

        res.send(await AppDataSource.getRepository(Restaurant).delete(restaurantToDelete));
        broadcastPleaseReload()
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

restaurantRouter.put('/:id', tokenMiddleware,  async (req, res) => {
    try  {
        let { id } = req.params;
        let { name, emoji } = req.body;

        if (!checkRequiredField([id, parseInt(id), name, emoji])) {
            return res.sendStatus(422);
        }

        let restaurantToEdit = await AppDataSource.getRepository(Restaurant).findOneByOrFail({id: parseInt(id)})

        restaurantToEdit.emoji = emoji;
        restaurantToEdit.name = name;

        res.send(await AppDataSource.getRepository(Restaurant).save(restaurantToEdit));
        broadcastPleaseReload()
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

restaurantRouter.get('/', tokenMiddleware,  async (req, res) => {
    try  {
        let restoWithVote = await AppDataSource.getRepository(Restaurant).find({
            where:{
                vote: {
                    createdAt: MoreThan(DateTime.now().startOf('day').toJSDate())
                }
            },
            relations:{
                vote: {
                    user: true
                }
            }
        })

        let restoWithoutVote = await AppDataSource.getRepository(Restaurant).find({
            where:{
                id: Not(In(restoWithVote.map(resto => resto.id)))
            }
        })

        let restoWithUser = restoWithVote.map(resto => {
            return {
                id: resto.id,
                name: resto.name,
                emoji: resto.emoji,
                users: resto.vote.map(vote => vote.user)
            }
        })

        const restos = [...Object.values(restoWithUser), ...Object.values(restoWithoutVote)];

        res.send(restos);
    } catch (e) {
        return ErrorHandler(e, req , res)
    }
});

export { restaurantRouter }