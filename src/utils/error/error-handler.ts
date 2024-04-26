import { Request, Response } from "express";

export function ErrorHandler(error:any, req:Request , res:Response) {
    let  code = 500;

    if (error.toString().indexOf('EntityNotFoundError') > -1) {
        code = 404;
    }
    if (error.toString().indexOf('[WARNING]') > -1) {
        code = 403;
    }

    return res.sendStatus(code)
}