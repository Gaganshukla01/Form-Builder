import express from "express"
import {formCreate,getShareId,getByid} from "../controller/formController.js"
export const formRoute=express.Router()

formRoute.post("/create",formCreate)
formRoute.get("/:id",getByid)
formRoute.get("/share/:shareId",getShareId)