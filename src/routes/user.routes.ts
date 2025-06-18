import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {User} from "../models/user.model"


export default async function userRoutes(app: FastifyInstance){ //recebe o app (fastify()) declarado no arquivo server.ts
    
  app.post("/users", async (request, reply) => {  //post cria um user
    const {name,email} = request.body as {name: string, email:string};

    try{
      const user = new User({ name, email});
      await user.save();
      reply.status(201).send(user);
    }catch(error:any){
      if(error.code === 11000){
        return reply.status(409).send({error: "Email already registered"});
      }
      reply.status(400).send({ error: error.message });
    }
        
  });

  app.get("/users/:id", async (request, reply) => { //get retorna o user
    const {id} = request.params as {id: string};

    try{
      const user = await User.findById(id);
      if(!user){
        return reply.status(404).send({error: "User not found"});
      }
      reply.send(user);
      }catch{
        reply.status(400).send({error:"Invalid id"});
      }
  });
    
  app.get("/users", async (request:FastifyRequest, reply:FastifyReply) =>{

    try{
      const users = await User.find();
      if(!users){
        return reply.status(404).send({error:"No users found"});
      }
      reply.send(users);
    }catch{
      reply.status(400).send({error:"invalid request"});
    }
  });


  app.put("/users/:id", async (request, reply) =>{ //put atualiza um único user
    const {id} = request.params as {id: string};
    const {name, email} = request.body as {name?: string, email?:string};

    try{
      const user = await User.findByIdAndUpdate(id, {name, email}, {new:true});
      if(!user){
        return reply.status(404).send({error: "User not found"});
      }
      reply.send(user);
      }catch{
        reply.status(400).send({error: "Invalid id"});
      }
    });
};