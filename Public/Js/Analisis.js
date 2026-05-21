/* Archivo frontend para consumir la API de análisis de imágenes de Azure */
document.addEventListener('DOMContentLoaded', () => {
    const btnAnalizar = document.getElementById('btnAnalizar');
    const imageUrlInput = document.getElementById('imageUrlInput');
    const imagenPrevia = document.getElementById('imagenPrevia');
    const loading = document.getElementById('loading');
    const cardResultados = document.getElementById('cardResultados');
    const alertaResultados = document.getElementById('alertaResultados');

    // Secciones de resultados
    const seccionDescripcion = document.getElementById('seccionDescripcion');
    const textoDescripcion = document.getElementById('textoDescripcion');
    const confianzaDescripcion = document.getElementById('confianzaDescripcion');

    const tablaEtiquetasBody = document.getElementById('tablaEtiquetasBody');
    const tablaObjetosBody = document.getElementById('tablaObjetosBody');

    // Preview de imagen al escribir la URL
    imageUrlInput.addEventListener('input', () => {
        const url = imageUrlInput.value.trim();
        if (url) {
            imagenPrevia.src = url;
            imagenPrevia.style.display = 'block';
            imagenPrevia.onerror = () => {
                imagenPrevia.style.display = 'none';
            };
        } else {
            imagenPrevia.style.display = 'none';
        }
    });

    btnAnalizar.addEventListener('click', async () => {
        const imageUrl = imageUrlInput.value.trim();

        if (!imageUrl) {
            alert('Por favor, ingresa la URL de la imagen a analizar.');
            return;
        }

        // Limpiar resultados anteriores
        loading.style.display = 'block';
        cardResultados.style.display = 'none';
        alertaResultados.innerHTML = '';
        tablaEtiquetasBody.innerHTML = '';
        tablaObjetosBody.innerHTML = '';

        try {
            // Paso 1 - Llamar al backend
            const response = await fetch('/api/analisis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageUrl })
            });

            // Paso 2 - Recibir respuesta
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud');
            }

            // Paso 3 - Mostrar descripción
            textoDescripcion.textContent = data.descripcion.texto;
            confianzaDescripcion.textContent = `${data.descripcion.confianza}%`;

            // Paso 4 - Mostrar etiquetas
            if (data.etiquetas.length > 0) {
                data.etiquetas.forEach(etiqueta => {
                    const tr = document.createElement('tr');

                    const tdNombre = document.createElement('td');
                    tdNombre.textContent = etiqueta.nombre;

                    const tdConfianza = document.createElement('td');
                    tdConfianza.textContent = `${etiqueta.confianza}%`;

                    tr.appendChild(tdNombre);
                    tr.appendChild(tdConfianza);
                    tablaEtiquetasBody.appendChild(tr);
                });
            } else {
                tablaEtiquetasBody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Sin etiquetas detectadas</td></tr>';
            }

            // Paso 5 - Mostrar objetos con ubicación
            if (data.objetos.length > 0) {
                data.objetos.forEach(obj => {
                    const tr = document.createElement('tr');

                    const tdNombre = document.createElement('td');
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-primary';
                    badge.textContent = obj.nombre;
                    tdNombre.appendChild(badge);

                    const tdConfianza = document.createElement('td');
                    tdConfianza.textContent = `${obj.confianza}%`;

                    const tdUbicacion = document.createElement('td');
                    tdUbicacion.innerHTML = `<code>x:${obj.x} y:${obj.y} | ${obj.ancho}x${obj.alto}px</code>`;

                    tr.appendChild(tdNombre);
                    tr.appendChild(tdConfianza);
                    tr.appendChild(tdUbicacion);
                    tablaObjetosBody.appendChild(tr);
                });
            } else {
                tablaObjetosBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Sin objetos detectados</td></tr>';
            }

            alertaResultados.innerHTML = `<div class="alert alert-success">${data.mensaje}</div>`;
            cardResultados.style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            alertaResultados.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            cardResultados.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    });
});