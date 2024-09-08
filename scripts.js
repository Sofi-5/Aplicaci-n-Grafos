// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const nodeForm = document.getElementById('nodeForm');
    const connectionForm = document.getElementById('connectionForm');
    const nodeTableBody = document.getElementById('nodeTableBody');
    const connectionTableBody = document.getElementById('connectionTableBody');
    const fromNodeSelect = document.getElementById('fromNode');
    const toNodeSelect = document.getElementById('toNode');
    const graphContainer = document.getElementById('graph-container');

    let nodes = [];
    let connections = [];
    let nodeId = 1; // Start node IDs from 1

    function updateNodeTable() {
        nodeTableBody.innerHTML = '';
        nodes.forEach((node, index) => {
            nodeTableBody.innerHTML += `
                <tr>
                    <td>${node.name}</td>
                    <td>${node.cost}</td>
                    <td>${node.duration}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editNode(${index})">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteNode(${index})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        updateNodeSelects();
        renderGraph();
    }

    function updateConnectionTable() {
        connectionTableBody.innerHTML = '';
        connections.forEach((connection, index) => {
            connectionTableBody.innerHTML += `
                <tr>
                    <td>${connection.from}</td>
                    <td>${connection.to}</td>
                    <td>${connection.bidirectional ? 'Bidireccional' : 'Unidireccional'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editConnection(${index})">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteConnection(${index})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        renderGraph();
    }

    function updateNodeSelects() {
        fromNodeSelect.innerHTML = '';
        toNodeSelect.innerHTML = '';
        nodes.forEach(node => {
            fromNodeSelect.innerHTML += `<option value="${node.name}">${node.name}</option>`;
            toNodeSelect.innerHTML += `<option value="${node.name}">${node.name}</option>`;
        });
    }

    function renderGraph() {
        const container = graphContainer;
        const data = {
            nodes: nodes.map(node => ({
                id: node.id,
                label: `${node.name}\nCosto: ${node.cost}\nDuración: ${node.duration}`,
                title: `Costo: ${node.cost}\nDuración: ${node.duration}`,
                shape: 'circle',  // Make nodes circular
                size: 20
            })),
            edges: connections.map(conn => ({
                from: nodes.find(n => n.name === conn.from).id,
                to: nodes.find(n => n.name === conn.to).id,
                arrows: conn.bidirectional ? { to: true, from: true } : { to: true },  // Arrow configuration
                smooth: { type: 'continuous' },  // Smooth line
                length: 300  // Increase the length of connections
            }))
        };

        const options = {
            nodes: {
                font: { size: 14 }
            },
            edges: {
                arrows: { to: { scaleFactor: 1.5 }, from: { scaleFactor: 1.5 } },
                smooth: {
                    type: 'continuous',
                    roundness: 0.5
                }
            },
            physics: {
                enabled: true,
                barnesHut: {
                    avoidOverlap: 0.7  // Increase overlap avoidance
                },
                repulsion: {
                    nodeDistance: 500  // Increase distance between nodes
                },
                stabilization: {
                    iterations: 2000  // Increase iterations for stabilization
                }
            },
            layout: {
                improvedLayout: true
            }
        };

        new vis.Network(container, data, options);
    }

    nodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nodeName = document.getElementById('nodeName').value.trim();
        const nodeCost = parseFloat(document.getElementById('nodeCost').value);
        const nodeDuration = parseFloat(document.getElementById('nodeDuration').value);

        if (nodeName && !nodes.some(n => n.name === nodeName)) {
            nodes.push({ id: nodeId++, name: nodeName, cost: nodeCost, duration: nodeDuration });
            updateNodeTable();
            nodeForm.reset();
        } else {
            alert('El nodo ya existe o el nombre está vacío.');
        }
    });

    connectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fromNode = document.getElementById('fromNode').value;
        const toNode = document.getElementById('toNode').value;
        const bidirectional = document.getElementById('bidirectional').checked; // Check if the checkbox is selected

        if (fromNode && toNode && fromNode !== toNode &&
            !connections.some(c => c.from === fromNode && c.to === toNode)) {
            connections.push({ from: fromNode, to: toNode, bidirectional: bidirectional });
            updateConnectionTable();
            connectionForm.reset();
        } else {
            alert('La conexión es inválida o ya existe.');
        }
    });

    window.deleteNode = function(index) {
        const nodeName = nodes[index].name;
        nodes.splice(index, 1);
        connections = connections.filter(c => c.from !== nodeName && c.to !== nodeName);
        updateNodeTable();
        updateConnectionTable();
    };

    window.deleteConnection = function(index) {
        connections.splice(index, 1);
        updateConnectionTable();
    };

    window.editNode = function(index) {
        const nodeName = prompt('Ingrese el nuevo nombre para el nodo:', nodes[index].name);
        const nodeCost = parseFloat(prompt('Ingrese el nuevo costo:', nodes[index].cost));
        const nodeDuration = parseFloat(prompt('Ingrese la nueva duración:', nodes[index].duration));

        if (nodeName && !nodes.some(n => n.name === nodeName)) {
            nodes[index] = { id: nodeId++, name: nodeName, cost: nodeCost, duration: nodeDuration };
            updateNodeTable();
        }
    };

    window.editConnection = function(index) {
        const fromNode = prompt('Ingrese el nuevo nodo de origen:', connections[index].from);
        const toNode = prompt('Ingrese el nuevo nodo de destino:', connections[index].to);
        const bidirectional = confirm('¿La conexión es bidireccional?');

        if (fromNode && toNode && fromNode !== toNode &&
            !connections.some(c => c.from === fromNode && c.to === toNode)) {
            connections[index] = { from: fromNode, to: toNode, bidirectional: bidirectional };
            updateConnectionTable();
        }
    };
});
