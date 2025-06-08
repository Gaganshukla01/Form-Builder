import express from "express"
import {createGoogleDoc} from "../controller/noteController.js"
export const notesRoute=express.Router()

notesRoute.post("/noteSave",createGoogleDoc)