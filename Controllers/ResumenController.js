const suscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_ENDPOINT;

exports.resumirTexto = async (req, res) => {
    try {
        if (!suscriptionKey || !endpoint) {
            return res.status(500).json({ error: "Faltan variables de entorno: AZURE_CV_KEY o AZURE_CV_ENDPOINT no están definidas en el .env" });
        }

        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ error: "Por favor proporciona un campo 'texto' en el body." });
        }

        const url = `${endpoint}/language/analyze-text/jobs?api-version=2023-04-01`;

        // Paso 1 - Armar cuerpo de la petición
        const cuerpoPeticion = {
            displayName: "resumen_tarea",
            analysisInput: {
                documents: [{
                    id: "1",
                    language: "es",
                    text: texto
                }]
            },
            tasks: [{
                kind: "ExtractiveSummarization",
                taskName: "resumen_tarea",
                parameters: { sentenceCount: 2 }
            }]
        };

        // Paso 2 - Enviar documento a Azure
        console.log("Enviando documento largo a AZURE...");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cuerpoPeticion)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de Azure: ${errorData.error?.message || 'Error desconocido'}`);
        }

        // Paso 3 - Obtener URL de seguimiento del header
        const urlSeguimiento = response.headers.get('operation-location');
        if (!urlSeguimiento) {
            throw new Error("Azure no devolvió la URL de seguimiento (operation-location).");
        }

        console.log("Trabajo aceptado en el servidor, procesando...");

        // Paso 4 - Polling hasta que el trabajo termine
        let resultadoFinal = null;
        while (true) {
            const respuestaSeguimiento = await fetch(urlSeguimiento, {
                headers: { "Ocp-Apim-Subscription-Key": suscriptionKey }
            });

            resultadoFinal = await respuestaSeguimiento.json();

            if (resultadoFinal.status === 'succeeded') { break; }
            if (resultadoFinal.status === 'failed') {
                throw new Error('Azure no pudo completar el proceso de resumen.');
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Paso 5 - Extraer frases del resumen
        console.log("Resumen generado por la IA");
        const tareaFinalizada = resultadoFinal.tasks.items[0];
        const frasesResumen = tareaFinalizada.results.documents[0].sentences;

        const frases = frasesResumen.map((frase, indice) => ({
            indice: indice + 1,
            texto: frase.text,
            rankScore: (frase.rankScore * 100).toFixed(2)
        }));

        return res.json({
            mensaje: "Resumen generado con éxito",
            totalFrases: frases.length,
            frases
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};