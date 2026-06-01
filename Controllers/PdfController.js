/* Este servicio permite analizar un archivo PDF (factura) usando Azure Form Recognizer
   Soporta PDF por URL pública o PDF local enviado como octet-stream
*/
const suscriptionKey = process.env.AZURE_CV_KEY;
const endpoint = process.env.AZURE_CV_ENDPOINT;
const modelId = 'prebuilt-invoice';
const url = `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

//Paso 1 - Enviar el documento a Azure para iniciar el análisis
async function subirDocumento(body, esArchivo = false) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': suscriptionKey,
            'Content-Type': esArchivo ? 'application/octet-stream' : 'application/json'
        },
        body: esArchivo ? body : JSON.stringify({ urlSource: body })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error de Azure: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const operationLocation = response.headers.get('Operation-Location');
    if (!operationLocation) throw new Error('Azure no retornó la URL de seguimiento.');
    return operationLocation;
}

//Paso 2 - Consultar el resultado hasta que esté listo (RECURSIVIDAD)
async function analizarDocumento(operationLocation) {
    const response = await fetch(operationLocation, {
        method: 'GET',
        headers: { 'Ocp-Apim-Subscription-Key': suscriptionKey }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al consultar: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();

    if (data.status === 'running' || data.status === 'notStarted') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return analizarDocumento(operationLocation); // RECURSIVIDAD metodoA -> metodoA
    }

    if (data.status === 'succeeded') return data.analyzeResult;

    throw new Error(`Análisis fallido: ${data.error?.message || 'Error desconocido'}`);
}

//Extrae el valor legible de un campo de Azure
function extraerValor(campo) {
    if (!campo) return null;
    if (campo.valueString !== undefined) return campo.valueString;
    if (campo.valueNumber !== undefined) return campo.valueNumber;
    if (campo.valueDate !== undefined) return campo.valueDate;
    if (campo.valueCurrency !== undefined) {
        const c = campo.valueCurrency;
        return `${c.currencySymbol || ''}${c.amount}`;
    }
    if (campo.valueAddress !== undefined) {
        const a = campo.valueAddress;
        return [a.streetAddress, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(', ');
    }
    if (campo.content !== undefined) return campo.content;
    return null;
}

//Arma la respuesta final con los campos extraídos
function construirRespuesta(analyzeResult) {
    const campos = analyzeResult.documents?.[0]?.fields || {};

    const factura = {
        proveedor:          extraerValor(campos.VendorName),
        direccionProveedor: extraerValor(campos.VendorAddress),
        cliente:            extraerValor(campos.CustomerName),
        direccionCliente:   extraerValor(campos.CustomerAddress),
        numeroFactura:      extraerValor(campos.InvoiceId),
        fechaFactura:       extraerValor(campos.InvoiceDate),
        fechaVencimiento:   extraerValor(campos.DueDate),
        subtotal:           extraerValor(campos.SubTotal),
        impuesto:           extraerValor(campos.TotalTax),
        total:              extraerValor(campos.InvoiceTotal),
        moneda:             extraerValor(campos.CurrencyCode),
        condicionesPago:    extraerValor(campos.PaymentTerm),
    };

    const items = (campos.Items?.valueArray || []).map(item => {
        const f = item.valueObject || {};
        return {
            descripcion:    extraerValor(f.Description),
            cantidad:       extraerValor(f.Quantity),
            precioUnitario: extraerValor(f.UnitPrice),
            total:          extraerValor(f.Amount),
        };
    }).filter(i => i.descripcion || i.total);

    return { factura, items };
}

//Controlador: PDF por URL pública
exports.analizarPorUrl = async (req, res) => {
    try {
        const { urlDocumento } = req.body;
        if (!urlDocumento) return res.status(400).json({ error: "Por favor proporciona el campo 'urlDocumento'." });

        const operationLocation = await subirDocumento(urlDocumento, false);
        const analyzeResult = await analizarDocumento(operationLocation);
        const { factura, items } = construirRespuesta(analyzeResult);

        return res.json({ mensaje: 'PDF analizado con éxito', factura, items });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

//Controlador: PDF local (octet-stream, sin multer)
exports.analizarPorArchivo = async (req, res) => {
    try {
        if (!req.body || req.headers['content-type'] !== 'application/octet-stream') {
            return res.status(400).json({ error: 'Se requiere el PDF como octet-stream.' });
        }

        const operationLocation = await subirDocumento(req.body, true);
        const analyzeResult = await analizarDocumento(operationLocation);
        const { factura, items } = construirRespuesta(analyzeResult);

        return res.json({ mensaje: 'PDF analizado con éxito', factura, items });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};