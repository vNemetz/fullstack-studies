import fastify from "fastify";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes";

const app = fastify();


async function main(){
    try{
        await mongoose.connect("mongodb://localhost:27017/db");
        console.log("MongoDB conectado via Mongoose");
        
        userRoutes(app);
        
        app.get("/", (request, reply) => {
            reply.status(201).send("I'm alive now");
        })        

        await app.listen({port:3000}).then(()=>{ //o "then" só é executado com o fim da promise
            console.log("http server running on http://localhost:3000");
        });

    }catch(error){
        console.error("Erro ao conectar ao banco de dados", error);
        process.exit(1);
    }
}

main();

