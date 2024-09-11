// Espera a que el contenido del documento HTML se haya cargado completamente antes de ejecutar el código dentro de la función de callback.
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene referencias a los elementos del DOM que se utilizarán en el script.
    const nodeForm = document.getElementById('nodeForm');
    // Referencia al formulario de agregar nodos.
    const connectionForm = document.getElementById('connectionForm');
    // Referencia al formulario de agregar conexiones.
    const nodeTableBody = document.getElementById('nodeTableBody');
    // Referencia al cuerpo de la tabla de nodos donde se mostrarán los nodos.
    const connectionTableBody = document.getElementById('connectionTableBody');
    // Referencia al cuerpo de la tabla de conexiones donde se mostrarán las conexiones.
    const fromNodeSelect = document.getElementById('fromNode');
    // Referencia al menú desplegable para seleccionar el nodo de origen en el formulario de conexiones.
    const toNodeSelect = document.getElementById('toNode');
    // Referencia al menú desplegable para seleccionar el nodo de destino en el formulario de conexiones.
    const graphContainer = document.getElementById('graph-container');
    // Referencia al contenedor donde se renderiza el grafo.

    let nodes = [];
    // Array para almacenar los nodos.
    let connections = [];
    // Array para almacenar las conexiones entre nodos.
    let nodeId = 1;
    // Contador para generar identificadores únicos para los nodos.

    // Actualiza la tabla de nodos con los datos actuales.
    function updateNodeTable() {
        nodeTableBody.innerHTML = '';
        // Limpia el contenido actual del cuerpo de la tabla de nodos.
        nodes.forEach((node, index) => {
            // Recorre el array de nodos y agrega una fila para cada nodo.
            nodeTableBody.innerHTML += `
                <tr>
                    <td>${node.name}</td>
                    <!-- Muestra el nombre del nodo. -->
                    <td>${node.cost}</td>
                    <!-- Muestra el costo del nodo. -->
                    <td>${node.duration}</td>
                    <!-- Muestra la duración del nodo. -->
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editNode(${index})">Actualizar</button>
                        <!-- Botón para actualizar el nodo. Llama a la función editNode con el índice del nodo. -->
                        <button class="btn btn-danger btn-sm" onclick="deleteNode(${index})">Eliminar</button>
                        <!-- Botón para eliminar el nodo. Llama a la función deleteNode con el índice del nodo. -->
                    </td>
                </tr>
            `;
        });
        updateNodeSelects();
        // Actualiza los menús desplegables para seleccionar nodos en el formulario de conexiones.
        renderGraph();
        // Renderiza el grafo con los datos actuales.
    }

    // Actualiza la tabla de conexiones con los datos actuales.
    function updateConnectionTable() {
        connectionTableBody.innerHTML = '';
        // Limpia el contenido actual del cuerpo de la tabla de conexiones.
        connections.forEach((connection, index) => {
            // Recorre el array de conexiones y agrega una fila para cada conexión.
            connectionTableBody.innerHTML += `
                <tr>
                    <td>${connection.from}</td>
                    <!-- Muestra el nodo de origen de la conexión. -->
                    <td>${connection.to}</td>
                    <!-- Muestra el nodo de destino de la conexión. -->
                    <td>${connection.cost}</td>
                    <!-- Muestra el costo de la conexión. -->
                    <td>${connection.bidirectional ? 'Bidireccional' : 'Unidireccional'}</td>
                    <!-- Muestra si la conexión es bidireccional o unidireccional. -->
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editConnection(${index})">Actualizar</button>
                        <!-- Botón para actualizar la conexión. Llama a la función editConnection con el índice de la conexión. -->
                        <button class="btn btn-danger btn-sm" onclick="deleteConnection(${index})">Eliminar</button>
                        <!-- Botón para eliminar la conexión. Llama a la función deleteConnection con el índice de la conexión. -->
                    </td>
                </tr>
            `;
        });
        renderGraph();
        // Renderiza el grafo con los datos actuales.
    }
    
    // Actualiza los menús desplegables para seleccionar nodos.
    function updateNodeSelects() {
        fromNodeSelect.innerHTML = '';
        toNodeSelect.innerHTML = '';
        // Limpia el contenido actual de los menús desplegables.
        nodes.forEach(node => {
            // Recorre el array de nodos y agrega una opción para cada nodo en ambos menús desplegables.
            fromNodeSelect.innerHTML += `<option value="${node.name}">${node.name}</option>`;
            toNodeSelect.innerHTML += `<option value="${node.name}">${node.name}</option>`;
        });
    }

    // Renderiza el grafo usando vis.js con los datos actuales de nodos y conexiones.
    function renderGraph() {
        const container = graphContainer;
        // Selecciona el contenedor donde se renderiza el grafo.
        const data = {
            // Datos para el grafo.
            nodes: nodes.map(node => ({
                id: node.id,
                label: `${node.name}\nCosto: ${node.cost}\nDuración: ${node.duration}`,
                title: `Costo: ${node.cost}\nDuración: ${node.duration}`,
                shape: 'circle',
                size: 20
            })),
            // Convierte el array de nodos en el formato requerido por vis.js.
            edges: connections.map(conn => ({
                from: nodes.find(n => n.name === conn.from).id,
                to: nodes.find(n => n.name === conn.to).id,
                label: `${conn.cost}`,
                arrows: conn.bidirectional ? { to: true, from: true } : { to: true },
                smooth: { type: 'continuous' },
                length: 300
            }))
            // Convierte el array de conexiones en el formato requerido por vis.js.
        };
    
        const options = {
            // Opciones para el grafo.
            nodes: {
                font: { size: 14 }
                // Tamaño de la fuente para las etiquetas de los nodos.
            },
            edges: {
                font: { align: 'top' },
                arrows: { to: { scaleFactor: 1.5 }, from: { scaleFactor: 1.5 } },
                // Configuración de las flechas para las conexiones.
                smooth: {
                    type: 'continuous',
                    roundness: 0.5
                },
                // Configuración de la suavización de las conexiones.
            },
            physics: {
                enabled: true,
                barnesHut: {
                    avoidOverlap: 0.7
                },
                repulsion: {
                    nodeDistance: 500
                },
                stabilization: {
                    iterations: 2000
                }
                // Configuración de la física del grafo para la disposición de los nodos.
            },
            layout: {
                improvedLayout: true
                // Mejora el diseño del grafo para una visualización más efectiva.
            }
        };
    
        new vis.Network(container, data, options);
        // Crea y renderiza el grafo en el contenedor usando vis.js.
    }
    
    // Maneja el evento de envío del formulario de nodos.
    nodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Previene el comportamiento predeterminado del formulario.
        const nodeName = document.getElementById('nodeName').value.trim();
        // Obtiene y limpia el nombre del nodo ingresado.
        const nodeCost = parseFloat(document.getElementById('nodeCost').value);
        // Obtiene el costo del nodo ingresado y lo convierte a un número flotante.
        const nodeDuration = parseFloat(document.getElementById('nodeDuration').value);
        // Obtiene la duración del nodo ingresado y lo convierte a un número flotante.

        if (nodeName && nodeCost >= 0 && nodeDuration >= 0 && !nodes.some(n => n.name === nodeName)) {
            // Verifica que el nombre no esté vacío, que el costo y la duración sean números no negativos, y que el nodo no exista ya.
            nodes.push({ id: nodeId++, name: nodeName, cost: nodeCost, duration: nodeDuration });
            // Agrega el nuevo nodo al array de nodos y aumenta el contador de identificadores.
            updateNodeTable();
            // Actualiza la tabla de nodos.
            nodeForm.reset();
            // Reinicia el formulario.
        } else {
            displayNotification('El nodo ya existe, o el nombre está vacío o los valores son inválidos.');
            // Muestra una notificación si los datos del nodo no son válidos.
        }
    });

    // Maneja el evento de envío del formulario de conexiones.
    connectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Previene el comportamiento predeterminado del formulario.
        const fromNode = document.getElementById('fromNode').value;
        // Obtiene el nodo de origen seleccionado.
        const toNode = document.getElementById('toNode').value;
        // Obtiene el nodo de destino seleccionado.
        const bidirectional = document.getElementById('bidirectional').checked;
        // Obtiene el estado del checkbox de conexión bidireccional.

        const fromNodeData = nodes.find(n => n.name === fromNode);
        // Busca los datos del nodo de origen.
        const toNodeData = nodes.find(n => n.name === toNode);
        // Busca los datos del nodo de destino.

        if (fromNode && toNode && fromNode !== toNode && fromNodeData && toNodeData &&
            !connections.some(c => c.from === fromNode && c.to === toNode)) {
            // Verifica que ambos nodos sean válidos, que no sean el mismo nodo y que la conexión no exista ya.
            const connectionCost = fromNodeData.cost + toNodeData.cost;
            // Calcula el costo de la conexión como la suma de los costos de los nodos de origen y destino.
            connections.push({ from: fromNode, to: toNode, cost: connectionCost, bidirectional: bidirectional });
            // Agrega la nueva conexión al array de conexiones.
            updateConnectionTable();
            // Actualiza la tabla de conexiones.
            connectionForm.reset();
            // Reinicia el formulario.
        } else {
            displayNotification('La conexión es inválida o ya existe, o los nodos seleccionados no son válidos.');
            // Muestra una notificación si los datos de la conexión no son válidos.
        }
    });
    
    // Muestra una notificación en forma de alerta.
    function displayNotification(message) {
        alert(message);
    }

    // Elimina un nodo por su índice.
    window.deleteNode = function(index) {
        const nodeName = nodes[index].name;
        // Obtiene el nombre del nodo a eliminar.
        nodes.splice(index, 1);
        // Elimina el nodo del array de nodos.
        connections = connections.filter(c => c.from !== nodeName && c.to !== nodeName);
        // Elimina las conexiones que involucraban al nodo eliminado.
        updateNodeTable();
        // Actualiza la tabla de nodos.
        updateConnectionTable();
        // Actualiza la tabla de conexiones.
    };

    // Elimina una conexión por su índice.
    window.deleteConnection = function(index) {
        connections.splice(index, 1);
        // Elimina la conexión del array de conexiones.
        updateConnectionTable();
        // Actualiza la tabla de conexiones.
    };

    // Permite editar un nodo por su índice.
    window.editNode = function(index) {
        const nodeName = prompt('Ingrese el nuevo nombre para el nodo:', nodes[index].name);
        // Solicita el nuevo nombre del nodo.
        const nodeCost = parseFloat(prompt('Ingrese el nuevo costo:', nodes[index].cost));
        // Solicita el nuevo costo del nodo.
        const nodeDuration = parseFloat(prompt('Ingrese la nueva duración:', nodes[index].duration));
        // Solicita la nueva duración del nodo.

        if (nodeName && nodeCost >= 0 && nodeDuration >= 0 && !nodes.some(n => n.name === nodeName)) {
            // Verifica que el nuevo nombre no esté vacío, que el costo y la duración sean números no negativos, y que el nodo no exista ya.
            nodes[index] = { id: nodeId++, name: nodeName, cost: nodeCost, duration: nodeDuration };
            // Actualiza el nodo en el array de nodos con los nuevos valores.
            updateNodeTable();
            // Actualiza la tabla de nodos.
        } else {
            displayNotification('Datos inválidos o el nodo ya existe.');
            // Muestra una notificación si los datos del nodo no son válidos.
        }
    };

    // Permite editar una conexión por su índice.
    window.editConnection = function(index) {
        const fromNode = prompt('Ingrese el nuevo nodo de origen:', connections[index].from);
        // Solicita el nuevo nodo de origen.
        const toNode = prompt('Ingrese el nuevo nodo de destino:', connections[index].to);
        // Solicita el nuevo nodo de destino.
        const bidirectionalResponse = prompt('¿La conexión es bidireccional? (Escriba "Si" o "No"):', connections[index].bidirectional ? 'Si' : 'No');
        // Solicita si la conexión es bidireccional.
        const bidirectional = bidirectionalResponse.trim().toLowerCase() === 'si';
        // Convierte la respuesta en un valor booleano.

        if (fromNode && toNode && fromNode !== toNode &&
            !connections.some(c => c.from === fromNode && c.to === toNode && c !== connections[index])) {
            // Verifica que ambos nodos sean válidos, que no sean el mismo nodo, y que la nueva conexión no exista ya.
            const fromNodeData = nodes.find(n => n.name === fromNode);
            // Busca los datos del nodo de origen.
            const toNodeData = nodes.find(n => n.name === toNode);
            // Busca los datos del nodo de destino.
            const connectionCost = fromNodeData.cost + toNodeData.cost;
            // Calcula el costo de la conexión como la suma de los costos de los nodos de origen y destino.
            
            connections[index] = { from: fromNode, to: toNode, cost: connectionCost, bidirectional: bidirectional };
            // Actualiza la conexión en el array de conexiones con los nuevos valores.
            updateConnectionTable();
            // Actualiza la tabla de conexiones.
        } else {
            displayNotification('Datos inválidos o la conexión ya existe.');
            // Muestra una notificación si los datos de la conexión no son válidos.
        }
    };
});

