//Deteccion de imagenes
const suscriptionKey = ""
const endpoint = "https://c1552480.cognitiveservices.azure.com/"

const url= `${endpoint}/vision/v3.2/analyze?visualFeatures=Description,Tags,Objects`
const imageURL= `https://www.mindicsalud.com/sites/default/files/styles/blog_full/public/ninos-pelota.jpg`
async function analizarContenido(){

    try{
        console.log("Analizando Imagen...")
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: imageURL })
        })

        if(!response.ok){
            const dataError = await response.json()
            throw new Error(dataError.message)
        }
        //exito
        const data = await response.json()
        const descripcion = data.description.captions[0].text
        const confianza = (data.description.captions[0].confidence * 100).toFixed(2)
        console.log(`Descripción: ${descripcion} - Confianza: ${confianza}%`)

        const listasEtiquetas = data.tags.map(fila => `${fila.name} -(${(fila.confidence * 100).toFixed(2)}%`)
        listasEtiquetas.forEach(element =>{
            console.log(`${element}`)
        })


        //Ubicacion de objetos
        console.log("Ubicacion de objetos")
        data.objects.forEach(element =>{
            console.log(` ${element.object} -x:${element.rectangle.x} - y:${element.rectangle.y} `)
        })

        //Ubicacion de objetos
    }catch(error){
        console.error(error.message)
    }
}
analizarContenido()