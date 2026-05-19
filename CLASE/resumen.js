//Servicio Foundry (AZURE)
const suscriptionKey = "4XDJfmEsGT8Xr1jEDMi1BKKgqIDyii8Lycj7CbO4WWS8JC5FjfBoJQQJ99CEAC1i4TkXJ3w3AAAAACOGP0kw"
const endpoint = "https://1552480-azure.services.ai.azure.com"

//URL 
const URL = `${endpoint}/language/analyze-text/jobs?api-version=2023-04-01`

async function resumirTexto(){

    //Texto que deberá ser resumido
    const documentoLargo= "Después de la derrota de Francia en junio de 1940, Alemania se movilizó para lograr superioridad aérea sobre Gran Bretaña como preludio para una invasión a la isla. A pesar de los meses de ataques aéreos, Alemania no pudo destruir la Fuerza Aérea Real (RAF) de Gran Bretaña. En el otoño de 1940, la invasión se pospuso de manera indefinida. La campaña alemana de bombardeo contra Gran Bretaña continuó hasta mayo de 1941. Finalmente, los alemanes pusieron fin a los ataques aéreos, principalmente por la preparación para la invasión a la Unión Soviética en junio de 1941."

    //Parametrizar el documento
    const cuerpoPeticion = {
        displayName: "",
        analysisInput: {
            documents:[{
                    id: "1",
                    language: "es",
                    text: documentoLargo
                }
            ]
        },
        tasks:[{
            kind: "ExtractiveSummarization",
            taskName: "resumen_invasion",
            parameters: {sentenceCount: 2}
        }]
    };
    try{
        console.log("Enviando documento largo a AZURE...")

        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cuerpoPeticion)
        });
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Error en: ${errorData.error.message}`)
        }

        //Hasta este punto la mitad del trabajo esta resuelto
        const URLSeguimiento = response.headers.get('operation-location')
        console.log("Trabajo aceptado en el servidor, procesando...")


        let resultadoFinal = null
        while(true){
            const respuestaSeguimiento = await fetch(URLSeguimiento, {
                headers: {"Ocp-Apim-Subscription-Key": suscriptionKey }
            })
            resultadoFinal = await respuestaSeguimiento.json()
            if (resultadoFinal.status === 'succeeded') {break;}
            if (resultadoFinal.status === 'failed') {throw new Error('El servidor no pudo completar el proceso...')}

            await new Promise(resolve => setTimeout(resolve, 2000))
        }

        console.log("Resumen generado por la IA")
        const tareaFinalizada = resultadoFinal.tasks.items[0]
        const frasesResumen = tareaFinalizada.results.documents[0].sentences

        console.log(`Tarea finalizada: ${tareaFinalizada}`)
        frasesResumen.forEach((frase, indice) => {
            console.log(`${indice} - ${frase.text}`)
        });
    }
    catch(error){
        console.error(error.message)
    }
}


resumirTexto()