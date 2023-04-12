import { PrismaClient } from "@prisma/client";
import express, { Application, Request, Response } from "express";
import { Model3DRequest } from "./interface";

const app: Application = express();
const port = process.env.PORT ?? 8080;

const prisma = new PrismaClient()


// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
    "/",
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Hello World!",
        });
    }
);

app.get("/models",async(req: Request,res :Response):Promise<Response>=>{
    const models = await prisma.model3D.findMany()

    return res.send({models})
})

app.post("/models",async(req: Request,res :Response):Promise<Response>=>{
    const model = await prisma.model3D.create({
        data:{
            name:"Dummy Model",
            url:"https://dummyurl.com"
        }
    })

    return res.send({message:"Model created succesfully with id:"+ model.id})
})

app.get("/models/:id/",async (req:Request, res: Response):Promise<Response> => {
    const model = await prisma.model3D.findFirst({where:{id:Number(req.params.id)}})
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

    return res.send(model)
})

app.delete("/models/:id/",async (req:Request, res: Response): Promise<Response> => {
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
