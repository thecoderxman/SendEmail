const express = require('express');
const app = express();
const redis = require('node-redis');


const PORT = 3000;

app.post('/sendEmail',(req,res)=>{
    const {clientId, emails} = req.body;
    const lock = redlock.find(clientId);
    lock.aquire();

    const clientObj = db.client.find(clientId);

    const count = clientObj.count;
    let counter = 0;
    let i =0

    if(count<300){
        for(i=0;i<emails.length && counter<300;i++){
            const emailObj = {...email[i], status: 'sent'};
            Promise.all(db.email.update(emailObj),sendEmailNow(email[i]));
            counter++;
        }
    }

    db.client.update({id: clientId}, {count});

    for(;i<emails.length;i++){
        const emailObj = {...email[i], status: 'pending'};
        db.email.update(emailObj)
    }

    lock.release();

})


app.listen(PORT, ()=>{console.log(`Listening on port ${PORT}`)});