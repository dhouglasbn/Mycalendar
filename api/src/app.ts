import express from 'express';

const app = express();

app.get('./', (request, response) => {
    return response.json({
        "author": "Dhouglas Bandeira",
        "Message": "Hello, World!"
    })
})

app.listen(3333);