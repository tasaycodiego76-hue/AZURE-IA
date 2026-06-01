/* Archivo frontend para consumir la API de análisis de PDF */
document.addEventListener('DOMContentLoaded', () => {
    const tabUrl = document.getElementById('tabUrl');
    const tabArchivo = document.getElementById('tabArchivo');
    const panelUrl = document.getElementById('panelUrl');
    const panelArchivo = document.getElementById('panelArchivo');
    const urlInput = document.getElementById('urlInput');
    const archivoInput = document.getElementById('archivoInput');
    const nombreArchivo = document.getElementById('nombreArchivo');
    const btnAnalizar = document.getElementById('btnAnalizar');
    const loading = document.getElementById('loading');
    const cardResultados = document.getElementById('cardResultados');
    const alertaResultados = document.getElementById('alertaResultados');
    const datosFactura = document.getElementById('datosFactura');
    const seccionItems = document.getElementById('seccionItems');
    const itemsBody = document.getElementById('itemsBody');

    let modoActual = 'url';

    // Cambio de tabs
    tabUrl.addEventListener('click', () => {
        modoActual = 'url';
        tabUrl.classList.add('active');
        tabArchivo.classList.remove('active');
        panelUrl.style.display = 'block';
        panelArchivo.style.display = 'none';
    });

    tabArchivo.addEventListener('click', () => {
        modoActual = 'archivo';
        tabArchivo.classList.add('active');
        tabUrl.classList.remove('active');
        panelArchivo.style.display = 'block';
        panelUrl.style.display = 'none';
    });

    // Mostrar nombre del archivo seleccionado
    archivoInput.addEventListener('change', () => {
        nombreArchivo.textContent = archivoInput.files.length > 0
            ? archivoInput.files[0].name
            : 'Ningún archivo seleccionado';
    });

    btnAnalizar.addEventListener('click', async () => {
        loading.style.display = 'block';
        cardResultados.style.display = 'none';
        alertaResultados.innerHTML = '';
        datosFactura.innerHTML = '';
        itemsBody.innerHTML = '';
        seccionItems.style.display = 'none';

        try {
            let endpoint, fetchOptions;

            if (modoActual === 'url') {
                const urlDocumento = urlInput.value.trim();
                if (!urlDocumento) {
                    alert('Por favor ingresa la URL del documento PDF.');
                    loading.style.display = 'none';
                    return;
                }

                //Paso 1 - Llamar a la API con URL
                endpoint = '/api/pdf/url';
                fetchOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ urlDocumento })
                };

            } else {
                if (!archivoInput.files.length) {
                    alert('Por favor selecciona un archivo PDF.');
                    loading.style.display = 'none';
                    return;
                }

                //Paso 1 - Leer el archivo como ArrayBuffer y enviarlo como octet-stream
                const archivo = archivoInput.files[0];
                const buffer = await archivo.arrayBuffer();

                endpoint = '/api/pdf/archivo';
                fetchOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/octet-stream' },
                    body: buffer
                };
            }

            //Paso 2 - Recibir respuesta
            const response = await fetch(endpoint, fetchOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud');
            }

            //Paso 3 - Renderizar resultados
            const { factura, items, mensaje } = data;

            alertaResultados.innerHTML = `<div class="alert alert-success">${mensaje}</div>`;

            const campos = [
                { etiqueta: 'Proveedor',            valor: factura.proveedor },
                { etiqueta: 'Direccion Proveedor',  valor: factura.direccionProveedor },
                { etiqueta: 'Cliente',              valor: factura.cliente },
                { etiqueta: 'Direccion Cliente',    valor: factura.direccionCliente },
                { etiqueta: 'Numero de Factura',    valor: factura.numeroFactura },
                { etiqueta: 'Fecha de Factura',     valor: factura.fechaFactura },
                { etiqueta: 'Fecha de Vencimiento', valor: factura.fechaVencimiento },
                { etiqueta: 'Subtotal',             valor: factura.subtotal },
                { etiqueta: 'Impuesto',             valor: factura.impuesto },
                { etiqueta: 'Total',                valor: factura.total },
                { etiqueta: 'Moneda',               valor: factura.moneda },
                { etiqueta: 'Condiciones de Pago',  valor: factura.condicionesPago },
            ];

            campos.forEach(({ etiqueta, valor }) => {
                if (!valor) return;
                const tr = document.createElement('tr');

                const tdEtiqueta = document.createElement('td');
                tdEtiqueta.className = 'fw-semibold text-muted';
                tdEtiqueta.textContent = etiqueta;

                const tdValor = document.createElement('td');
                tdValor.textContent = valor;

                tr.appendChild(tdEtiqueta);
                tr.appendChild(tdValor);
                datosFactura.appendChild(tr);
            });

            if (items && items.length > 0) {
                items.forEach(item => {
                    const tr = document.createElement('tr');

                    const tdDesc = document.createElement('td');
                    tdDesc.textContent = item.descripcion || '-';

                    const tdCant = document.createElement('td');
                    tdCant.className = 'text-center';
                    tdCant.textContent = item.cantidad || '-';

                    const tdPrecio = document.createElement('td');
                    tdPrecio.className = 'text-end';
                    tdPrecio.textContent = item.precioUnitario || '-';

                    const tdTotal = document.createElement('td');
                    tdTotal.className = 'text-end';
                    tdTotal.textContent = item.total || '-';

                    tr.appendChild(tdDesc);
                    tr.appendChild(tdCant);
                    tr.appendChild(tdPrecio);
                    tr.appendChild(tdTotal);
                    itemsBody.appendChild(tr);
                });
                seccionItems.style.display = 'block';
            }

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