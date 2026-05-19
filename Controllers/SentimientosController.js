// Servicio Foundry (AZURE) - ANALISIS DE SENTIMIENTOS
const suscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_ENDPOINT;

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

exports.analizarSentimientos = async (req, res) => {
    try {
        const { textos } = req.body;

        if (!textos || !Array.isArray(textos) || textos.length === 0) {
            return res.status(400).json({ error: "Por favor proporciona un array de 'textos' en el JSON del body." });
        }

        //Paso 1 - Construir los documentos que se desean analizar
        const documents = textos.map((texto, index) => ({
            id: (index + 1).toString(),
            language: "es",
            text: texto
        }));

        const documentosAnalizar = {
            kind: "SentimentAnalysis",
            analysisInput: {
                documents: documents
            }
        };

        //Paso 2 - Enviar multiples documentos a Azure
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentosAnalizar)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de Azure: ${errorData.error?.message || 'Error desconocido'}`);
        }

        //Paso 3 - Recibir Respuesta
        const data = await response.json();

        if (data.errors && data.errors.length > 0) {
            return res.status(500).json({ errors: data.errors });
        }

        //Enviando los resultados...
        const resultados = data.results.documents.map(documento => {
            //Contenido original
            const contenidoOriginal = documents.find(d => d.id === documento.id).text;
            
            return {
                id: documento.id,
                texto: contenidoOriginal,
                sentimiento: documento.sentiment,
                scores: {
                    positivo: (documento.confidenceScores.positive * 100).toFixed(2),
                    negativo: (documento.confidenceScores.negative * 100).toFixed(2),
                    neutral: (documento.confidenceScores.neutral * 100).toFixed(2)
                }
            };
        });

        return res.json({
            mensaje: "Análisis de sentimientos completado con éxito",
            resultados: resultados
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};
