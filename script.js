var maxLength = calculateMaxAllowedChars();
var key;

window.addEventListener('DOMContentLoaded', (event) => {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    const overlayText = document.createElement('div');
    overlayText.classList.add('overlay-text');
    overlayText.textContent = 'landscape mode is recommended';
    overlay.appendChild(overlayText);
    document.body.appendChild(overlay);
  
    const checkWindowSize = () => {
      if (window.innerWidth < 768) {
        overlay.style.display = 'flex';
      } else {
        overlay.style.display = 'none';
      }
    };
  
    window.addEventListener('resize', checkWindowSize);
    window.addEventListener('orientationchange', checkWindowSize); // Listen for orientation changes
    checkWindowSize();
  });  

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
    } else {
        console.error('No image found in local storage.');
    }
}
