//Servicio FOUNDRY (ZURE) - OCULTAR DATOS SENSIBLES

const suscriptionKey = "4XDJfmEsGT8Xr1jEDMi1BKKgqIDyii8Lycj7CbO4WWS8JC5FjfBoJQQJ99CEAC1i4TkXJ3w3AAAAACOGP0kw"
const endpoint = "https://1552480-azure.services.ai.azure.com/"

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`

async function anonimizarDatos(){
    try{
        const texto = `Hola, mi nombre es Juan carlos Perez con DNI 45454646. Mi número es 987654321 y vivo en Av. Miraflores 748, Arequipa. Pueden escribirme a juancarlos@gmail.com `

        const documentoAnonimizar = {
         kind: 'PiiEntityRecognition',
         analysisInput: {
            documents: [{
                id: "1",
                language: "es",
                text: texto
        }]
      },
      parameters:{
        redactionPolicy:{
            policyKind: 'CharacterMask'
        }
      }
    }
    const response = await fetch (url,{
         method: 'POST',
        headers: {
            "Ocp-Apim-Subscription-Key": suscriptionKey,
            "Content-Type": "application/json"
            },
        body: JSON.stringify(documentoAnonimizar)
    })
    if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Error en: ${errorData.error.message}`)
        }
        const data = await response.json()

        if (data.results.errors.length > 0){
            console.error(data.results.errors) //mejorar
            return
        }
        const primerDocumento = data.results.documentos[0]
        console.log(primerDocumento.redactedText)
 }

    catch (error){
        console.error(error.message)
    }

}

anonimizarDatos()