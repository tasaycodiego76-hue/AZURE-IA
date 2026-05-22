/* Archivo frontend para consumir OCR de Azure */

const imageUrlInput = document.getElementById('imageUrl')
const resultado = document.getElementById('resultado')
const listaTexto = document.getElementById('listaTexto')
const totalLineas = document.getElementById('totalLineas')

const errorDiv = document.getElementById('error')
const loading = document.getElementById('loading')

/* Vista previa de imagen */
function previsualizarImagen(url) {

    const preview = document.getElementById('preview')
    const imgPreview = document.getElementById('imgPreview')

    if (url.trim() === '') {
        preview.classList.add('d-none')
        return
    }

    imgPreview.src = url
    preview.classList.remove('d-none')
}

/* Función principal OCR */
async function analizarOCR() {

    //Paso 1 - Obtener URL
    const imageUrl = imageUrlInput.value.trim()

    //Paso 2 - Validar URL
    if (!imageUrl) {
        alert('Por favor ingresa una URL de imagen')
        return
    }

    //Paso 3 - Resetear interfaz
    resultado.classList.add('d-none')
    errorDiv.classList.add('d-none')
    listaTexto.innerHTML = ''

    //Paso 4 - Mostrar loading
    loading.classList.remove('d-none')

    try {

        //Paso 5 - Llamar backend
        const response = await fetch('/api/ocr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageUrl
            })
        })

        //Paso 6 - Obtener respuesta
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error analizando imagen')
        }

        //Paso 7 - Mostrar total de líneas
        totalLineas.textContent = data.totalLineas

        //Paso 8 - Mostrar texto detectado
        if (data.textosDetectados.length > 0) {

            data.textosDetectados.forEach(item => {

                const li = document.createElement('li')

                li.className = 'list-group-item'

                li.textContent = item.texto

                listaTexto.appendChild(li)

            })

        } else {

            listaTexto.innerHTML = `
                <li class="list-group-item text-muted">
                    No se detectó texto en la imagen
                </li>
            `
        }

        //Paso 9 - Mostrar resultados
        resultado.classList.remove('d-none')

    } catch (error) {

        console.error(error)

        //Paso 10 - Mostrar error
        errorDiv.textContent = error.message
        errorDiv.classList.remove('d-none')

    } finally {

        //Paso 11 - Ocultar loading
        loading.classList.add('d-none')

    }
}