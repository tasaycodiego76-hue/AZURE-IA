//Deteccion de imagenes
const suscriptionKey = ""
const endpoint = "https://c1552480.cognitiveservices.azure.com/"

const url= `${endpoint}/vision/v3.2/analyze?visualFeatures=Objects`
const imageURL= `https://arweb.com/wp-content/uploads/2023/03/gente-oficina.jpg`

async function detectarObjetos(){

    try{
        console.log ("Iniciando la deteccion de objetos...")
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: imageURL })
        })
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(errorData.message)
        }
        //exito
        const data = await response.json()

        data.objects.forEach(obj => {
            const confianza = (obj.confidence * 100).toFixed(2)
            console.log(`Objeto identificado: ${obj.object} - Confianza: ${confianza}%`)

            //ubicacion 
            const rect = obj.rectangle
            console.log(`Coordenadas del rectangulo:`)
            console.log(`Inicio (superior, izquierdo): ${rect.x}, ${rect.y}`)
            console.log (`Dimensiones (px): ${rect.w} ancho, ${rect.h} alto`)
        })

    }catch(error){
        console.error(`Error en el servicio: ${error.message}`)

    }
}
detectarObjetos()
 