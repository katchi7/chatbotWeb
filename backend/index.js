let express = require("express"),
    app = express(),
    unirest = require("unirest"),
    fileName = '\\answer.wav';
    const fs = require('fs');
    const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    
    const textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: 'KxUSNparC9y2YrgtcYipUWahCRnTacJzvZcYCsUUmiDL',
      }),
      url: 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/e8712961-da9b-4c98-b4d7-69196e70b7ef',
    });
    
    
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });

app.get("/",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    getAnswer(req.query.question,res);
});
app.get("/audio",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    getAudio(req.query.answer,res);
});
app.delete("/",(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    fs.unlink(__dirname + fileName, (err)=>{
        if(!err){
            console.log("file deleted");
            res.send("deleted");
        }
    })
});

app.listen(3000,()=>{
    console.log("server Started");
})




function getAnswer(question,res){
    var request = unirest("GET", "https://acobot-brainshop-ai-v1.p.rapidapi.com/get");
    
    request.query({
        "bid": "178",
        "key": "sX5A2PcYZbsN5EY6",
        "uid": "mashape",
        "msg": question
    });
    
    request.headers({
        "x-rapidapi-host": "acobot-brainshop-ai-v1.p.rapidapi.com",
        "x-rapidapi-key": "acbee58152msh391f04712fb5795p1c07acjsn513a7651afc5",
        "useQueryString": true
    });
    
    
    request.end(function (response) {
        if (response.error) console.log(response.error);
        else {
            res.send(response.body.cnt)
        }
    });
}
function getAudio(answer,res){
    var synthesizeParams = {
        text: answer,
        accept: 'audio/wav',
        voice: 'en-US_AllisonV3Voice',
      };
    textToSpeech.synthesize(synthesizeParams)
  .then(response => {
    // only necessary for wav formats,
    // otherwise `response.result` can be directly piped to a file
    return textToSpeech.repairWavHeaderStream(response.result);
  })
  .then(buffer => {
    
    console.log("file");
    fileName = "/public/audio/audio"+Number.parseInt(Math.random()*100)+".wav";
    fs.writeFileSync(__dirname + fileName, buffer);  
    res.send(fileName);
  })
  .catch(err => {
    console.log('error:', err);
  });
}
