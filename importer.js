/*

*/


const mongoose =require('mongoose');
const topics = require('./src/topics.mongo');
const parse = require('csv-parser')
const fs = require('fs')
const results = [];

require('dotenv').config()
const MONGO_URL = process.env.DB_URL;

mongoose.connection.once('open',()=>console.log('connection open'))
mongoose.connection.on('error',e=>console.error(e))
console.log(MONGO_URL)
async  function startServer() {
    await mongoose.connect(MONGO_URL,{
        useNewUrlParser:true,
        // useFindAndModify:false,
        // useCreateIndex:true,
        useUnifiedTopology:true,
    })

    fs.createReadStream('./public/topics.csv').pipe(parse({
        comments: '#',
        columns: true
    })).on('data', data => {
        results.push(data)
    })

        .on('error', err => console.error(err))
        .on('end', () => {
            results.forEach(result=>{
                if (result.level_1!=''){
                    topics.updateOne({
                        topic:result.level_1
                    },{topic:result.level_1},{
                        upsert:true,

                    }).then(c=>console.log(c)).catch(e=>console.log(e));
                }
                if (result.level_2!=''){
                    topics.updateOne({
                        topic:result.level_2
                    },{
                        topic:result.level_2,
                        parent:`,${result.level_1},`
                    },{
                        upsert:true,

                    }).then(c=>console.log(c)).catch(e=>console.log(e));
                }
                if (result.level_3!=''){
                    topics.updateOne({
                        topic:result.level_3
                    },{topic:result.level_3,
                        parent:`,${result.level_1},${result.level_2},`
                    },{
                        upsert:true,

                    }).then(c=>console.log(c)).catch(e=>console.log(e));
                }

            })
            console.log('done')
        });

}
startServer().then(r =>console.log(r) )
