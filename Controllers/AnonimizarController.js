/* Este servicio permite detectar y ocultar datos sensibles (PII) en un texto:
   Nombres, DNI, teléfonos, direcciones, correos electrónicos, etc.
*/
const suscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_ENDPOINT;

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

exports.anonimizarDatos = async (req, res) => {
    try {
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ error: "Por favor proporciona un campo 'texto' en el JSON del body." });
        }

        // Paso 1 - Armar el documento a anonimizar
        const documentoAnonimizar = {
            kind: 'PiiEntityRecognition',
            analysisInput: {
                documents: [{
                    id: "1",
                    language: "es",
                    text: texto
                }]
            },
            parameters: {
                redactionPolicy: {
                    policyKind: 'CharacterMask'
                }
            }
        };

        // Paso 2 - Enviar documento a Azure
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentoAnonimizar)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de Azure: ${errorData.error?.message || 'Error desconocido'}`);
        }

        // Paso 3 - Recibir respuesta
        const data = await response.json();

        if (data.results.errors && data.results.errors.length > 0) {
            return res.status(500).json({ errors: data.results.errors });
        }

        const primerDocumento = data.results.documents[0];

        // Extraer las entidades PII detectadas
        const entidadesDetectadas = primerDocumento.entities.map(entidad => ({
            text: entidad.text,
            category: entidad.category,
            confidenceScore: entidad.confidenceScore
        }));

        return res.json({
            mensaje: "Anonimización completada con éxito",
            textoOriginal: texto,
            textoAnonimizado: primerDocumento.redactedText,
            entidadesDetectadas
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};