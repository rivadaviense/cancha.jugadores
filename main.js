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
        if (!isDrawingEnabled) {
            event.preventDefault();
        }
    }

    // Iniciar el arrastre
    function drag(event) {
        if (!isDrawingEnabled) {
            event.dataTransfer.setData("text", event.target.id);
            event.target.classList.add('dragging');
        }
    }

    // Manejar el drop
    function drop(event) {
        if (!isDrawingEnabled) {
            event.preventDefault();

            var data = event.dataTransfer.getData("text");
            var draggedElement = document.getElementById(data);
            
            draggedElement.classList.remove('dragging');

            var canchaRect = cancha.getBoundingClientRect();

            var dropX = event.clientX - canchaRect.left - (draggedElement.clientWidth / 2);
            var dropY = event.clientY - canchaRect.top - (draggedElement.clientHeight / 2);

            dropX = Math.max(0, Math.min(dropX, canchaRect.width - draggedElement.clientWidth));
            dropY = Math.max(0, Math.min(dropY, canchaRect.height - draggedElement.clientHeight));

            draggedElement.style.position = "absolute";
            draggedElement.style.left = dropX + 'px';
            draggedElement.style.top = dropY + 'px';

            cancha.appendChild(draggedElement);
        }
    }

    // Asignar las funciones a los eventos del contenedor de la cancha
    cancha.ondrop = drop;
    cancha.ondragover = allowDrop;

    // Asignar la función drag a todos los elementos arrastrables
    const draggableElements = document.querySelectorAll('[draggable="true"]');
    draggableElements.forEach(elem => {
        elem.ondragstart = drag;
    });
});
