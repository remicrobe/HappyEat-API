import express = require("express");

const templateRouter = express.Router();


templateRouter.get('/', async (req, res) => {
    try  {
        res.send('Skeleton API')
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

export { templateRouter }