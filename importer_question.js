/*

*/


const mongoose = require('mongoose');
const questions = require('./src/question.mongo');
const parse = require('csv-parser')
const fs = require('fs')
require('dotenv').config()

const MONGO_URL = process.env.DB_URL;

mongoose.connection.once('open',()=>console.log('connection open'))
mongoose.connection.on('error',e=>console.error(e))

async  function startServer() {
    await mongoose.connect(MONGO_URL,{
        useNewUrlParser:true,
        // useFindAndModify:false,
        // useCreateIndex:true,
        useUnifiedTopology:true,
    })
    const results = [];


    fs.createReadStream('./public/questions.csv').pipe(parse({
        comments: '#',
        columns: true
    })).on('data', data => {
        results.push(data)
    })

        .on('error', err => console.error(err))
        .on('end', () => {
            console.log(results)

            results.map(result => {
                let annotations=[];
                for (let p in result) {

                    if (p!=='q_n'&&result[p]!==''){
                        annotations.push(result[p])
                    }

                }
                const question = 'Question '+result.q_n
                questions.updateOne({
                    question:question,
                },{question:question,annotations},{
                    upsert:true,

                }).then(c=>console.log(c))
                    .catch(e=>console.log(e));

            })
            console.log('done')
        });



}
startServer().then(r =>console.log(r) )
