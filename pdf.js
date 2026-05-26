/*
Analizar un archivo PDF, como si se tratara de un archivo PLANO(txt)
Este ejercicio se puede realizar con PDF (ONLINE https//...) o PDF local
 */ 

/*
¿como utilizar este servicio con un PDF Local?
 <input type='file'> 
 cambiar:
 documentUrl = `miarchivo.pdf`
 Content-Type: applicacion/octet-stream
*/

const endPoint = `https://1552480-azure-ia.services.ai.azure.com/`
const apiKey = ``
const modelId = `prebuilt-invoice`

const url = `${endPoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`
const documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

//AZURE NECESITA HOSTEAR EL ARCHIVO PDF
async function subirDocumento() {

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"urlSource": documentUrl })
        });
        if (!response.ok) {
            console.error('Problemas de acceso')
            return
        }
        const operationLocation = response.headers.get('Operation-Location')
        console.log('Analisis iniciado, URL:',operationLocation)
        return operationLocation
    }
    catch (error) {
        console.error(error)
    }
}
//Archivo que debemos analizar
async function analizarDocumento(operationLocation) {
    try{
        const response = await fetch(operationLocation, {
            method: 'GET',
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
            }
        })
        if (!response.ok) {
        console.error('Problemas de acceso')
        return
        }

        //El analisis puede tardar unos instantes...
        const data = await response.json()
        if (data.status === 'running' || data.status === 'noStarted') {
            console.log('Procesando, espere por favor...')
            await new Promise(resolve => setTimeout(resolve, 2000)) // Espera 2 segundos antes de volver a consultar
            return analizarDocumento(operationLocation) // RECURSIVIDAD metodoA-> metodoA
        }else if (data.status === 'succeeded') {
            console.log('Datos extraídos del PDF')
           // console.log(data.analyzeResult.documents)
            return data.analyzeResult
        }else{
            console.error('Análisis ha fallado', data.error)
        }
    }
    catch(error){
        console.error(error)
    }
}
async function procesarFactura() {
    const urlResultado = await subirDocumento()
    //Si el objeto  = undefined
    if (urlResultado) {
        const resultadoFinal = await analizarDocumento(urlResultado)
       // console.log("Procesando Factura...")
        console.log(resultadoFinal.documents[0].fields)
    }
}

procesarFactura()
