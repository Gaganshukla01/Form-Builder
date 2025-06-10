import express from "express"
import { resFormAdd,formRes } from "../controller/formResController"
export const formResRoute=express.Router()

formResRoute.post("/formresadd",resFormAdd)

formResRoute.get("/formresfetch",formRes)