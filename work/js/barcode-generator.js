const dataInput = document.getElementById('barcodeDataInput');
const typeInput = document.getElementById('barcodeTypeInput');
const previewImage = document.getElementById('barcodeImage');
const printButton = document.getElementById('printButton');

// Create barcode API URL
function buildApiUrl(data, type) {
    type = type.trim().toLowerCase();
    if (type === 'qr') type = 'qr';
    else if (type === 'barcode' || type === '128') type = '128';
    else return null;
    return `https://barcodeapi.org/api/${type}/${encodeURIComponent(data)}?dpi=1000`;
}

// Update preview image and call API
function updatePreview() {
    let data = dataInput.value;
    let type = typeInput.value;

    const url = buildApiUrl(data, type);
    if (url) {
        // live fetch to update image (no-store disables cache)
        fetch(url, { cache: "no-store" })
            .then(response => response.blob())
            .then(blob => {
                previewImage.src = URL.createObjectURL(blob);
                previewImage.alt = `Barcode for ${data}`;
            })
            .catch(err => {
                console.error("Error fetching barcode:", err);
                previewImage.removeAttribute('src');
                previewImage.alt = "Error generating barcode";
            });
    } else {
        previewImage.removeAttribute('src');
        previewImage.alt = "Your barcode will appear here";
    }
}

// Do the preview change
[dataInput, typeInput].forEach(input => {
    input.addEventListener('input', updatePreview);
});

// Button to print the barcode
printButton.addEventListener('click', () => {
    let data = dataInput.value;
    let type = typeInput.value;

    const url = buildApiUrl(data, type);
    if (!url) return;

    fetch(url, { cache: "no-store" })
        .then(response => response.blob())
        .then(blob => {
            const objectUrl = URL.createObjectURL(blob);

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        body, html {
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            width: 100vw;
                        }
                        img {
                            max-width: 100%;
                            max-height: 100%;
                        }
                    </style>
                </head>
                <body>
                    <img src="${objectUrl}" alt="Barcode for ${data}">
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        });
});
