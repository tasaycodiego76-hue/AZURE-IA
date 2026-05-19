/* Archivo frontend para consumir la API de extracción de datos de Azure */
document.addEventListener('DOMContentLoaded', () => {
    const btnAnalizar = document.getElementById('btnAnalizar');
    const textoInput = document.getElementById('textoInput');
    const loading = document.getElementById('loading');
    const cardResultados = document.getElementById('cardResultados');
    const resultadosBody = document.getElementById('resultadosBody');
    const alertaResultados = document.getElementById('alertaResultados');
    const sinResultados = document.getElementById('sinResultados');
    const tablaResultados = document.getElementById('tablaResultados');

    btnAnalizar.addEventListener('click', async () => {
        let texto = textoInput.value.trim();
        if (!texto) {
            alert('Por favor, ingresa el texto que deseas analizar.');
            return;
        }

        const categoriasCheckboxes = document.querySelectorAll('.categoria-check:checked');
        const categoriasSeleccionadas = Array.from(categoriasCheckboxes).map(cb => cb.value);

        if (categoriasSeleccionadas.length === 0) {
            alert('Por favor selecciona al menos una categoría.');
            return;
        }

        loading.style.display = 'block';
        cardResultados.style.display = 'none';
        alertaResultados.innerHTML = '';
        resultadosBody.innerHTML = '';
        sinResultados.style.display = 'none';
        tablaResultados.style.display = 'table';

        try {
            //Paso 1 - Llamar a la API en nuestro backend
            const response = await fetch('/api/extraccion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto })
            });

            //Paso 2 - Recibir Respuesta
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud');
            }

            //Paso 3 - Filtrar según las categorías seleccionadas por el usuario
            const entidades = data.todasLasEntidades || [];
            const entidadesFiltradas = entidades.filter(entidad => categoriasSeleccionadas.includes(entidad.category));

            if (entidadesFiltradas.length > 0) {
                entidadesFiltradas.forEach(entidad => {
                    const tr = document.createElement('tr');
                    
                    const tdTexto = document.createElement('td');
                    tdTexto.textContent = entidad.text;
                    
                    const tdCategoria = document.createElement('td');
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-primary';
                    badge.textContent = entidad.category;
                    tdCategoria.appendChild(badge);
                    
                    const tdConfianza = document.createElement('td');
                    const porcentaje = (entidad.confidenceScore * 100).toFixed(2);
                    tdConfianza.textContent = `${porcentaje}%`;

                    tr.appendChild(tdTexto);
                    tr.appendChild(tdCategoria);
                    tr.appendChild(tdConfianza);
                    
                    resultadosBody.appendChild(tr);
                });
                
                alertaResultados.innerHTML = `<div class="alert alert-success">${data.mensaje}</div>`;
            } else {
                tablaResultados.style.display = 'none';
                sinResultados.style.display = 'block';
            }

            cardResultados.style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            alertaResultados.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            cardResultados.style.display = 'block';
            tablaResultados.style.display = 'none';
        } finally {
            loading.style.display = 'none';
        }
    });
});
