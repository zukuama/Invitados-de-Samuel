// script.js

function drawSheetName() {
  var queryString = encodeURIComponent('SELECT A, B, C, D, E');

  var query = new google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1RhL_I9NMXTi0nmDfDphv96vLPzuZqEKbwZNwOxU-6ZM/gviz/tq?sheet=Lista de Invitados&headers=1&tq=' + queryString);
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  const listaDeInvitados = document.getElementById('lista-de-invitados');

  for (let i = 0; i < data.getNumberOfRows(); i++) {
    const invitado = data.getValue(i, 0);
    const cantidad = data.getValue(i, 1);
    const ninos = data.getValue(i, 2);
    const confirmado = data.getValue(i, 3);
    const imagenUrl = data.getValue(i, 4);

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
}

google.charts.load('current', {'packages':['corechart', 'table']});
google.charts.setOnLoadCallback(drawSheetName);
