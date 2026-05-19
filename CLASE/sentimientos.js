//Servicio Foundry (AZURE) - ANALISIS DE SENTIMIENTOS
const suscriptionKey = ""
const endpoint = "https://1552480-azure.services.ai.azure.com"

const URL = `${endpoint}/language/analyze-text?api-version=2023-04-01`

async function analizarSentimientos (){
    try{
        const documentosAnalizar = {
            kind: "SentimentAnalysis",
            analysisInput: {
                documents:[
                {
                    id: "1",
                    language: "es",
                    text: "El servicio de atención al cliente le informa qu tiene una promocion en su proxima compra"
                },
                 {
                    id: "2",
                    language: "es",
                    text: "Estoy muy frustrado, el sistema de ventas falló y perdimos tiempo y dinero en el proceso"
                },
                 {
                    id: "3",
                    language: "es",
                    text: "El reporte del área de logística está listo para su descarga"
                }
              ]
            }
        }
        console.log ("Enviando multiples documento a Azure")

        const response = await fetch(URL,{
           method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentosAnalizar)
        })
          if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Error en: ${errorData.error.message}`)
        }

        const data = await response.json()

        //Enviando los resultados...
        data.results.documents.forEach(documento =>{
            //Se muestra el ID de cada codumento
            console.log(`Documento # ${documento.id}`)
            //Contenido analizado
            const contenidoOriginal = documentosAnalizar.analysisInput.documents.find(d => d.id === documento.id).text
            console.log(`Contenido original: ${contenidoOriginal}`)

            console.log(`Sentimiento predominante: ${documento.sentiment}`)

            const scores = documento.confidenceScores
            console.log ("Puntuaciones de confianza:")
            console.log(` - Positivo: ${(scores.positive * 100).toFixed(2)}`)
            console.log(` - Negativo:  ${(scores.negative * 100).toFixed(2)}`)
            console.log(` - Neutral:  ${(scores.neutral * 100).toFixed(2)}`)
        })

    }//try
    catch(error){
        console.error(error.message)
    }
}

analizarSentimientos()