const {createServer} = require('http')
const {parse} = require('url')

let db = [
    {
        title: 'What did the mic tell the user?',
        comedian: 'John Doe',
        year: 1994,
        id: 1
    },

    {
        title: "I like to play chess with old men in the park, although it's hard to find 32 of them.",
        comedian: 'Emo Phillips',
        year: 1956,
        id: 2
    },

    {
        title: "Why does a bicycle rest when it's not moving? Because it's two-tyred.",
        comedian: 'Google',
        year: 1994,
        id: 3
    },

    {
        title: "One-armed butlers – they can take it but they can’t dish it out.",
        comedian: 'Tim Vine',
        year: 1967,
        id: 4
    },

    {
        title: "I thought I'd begin by reading a poem by Shakespeare, but then I thought, why should I? He never reads any of mine.",
        comedian: 'Spike Milligan',
        year: 2002,
        id: 5
    },
]

const requestHandler = (req, res) =>{
    if(req.url === '/' && req.method === 'GET'){
        getJokes(req, res)
    }
    else if(req.url === '/' && req.method === 'POST'){
        addJoke(req, res)
    }
    else if(req.url === '/jokes/1' && req.method === 'PATCH'){
        updateJoke(req, res)
    }
    else if(req.url === '/jokes/1' && req.method === 'DELETE'){
        deleteJoke(req, res)
    }
    else{
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({error: true, message: "Not found"}))
    }
}

function getJokes(req, res){
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({data: db, message: 'Data fetched successfully'}))
}   

function addJoke(req, res){
    let body = []

    req.on('data', chunk =>{
        body.push(chunk)
    })

    req.on('end', () =>{
        const data = Buffer.concat(body).toString()
        const newJoke = JSON.parse(data)
        newJoke.id = db.length + 1  // Generate new id
        db.push(newJoke)

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(db))
    })
}

function updateJoke(req, res){
    const id = +req.url.split('/')[2]
    const body = []

    req.on('data', (chunk) =>{
        body.push(chunk)
    })

    req.on('end', () =>{
        const convertedBuffer = Buffer.concat(body).toString()
        const jsonRes = JSON.parse(convertedBuffer)

        const updatedDB = db.map(item => {
            if(item.id === id){
                return{
                    ...item,
                    ...jsonRes,
                }
            }
            return item
        })
        db = updatedDB
    })
       
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(updatedDB))
}

function deleteJoke(req, res){
    const id = parseInt(req.url.split('/')[2])
    const deletedJoke = db.find(item => item.id === id)
    db = db.filter(item => item.id !== id)

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(deletedJoke))
}

const server = createServer(requestHandler)

server.listen(4000, () =>{
    console.log('server running')
})