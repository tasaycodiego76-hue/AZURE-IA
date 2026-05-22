/* Este servicio permite detectar texto dentro de una imagen usando OCR */

const suscriptionKey = process.env.AZURE_CV_KEY
const endpoint = process.env.AZURE_CV_ENDPOINT

const url = `${endpoint}/vision/v3.2/read/analyze`

exports.leerTextoImagen = async (req, res) => {

    try {

        //Paso 1 - Obtener URL de imagen desde frontend
        const { imageUrl } = req.body

        if (!imageUrl) {
            return res.status(400).json({
                error: "Debes enviar imageUrl en el body"
            })
        }

        //Paso 2 - Enviar imagen a Azure
        console.log('Enviando imagen a Azure...')

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: imageUrl
            })
        })

        //Paso 3 - Validar respuesta
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || 'Error procesando imagen')
        }

        //Paso 4 - Obtener operation-location
        const operationLocation = response.headers.get('operation-location')

        console.log('Procesando imagen...')

        //Paso 5 - Esperar resultados
        let result = null

        while (true) {

            const checkResponse = await fetch(operationLocation, {
                headers: {
                    "Ocp-Apim-Subscription-Key": suscriptionKey
                }
            })

            result = await checkResponse.json()

            if (result.status === 'succeeded') break

            if (result.status === 'failed') {
                throw new Error('Error analizando texto')
            }

            //Esperar 1 segundo
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        //Paso 6 - Extraer texto detectado
        const textosDetectados = []

        result.analyzeResult.readResults.forEach(page => {

            page.lines.forEach(line => {

                textosDetectados.push({
                    texto: line.text,
                    coordenadas: line.boundingBox
                })

            })

        })

        //Paso 7 - Responder al frontend
        return res.json({
            mensaje: 'Texto detectado correctamente',
            imagenAnalizada: imageUrl,
            totalLineas: textosDetectados.length,
            textosDetectados
        })

    } catch (error) {

        console.error(error.message)

        return res.status(500).json({
            error: error.message
        })

    }
}