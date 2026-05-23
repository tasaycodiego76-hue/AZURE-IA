/* Archivo frontend para consumir la API de anonimización de datos sensibles de Azure */
document.addEventListener('DOMContentLoaded', () => {
    const btnAnonimizar = document.getElementById('btnAnonimizar');
    const textoInput = document.getElementById('textoInput');
    const loading = document.getElementById('loading');
    const cardResultados = document.getElementById('cardResultados');
    const alertaResultados = document.getElementById('alertaResultados');
    const txtOriginal = document.getElementById('txtOriginal');
    const txtAnonimizado = document.getElementById('txtAnonimizado');
    const entidadesBody = document.getElementById('entidadesBody');
    const tablaEntidades = document.getElementById('tablaEntidades');
    const sinEntidades = document.getElementById('sinEntidades');

    btnAnonimizar.addEventListener('click', async () => {
        const texto = textoInput.value.trim();

        if (!texto) {
            alert('Por favor, ingresa el texto que deseas anonimizar.');
            return;
        }

        loading.style.display = 'block';
        cardResultados.style.display = 'none';
        alertaResultados.innerHTML = '';
        entidadesBody.innerHTML = '';
        sinEntidades.style.display = 'none';
        tablaEntidades.style.display = 'table';

        try {
            // Paso 1 - Llamar a la API en nuestro backend
            const response = await fetch('/api/anonimizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto })
            });

            // Paso 2 - Recibir respuesta
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud');
            }

            // Paso 3 - Mostrar resultados
            txtOriginal.textContent = data.textoOriginal;
            txtAnonimizado.textContent = data.textoAnonimizado;

            // Tabla de entidades detectadas
            const entidades = data.entidadesDetectadas || [];

            if (entidades.length > 0) {
                entidades.forEach(entidad => {
                    const tr = document.createElement('tr');

                    const tdTexto = document.createElement('td');
                    tdTexto.textContent = entidad.text;

                    const tdCategoria = document.createElement('td');
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-danger';
                    badge.textContent = entidad.category;
                    tdCategoria.appendChild(badge);

                    const tdConfianza = document.createElement('td');
                    const porcentaje = (entidad.confidenceScore * 100).toFixed(2);
                    tdConfianza.textContent = `${porcentaje}%`;

                    tr.appendChild(tdTexto);
                    tr.appendChild(tdCategoria);
                    tr.appendChild(tdConfianza);

                    entidadesBody.appendChild(tr);
                });
            } else {
                tablaEntidades.style.display = 'none';
                sinEntidades.style.display = 'block';
            }

            alertaResultados.innerHTML = `<div class="alert alert-success">${data.mensaje}</div>`;
            cardResultados.style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            alertaResultados.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            cardResultados.style.display = 'block';
            tablaEntidades.style.display = 'none';
        } finally {
            loading.style.display = 'none';
        }
    });
});