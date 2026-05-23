/* Este servicio permite analizar imágenes y extraer información clave:
   Descripción, etiquetas, categorías, colores dominantes, etc.
*/
const suscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_ENDPOINT;

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

exports.analizarImagen = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: "Por favor proporciona un campo 'imageUrl' en el JSON del body." });
        }

        // Paso 1 - Enviar la imagen a Azure para análisis
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
            throw new Error(`Error de Azure: ${errorData.error?.message || 'Error desconocido'}`);
        }

        // Paso 2 - Recibir respuesta
        const data = await response.json();

        // Paso 3 - Extraer la información relevante
        const descripcion = data.description?.captions?.[0]?.text || 'Sin descripción';
        const confianza = data.description?.captions?.[0]?.confidence
            ? (data.description.captions[0].confidence * 100).toFixed(2)
            : '0.00';
        const etiquetas = data.description?.tags || [];
        const categorias = data.categories || [];
        const colores = data.color || {};

        return res.json({
            mensaje: "Análisis de imagen completado con éxito",
            descripcion,
            confianza: `${confianza}%`,
            etiquetas,
            categorias,
            colores
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};