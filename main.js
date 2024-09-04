document.addEventListener('DOMContentLoaded', () => {
    const cancha = document.getElementById('cancha');
    const escribirBtn = document.getElementById('escribir');
    const borrarBtn = document.getElementById('borar');
    const resetBtn = document.getElementById('reset-cancha');
    const nombreBtn = document.getElementById('nombre');
    const contenedorJugadores = document.querySelector('.contenedor-jugadores');
    const imageInput = document.getElementById('image-input');
    
    let isDrawing = false;
    let isDrawingEnabled = false;
    let isNamingEnabled = false;
    const originalPositions = {};

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas-draw');
    cancha.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = cancha.clientWidth;
        canvas.height = cancha.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function initializeOriginalPositions() {
        const jugadores = document.querySelectorAll('.jugadores');
        jugadores.forEach(jugador => {
            const rect = jugador.getBoundingClientRect();
            originalPositions[jugador.id] = {
                parent: contenedorJugadores,
                left: jugador.offsetLeft,
                top: jugador.offsetTop
            };
        });
    }

    function resetCancha() {
        const jugadores = document.querySelectorAll('.jugadores');
        jugadores.forEach(jugador => {
            resetPlayerPosition(jugador);
        });
        clearCanvas();
    }

    function startDrawing(e) {
        if (isDrawingEnabled) {
            const x = e.touches ? e.touches[0].clientX - canvas.getBoundingClientRect().left : e.offsetX;
            const y = e.touches ? e.touches[0].clientY - canvas.getBoundingClientRect().top : e.offsetY;
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    }

    function draw(e) {
        if (!isDrawing || !isDrawingEnabled) return;
        const x = e.touches ? e.touches[0].clientX - canvas.getBoundingClientRect().left : e.offsetX;
        const y = e.touches ? e.touches[0].clientY - canvas.getBoundingClientRect().top : e.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    function toggleDrawing() {
        isDrawingEnabled = !isDrawingEnabled;
        if (isDrawingEnabled) {
            canvas.style.pointerEvents = 'auto';
            escribirBtn.classList.add('active');
            cancha.style.pointerEvents = 'none';
        } else {
            canvas.style.pointerEvents = 'none';
            escribirBtn.classList.remove('active');
            cancha.style.pointerEvents = 'auto';
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drag(event) {
        if (!isDrawingEnabled && !isNamingEnabled) {
            event.dataTransfer.setData("text", event.target.id);
        }
    }

    function drop(event) {
        event.preventDefault();
        if (isDrawingEnabled) return;

        const data = event.dataTransfer.getData("text");
        const draggedElement = document.getElementById(data);
        
        if (event.target === cancha || cancha.contains(event.target)) {
            const canchaRect = cancha.getBoundingClientRect();
            const dropX = (event.touches ? event.touches[0].clientX : event.clientX) - canchaRect.left - (draggedElement.offsetWidth / 2);
            const dropY = (event.touches ? event.touches[0].clientY : event.clientY) - canchaRect.top - (draggedElement.offsetHeight / 2);

            draggedElement.style.position = "absolute";
            draggedElement.style.left = `${dropX}px`;
            draggedElement.style.top = `${dropY}px`;
            cancha.appendChild(draggedElement);

            const nombre = document.querySelector(`.nombre[data-id="${draggedElement.id}"]`);
            if (nombre) {
                nombre.style.display = 'block';
                nombre.style.left = `${dropX + draggedElement.offsetWidth / 2}px`;
                nombre.style.top = `${dropY + draggedElement.offsetHeight}px`;
                cancha.appendChild(nombre);
            }
        } else if (contenedorJugadores.contains(event.target)) {
            resetPlayerPosition(draggedElement);
        }
    }

    function resetPlayerPosition(player) {
        const position = originalPositions[player.id];
        if (position) {
            player.style.position = '';
            player.style.left = '';
            player.style.top = '';
            position.parent.appendChild(player);

            const nombre = document.querySelector(`.nombre[data-id="${player.id}"]`);
            if (nombre) {
                nombre.style.display = 'none'; // Ocultar el nombre
                position.parent.appendChild(nombre);
            }
        }
    }

    imageInput.addEventListener('change', (event) => {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('jugadores');
                img.draggable = true;
                img.id = `jugador-${Date.now()}-${i}`;

                contenedorJugadores.appendChild(img);
                img.addEventListener('dragstart', drag);

                originalPositions[img.id] = {
                    parent: contenedorJugadores,
                    left: img.offsetLeft,
                    top: img.offsetTop
                };

                img.addEventListener('click', function () {
                    if (isNamingEnabled) {
                        addNameToPlayer(img);
                    }
                });
            };

            reader.readAsDataURL(file);
        }
    });

    function addNameToPlayer(player) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Escribe el nombre';
        input.classList.add('nombre-input');
        input.style.position = 'absolute';
        
        const inputWidth = 150;
        input.style.left = `${player.offsetLeft + (player.offsetWidth / 2) - (inputWidth / 2)}px`;
        input.style.top = `${player.offsetTop + player.offsetHeight + 5}px`;
        input.style.width = `${inputWidth}px`;
        
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                const name = document.createElement('div');
                name.textContent = input.value;
                name.classList.add('nombre');
                name.style.position = 'absolute';
                name.style.textAlign = 'center';
                name.style.width = `${player.offsetWidth}px`;
                name.style.left = `${player.offsetLeft + (player.offsetWidth / 2)}px`;
                name.style.top = `${player.offsetTop + player.offsetHeight}px`;
                name.dataset.id = player.id;

                name.addEventListener('click', () => {
                    const newInput = document.createElement('input');
                    newInput.type = 'text';
                    newInput.value = name.textContent;
                    newInput.classList.add('nombre-input');
                    newInput.style.position = 'absolute';
                    newInput.style.width = `${inputWidth}px`;
                    newInput.style.left = `${player.offsetLeft + (player.offsetWidth / 2) - (inputWidth / 2)}px`;
                    newInput.style.top = `${player.offsetTop + player.offsetHeight + 5}px`;
                    
                    newInput.addEventListener('blur', () => {
                        if (newInput.value.trim()) {
                            name.textContent = newInput.value;
                        }
                        newInput.remove();
                    });
                    newInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            newInput.blur();
                        }
                    });
                    
                    cancha.appendChild(newInput);
                    newInput.focus();
                    name.remove();
                });

                cancha.appendChild(name);

                player.addEventListener('mousemove', () => {
                    name.style.left = `${player.offsetLeft + (player.offsetWidth / 2)}px`;
                    name.style.top = `${player.offsetTop + player.offsetHeight}px`;
                });

                // Ocultar el nombre si el jugador está en el contenedor de jugadores
                if (contenedorJugadores.contains(player)) {
                    name.style.display = 'none';
                }
            }
            input.remove();
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        cancha.appendChild(input);
        input.focus();
    }

    function toggleNaming() {
        isNamingEnabled = !isNamingEnabled;
        if (isNamingEnabled) {
            nombreBtn.classList.add('active');
        } else {
            nombreBtn.classList.remove('active');
        }
    }

    escribirBtn.addEventListener('click', toggleDrawing);
    borrarBtn.addEventListener('click', clearCanvas);
    resetBtn.addEventListener('click', resetCancha);
    nombreBtn.addEventListener('click', toggleNaming);

    cancha.addEventListener('dragover', allowDrop);
    cancha.addEventListener('drop', drop);
    contenedorJugadores.addEventListener('dragover', allowDrop);
    contenedorJugadores.addEventListener('drop', drop);

    // Eventos táctiles para el dibujo
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // Eventos de ratón para el dibujo
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
});
