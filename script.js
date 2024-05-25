function drawSheetName(searchTerm = '') {
  let queryString = 'SELECT A, B, C, D, E';
  const query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1RhL_I9NMXTi0nmDfDphv96vLPzuZqEKbwZNwOxU-6ZM/gviz/tq?sheet=Lista%20de%20Invitados&headers=1&tq=' + encodeURIComponent(queryString));
  query.send(response => handleQueryResponse(response, searchTerm));
}

function handleQueryResponse(response, searchTerm) {
  if (response.isError()) {
    console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  const data = response.getDataTable();
  const listaDeInvitados = document.getElementById('lista-de-invitados');
  listaDeInvitados.innerHTML = '';

  let found = false;

  for (let i = 0; i < data.getNumberOfRows(); i++) {
    const invitado = data.getValue(i, 0);
    const cantidad = data.getValue(i, 1);
    const ninos = data.getValue(i, 2);
    const confirmado = data.getValue(i, 3);
    const imagenUrl = data.getValue(i, 4);

    // Convertir valores a cadena y manejar valores null
    const invitadoStr = invitado ? invitado.toString().toLowerCase() : '';
    const cantidadStr = cantidad ? cantidad.toString().toLowerCase() : '';
    const ninosStr = ninos ? ninos.toString().toLowerCase() : '';
    const confirmadoStr = confirmado ? confirmado.toString().toLowerCase() : '';

    if (searchTerm && !invitadoStr.includes(searchTerm.toLowerCase()) &&
      !cantidadStr.includes(searchTerm.toLowerCase()) &&
      !ninosStr.includes(searchTerm.toLowerCase()) &&
      !confirmadoStr.includes(searchTerm.toLowerCase())) {
      continue;
    }

    found = true;

    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = imagenUrl || 'https://via.placeholder.com/150';

    const details = document.createElement('div');
    details.className = 'card-details';

    const invitadoDiv = document.createElement('div');
    invitadoDiv.textContent = `Invitado: ${invitado}`;

    const cantidadDiv = document.createElement('div');
    cantidadDiv.textContent = `Cantidad: ${cantidad}`;

    const ninosDiv = document.createElement('div');
    ninosDiv.textContent = `Niños: ${ninos}`;

    const confirmadoDiv = document.createElement('div');
    confirmadoDiv.textContent = `Confirmado: ${confirmado}`;

    details.appendChild(invitadoDiv);
    details.appendChild(cantidadDiv);
    details.appendChild(ninosDiv);
    details.appendChild(confirmadoDiv);

    card.appendChild(img);
    card.appendChild(details);

    listaDeInvitados.appendChild(card);
  }

  if (!found) {
    alert('No se encuentra el invitado');
  }
}

google.charts.load('current', { 'packages': ['corechart', 'table'] });
google.charts.setOnLoadCallback(() => drawSheetName());