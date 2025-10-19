import express from "express"
import { commandHandler } from "./src/commandHandler.js"

const app = express()
const PORT = process.env.PORT || 80

app.use(express.json())

app.post("/connect", (req, res) => {
    console.log("🔗 Conectado com sucesso!")
    console.log(req.body)
    res.sendStatus(200)
})

app.post("/message", (req, res) => {
    console.log("💬 Mensagem recebida!")
    console.log(req.body)
    commandHandler(req.body)
    res.sendStatus(200)
})

app.get("/", (req, res) => {
    res.send("Servidor Express rodando!");
})

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
})