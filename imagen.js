//Deteccion de imagenes
const suscriptionKey = "4vRW6Fsu8CIZrruXgM5W65Zmx2Y6PHI3yMcOoMhjW0PqspUkwcoyJQQJ99CEACZoyfiXJ3w3AAAFACOGCYCO"
const endpoint = "https://c1552480.cognitiveservices.azure.com/"

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`
const imageURL = `https://img.magnific.com/foto-gratis/hombre-morena-sobre-fondo-blanco-aislado_1368-4404.jpg?semt=ais_hybrid&w=740&q=80`

async function analizarImagen(){
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: imageURL })
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(`Error en: ${errorData.error.message}`)
        }

        //Logramos recibir un resultado favorable
        const data = await response.json();
        const confianza = (data.description.captions[0].confidence * 100).toFixed(2);

        //Muesta todos los datos
        //console.log(data.description)
        console.log("Descripción de la imagen:", data.description.captions[0].text);
        console.log("Confianza:", `${confianza}%`);
        //join metodo que itera y concatena valores de un array
        console.log("Etiquetas:", data.description.tags.join(", "));
    }catch(error){
        console.error(`Error analizando imagen: ${error.message}`)
    }
}


analizarImagen()