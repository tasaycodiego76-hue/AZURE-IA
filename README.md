# AZURE-IA - PROYECTO FINAL-ENTREGABLE

Aplicación web con Node.js y Express que integra múltiples servicios de **Azure AI** para procesamiento de lenguaje natural, visión por computadora y chatbot conversacional.

---

## Servicios integrados

- **Extracción de datos**: identifica entidades clave en un texto (personas, fechas, lugares, etc.)
- **Análisis de sentimientos**: detecta si un texto es positivo, negativo o neutral
- **Análisis de imágenes**: describe una imagen e identifica etiquetas, categorías y colores
- **Resumen**: genera un resumen automático de un texto largo
- **OCR**: extrae texto de cualquier imagen mediante URL
- **Analizar imagen**: detecta objetos y su ubicación dentro de una imagen
- **Anonimización**: detecta y oculta datos sensibles (PII) en un texto
- **Chatbot**: asistente conversacional con historial usando Azure OpenAI

---

## Procedimientos

### 1. Clonar el repositorio
```
git clone https://github.com/tasaycodiego76-hue/AZURE-IA.git
```

### 2. Cambiar a la rama del proyecto final
```
git switch PROYECTO-FINAL-AZURE
```

### 3. Instalar dependencias
```
npm install
```

### 4. Configurar el archivo .env
Crea un archivo `.env` en la raíz del proyecto y coloca tus credenciales de Azure:
```
# Servicios Azure AI (Lenguaje y Visión)
AZURE_CV_KEY=tu_clave_aqui
AZURE_CV_ENDPOINT=https://tu-recurso.services.ai.azure.com

# Azure OpenAI (Chatbot)
AZURE_OPENAI_KEY=tu_clave_aqui
AZURE_OPENAI_ENDPOINT=https://tu-recurso.openai.azure.com

PORT=3000
```

### 5. Iniciar el servidor
```
node server.js
```

### 6. Abrir en el navegador
```
http://localhost:3000
```

---

## Uso

1. En la pantalla principal selecciona un servicio
2. Ingresa el texto o URL de imagen según el servicio
3. Haz clic en el botón para analizar
4. El resultado se muestra en pantalla
5. El chatbot flotante está disponible en todas las vistas

---

## Estructura del Proyecto

```
AZURE-IA/
├── Controllers/
│   ├── AnalisisController.js       → Análisis de imágenes con Azure Vision
│   ├── AnonimizarController.js     → Anonimización de datos sensibles (PII)
│   ├── ChatController.js           → Chatbot conversacional con Azure OpenAI
│   ├── ExtraccionController.js     → Extracción de entidades en texto
│   ├── ImagenController.js         → Detección de objetos en imagen
│   ├── OcrController.js            → Extracción de texto con Azure OCR
│   ├── ResumenController.js        → Resumen automático de texto
│   └── SentimientosController.js   → Análisis de sentimientos
├── Routes/
│   ├── analisis.js                 → Ruta POST /api/analisis
│   ├── anonimizar.js               → Ruta POST /api/anonimizar
│   ├── chat.js                     → Ruta POST /api/chat
│   ├── extraccion.js               → Ruta POST /api/extraccion
│   ├── imagen.js                   → Ruta POST /api/imagen
│   ├── ocr.js                      → Ruta POST /api/ocr
│   ├── resumen.js                  → Ruta POST /api/resumen
│   └── sentimientos.js             → Ruta POST /api/sentimientos
├── Public/
│   ├── Css/
│   │   └── Chat.css                → Estilos del widget chatbot
│   ├── Js/
│   │   ├── Analisis.js             → Lógica frontend análisis de imágenes
│   │   ├── Anonimizar.js           → Lógica frontend anonimización
│   │   ├── Chat.js                 → Lógica frontend chatbot flotante
│   │   ├── Extraccion.js           → Lógica frontend extracción
│   │   ├── Imagen.js               → Lógica frontend detección de objetos
│   │   ├── Ocr.js                  → Lógica frontend OCR
│   │   ├── Resumen.js              → Lógica frontend resumen
│   │   └── Sentimientos.js         → Lógica frontend sentimientos
│   ├── analisis.html               → Vista análisis de imágenes
│   ├── anonimizar.html             → Vista anonimización
│   ├── extraccion.html             → Vista extracción de datos
│   ├── imagen.html                 → Vista detección de objetos
│   ├── index.html                  → Menú principal
│   ├── ocr.html                    → Vista OCR
│   ├── resumen.html                → Vista resumen
│   └── sentimientos.html           → Vista sentimientos
├── Services/                       → Scripts de prueba desarrollados en clase
├── .env                            → Variables de entorno
├── .gitignore
├── package.json
└── server.js                       → Servidor Express principal
```

---

## Carpeta Services

Contiene los scripts individuales desarrollados en clase para probar cada servicio
de Azure directamente desde Node.js con `console.log`.

Ejecutar cualquiera con:
```
node Services/extraccion.js  # Ejemplo
```

---

## Tecnologías

```
Node.js                        - Entorno de ejecución
Express                        - Framework backend
Azure AI Language              - Extracción, sentimientos, resumen, anonimización
Azure Computer Vision          - Análisis de imágenes y OCR
Azure OpenAI                   - Chatbot conversacional (GPT)
Bootstrap 5                    - Estilos del frontend
dotenv                         - Manejo de variables de entorno
```