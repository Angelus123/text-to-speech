const TextToSpeech = require('@google-cloud/text-to-speech');
const Speech = require('@google-cloud/speech');
const fs = require('fs');
const util = require('util');
const cors = require('cors');
const express = require("express");
require('dotenv').config();

const tts_client = new TextToSpeech.TextToSpeechClient();
const stt_client = new Speech.SpeechClient();

async function speechToText(audio) {
    const request = {
      audio: {content:audio},
      config: {encoding:"MP3",sampleRateHertz: 16000,languageCode: 'en-US'}
    };  
    const [response] = await stt_client.recognize(request);
    return response;
}  


const filename = "./audio.mp3";
const file = fs.readFileSync(filename);
var audioBytes = file.toString('base64');
audioBytes = audioBytes.substring(0, audioBytes.length/2);


async function textToSpeech(text) {
  const request = {
    input: {text: text},
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  const [response] = await tts_client.synthesizeSpeech(request);
  return response;
}


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.post('/text-to-speech',async (req,res)=>{
    const text = req.body.text;
    const audio = await textToSpeech(text);    
    res.send(audio).end();
})


app.post('/speech-to-text',async (req,res)=>{
    // const audioBytes = req.body.audio;
    const text = await speechToText(audioBytes);    
    res.send(text).end();
})



app.listen(8082||process.env.PORT, () =>
  console.log(`App listening on 8082!....`)
);
