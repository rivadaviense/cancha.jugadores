// Permitir el drop sobre la cancha
function allowDrop(event) {
    event.preventDefault(); // Prevenir la acción por defecto para permitir el drop
}

// Iniciar el arrastre
function drag(event) {
    event.dataTransfer.setData("text", event.target.id); // Almacenar el ID del elemento arrastrado
    event.target.classList.add('dragging'); // Añadir la clase 'dragging' al iniciar el arrastre
}

// Manejar el drop
function drop(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto

    var data = event.dataTransfer.getData("text"); // Obtener el ID del elemento arrastrado
    var draggedElement = document.getElementById(data); // Obtener el elemento arrastrado
    
    // Eliminar la clase 'dragging' cuando se suelte el elemento
    draggedElement.classList.remove('dragging');

    // Obtener las dimensiones del contenedor de la cancha
    var canchaRect = document.getElementById('cancha').getBoundingClientRect();

    // Calcular posiciones aleatorias dentro de la cancha
    var randomX = Math.random() * (canchaRect.width - draggedElement.clientWidth);
    var randomY = Math.random() * (canchaRect.height - draggedElement.clientHeight);

    // Mover el elemento a la posición calculada
    draggedElement.style.position = "absolute";
    draggedElement.style.left = randomX + 'px';
    draggedElement.style.top = randomY + 'px';

    // Añadir el jugador a la cancha
    document.getElementById('cancha').appendChild(draggedElement);
}




//
// Permitir el drop sobre la cancha
function allowDrop(event) {
    event.preventDefault(); // Prevenir la acción por defecto para permitir el drop
}

// Iniciar el arrastre
function drag(event) {
    event.dataTransfer.setData("text", event.target.id); // Almacenar el ID del elemento arrastrado
    event.target.classList.add('dragging'); // Añadir la clase 'dragging' al iniciar el arrastre
}

// Manejar el drop
function drop(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto

    var data = event.dataTransfer.getData("text"); // Obtener el ID del elemento arrastrado
    var draggedElement = document.getElementById(data); // Obtener el elemento arrastrado
    
    // Eliminar la clase 'dragging' cuando se suelte el elemento
    draggedElement.classList.remove('dragging');

    // Obtener las dimensiones del contenedor de la cancha
    var canchaRect = document.getElementById('cancha').getBoundingClientRect();

    // Calcular la posición donde se soltó el jugador dentro de la cancha
    var dropX = event.clientX - canchaRect.left - (draggedElement.clientWidth / 2);
    var dropY = event.clientY - canchaRect.top - (draggedElement.clientHeight / 2);

    // Limitar el movimiento para que los jugadores no se salgan de la cancha
    dropX = Math.max(0, Math.min(dropX, canchaRect.width - draggedElement.clientWidth));
    dropY = Math.max(0, Math.min(dropY, canchaRect.height - draggedElement.clientHeight));

    // Mover el elemento a la posición calculada
    draggedElement.style.position = "absolute";
    draggedElement.style.left = dropX + 'px';
    draggedElement.style.top = dropY + 'px';

    // Añadir el jugador a la cancha
    document.getElementById('cancha').appendChild(draggedElement);
}

document.addEventListener('DOMContentLoaded', () => {
    const cancha = document.getElementById('cancha');
    const escribirBtn = document.getElementById('escribir');
    const borrarBtn = document.getElementById('borrar');
    let isDrawing = false;

    // Crear el elemento canvas para dibujar
    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas-draw');
    cancha.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Ajustar tamaño del canvas para que coincida con el tamaño de la cancha
    function resizeCanvas() {
        canvas.width = cancha.clientWidth;
        canvas.height = cancha.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Iniciar dibujo
    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    // Dibujar en el canvas
    function draw(e) {
        if (!isDrawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    // Finalizar dibujo
    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    // Activar o desactivar el modo de dibujo
    function toggleDrawing() {
        if (escribirBtn.classList.contains('active')) {
            escribirBtn.classList.remove('active');
            canvas.style.pointerEvents = 'none'; // Desactivar el canvas
        } else {
            escribirBtn.classList.add('active');
            canvas.style.pointerEvents = 'auto'; // Activar el canvas
        }
    }

    // Borrar todo el contenido del canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Eventos
    escribirBtn.addEventListener('click', toggleDrawing);
    borrarBtn.addEventListener('click', clearCanvas);

    // Eventos del canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
});


document.addEventListener('DOMContentLoaded', () => {
    const cancha = document.getElementById('cancha');
    const escribirBtn = document.getElementById('escribir');
    const borrarBtn = document.getElementById('borar');
    let isDrawing = false;
    let isDrawingEnabled = false;

    // Crear el elemento canvas para dibujar
    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas-draw');
    cancha.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Ajustar tamaño del canvas para que coincida con el tamaño de la cancha
    function resizeCanvas() {
        canvas.width = cancha.clientWidth;
        canvas.height = cancha.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Iniciar dibujo
    function startDrawing(e) {
        if (isDrawingEnabled) {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    }


    
    // Dibujar en el canvas
    function draw(e) {
        if (!isDrawing || !isDrawingEnabled) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    // Finalizar dibujo
    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    // Activar o desactivar el modo de dibujo
    function toggleDrawing() {
        isDrawingEnabled = !isDrawingEnabled;
        if (isDrawingEnabled) {
            canvas.style.pointerEvents = 'auto'; // Activar el canvas para dibujar
            escribirBtn.classList.add('active');
        } else {
            canvas.style.pointerEvents = 'none'; // Desactivar el canvas para dibujar
            escribirBtn.classList.remove('active');
        }
    }

    // Borrar todo el contenido del canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Eventos
    escribirBtn.addEventListener('click', toggleDrawing);
    borrarBtn.addEventListener('click', clearCanvas);

    // Eventos del canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Permitir el drop sobre la cancha
    function allowDrop(event) {
        event.preventDefault(); // Prevenir la acción por defecto para permitir el drop
    }

    // Iniciar el arrastre
    function drag(event) {
        event.dataTransfer.setData("text", event.target.id); // Almacenar el ID del elemento arrastrado
        event.target.classList.add('dragging'); // Añadir la clase 'dragging' al iniciar el arrastre
    }

    // Manejar el drop
    function drop(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto

        var data = event.dataTransfer.getData("text"); // Obtener el ID del elemento arrastrado
        var draggedElement = document.getElementById(data); // Obtener el elemento arrastrado
        
        // Eliminar la clase 'dragging' cuando se suelte el elemento
        draggedElement.classList.remove('dragging');

        // Obtener las dimensiones del contenedor de la cancha
        var canchaRect = document.getElementById('cancha').getBoundingClientRect();

        // Calcular la posición donde se soltó el jugador dentro de la cancha
        var dropX = event.clientX - canchaRect.left - (draggedElement.clientWidth / 2);
        var dropY = event.clientY - canchaRect.top - (draggedElement.clientHeight / 2);

        // Limitar el movimiento para que los jugadores no se salgan de la cancha
        dropX = Math.max(0, Math.min(dropX, canchaRect.width - draggedElement.clientWidth));
        dropY = Math.max(0, Math.min(dropY, canchaRect.height - draggedElement.clientHeight));

        // Mover el elemento a la posición calculada
        draggedElement.style.position = "absolute";
        draggedElement.style.left = dropX + 'px';
        draggedElement.style.top = dropY + 'px';

        // Añadir el jugador a la cancha
        document.getElementById('cancha').appendChild(draggedElement);
    }

    // Asignar las funciones a los eventos del contenedor de la cancha
    cancha.ondrop = drop;
    cancha.ondragover = allowDrop;
});

// codigo con lapiz 



// Variables para almacenar posiciones originales
const originalPositions = {};

// Permitir el drop sobre la cancha
function allowDrop(event) {
    event.preventDefault(); // Prevenir la acción por defecto para permitir el drop
}

// Iniciar el arrastre
function drag(event) {
    event.dataTransfer.setData("text", event.target.id); // Almacenar el ID del elemento arrastrado
    event.target.classList.add('dragging'); // Añadir la clase 'dragging' al iniciar el arrastre
}

// Manejar el drop
function drop(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto

    var data = event.dataTransfer.getData("text"); // Obtener el ID del elemento arrastrado
    var draggedElement = document.getElementById(data); // Obtener el elemento arrastrado
    
    // Eliminar la clase 'dragging' cuando se suelte el elemento
    draggedElement.classList.remove('dragging');

    // Obtener las dimensiones del contenedor de la cancha
    var canchaRect = document.getElementById('cancha').getBoundingClientRect();

    // Calcular posiciones aleatorias dentro de la cancha
    var randomX = Math.random() * (canchaRect.width - draggedElement.clientWidth);
    var randomY = Math.random() * (canchaRect.height - draggedElement.clientHeight);

    // Mover el elemento a la posición calculada
    draggedElement.style.position = "absolute";
    draggedElement.style.left = randomX + 'px';
    draggedElement.style.top = randomY + 'px';

    // Añadir el jugador a la cancha
    document.getElementById('cancha').appendChild(draggedElement);
}

// Función para inicializar las posiciones originales de los jugadores
function initializeOriginalPositions() {
    const contenedorJugadores = document.querySelector('.contenedor-jugadores');
    const jugadores = contenedorJugadores.querySelectorAll('.jugadores');

    jugadores.forEach(jugador => {
        const rect = jugador.getBoundingClientRect();
        originalPositions[jugador.id] = {
            left: rect.left - contenedorJugadores.getBoundingClientRect().left,
            top: rect.top - contenedorJugadores.getBoundingClientRect().top
        };
    });
}

// Función para restablecer los jugadores a sus posiciones originales
function resetCancha() {
    const cancha = document.getElementById('cancha');
    const jugadores = cancha.querySelectorAll('.jugadores');

    jugadores.forEach(jugador => {
        const position = originalPositions[jugador.id];
        if (position) {
            jugador.style.position = '';
            jugador.style.left = '';
            jugador.style.top = '';
            document.querySelector('.contenedor-jugadores').appendChild(jugador);
        }
    });

    // Limpiar la cancha
    cancha.innerHTML = '<img src="./imagenes/cancha.jpg" alt="Imagen de cancha">';
}

// Inicializar posiciones originales al cargar
window.onload = initializeOriginalPositions;

// Agregar evento al botón de reinicio
document.getElementById('reset-cancha').addEventListener('click', resetCancha);


// Permitir el drop sobre la cancha
function allowDrop(event) {
    event.preventDefault(); // Prevenir la acción por defecto para permitir el drop
}

// Iniciar el arrastre
function drag(event) {
    event.dataTransfer.setData("text", event.target.id); // Almacenar el ID del elemento arrastrado
    event.target.classList.add('dragging'); // Añadir la clase 'dragging' al iniciar el arrastre
}

// Manejar el drop
function drop(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto

    var data = event.dataTransfer.getData("text"); // Obtener el ID del elemento arrastrado
    var draggedElement = document.getElementById(data); // Obtener el elemento arrastrado
    
    // Eliminar la clase 'dragging' cuando se suelte el elemento
    draggedElement.classList.remove('dragging');

    // Obtener las dimensiones del contenedor de la cancha
    var canchaRect = document.getElementById('cancha').getBoundingClientRect();

    // Calcular la posición donde se soltó el jugador dentro de la cancha
    var dropX = event.clientX - canchaRect.left - (draggedElement.clientWidth / 2);
    var dropY = event.clientY - canchaRect.top - (draggedElement.clientHeight / 2);

    // Limitar el movimiento para que los jugadores no se salgan de la cancha
    dropX = Math.max(0, Math.min(dropX, canchaRect.width - draggedElement.clientWidth));
    dropY = Math.max(0, Math.min(dropY, canchaRect.height - draggedElement.clientHeight));

    // Mover el elemento a la posición calculada
    draggedElement.style.position = "absolute";
    draggedElement.style.left = dropX + 'px';
    draggedElement.style.top = dropY + 'px';

    // Añadir el jugador a la cancha
    document.getElementById('cancha').appendChild(draggedElement);
}



///dibuja la cancha 
document.addEventListener('DOMContentLoaded', () => {
    const cancha = document.getElementById('cancha');
    const escribirBtn = document.getElementById('escribir');
    const borrarBtn = document.getElementById('borrar');
    let isDrawing = false;

    // Crear el elemento canvas para dibujar
    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas-draw');
    cancha.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Ajustar tamaño del canvas para que coincida con el tamaño de la cancha
    function resizeCanvas() {
        canvas.width = cancha.clientWidth;
        canvas.height = cancha.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Iniciar dibujo
    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    // Dibujar en el canvas
    function draw(e) {
        if (!isDrawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    // Finalizar dibujo
    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    // Activar o desactivar el modo de dibujo
    function toggleDrawing() {
        if (escribirBtn.classList.contains('active')) {
            escribirBtn.classList.remove('active');
            canvas.style.pointerEvents = 'none'; // Desactivar el canvas
        } else {
            escribirBtn.classList.add('active');
            canvas.style.pointerEvents = 'auto'; // Activar el canvas
        }
    }

    // Borrar todo el contenido del canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Eventos
    escribirBtn.addEventListener('click', toggleDrawing);
    borrarBtn.addEventListener('click', clearCanvas);

    // Eventos del canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
});


document.addEventListener('DOMContentLoaded', () => {
    const cancha = document.getElementById('cancha');
    const escribirBtn = document.getElementById('escribir');
    const borrarBtn = document.getElementById('borar');
    let isDrawing = false;
    let isDrawingEnabled = false;

    // Crear el elemento canvas para dibujar
    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas-draw');
    cancha.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Ajustar tamaño del canvas para que coincida con el tamaño de la cancha
    function resizeCanvas() {
        canvas.width = cancha.clientWidth;
        canvas.height = cancha.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Iniciar dibujo
    function startDrawing(e) {
        if (isDrawingEnabled) {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    }



    // Dibujar en el canvas
    function draw(e) {
        if (!isDrawing || !isDrawingEnabled) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    // Finalizar dibujo
    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    // Activar o desactivar el modo de dibujo
    function toggleDrawing() {
        isDrawingEnabled = !isDrawingEnabled;
        if (isDrawingEnabled) {
            canvas.style.pointerEvents = 'auto'; // Activar el canvas para dibujar
            escribirBtn.classList.add('active');
        } else {
            canvas.style.pointerEvents = 'none'; // Desactivar el canvas para dibujar
            escribirBtn.classList.remove('active');
        }
    }

    // Borrar todo el contenido del canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Eventos
    escribirBtn.addEventListener('click', toggleDrawing);
    borrarBtn.addEventListener('click', clearCanvas);

    // Eventos del canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Permitir el drop sobre la cancha
    function allowDrop(event) {
        event.preventDefault(); // Prevenir la acción por defecto para permitir el drop
    }

    // Iniciar el arrastre
    function drag(event) {
        event.dataTransfer.setData("text", event.target.id); // Almacenar el ID del elemento arrastrado
        event.target.classList.add('dragging'); // Añadir la clase 'dragging' al iniciar el arrastre
    }

    // Manejar el drop
    function drop(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto

        var data = event.dataTransfer.getData("text"); // Obtener el ID del elemento arrastrado
        var draggedElement = document.getElementById(data); // Obtener el elemento arrastrado
        
        // Eliminar la clase 'dragging' cuando se suelte el elemento
        draggedElement.classList.remove('dragging');

        // Obtener las dimensiones del contenedor de la cancha
        var canchaRect = document.getElementById('cancha').getBoundingClientRect();

        // Calcular la posición donde se soltó el jugador dentro de la cancha
        var dropX = event.clientX - canchaRect.left - (draggedElement.clientWidth / 2);
        var dropY = event.clientY - canchaRect.top - (draggedElement.clientHeight / 2);

        // Limitar el movimiento para que los jugadores no se salgan de la cancha
        dropX = Math.max(0, Math.min(dropX, canchaRect.width - draggedElement.clientWidth));
        dropY = Math.max(0, Math.min(dropY, canchaRect.height - draggedElement.clientHeight));

        // Mover el elemento a la posición calculada
        draggedElement.style.position = "absolute";
        draggedElement.style.left = dropX + 'px';
        draggedElement.style.top = dropY + 'px';

        // Añadir el jugador a la cancha
        document.getElementById('cancha').appendChild(draggedElement);
    }

    // Asignar las funciones a los eventos del contenedor de la cancha
    cancha.ondrop = drop;
    cancha.ondragover = allowDrop;
});



const botonEscribir = document.getElementById('escribir');

// Alternar clase 'active' al hacer clic en el botón
botonEscribir.addEventListener('click', function() {
    this.classList.toggle('active');
    
    // Aquí puedes agregar más lógica para activar/desactivar la función de dibujo
});



