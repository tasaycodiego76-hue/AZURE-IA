/* Servicio de chatbot usando Azure OpenAI con historial de conversación */
const API_KEY      = process.env.AZURE_OPENAI_KEY;
const ENDPOINT     = process.env.AZURE_OPENAI_ENDPOINT;
const DEPLOYMENT   = 'gpt-5.4-mini';
const API_VERSION  = '2025-04-01-preview';

exports.chat = async (req, res) => {
    try {
        const { pregunta, historial = [] } = req.body;

        if (!pregunta) {
            return res.status(400).json({ error: "Por favor proporciona el campo 'pregunta'." });
        }

        const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

        // Paso 1 - Armar el body con historial + nueva pregunta
        const body = {
            messages: [
                { role: 'system', content: 'Eres un asistente útil y amigable. Responde siempre en español de forma clara y concisa.' },
                ...historial,
                { role: 'user', content: pregunta }
            ],
            max_completion_tokens: 800,
            temperature: 0.7
        };

        // Paso 2 - Enviar a Azure OpenAI
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de Azure: ${errorData.error?.message || 'Error desconocido'}`);
        }

        // Paso 3 - Recibir respuesta
        const data = await response.json();
        const mensaje = data.choices[0].message;

        return res.json({
            respuesta: mensaje.content,
            tokens_usados: data.usage.total_tokens,
            nuevo_historial: [
                ...historial,
                { role: 'user', content: pregunta },
                mensaje
            ]
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};