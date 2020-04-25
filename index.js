'use strict'

//Libs
const express = require('express');
const boydParser = require('body-parser');
const request = require('request');
const app = express();
const token = '';

//Correr server
app.set('port',5000);
app.use(boydParser.json());

app.get('/',(req, res)=>{
    res.send('Hola bb');
});

app.get('/webhook',(req,res)=>{
    if(req.query['hub.verify_token']=== 'miPrimerChatBot'){
        res.send(req.query['hub.challenge'])
    }
    else{
        res.send('Sin permisos');
    }
});

app.post('/webhook',(req,res)=>{
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging){
        webhook_event.messaging.forEach(event => {
            console.log(event);
            handleMesage(event);
        });
    }
    res.sendStatus(200);
});

function handleMesage(event) {
    const senderID = event.sender.id;
    const messageData = {
        recipient : {
            id: senderID,
        },
        message : {
            text : getMsg()
        }
    }
    callSendApi(messageData);
}
let i = 0;

function getMsg(){
    if(i == 0){
        i++;
        return 'Mi primer chatbot baby';
    }
    else if(i == 1){
        i++;
        return 'NO seas imbecil';
    }
    else{
        i = 0;
        return 'TE ODIO COVID 19';
    }
}

function callSendApi(response) {
    console.log(response);
    request ({
        "uri" : "https://graph.facebook.com/me/messages",
        "qs" : {
            "access_token" : token
        },
        "method" : 'POST',
        "json" : response
    },(err)=>{
        if(err)
            console.log(err);       
        else
            console.log('Mensaje enviado');
                 
    })
}

app.listen(app.get('port'),()=>{
    console.log("Servidor corriendo");
});