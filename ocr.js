//Deteccion de texto en imagen - OCR
const suscriptionKey = ""
const endpoint = "https://c1552480.cognitiveservices.azure.com/"

const url = `${endpoint}vision/v3.2/read/analyze`
const imageURL = `https://image.slidesharecdn.com/eleditorial-220301120619/95/El-editorial-3-638.jpg`

async function leerTexto (){
    try{
        console.log('Enviando imagen a Azure...')

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
        //Azure no devuelve el texto inmediatamente,d evuelve una URL en el header 'operation-location'

        const operationLocation = response.headers.get('operation-location')
        console.log('Procesando... esperando resultados')

        //Consultar URL de la operacion hasta que se encuentre como "succeded"

        let result = null 
        while(true){
            const checkResponse = await fetch(operationLocation, {
            headers:{"Ocp-Apim-Subscription-Key": suscriptionKey}
        })
        result = await checkResponse.json()
        if(result.status === 'succeeded')break;
        if(result.status === 'failed') throw new Error('Error analizando datos...');
      //Esperar 1 segundo para volver a intentarlo
      await new Promise(resolve => setTimeout(resolve, 1000))   
    }
    console.log('Texto detectado:')

    result.analyzeResult.readResults.forEach(page =>{
        page.lines.forEach(line =>{
            console.log(line.text)
        })
    })
    //console.log(result.analyzeResult.readResults)
    }catch(error){
        console.error(`Error en el servicio: ${error.message}`)

    }
}


leerTexto()
