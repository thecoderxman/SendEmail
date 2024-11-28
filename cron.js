const cron = require('node-cron');
const prisma = require('prisma');

cron.schedule("* * * * * ", ()=>{
    //Fetch active clients

    const clients = db.client.find({status: 'active'})

    for(let i=0;i<clients.length;i++){
        const clientObj = clients[i];
        const lock = redLock.find(clientObj.id);
        const count = 0;
        lock.acquire();
        const query = `SELECT * from emails where client_id == ${clientObj.id} limit 300`;
        const emails = prisma.rawQuery(query);

        for(let j=0;j<emails.length && count<300;j++){
            const emailToSend = helper(emails[i]);
            sendEmailNow(emailToSend);
            db.email.update({id: emails[i]._id}, {status: 'sent'});
            count++;
        }
        db.client.update({id: clientObj.id}, {count});
        lock.release();
    }
})

