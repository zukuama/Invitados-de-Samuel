function drawSheetName(searchTerm = '') {
  let queryString = 'SELECT A, B, C, D';
  const query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1RhL_I9NMXTi0nmDfDphv96vLPzuZqEKbwZNwOxU-6ZM/edit?usp=sharing'
    + encodeURIComponent(queryString));
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

    const invitadoStr = invitado ? invitado.toString().toLowerCase() : '';
    const cantidadStr = cantidad ? cantidad.toString().toLowerCase() : '';
    const ninosStr = ninos ? ninos.toString().toLowerCase() : '';
    const confirmadoStr = confirmado ? confirmado.toString().toLowerCase() : '';

    if (!searchTerm || invitadoStr.includes(searchTerm.toLowerCase()) || cantidadStr.includes(searchTerm.toLowerCase())
      || ninosStr.includes(searchTerm.toLowerCase()) || confirmadoStr.includes(searchTerm.toLowerCase())) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
              <div class="card-details">
                  <div><strong>Nombre:</strong> ${invitado}</div>
                  <div><strong>Cantidad:</strong> ${cantidad}</div>
                  <div><strong>Niños:</strong> ${ninos}</div>
                  <div><strong>Confirmado:</strong> ${confirmado}</div>
              </div>
          `;
      listaDeInvitados.appendChild(card);
      found = true;
    }
  }

  if (!found) {
    const message = document.createElement('p');
    message.textContent = 'No se encontraron resultados';
    listaDeInvitados.appendChild(message);
  }
}

function checkFormValidity() {
  const invitadoInput = document.getElementById('invitado');
  const cantidadInput = document.getElementById('cantidad');
  const confirmadoSelect = document.getElementById('confirmado');
  const submitButton = document.getElementById('submit-button');

  submitButton.disabled = !(invitadoInput.value && cantidadInput.value && confirmadoSelect.value);
}

document.addEventListener('DOMContentLoaded', () => {
  google.charts.load('current', { packages: ['corechart', 'table'] });
  google.charts.setOnLoadCallback(drawSheetName);

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => drawSheetName(searchInput.value));

  const addButton = document.getElementById('add-button');
  const addModal = new bootstrap.Modal(document.getElementById('add-modal'));
  addButton.addEventListener('click', () => addModal.show());

  const form = document.getElementById('add-form');
  form.addEventListener('input', checkFormValidity);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
      invitado: document.getElementById('invitado').value,
      cantidad: document.getElementById('cantidad').value,
      ninos: document.getElementById('ninos').value,
      confirmado: document.getElementById('confirmado').value,
    };

    fetch('https://script.google.com/macros/s/AKfycbyfd0XzOFx-rBYjjC_Q1B-8_fbB3Px6AyH94p0d7LdwO-wP1yPrWRFqQoH8FsDC2ME/exec', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(result => {
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmation-modal'));
        const confirmationMessage = document.getElementById('confirmation-message');

        if (result.result === 'success') {
          confirmationMessage.innerHTML = '<div class="alert alert-success" role="alert">Invitado agregado exitosamente.</div>';
        } else {
          confirmationMessage.innerHTML = '<div class="alert alert-danger" role="alert">Error al agregar el invitado.</div>';
        }

        confirmationModal.show();
        addModal.hide();

        setTimeout(() => {
          confirmationModal.hide();
          location.reload();
        }, 2000);
      })
      .catch(error => {
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmation-modal'));
        const confirmationMessage = document.getElementById('confirmation-message');
        confirmationMessage.innerHTML = '<div class="alert alert-danger" role="alert">Error al agregar el invitado.</div>';
        confirmationModal.show();

        setTimeout(() => {
          confirmationModal.hide();
        }, 2000);
      });
  });
});
