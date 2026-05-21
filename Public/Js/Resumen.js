/* Archivo frontend para consumir la API de resumen de textos de Azure */
document.addEventListener('DOMContentLoaded', () => {
    const btnResumير        = document.getElementById('btnResumير');
    const textoInput        = document.getElementById('textoInput');
    const contadorCaracteres = document.getElementById('contadorCaracteres');
    const loading           = document.getElementById('loading');
    const cardResultados    = document.getElementById('cardResultados');
    const alertaResultados  = document.getElementById('alertaResultados');
    const listaFrases       = document.getElementById('listaFrases');
    const totalFrases       = document.getElementById('totalFrases');

    // Contador de caracteres en tiempo real
    textoInput.addEventListener('input', () => {
        contadorCaracteres.textContent = `${textoInput.value.length} caracteres`;
    });

    btnResumير.addEventListener('click', async () => {
        const texto = textoInput.value.trim();

        if (!texto) {
            alert('Por favor, ingresa el texto que deseas resumir.');
            return;
        }

        // Limpiar resultados anteriores
        loading.style.display = 'block';
        cardResultados.style.display = 'none';
        alertaResultados.innerHTML = '';
        listaFrases.innerHTML = '';

        try {
            // Paso 1 - Llamar al backend
            const response = await fetch('/api/resumen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto })
            });

            // Paso 2 - Leer como texto para evitar error de parsing
            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`El servidor devolvió una respuesta inesperada (${response.status})`);
            }

            if (!response.ok) {
                throw new Error(data.error || `Error ${response.status}`);
            }

            // Paso 3 - Mostrar total de frases
            totalFrases.textContent = `${data.totalFrases} frase(s) extraída(s)`;

            // Paso 4 - Mostrar cada frase del resumen
            data.frases.forEach(frase => {
                const item = document.createElement('div');
                item.className = 'card mb-2';

                item.innerHTML = `
                    <div class="card-body py-2 px-3">
                        <div class="d-flex justify-content-between align-items-start gap-2">
                            <span class="badge bg-primary me-2" style="min-width:28px;">${frase.indice}</span>
                            <p class="mb-0 flex-grow-1">${frase.texto}</p>
                            <span class="badge bg-success ms-2 text-nowrap">Score: ${frase.rankScore}%</span>
                        </div>
                    </div>
                `;

                listaFrases.appendChild(item);
            });

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