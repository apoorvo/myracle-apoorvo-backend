import { PrismaClient } from "@prisma/client";
import express, { Application, Request, Response } from "express";

import { Model3DRequest, RequestWithFile } from "./interface";
import path from "path";

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage} = require('firebase-admin/storage');
const cors = require('cors')


const app: Application = express();
const port = process.env.PORT ?? 3000;

const prisma = new PrismaClient()
const serviceAccount = require('./firebase_credentials.json');

const Multer  = require('multer')


// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const allowedFileExtensions = ['.obj', '.glb','.gltf','.fbc']

const multer = Multer({
    storage:Multer.memoryStorage(),
})



initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.BUCKET_NAME
});

const bucket = getStorage().bucket();

app.get(
    "/",
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Hello World!",
        });
    }
);

app.get("/models/",async(req: Request,res :Response):Promise<Response>=>{
    const models = await prisma.model3D.findMany()
    console.log(models)
    return res.send({models})
})

app.post("/models",multer.single('modelFile'),async(req: RequestWithFile,res :Response):Promise<Response>=>{
    try{
        if(req.file){
            const fileExtension = path.extname(req.file.originalname).toLowerCase()
            console.log(fileExtension)
            if (!allowedFileExtensions.includes(fileExtension)) {
                console.log("INVALID FILE TYPe")
                return res.status(500).send({error:"invalid filetype"})
              }
      
        }else{
            throw new Error("file is required")
        }

        if(!req.body.name){
            throw new Error("name is required")
        }

        const date = new Date()
        const filenae = (date.toISOString())+req.file?.originalname
        await bucket.file(filenae).save(req.file?.buffer)  
        
        const data = {
            name:req.body.name,
            url:`gs://${process.env.BUCKET_NAME}/${filenae}`

        }

        if(req.body.description){
            data["description"] = req.body.description
        }

        const model = await prisma.model3D.create({
            data
        })
        return res.send({model})   
    }catch(err){
        
        console.log(err)
        return res.status(500).send({err:err})
    }


})

app.get("/models/:id/",async (req:Request, res: Response):Promise<Response> => {
    const model = await prisma.model3D.findFirst({where:{id:Number(req.params.id)}})
    console.log(model)
    return res.send({model})
})

app.put("/models/:id/",async (req:Request, res: Response):Promise<Response> => {
    const data: Model3DRequest = {name: req.body.name}
    if(req.body.description){
        data["description"] = req.body.description
    }
    const model = await prisma.model3D.update({
        where:{id:Number(req.params.id)},
        data
    })

    return res.send({model})
})

app.delete("/models/:id/",async (req:Request, res: Response): Promise<Response> => {
    const model = await prisma.model3D.findFirst({where:{id:Number(req.params.id)}})
    const fileName = model?.url.split("/").pop();
    console.log(fileName)

    await bucket.file(fileName).delete();
    console.log("File deleted")
    await prisma.model3D.delete({where:{id:Number(req.params.id)}})


    return res.send({message:"Model deleted succesfully"})
})

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}
