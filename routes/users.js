import {Router} from "express";
import { usersService } from "../services/users.service";
import { isAuthorized } from "../middleware/auth";
import {generateDto} from "../utils/generate-dto";

const router = new Router();

router.get("/users", isAuthorized, async (req, res) => {
    try {
        const getAllUsers = await usersService.getAllUsers();
        if(req.user.role !== "User") {
            res.json({
                data: getAllUsers,
                userInfo: req.user,
                userRole: req.user.role
            })
        } else {
            res.json({
                status: "Sorry but you have to be Admin or Manager to see this",
                userInfo: req.user,
                userRole: req.user.role
            })
        }
    } catch (error) {
        res.json({
            status: "No list",
            data: error
        })
    }
});

router.get("/users/:id", isAuthorized, async (req, res) => {
    const oneUser = await usersService.getOneUser(req);
    res.json({
        status: "User found",
        data: oneUser
    })
})

router.post("/users", async (req, res) => {
    const existedUser = await usersService.getUserByEmail(req);
    const createdUser = await usersService.createUser(req);
        if(existedUser) {
            res.json({
                status: "Sorry, but user with such EMAIL already exists"
            })
        } else {
            res.json(generateDto(createdUser))
        }
});


export default router;
