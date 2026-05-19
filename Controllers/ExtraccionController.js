/* Este servicio permite identificar datos(informacion) clave en un documento
Teléfonos , nombres, edad, dirección, etc.
*/
const suscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_ENDPOINT;

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

exports.extraerDatos = async (req, res) => {
    try {
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ error: "Por favor proporciona un campo 'texto' en el JSON del body." });
        }

        //Paso 1 - Documento que se desea analizar
        const documentoProcesar = {
            kind: 'EntityRecognition',
            analysisInput: {
                documents: [{
                    id: "1",
                    language: "es",
                    text: texto
                }]
            }
        };

        //Paso 2 - Enviar documento
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentoProcesar)
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

        //Extraer todos los datos clave de cada DOCUMENTO
        //... es tambien el único documento que enviamos
        const primerDocumento = data.results.documents[0];
     
        //La empresa para la que desarrolla, solo quiere obtener las fechas
        const fechasExtraidas = [];
        primerDocumento.entities.forEach(documento => {
            if (documento.category === 'DateTime') {
                fechasExtraidas.push(documento);
            }
        });

        return res.json({
            mensaje: "Extracción completada con éxito",
            todasLasEntidades: primerDocumento.entities,
            fechasExtraidas: fechasExtraidas
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};
