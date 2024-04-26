import {AppDataSource} from "../database/datasource";
import {User} from "../database/entity/user.entity";
import {DateTime} from "luxon";
import {MoreThan} from "typeorm";

export async function tokenMiddleware(req, res, next) {
    // Vérifier si un JWT est passé dans l'en-tête
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Retourner une erreur 401 si aucun token n'est fourni
    }

    let collab = await AppDataSource.getRepository(User).findOneBy({
        token: token,
        tokenCreatedAt: MoreThan(DateTime.now().minus({hour: 1}).toJSDate())
    })

    if (collab) {
        req.body.token = token
        req.body.connectedCollab = collab;
        next();
    } else {
        res.sendStatus(401)
    }

}