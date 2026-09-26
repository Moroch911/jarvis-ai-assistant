// script.js - Jarvis prototype (browser-only)

const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('send');
const listenBtn = document.getElementById('listen');
const apiKeyInput = document.getElementById('apiKey');
const connectBtn = document.getElementById('connectApi');
const statusSpan = document.getElementById('status');
const autoSpeak = document.getElementById('autoSpeak');

let OPENAI_KEY = null;
let recognition = null;
let listening = false;

function appendMessage(text, who='bot'){
  const div = document.createElement('div');
  div.className = 'message ' + (who==='user' ? 'user' : 'bot');
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text){
  if(!autoSpeak.checked) return;
  if(!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

async function sendToOpenAI(prompt){
  if(!OPENAI_KEY) throw new Error('No API key');
  statusSpan.textContent = 'Contactando LLM...';
  const res = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer '+OPENAI_KEY
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages:[{role:'system',content:'Eres Jarvis, un asistente personal, responde en español y sé breve.'},{role:'user',content:prompt}],
      max_tokens:300
    })
  });
  if(!res.ok){
    const t = await res.text();
    throw new Error('OpenAI API error: '+res.status+' '+t);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || JSON.stringify(data);
  statusSpan.textContent = '';
  return text;
}

function simpleAssistant(input){
  input = input.toLowerCase();
  if(input.includes('hora')){
    return 'Ahora son ' + new Date().toLocaleTimeString();
  }
  if(input.includes('buscar') || input.includes('busca')){
    const q = input.replace(/.*buscar\s*/,'').replace(/.*busca\s*/,'');
    if(q.length>0) {
      window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank');
      return 'He abierto una búsqueda en Google para: ' + q;
    }
    return '¿Qué quieres que busque?';
  }
  if(input.includes('abre') && input.includes('google')){
    window.open('https://www.google.com','_blank');
    return 'Abriendo Google';
  }
  if(input.includes('chiste')){
    return '¿Por qué los programadores confunden Halloween con Navidad? Porque 31 OCT = 25 DEC.';
  }
  if(input.includes('gracias') || input.includes('thank')){
    return 'De nada. ¿Algo más?';
  }
  return null;
}

async function handleUser(text){
  appendMessage(text,'user');
  // try simple assistant
  const simple = simpleAssistant(text);
  if(simple){
    appendMessage(simple,'bot');
    speak(simple);
    return;
  }
  // otherwise, try OpenAI if key provided
  if(OPENAI_KEY){
    try{
      const resp = await sendToOpenAI(text);
      appendMessage(resp,'bot');
      speak(resp);
    }catch(e){
      console.error(e);
      appendMessage('Error al usar OpenAI: '+e.message,'bot');
      speak('Ocurrió un error al contactar al servicio de IA.');
    }
    return;
  }
  // fallback
  const fall = "Lo siento, no entendí eso. Pruébalo de nuevo o pega tu clave de OpenAI para respuestas más completas.";
  appendMessage(fall,'bot');
  speak(fall);
}

sendBtn.addEventListener('click', ()=>{
  const v = userInput.value.trim();
  if(!v) return;
  userInput.value = '';
  handleUser(v);
});

connectBtn.addEventListener('click', ()=>{
  const v = apiKeyInput.value.trim();
  if(!v){
    OPENAI_KEY = null;
    statusSpan.textContent = 'OpenAI desconectado (usando asistente básico).';
    return;
  }
  OPENAI_KEY = v;
  statusSpan.textContent = 'OpenAI conectado (clave en tu navegador).';
});

// Speech Recognition
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener('result', (e)=>{
    const text = e.results[0][0].transcript;
    listening = false;
    listenBtn.textContent = 'Escuchar';
    handleUser(text);
  });
  recognition.addEventListener('end', ()=>{
    listening = false;
    listenBtn.textContent = 'Escuchar';
  });
  recognition.addEventListener('start', ()=>{
    listening = true;
    listenBtn.textContent = 'Parar';
  });
} else {
  listenBtn.disabled = true;
  listenBtn.textContent = 'Reconocimiento no soportado';
}

listenBtn.addEventListener('click', ()=>{
  if(!recognition) return;
  if(!listening){
    try{ recognition.start(); }catch(e){ console.warn(e); }
  } else {
    recognition.stop();
  }
});

// keyboard: Enter to send
userInput.addEventListener('keydown',(e)=>{
  if(e.key==='Enter') sendBtn.click();
});

// welcome
appendMessage('Hola, soy Jarvis (prototipo). Di un comando o escribe algo.','bot');
