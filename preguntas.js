//Servicio FOUNDRY (AZURE) - Responder Preguntas
const suscriptionKey =
  "";
const endpoint = "https://1552480-azure.services.ai.azure.com"

/* const URL = `${endpoint}/language/:query-knowledgebases?projectName=PruebaQA&api-version=2021-10-01`; */
const URL = `${endpoint}/language/:query-text?api-version=2021-10-01`;

async function responderPreguntas() {
  try {
    const contextoAnalizar = `El procesador es el componente que ejecuta todas las instrucciones del sistema operativo y las aplicaciones. Cada vez que abres un programa, guardas un archivo o navegas por internet, la CPU calcula los pasos necesarios para que eso ocurra. Los procesadores modernos tienen múltiples núcleos, lo que les permite atender varias tareas al mismo tiempo sin que una bloquee a las demás. Un procesador de cuatro núcleos puede manejar una videollamada, música en segundo plano y un documento abierto sin que el equipo se ralentice notablemente. Uno de ocho núcleos o más permite editar video, compilar código o correr simulaciones sin saturar el sistema. Las dos marcas principales en el mercado de consumo son Intel y AMD. Ambas ofrecen procesadores para uso cotidiano, trabajo profesional y gaming. La elección entre una y otra depende más del presupuesto y del uso específico que de una diferencia técnica absoluta. Un dato importante: si el procesador falla o está dañado, la computadora no puede encender, independientemente del estado de los demás componentes.`;

    const pregunta = `¿Qué permite hacer un procesador de ocho núcleos o más?`;

    //Version compacta de la peticion a los servicios de AZURE
    const cuerpoPeticion = {
      question: pregunta,
      records: [
        {
          id: "doc_01",
          text: contextoAnalizar,
        },
      ],
    };

    /* const cuerpoPeticion = {
      kind: "Conversation",
      analysisInput: {
        conversationItem: {
          id: "1",
          participantId: "usuario_final",
          text: pregunta,
        },
      },
      parameters: {
        projectName: 'PruebaQA',
        deploymentName: 'production',
        stringIndexType: 'Utf16CodeUnit',
        records: [{
            id: "contexto_01",
            text: contextoAnalizar
        }]
      },
    }; */

    console.log("Buscando respuesta en el Documento");

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpoPeticion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    const data = await response.json();
    //console.log(data)
    const respuesta = data.answers[0].answer
    const confianza = (data.answers[0].confidenceScore * 100).toFixed(2)
    console.log(`Respuesta: ${respuesta} | Confianza: ${confianza}%`)

  } catch (error) {
    console.error(error.message);
  }
}

responderPreguntas();