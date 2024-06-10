document.addEventListener('DOMContentLoaded', () => {
    const descriptionInput = document.getElementById('descriptionInput');
    const generateButton = document.getElementById('generateButton');
    const imageContainer = document.getElementById('imageContainer');
    const downloadButton = document.getElementById('downloadButton');
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementsByClassName('close')[0];

    const apiKey = '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'; // Tu API Key de Hugging Face

    generateButton.addEventListener('click', () => {
        const description = descriptionInput.value;
        if (description) {
            generateImage(description);
        } else {
            alert('Por favor, ingrese una descripción.');
        }
    });

    downloadButton.addEventListener('click', downloadImage);

    function openModal() {
        modal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    async function generateImage(description) {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: description })
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const data = await response.json();
                console.log(data); // Registra los metadatos del modelo en la consola para verificar
                alert('Respuesta inesperada: Se obtuvo información sobre el modelo pero no se generó ninguna imagen. Verifica tu solicitud.');
            } else {
                const blob = await response.blob(); // Convertir la respuesta en un Blob
                const imgUrl = URL.createObjectURL(blob); // Crear una URL para el Blob
                displayImage(imgUrl);
            }
        } catch (error) {
            alert('Error al conectar con el servicio de IA.');
            console.error(error);
        }
    }

    function displayImage(url) {
        imageContainer.innerHTML = `<img src="${url}" alt="Generated Image">`;
        downloadButton.setAttribute('href', url);
        openModal();
    }

    function downloadImage() {
        const url = downloadButton.getAttribute('href');
        const link = document.createElement('a');
        link.download = 'generated-image.png';
        link.href = url;
        link.click();
    }
});
