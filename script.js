// if (fileName) {
//   // Call hilbert_render.js with the new filename
//   hilbertRender(fileName);
// } else {
//   console.error('Failed to create image');
// }


async function handleSubmit(event) {
    event.preventDefault();
    
    const content = document.getElementById('content').value;
    const fontColor = document.getElementById('fontcolor').value;
    const bgColor = document.getElementById('bgcolor').value;
    const fileName = await createmyImage(content, fontColor, bgColor);
    
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

        const fontSize = 70;
        const fontFamily = 'hilbertfont-Regular';

        const font = new FontFace('hilbertfont-Regular', `url('./hilbertfont-Regular.ttf')`);
        font.load().then(async (loadedFont) => {
            document.fonts.add(loadedFont);
            await document.fonts.ready;

            ctx.fillStyle = fontColor;
            ctx.font = `${fontSize}px ${fontFamily}`;
            const maxWidth = canvas.width - 40;
            let y = fontSize + 40;
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

            const img = canvas.toDataURL('image/png');

            const fileName = 'hilbert_font_' + Date.now() + '.png';
            const path = './images/' + fileName;
            const link = document.createElement('a');
            link.href = img;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            resolve(fileName);
        }).catch((error) => {
            console.error('Failed to load font:', error);
        });
    });
}
