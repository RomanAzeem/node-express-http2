const spdy = require("spdy")
const express = require("express")
const fs = require("fs")
const { promisify } = require("util")

const readFile = promisify(fs.readFile)

const app = express()

app.use(express.static("public"))

app.get("/push", async (req, res) => {
    try {
        if (res.push) {
            [
                "/app.js",
                "/styles.css",
                "/images/image.png"
            ].forEach(async (file) => {
                res.push(file, {}).end(await readFile(`public${file}`))
            })
        }

        res.writeHead(200)
        res.end(await readFile("index.html"))
    } catch (error) {
        res.status(500).send(error.toString())
    }
})

app.get('/welcome', (req, res, next) => {
    res.send("Welcome")
})

spdy.createServer(
    {
        key: fs.readFileSync("./server.key"),
        cert: fs.readFileSync("./server.crt")
    },
    app
).listen(8000, (err) => {
    if (err) {
        throw new Error(err)
    }
    console.log("Listening on port 8000")
})