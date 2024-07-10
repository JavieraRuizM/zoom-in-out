// Variables y configuraciones iniciales
let img, imgBuffer;
let circles = [];
let offsetX = 0;
let diametro = 35;
let diametroExpandido = 55;
let transparencia = 180;
let oscilacionOpacidad = 50;
let velocidadOpacidad = 0.03;
let modalOpen = false;
let iconImage1, iconImage2;
let canvas;
let lastTouchX = null; // Para seguimiento de movimiento en móviles

function preload() {
    img = loadImage('wep.webp'); // Cargar la imagen
    iconImage1 = loadImage('icon1.svg'); // Cargar íconos
    iconImage2 = loadImage('icon2.svg');
}

function setup() {
    // Ajusta la altura al tamaño del viewport
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    imgBuffer = createGraphics(img.width, windowHeight); // Crear buffer de imagen
    imgBuffer.image(img, 0, 0, img.width, windowHeight); // Dibujar imagen en buffer

    generateCircles(); // Generar círculos
    noStroke(); // Sin contorno para los círculos

    window.addEventListener('wheel', handleWheel, { passive: false }); // Manejar scroll
    window.addEventListener('touchmove', handleTouchMove, { passive: false }); // Manejar touchmove
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    imgBuffer = createGraphics(img.width, windowHeight); // Crear buffer de imagen
    imgBuffer.image(img, 0, 0, img.width, windowHeight); // Dibujar imagen en buffer
}

function draw() {
    background(255); // Fondo blanco
    translate(offsetX, 0); // Desplazamiento horizontal

    // Dibujar imagen desde el buffer
    image(imgBuffer, 0, 0);

    // Dibujar círculos y otros elementos
    circles.forEach(circle => {
        let d = dist(mouseX - offsetX, mouseY, circle.x, circle.y);
        let diametroActual = lerp(circle.diametroActual, d < diametro / 2 ? diametroExpandido : diametro, 0.08);

        // Efecto de opacidad
        let opacidad = transparencia + oscilacionOpacidad * sin(frameCount * velocidadOpacidad);

        // Dibujar círculos
        if (d < diametro / 2) {
            fill(106, 186, 181, transparencia); // Color y transparencia
            ellipse(circle.x, circle.y, diametroExpandido, diametroExpandido); // Dibujar círculo expandido

            fill(250, 241, 231); // Color del círculo principal
            ellipse(circle.x, circle.y, diametroActual, diametroActual); // Dibujar círculo principal
        }

        fill(250, 241, 231); // Color y opacidad del círculo principal
        ellipse(circle.x, circle.y, diametroActual, diametroActual); // Dibujar círculo principal
        
        // Dibujar ícono
        if (circle.iconImage) {
            let iconSize = map(diametroActual, diametro, diametroExpandido, 18, 30); // Escalar tamaño del ícono
            let iconX = circle.x - iconSize / 2; // Posición x del ícono
            let iconY = circle.y - iconSize / 2; // Posición y del ícono
            image(circle.iconImage, iconX, iconY, iconSize, iconSize); // Dibujar ícono
        }

        // Actualizar el diámetro actual del círculo
        circle.diametroActual = diametroActual;
    });
}

function generateCircles() {
    circles.push(new Circle(180, 340, 'modal-1', iconImage1)); 
    circles.push(new Circle(605, 340, 'modal-2', iconImage1)); 
    circles.push(new Circle(380, 570, 'modal-3', iconImage2));
    circles.push(new Circle(980, 330, 'modal-4', iconImage2));
    circles.push(new Circle(2250, 200, 'modal-5', iconImage2)); 
    circles.push(new Circle(2950, 380,'modal-6', iconImage2));
    circles.push(new Circle(3450, 450,'modal-7', iconImage1));
    circles.push(new Circle(5300, 400,'modal-8', iconImage2));
    circles.push(new Circle(5600, 400,'modal-9', iconImage1));
    circles.push(new Circle(6950, 150,'modal-10', iconImage2));
    circles.push(new Circle(9850, 170,'modal-11', iconImage2));
    // Agregar más círculos si es necesario
}

function handleWheel(event) {
    if (!modalOpen && event.deltaY !== 0) {
        offsetX -= event.deltaY;
        offsetX = constrain(offsetX, -img.width + windowWidth, 0);
        event.preventDefault();
    }
}

function handleTouchMove(event) {
    if (!modalOpen) {
        let touch = event.touches[0];
        if (lastTouchX !== null) {
            let deltaX = touch.clientX - lastTouchX;
            offsetX -= deltaX; // Invertir el desplazamiento
            offsetX = constrain(offsetX, -img.width + windowWidth, 0);
        }
        lastTouchX = touch.clientX;
        event.preventDefault();
    }
}

function touchEnded(event) {
    lastTouchX = null; // Reiniciar el seguimiento de la posición del toque
}

function mousePressed() {
    let foundCircle = false;
    circles.forEach(circle => {
        let d = dist(mouseX - offsetX, mouseY, circle.x, circle.y);
        if (d < diametro / 2) {
            showModal(circle.modalId);
            foundCircle = true;
        }
    });

    if (!foundCircle) {
        // Realizar otras operaciones si no se hizo clic en ningún círculo
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        modalOpen = true;
    } else {
        console.error(`Modal with ID ${modalId} not found.`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        modalOpen = false;
    } else {
        console.error(`Modal with ID ${modalId} not found.`);
    }
}

// Constructor de objetos Circle
function Circle(x, y, modalId, iconImage) {
    this.x = x;
    this.y = y;
    this.modalId = modalId;
    this.iconImage = iconImage;
    this.diametroActual = diametro; // Inicializar el diámetro actual del círculo
}



