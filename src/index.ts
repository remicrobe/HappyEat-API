import * as express from 'express'
import * as dotenv from 'dotenv';
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocsFile from "./docs/swagger.json"

dotenv.config()

import * as cors from 'cors'
import { templateRouter } from './route/template'
import {AppDataSource} from "./database/datasource";
import {restaurantRouter} from "./route/restaurant";
import {userRouter} from "./route/user";
import {voteRouter} from "./route/vote";
import { Server } from 'socket.io';
import * as http from "http";
import {User} from "./database/entity/user.entity";
import {statsRouter} from "./route/stats";

export class Index {
    static app = express()
    static router = express.Router()
    static server = http.createServer(Index.app); // Créez un serveur HTTP à partir de votre application Express
    static io = new Server(Index.server, {cors: {origin : '*'}}); // Créez une instance de Socket.IO attachée à votre serveur HTTP

    static globalConfig(){
        Index.app.use(cors())
        Index.app.use(express.json())
    }

    static docsConfig(){
        Index.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocsFile));
    }

    static routeConfig(){
        Index.app.use('/template', templateRouter)
        Index.app.use('/user', userRouter)
        Index.app.use('/restaurant', restaurantRouter)
        Index.app.use('/vote', voteRouter)
        Index.app.use('/stats', statsRouter)
    }

    static socketConfig(){
        Index.io.on('connection', (socket) => {

            // Demander le token à l'utilisateur
            socket.emit('requestToken', 'Veuillez fournir votre token.');

            const timeout = setTimeout(() => {
                socket.emit('ciao', 'Token non envoyé.');
                socket.disconnect();
            }, 5000); // 5000 millisecondes (5 secondes)


            socket.on('userToken', async (token) => {
                console.log('Le token de l\'utilisateur est :', token);
                let collab = await AppDataSource.getRepository(User).findOneBy({token: token})
                if (collab) {
                    socket.join("connectedUsers");
                } else {
                    socket.emit('disconnected', 'Token faux.');

                    socket.disconnect();
                }

                clearTimeout(timeout);
            });
        });
    }

    static async serverConfig() {
        await AppDataSource.initialize().then(async () => {
            console.log("Connecté a la base de données");
            Index.server.listen(process.env.PORT, () => {
                console.log(`API démarrée sur le port ${process.env.PORT}....`);
                Index.app.emit("ready");
            });
        });
    }

    static async main() {
        Index.globalConfig()
        Index.routeConfig()
        Index.docsConfig()
        Index.socketConfig()
        await Index.serverConfig()
    }

}

Index.main() 