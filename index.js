const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoClient = require('mongodb');
const cors = require('cors');

const url = 'mongodb+srv://dbUser:dbUser@cluster0-vuciv.mongodb.net/test?retryWrites=true&w=majority'

app.use(cors());
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }))

function generate(){
    let short = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
       short += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return short;
}

app.post('/',(req,res)=>{
    let longUrl = req.body.longUrl;
    mongoClient.connect(url,(err,client)=>{
        if(err) throw err;
        let db = client.db('urldb');
        let unique = false;
        let urlObject = {
            long: longUrl,
            
        };

        do{
            let urlShort = generate()
            urlObject.short = urlShort;
            db.collection('urlShortener').findOne({"short":urlShort},(err,data)=>{
                if(err) throw err;
                if(!data){
                    unique = true;
                    db.collection('urlShortener').insertOne(urlObject,(err,data)=>{
                        if(err) throw err;
                        client.close();
                    
                        res.send(data)
                    })
                }
            })
        }
        while(unique == true)
        
            
           
        
    })

})
app.get('/url',(req,res)=>{
    mongoClient.connect(url,(err,client)=>{
        if(err) throw err;
        let db = client.db('urldb');
        db.collection('urlShortener').find().toArray((err,data)=>{
            if(err) throw err;
            client.close();
            res.json(data)

    
        })
    })
})

app.listen(process.env.PORT,()=>{
    console.log("port running");
})