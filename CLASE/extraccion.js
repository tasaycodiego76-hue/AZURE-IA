/* Este servicio permite identificar datos(informacion) clave en un documento
Teléfonos , nombres, edad, dirección, etc.
*/
const suscriptionKey = ""
const endpoint = "https://1552480-azure.services.ai.azure.com/"


const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`

async function extraerDatos(){
    try{
      //Paso 1 - Documento que se desea analizar
      const texto = `El ingeniero Carlos Mendoza del equipo de TI coordinó la compra de 15 servidores marca DELL por un valor de 45000 dólares para la sucursal de
      Autos Nova en Lima el pasado 12 de mayo del 2026`

      const documentoProcesar = {
        kind: 'EntityRecognition',
        analysisInput: {
            documents: [{
                id: "1",
                language: "es",
                text: texto
            }]
        }
      }
      //Paso 2 - Enviar documento
      console.log(`Enviando texto a azure para extracción...`)
      const response = await fetch(url, {
         method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentoProcesar)
      })
       if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Error en: ${errorData.error.message}`)
        }

      //Paso 3 - Recibir Respuesta
      const data = await response.json()
      
      if (data.errors > 0 ){
        console.log(data.errors)
        return
      }

      //Extraer todos los datos clave de cada DOCUMENTO
      //... es tambien el único documento que enviamos
      const primerDocumento = data.results.documents[0]
     
      //La empresa para la que desarrolla, solo quiere obtener las fechas
      primerDocumento.entities.forEach(documento =>{
        if (documento.category === 'DateTime'){
            console.log(documento)
        }
      })
      

    }catch(error){
        console.error(error.message)
    }
}

extraerDatos()