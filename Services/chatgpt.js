
const AZURE_ENDPOITN =`https://1552480-azure-ia.openai.azure.com` 
const DEPLYMENT_NAME= `gpt-5.4-mini`
const API_KEY=``
const API_VERSION=`2025-04-01-preview`

async function preguntarAzure(pregunta = ``, historial=[]){

    //EndPoint Final
    const url = `${AZURE_ENDPOITN}/openai/deployments/${DEPLYMENT_NAME}/chat/completions?api-version=${API_VERSION}`

    //Objeto conteniendo informacion BODY
    const body ={
        messages: [
         {role:"system", content: "Eres un asistente util"},
         ...historial,
         {role:"user", content: pregunta}
        ],
        max_completion_tokens: 800,
        temperature: 0.7
    }

    const response = await fetch (url,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "api-key"     : API_KEY
        },
        body: JSON.stringify(body)
    })
    if(!response.ok){
        console.error('No se accedió al servicio')
        return;
    }
    const data = await response.json()
    const mensaje = data.choices[0].message

    return{
        respuesta: mensaje.content,
        tokens_usados: data.usage.total_tokens,
        nuevo_historial: [...historial,{role:'user', content :pregunta}, mensaje]
    }
}

//Prepara un BATCH (lote) de preguntas que estarán relacionadas
async function test(){

    let historial = []

    //¿QUIEN ES GOKU?
    console.log('---Pregunta 1---')
    let r1 = await preguntarAzure('¿Quien es goku? dame una respuesta corta')
    console.log(r1.respuesta)
    historial = r1.nuevo_historial
    //'¿COMO SE LLAMAN SUS HIJOS?
    console.log('---Pregunta 2---')
    let r2 = await preguntarAzure('¿y como se llaman sus hijos?', historial)
    console.log(r2.respuesta)
    historial = r2.nuevo_historial
    //Y QUIEN ES EL MAS PODEROSO?
    console.log('---Pregunta 3---')
    let r3 = await preguntarAzure('¿y cual de los dos es mas fuerte?', historial)
    console.log(r3.respuesta)
    historial = r3.nuevo_historial

    console.log(`---tokens utilizados:${r3.tokens_usados}`)
}
test()