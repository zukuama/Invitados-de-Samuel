document.getElementById('search-input').addEventListener('input', function () {
    const searchTerm = this.value;
    drawSheetName(searchTerm);
});

document.getElementById('add-button').addEventListener('click', function () {
    const addModal = new bootstrap.Modal(document.getElementById('add-modal'));
    addModal.show();
});

const form = document.getElementById('add-form');
const submitButton = document.getElementById('submit-button');

form.addEventListener('input', function () {
    submitButton.disabled = !form.checkValidity();
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
        invitado: formData.get('invitado'),
        cantidad: formData.get('cantidad'),
        ninos: formData.get('ninos'),
        confirmado: formData.get('confirmado')
    };

    fetch('https://script.google.com/macros/s/AKfycbzx4x929hRJYTND8jHldFg5R8b861UgPO7rr7crOpzTICAAun7unvRbYzONEgglSoez/exec', {
        method: 'POST',
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmation-modal'));
            const confirmationMessage = document.getElementById('confirmation-message');
            if (result.success) {
                confirmationMessage.innerHTML = '<div class="alert alert-success" role="alert">Envío exitoso</div>';
                setTimeout(() => {
                    confirmationModal.hide();
                    window.location.reload();
                }, 2000);
            } else {
                confirmationMessage.innerHTML = '<div class="alert alert-danger" role="alert">Error al enviar</div>';
                confirmationModal.show();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmation-modal'));
            const confirmationMessage = document.getElementById('confirmation-message');
            confirmationMessage.innerHTML = '<div class="alert alert-danger" role="alert">Error al enviar</div>';
            confirmationModal.show();
        });
});
