/* Archivo frontend para consumir la API de análisis de imágenes de Azure */
document.addEventListener('DOMContentLoaded', () => {
    const btnAnalizar = document.getElementById('btnAnalizar');
    const imageUrlInput = document.getElementById('imageUrlInput');
    const imagenPreview = document.getElementById('imagenPreview');
    const loading = document.getElementById('loading');
    const cardResultados = document.getElementById('cardResultados');
    const alertaResultados = document.getElementById('alertaResultados');
    const txtDescripcion = document.getElementById('txtDescripcion');
    const txtConfianza = document.getElementById('txtConfianza');
    const txtEtiquetas = document.getElementById('txtEtiquetas');
    const listaCategorias = document.getElementById('listaCategorias');
    const listaColores = document.getElementById('listaColores');

    btnAnalizar.addEventListener('click', async () => {
        const imageUrl = imageUrlInput.value.trim();

        if (!imageUrl) {
            alert('Por favor, ingresa la URL de la imagen a analizar.');
            return;
        }

        // Mostrar preview de la imagen antes de analizar
        imagenPreview.src = imageUrl;
        imagenPreview.style.display = 'block';
        imagenPreview.onerror = () => {
            imagenPreview.style.display = 'none';
        };

        loading.style.display = 'block';
        cardResultados.style.display = 'none';
        alertaResultados.innerHTML = '';

        try {
            // Paso 1 - Llamar a la API en nuestro backend
            const response = await fetch('/api/imagen', {
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

            // Paso 3 - Mostrar resultados
            txtDescripcion.textContent = data.descripcion;
            txtConfianza.textContent = data.confianza;

            // Etiquetas
            txtEtiquetas.innerHTML = '';
            if (data.etiquetas.length > 0) {
                data.etiquetas.forEach(tag => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-secondary me-1 mb-1';
                    badge.textContent = tag;
                    txtEtiquetas.appendChild(badge);
                });
            } else {
                txtEtiquetas.textContent = 'Sin etiquetas';
            }

            // Categorías
            listaCategorias.innerHTML = '';
            if (data.categorias.length > 0) {
                data.categorias.forEach(cat => {
                    const puntaje = (cat.score * 100).toFixed(2);
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `
                        ${cat.name}
                        <span class="badge bg-primary rounded-pill">${puntaje}%</span>
                    `;
                    listaCategorias.appendChild(li);
                });
            } else {
                listaCategorias.innerHTML = '<li class="list-group-item">Sin categorías detectadas</li>';
            }

            // Colores
            listaColores.innerHTML = '';
            const coloresDominantes = data.colores?.dominantColors || [];
            if (coloresDominantes.length > 0) {
                coloresDominantes.forEach(color => {
                    const badge = document.createElement('span');
                    badge.className = 'badge me-1 mb-1';
                    badge.style.backgroundColor = color;
                    badge.style.color = '#fff';
                    badge.style.border = '1px solid #ccc';
                    badge.textContent = color;
                    listaColores.appendChild(badge);
                });
            } else {
                listaColores.textContent = 'Sin colores detectados';
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