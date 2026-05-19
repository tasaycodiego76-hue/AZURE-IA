document.addEventListener('DOMContentLoaded', () => {
    const btnAnalizar = document.getElementById('btnAnalizar');
    const textoInput = document.getElementById('textoInput');
    const loading = document.getElementById('loading');
    const cardResultados = document.getElementById('cardResultados');
    const resultadosBody = document.getElementById('resultadosBody');
    const alertaResultados = document.getElementById('alertaResultados');
    const tablaResultados = document.getElementById('tablaResultados');

    btnAnalizar.addEventListener('click', async () => {
        const textoBruto = textoInput.value.trim();
        
        if (!textoBruto) {
            alert('Por favor, ingresa al menos un texto para analizar.');
            return;
        }

        //Paso 1 - Separar el texto por líneas para enviar múltiples documentos
        const textosArray = textoBruto.split('\n').filter(linea => linea.trim() !== '');

        loading.style.display = 'block';
        cardResultados.style.display = 'none';
        alertaResultados.innerHTML = '';
        resultadosBody.innerHTML = '';
        tablaResultados.style.display = 'table';

        try {
            //Paso 2 - Llamar a la API en nuestro backend
            const response = await fetch('/api/sentimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ textos: textosArray })
            });

            //Paso 3 - Recibir Respuesta
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud');
            }

            //Renderizar los resultados
            data.resultados.forEach(res => {
                const tr = document.createElement('tr');
                
                const tdId = document.createElement('td');
                tdId.textContent = res.id;

                const tdTexto = document.createElement('td');
                tdTexto.textContent = res.texto;
                
                const tdSentimiento = document.createElement('td');
                const badge = document.createElement('span');
                
                // Darle color al badge según el sentimiento
                if (res.sentimiento === 'positive') {
                    badge.className = 'badge bg-success';
                } else if (res.sentimiento === 'negative') {
                    badge.className = 'badge bg-danger';
                } else if (res.sentimiento === 'neutral') {
                    badge.className = 'badge bg-secondary';
                } else {
                    badge.className = 'badge bg-warning text-dark';
                }
                
                badge.textContent = res.sentimiento.toUpperCase();
                tdSentimiento.appendChild(badge);
                
                const tdPositivo = document.createElement('td');
                tdPositivo.textContent = `${res.scores.positivo}%`;
                tdPositivo.className = 'text-success fw-bold';

                const tdNeutral = document.createElement('td');
                tdNeutral.textContent = `${res.scores.neutral}%`;
                tdNeutral.className = 'text-secondary fw-bold';

                const tdNegativo = document.createElement('td');
                tdNegativo.textContent = `${res.scores.negativo}%`;
                tdNegativo.className = 'text-danger fw-bold';

                tr.appendChild(tdId);
                tr.appendChild(tdTexto);
                tr.appendChild(tdSentimiento);
                tr.appendChild(tdPositivo);
                tr.appendChild(tdNeutral);
                tr.appendChild(tdNegativo);
                
                resultadosBody.appendChild(tr);
            });
            
            alertaResultados.innerHTML = `<div class="alert alert-success">${data.mensaje}</div>`;
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
