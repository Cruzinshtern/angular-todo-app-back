import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { sequelizeService } from "../models";


export const privateKey = process.env.PRIVATE_KEY || 'secret';
export const options = {
    algorithm: 'RS256'
};


export async function  isAuthorized(req, res, next) {
    const token = req.headers['authorization'];
    const parsedToken = jwt.verify(token, privateKey);
    const user = await sequelizeService.db.users.findOne({
        where: {
            id: parsedToken.id
        }
    })
    if (!user) {
        res.statusCode = 401;
        res.json({
            status: 'Unauthorized'
        })
    } else {
        req.user = user;
        next();
    }
}

