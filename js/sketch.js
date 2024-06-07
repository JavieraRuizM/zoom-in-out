let img; // Variable para almacenar la imagen cargada
let circles = []; // Array para almacenar los círculos
let offsetX = 0; // Desplazamiento horizontal para el canvas
let diametro = 35; // Diámetro de los círculos
let diametroExpandido = 55; // Diámetro expandido del círculo
let transparencia = 180; // Nivel de transparencia de los círculos de fondo
let oscilacionOpacidad = 50; // Amplitud de la oscilación de la opacidad
let velocidadOpacidad = 0.03; // Velocidad de la oscilación de la opacidad
let modalOpen = false; // Indicador estado del modal

// Variables para almacenar las imágenes de los íconos
let iconImage1, iconImage2;

function preload() {
    img = loadImage('base1.png'); // Cargar la imagen 'base1.png' y almacenarla en la variable 'img'
    iconImage1 = loadImage('icon1.svg'); // Cargar el primer ícono
    iconImage2 = loadImage('icon2.svg'); // Cargar el segundo ícono
    
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight); 
    canvas.parent('canvas-container'); 
    if (img.width > windowWidth) { 
        resizeCanvas(img.width, windowHeight); // Si la imagen es más ancha que la ventana, cambiar el tamaño del canvas para que coincida con el ancho de la imagen
    }
    window.addEventListener('wheel', handleWheel, { passive: false }); // Agregar un evento para manejar el desplazamiento con la rueda del mouse
    generateCircles(); // Generar los círculos
    noStroke(); // Deshabilitar los contornos para los círculos
}

// Constructor de objetos Circle
function Circle(x, y, modalId, iconImage) {
    this.x = x; // Coordenada x del círculo
    this.y = y; // Coordenada y del círculo
    this.modalId = modalId; // ID del modal asociado al círculo
    this.iconImage = iconImage; // Imagen del ícono asociada al círculo
    this.diametroActual = diametro; // Diámetro actual del círculo
}

// Función para generar y agregar círculos al array
function generateCircles() {
    circles.push(new Circle(140, 280, 'modal-1', iconImage1)); // Agregar un círculo con posición, ID del modal e ícono específicos
    circles.push(new Circle(1625, 160, 'modal-2', iconImage2)); // Agregar otro círculo
    // Puedes agregar más círculos si es necesario
}

function draw() {
    background(255); // Establecer el fondo blanco
    translate(offsetX, 0); // Aplicar un desplazamiento horizontal al canvas
    image(img, 0, 0); // Dibujar la imagen en el canvas

    // Iterar sobre cada círculo
    circles.forEach(circle => {
        let d = dist(mouseX - offsetX, mouseY, circle.x, circle.y); // Calcular la distancia entre el mouse y el centro del círculo

        // Interpolar el diámetro del círculo
        circle.diametroActual = lerp(circle.diametroActual, d < diametro / 2 ? diametroExpandido : diametro, 0.08);

        // Calcular la opacidad del círculo inicial usando una función sinusoidal
        let opacidad = transparencia + oscilacionOpacidad * sin(frameCount * velocidadOpacidad);

        // Dibujar el círculo expandido con mayor transparencia si el cursor está sobre el círculo
        if (d < diametro / 2) {
            fill(201, 245, 250, transparencia);
            ellipse(circle.x, circle.y, diametroExpandido, diametroExpandido);

            // Dibujar el círculo principal con el efecto de interpolación
            fill(191, 191, 186);
            ellipse(circle.x, circle.y, circle.diametroActual, circle.diametroActual);
        }

        // Dibujar el círculo principal con el efecto de oscilación de la opacidad
        fill(191, 191, 186/*, opacidad*/);
        ellipse(circle.x, circle.y, circle.diametroActual, circle.diametroActual);

      
        // Dibujar la imagen del ícono centrada en el círculo y escalada proporcionalmente
        if (circle.iconImage) {
            let iconSize = map(circle.diametroActual, diametro, diametroExpandido, 18, 35); // Escalar el tamaño del ícono proporcionalmente
            let iconX = circle.x - iconSize / 2; // Coordenada x del ícono
            let iconY = circle.y - iconSize / 2; // Coordenada y del ícono
            image(circle.iconImage, iconX, iconY, iconSize, iconSize); // Dibujar la imagen
        }
    });
}

// Función para manejar el desplazamiento con la rueda del mouse
function handleWheel(event) {
    if (!modalOpen && event.deltaY !== 0) { // Solo maneja el desplazamiento si no hay un modal abierto
        offsetX -= event.deltaY; // Ajustar el desplazamiento horizontal
        offsetX = constrain(offsetX, -img.width + windowWidth, 0); // Restringir el desplazamiento dentro de los límites de la imagen
        event.preventDefault(); // Prevenir el comportamiento por defecto del evento
    }
}

// Función que se ejecuta cuando se presiona el mouse
function mousePressed() {
    circles.forEach(circle => {
        let d = dist(mouseX - offsetX, mouseY, circle.x, circle.y); // Calcular la distancia entre el mouse y el círculo
        if (d < diametro / 2) { // Si el mouse está sobre el círculo
            showModal(circle.modalId); // Mostrar el modal correspondiente
        }
    });
}

// Función para mostrar un modal
function showModal(modalId) {
    const modal = document.getElementById(modalId); // Obtener el elemento del modal por su ID
    if (modal) { // Si el modal existe
        modal.style.display = 'block'; // Mostrar el modal
      document.body.classList.add('modal-open'); // Agregar la clase al body para deshabilitar el scroll
      modalOpen = true; // Marcar que un modal está abierto
    } else {
        console.error(`Modal with ID ${modalId} not found.`);
    }
}

// Función para cerrar un modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId); // Obtener el elemento del modal por su ID
    if (modal) { // Si el modal existe
        modal.style.display = 'none'; // Ocultar el modal
      document.body.classList.remove('modal-open'); //quitar la clase del body para habilitar el scroll
      modalOpen = false; // Marcar que no hay modales abiertos
      
    } else {
        console.error(`Modal with ID ${modalId} not found.`);
    }
}

