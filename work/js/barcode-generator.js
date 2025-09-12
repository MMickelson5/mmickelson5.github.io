const generateButton = document.getElementById('generateBarcodeButton');
const printButton = document.getElementById('printButton');


generateButton.addEventListener('click', () => {
    let data = document.getElementById('barcodeDataInput').value;
    let type = document.getElementById('barcodeTypeInput').value.trim().toLowerCase();

    if (type === 'qr') type = 'QRCode';
    else if (type === 'barcode') type = 'Code128';

    const url = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(data)}&code=${encodeURIComponent(type)}&translate-esc=on&dpi=300`;

    const src = url;
    const alt = `Barcode for ${data}`;

    document.getElementById('barcodeImage').src = src;
    document.getElementById('barcodeImage').alt = alt;
});

printButton.addEventListener('click', () => {
    let data = document.getElementById('barcodeDataInput').value;
    let type = document.getElementById('barcodeTypeInput').value.trim().toLowerCase();

    if (type === 'qr') type = 'QRCode';
    else if (type === 'barcode') type = 'Code128';

    const url = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(data)}&code=${encodeURIComponent(type)}&translate-esc=on&dpi=300&rotation=90`;

    const src = url;

    const alt = `Barcode for ${data}`;


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
            <img src="${src}" alt="${alt}">
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});