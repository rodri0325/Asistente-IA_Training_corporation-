import { crearApp } from './app.js';

const port = Number(process.env.PORT || 5000);
if (!process.env.GEMINI_API_KEY?.trim()) {
  console.warn('Configura GEMINI_API_KEY en .env para habilitar las respuestas de IA.');
}
crearApp().listen(port, '127.0.0.1', () => {
  console.log(`Asistente de prueba: http://localhost:${port}`);
});
