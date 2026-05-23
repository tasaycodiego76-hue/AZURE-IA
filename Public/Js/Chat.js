document.addEventListener('DOMContentLoaded', () => {

    const chatBtn      = document.getElementById('chat-btn');
    const chatWidget   = document.getElementById('chat-widget');
    const chatCerrar   = document.getElementById('chat-cerrar');
    const chatMensajes = document.getElementById('chat-mensajes');
    const chatInput    = document.getElementById('chat-input');
    const chatEnviar   = document.getElementById('chat-enviar');
    const chatTokens   = document.getElementById('chat-tokens');

    let historial = [];

    chatBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('abierto');
        if (chatWidget.classList.contains('abierto')) chatInput.focus();
    });

    chatCerrar.addEventListener('click', () => {
        chatWidget.classList.remove('abierto');
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    });

    chatEnviar.addEventListener('click', enviarMensaje);

    function agregarBurbuja(texto, tipo) {
        const div = document.createElement('div');
        div.className = `chat-burbuja ${tipo}`;
        div.textContent = texto;
        chatMensajes.appendChild(div);
        chatMensajes.scrollTop = chatMensajes.scrollHeight;
        return div;
    }

    async function enviarMensaje() {
        const pregunta = chatInput.value.trim();
        if (!pregunta) return;

        agregarBurbuja(pregunta, 'usuario');
        chatInput.value = '';
        chatEnviar.disabled = true;

        const burbujaEscribiendo = agregarBurbuja('Escribiendo...', 'escribiendo');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pregunta, historial })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Error al obtener respuesta');

            burbujaEscribiendo.remove();
            agregarBurbuja(data.respuesta, 'bot');

            historial = data.nuevo_historial;
            chatTokens.textContent = `Tokens usados: ${data.tokens_usados}`;

        } catch (error) {
            burbujaEscribiendo.remove();
            agregarBurbuja('Error: ' + error.message, 'bot');
        } finally {
            chatEnviar.disabled = false;
            chatInput.focus();
        }
    }
});