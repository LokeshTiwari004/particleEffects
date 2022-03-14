const myImage = new Image;
myImage.src = 'hacker.jpg';

// const dimension =  Math.floor(visualViewport.height / 3);
const width = x_factor * dimension;
const height = dimension * y_factor;


const canvas = document.getElementById('canvas1');
canvas.height = height;
canvas.width =  width;
const ctx = canvas.getContext('2d');


myImage.addEventListener('load', function (){
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
    const scannedImage = ctx.getImageData(0, 0, width, height);
    ctx.clearRect(0, 0, width, height)
    
    const numOfParticles = 2000;
    let particleArray = [];

    let mappedImage = [];

    for (let y = 0; y < height; y++ ) {
        let row = [];
        for (let x = 0; x < width; x++) {
            const f = 4 * (y * width + x);
            const red = scannedImage.data[f];
            const green = scannedImage.data[f + 1];
            const blue = scannedImage.data[f + 2];
            const brightness = getRelativeBrightness(red, green, blue);

            row.push({brightness, color: `rgb(${red},${green},${blue})`});
        }
        mappedImage.push(row)
    }


    function getRelativeBrightness(red, green, blue) {
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
        )/255;
    }
    
    class Particle {
        constructor(){
            this.x = Math.random() * width;
            this.y = 0;
            this.baseVelocity = .5;
            this.baseVelocityAmplitude = 2.5;
            this.velocity = Math.random() * this.baseVelocityAmplitude + this.baseVelocity;
            this.size = Math.random() * 1 + 0.5;
            this.underlyingPixel = mappedImage[Math.floor(this.y)][Math.floor(this.x)];
            this.angle = (Math.PI/2) * 1; // FIXED angle for each particle
            this.movement = this.velocity;
            
            this.wavyAngle = 0;
            this.wavyAngleIncrement = 0.1;
            this.waveAmplitude = .4;
            this.waveAmplitude_X = this.waveAmplitude * Math.cos(this.angle - Math.PI/2);
            this.waveAmplitude_Y = this.waveAmplitude * Math.sin(this.angle - Math.PI/2);
        }

        update () {
            this.movement = this.velocity;
            this.wavyAngle += this.wavyAngleIncrement;
            
            this.y += this.movement * Math.sin(this.angle) - this.waveAmplitude_Y * Math.sin(this.wavyAngle);
            this.x += this.movement * Math.cos(this.angle) - this.waveAmplitude_X * Math.sin(this.wavyAngle);
            

            if (this.y >= height) {
                this.y = 0;
                this.x = Math.random() * width;
            } else if ( this.y < 0 ) {
                this.y = height - 1;
                this.x = Math.random() * width;
            }

            if (this.x >= width) {
                this.x = 0;
                // this.y = Math.random() * height
            } else if (this.x < 0) {
                this.x = width - 1;
                // this.y = Math.random() * height
            }

            this.underlyingPixel = mappedImage[Math.floor(this.y)][Math.floor(this.x)];

        }

        draw() {
            ctx.fillStyle = 'rgb(' + Math.floor(Math.random() * 50 + 20) + ',' + Math.floor(Math.random() * 70 + 130) + ','  + Math.floor(Math.random() * 100 + 100) + ')';
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function inti() {
        for (let i = 0; i < numOfParticles; i++){
            particleArray.push(new Particle);
        }
    }

    inti();

    function animate() {

        ctx.globalAlpha = 0.05;
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < numOfParticles; i++) {

            particleArray[i].update();
            ctx.globalAlpha = (particleArray[i].underlyingPixel.brightness) * .8;
            particleArray[i].draw();

        }

        requestAnimationFrame(animate)

    }
    
    requestAnimationFrame(animate)
});
