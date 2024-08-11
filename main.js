document.addEventListener('DOMContentLoaded', () => {
    const cancha = document.getElementById('cancha');
    const escribirBtn = document.getElementById('escribir');
    const borrarBtn = document.getElementById('borar');
    const resetBtn = document.getElementById('reset-cancha');
    const contenedorJugadores = document.querySelector('.contenedor-jugadores');
    let isDrawing = false;
    let isDrawingEnabled = false;
    const originalPositions = {};

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

    // Función para inicializar las posiciones originales de los jugadores
    function initializeOriginalPositions() {
        const jugadores = document.querySelectorAll('.jugadores');
        jugadores.forEach(jugador => {
            const rect = jugador.getBoundingClientRect();
            originalPositions[jugador.id] = {
                parent: jugador.parentElement,
                left: jugador.offsetLeft,
                top: jugador.offsetTop
            };
        });
    }

    // Función para restablecer los jugadores a sus posiciones originales
    function resetCancha() {
        const jugadores = document.querySelectorAll('.jugadores');
        jugadores.forEach(jugador => {
            const position = originalPositions[jugador.id];
            if (position) {
                jugador.style.position = '';
                jugador.style.left = `${position.left}px`;
                jugador.style.top = `${position.top}px`;
                position.parent.appendChild(jugador);
            }
        });
        clearCanvas();
    }

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
            cancha.style.pointerEvents = 'none'; // Desactivar eventos en la cancha
        } else {
            canvas.style.pointerEvents = 'none'; // Desactivar el canvas para dibujar
            escribirBtn.classList.remove('active');
            cancha.style.pointerEvents = 'auto'; // Reactivar eventos en la cancha
        }
    }

    // Borrar todo el contenido del canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Permitir el drop sobre la cancha y el contenedor de jugadores
    function allowDrop(event) {
        event.preventDefault();
    }

    // Iniciar el arrastre
    function drag(event) {
        if (!isDrawingEnabled) {
            event.dataTransfer.setData("text", event.target.id);
        }
    }

    // Manejar el drop
    function drop(event) {
        event.preventDefault();
        if (isDrawingEnabled) return;

        const data = event.dataTransfer.getData("text");
        const draggedElement = document.getElementById(data);
        
        if (event.target === cancha || cancha.contains(event.target)) {
            const canchaRect = cancha.getBoundingClientRect();
            const dropX = event.clientX - canchaRect.left - (draggedElement.offsetWidth / 2);
            const dropY = event.clientY - canchaRect.top - (draggedElement.offsetHeight / 2);

            draggedElement.style.position = "absolute";
            draggedElement.style.left = `${dropX}px`;
            draggedElement.style.top = `${dropY}px`;
            cancha.appendChild(draggedElement);
        } else {
            resetPlayerPosition(draggedElement);
        }
    }

    // Función para restablecer la posición de un jugador
    function resetPlayerPosition(player) {
        const position = originalPositions[player.id];
        if (position) {
            player.style.position = '';
            player.style.left = `${position.left}px`;
            player.style.top = `${position.top}px`;
            position.parent.appendChild(player);
        }
    }

    // Eventos
    escribirBtn.addEventListener('click', toggleDrawing);
    borrarBtn.addEventListener('click', clearCanvas);
    resetBtn.addEventListener('click', resetCancha);

    // Eventos del canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Asignar las funciones a los eventos
    cancha.addEventListener('dragover', allowDrop);
    cancha.addEventListener('drop', drop);
    contenedorJugadores.addEventListener('dragover', allowDrop);
    contenedorJugadores.addEventListener('drop', drop);
    document.body.addEventListener('dragover', allowDrop);
    document.body.addEventListener('drop', drop);

    // Asignar la función drag a todos los elementos arrastrables
    const draggableElements = document.querySelectorAll('.jugadores');
    draggableElements.forEach(elem => {
        elem.addEventListener('dragstart', drag);
    });

    // Inicializar posiciones originales al cargar
    initializeOriginalPositions();
});