/* Controlador para análisis de imágenes con Azure Computer Vision
   Extrae: descripción, etiquetas y ubicación de objetos
*/
const suscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_ENDPOINT;

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Description,Tags,Objects`;

exports.analizarImagen = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: "Por favor proporciona un campo 'imageUrl' en el JSON del body." });
        }

        // Paso 1 - Enviar URL de la imagen a Azure
        console.log("Analizando imagen...");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: imageUrl })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de Azure: ${errorData.message || 'Error desconocido'}`);
        }

        // Paso 2 - Recibir respuesta
        const data = await response.json();

        // Paso 3 - Extraer descripción
        const descripcion = {
            texto: data.description.captions[0]?.text || "Sin descripción",
            confianza: ((data.description.captions[0]?.confidence || 0) * 100).toFixed(2)
        };

        // Paso 4 - Extraer etiquetas (tags)
        const etiquetas = data.tags.map(tag => ({
            nombre: tag.name,
            confianza: (tag.confidence * 100).toFixed(2)
        }));

        // Paso 5 - Extraer objetos con ubicación
        const objetos = data.objects.map(obj => ({
            nombre: obj.object,
            confianza: (obj.confidence * 100).toFixed(2),
            x: obj.rectangle.x,
            y: obj.rectangle.y,
            ancho: obj.rectangle.w,
            alto: obj.rectangle.h
        }));

        return res.json({
            mensaje: "Análisis de imagen completado con éxito",
            descripcion,
            etiquetas,
            objetos
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};