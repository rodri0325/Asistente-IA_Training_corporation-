(() => {
  const feedback = document.getElementById('training-feedback');

  function report(message) {
    feedback.textContent = message;
    feedback.hidden = !message;
  }

  document.querySelectorAll('[data-training-chat], [data-training-question]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!window.TrainingChat?.init || !window.TrainingChatConfig) {
        report('El asistente no está disponible en este momento. Inténtalo más tarde.');
        return;
      }
      try {
        const chat = window.TrainingChat.init(window.TrainingChatConfig);
        if (button.dataset.trainingQuestion) {
          if (!chat.setQuestion(button.dataset.trainingQuestion)) {
            chat.open();
            report('Espera la respuesta a tu consulta actual antes de elegir otro curso.');
            return;
          }
        } else {
          chat.open();
        }
        report('');
      } catch {
        report('No se pudo abrir el asistente. Actualiza la página e inténtalo de nuevo.');
      }
    });
  });
})();
