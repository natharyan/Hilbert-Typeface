var maxLength = calculateMaxAllowedChars();
var key;
let buttonCard;

function calculateMaxAllowedChars() {
    const fontSize = window.innerHeight / 6;
    const maxHeight = window.innerHeight;
    const rows = 5;
    const charsPerRow = 10;
    const totalChars = rows * charsPerRow;
    return totalChars;
}

function updateCharCount(event) {
    const contentInput = event.target;
    const currentLength = contentInput.value.length;
    const remainingChars = maxLength - currentLength;
    const charCountMessage = document.getElementById('char-count-message');

    if (remainingChars >= 0) {
        charCountMessage.textContent = `${remainingChars} characters remaining`;
        charCountMessage.classList.remove('exceeded');
    } else {
        charCountMessage.textContent = `Exceeded by ${Math.abs(remainingChars)} characters`;
        charCountMessage.classList.add('exceeded');
    }
}

document.getElementById('black-button').addEventListener('click', function() {
    var popoverContainer = document.createElement('div');
    popoverContainer.id = 'pdf-popover';
    popoverContainer.style.position = 'fixed';
    popoverContainer.style.top = '50%';
    popoverContainer.style.right = '50px';
    popoverContainer.style.transform = 'translateY(-50%)';
    popoverContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    popoverContainer.style.padding = '20px';
    popoverContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    popoverContainer.style.zIndex = '2';
    popoverContainer.style.overflowY = 'auto';
    popoverContainer.style.maxHeight = '80vh';
    popoverContainer.style.width = '480px';
    
    var closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#000';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 15px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '2px';
    closeButton.style.fontFamily = "'Space Mono', monospace";
    closeButton.style.marginTop = '10px';
    closeButton.addEventListener('click', function() {
        popoverContainer.remove();
    });
    
    popoverContainer.appendChild(closeButton);
    
    var pdfViewer = document.createElement('iframe');
    pdfViewer.src = 'Aryan_Nath_Resume_1_copy.pdf';
    pdfViewer.style.width = '100%';
    pdfViewer.style.height = '600px';
    popoverContainer.appendChild(pdfViewer);
    document.body.appendChild(popoverContainer);
});

window.onload = () => {
    const contentInput = document.getElementById('content');
    contentInput.addEventListener('input', updateCharCount);
    updateCharCount({ target: contentInput });
};

async function handleSubmit(event) {
    event.preventDefault();
    const content = document.getElementById('content').value;
    const fontColor = document.getElementById('fontcolor').value;
    const bgColor = document.getElementById('bgcolor').value;
    await createmyImage(content, fontColor, bgColor);
    displaySavedImage();
}

async function createmyImage(content, fontColor, bgColor) {
    console.log(content, fontColor, bgColor); 
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerHeight;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const fontSize = canvas.width/6;
        const fontFamily = 'hilbertfont-Regular';

        const font = new FontFace('hilbertfont-Regular', `url('./hilbertfont-Regular.ttf')`);
        font.load().then(async (loadedFont) => {
            document.fonts.add(loadedFont);
            await document.fonts.ready;

            ctx.fillStyle = fontColor;
            ctx.font = `${fontSize}px ${fontFamily}`;
            const maxWidth = canvas.width - 40;
            let y = fontSize + 5;
            let words = content.split(' ');
            let line = '';
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let testWidth = ctx.measureText(testLine).width;
                if (testWidth > maxWidth && i > 0) {
                    ctx.fillText(line, 20, y);
                    line = words[i] + ' ';
                    y += fontSize + 10;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, 20, y);

            const imgData = canvas.toDataURL('image/png');
            key = 'hilbertImage';
            // Save the image data to local storage
            localStorage.setItem(key, imgData);
            
            resolve();
        }).catch((error) => {
            console.error('Failed to load font:', error);
            reject(error);
        });
    });
}

function displaySavedImage() {
    const imgData = localStorage.getItem(key);
    if (imgData) {
        const renderimg = new Event('render');
        document.dispatchEvent(renderimg);
        const formcard = document.getElementById('form-card');
        formcard.remove();
        const blackButton = document.getElementById('black-button');
        blkbtnstore = blackButton;
        const infocard = document.getElementById('button-card');
        const pdfpopover = document.getElementById('pdf-popover');

        const downloadButton = document.createElement('dwnld-button');
        downloadButton.innerHTML = '&#x2B07; Download Image';
        downloadButton.style.backgroundColor = '#000';
        downloadButton.style.color = '#fff';
        downloadButton.style.border = 'none';
        downloadButton.style.padding = '7px 7px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.borderRadius = '2px';
        downloadButton.style.fontFamily = "'Space Mono', monospace";
        downloadButton.style.fontSize = '14px';
        downloadButton.style.margin = '10px';
        downloadButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        downloadButton.addEventListener('click', function() {
            downloadCanvasAsPNG();
        });

        const refreshButton = document.createElement('rfresh-button');
        refreshButton.innerHTML = 'Refresh';
        refreshButton.style.backgroundColor = '#000';
        refreshButton.style.color = '#fff';
        refreshButton.style.border = 'none';
        refreshButton.style.padding = '7px 7px';
        refreshButton.style.cursor = 'pointer';
        refreshButton.style.borderRadius = '2px';
        refreshButton.style.fontFamily = "'Space Mono', monospace";
        refreshButton.style.fontSize = '14px';
        refreshButton.style.margin = '10px';
        refreshButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        refreshButton.addEventListener('click', function() {
            location.reload();
        });

        blackButton.remove();
        infocard.appendChild(downloadButton);
        infocard.appendChild(document.createElement('br'));
        infocard.appendChild(document.createElement('br'));
        infocard.appendChild(refreshButton);
        pdfpopover.remove();

        document.body.appendChild(buttonCard);
    } else {
        console.error('No image found in local storage.');
    }
}
function downloadCanvasAsPNG() {
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'name.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}