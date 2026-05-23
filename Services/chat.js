/*
Utiliza LLM phi de Microsfoft
Requiere la activacion de Microsoft.Web (Suscripcion > Configuracion > Proveedores de recurso)
*/ 
 //Datos de acceso

const endPointURL = ``
const token=``


async function enviarPreguntar(pregunta = ``){
    pregunta += ', dame una respuesta corta'

    const configuracion= {
    model: 'Phi-4',
    messages:[
        {role: 'user', content: pregunta}
    ]
}

    const response = await fetch(endPointURL,{
     method: 'POST',
     headers:{
        'Authorization':`Bearer ${token}`,
        'Content-Type':`application/json`
    },
    body: JSON.stringify(configuracion)
    })
    if (!response.ok){
        console.error('No se pudo acceder al servicio')
        return
    }

    const data = await response.json()
    //console.log(`Respuesta completa: ${data}`)
    if (data.choices && data.choices.length > 0){
        console.log(`Respuesta corta: ${data.choices[0].message.content}`)
    }else{
        console.log(`No se encontro contenido para la respuesta`)
    }
}


enviarPreguntar(`¿Quién descubrió America?`)