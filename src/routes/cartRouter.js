import path from "path";
import { Router } from 'express';
export const router=Router()
router.get('/',(request,response)=>{

    

    response.setHeader('Content-Type','application/json')
    response.status(200).json({})
})