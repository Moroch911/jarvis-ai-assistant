# Jarvis AI Assistant - Prototipo

Este repositorio contiene un prototipo de asistente "Jarvis" que corre completamente en el navegador. Características:

- Reconocimiento de voz (Web Speech API) para capturar comandos.
- Síntesis de voz (SpeechSynthesis) para leer respuestas.
- Motor de respuestas simple integrado (comandos básicos como "hora", "buscar", "chiste").
- Opción para pegar tu propia OpenAI API Key en el navegador y obtener respuestas del modelo (opcional).

Cómo usar (rápido)

1. Abre `index.html` en tu navegador (o usa GitHub Pages cuando esté habilitado).
2. Pega tu OpenAI API key (opcional) y presiona "Conectar" si quieres respuestas avanzadas.
3. Escribe un comando o presiona "Escuchar" y di un comando.

Privacidad y seguridad

- Si pegas tu clave de OpenAI en la caja, las peticiones se hacen desde tu propio navegador y tu clave nunca se envía a terceros por este prototipo. Aun así, ten cuidado al usar claves.

Despliegue en GitHub Pages

Este sitio puede publicarse en GitHub Pages desde la rama `main`. La URL esperada (si Pages está habilitado) es:

https://Moroch911.github.io/jarvis-ai-assistant/

Si quieres, puedo intentar activar GitHub Pages o ayudarte a desplegarlo en Render/Vercel/Netlify y configurar un backend seguro para OpenAI.
