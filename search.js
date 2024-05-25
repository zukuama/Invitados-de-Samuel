document.getElementById('search-input').addEventListener('input', function () {
    const searchTerm = this.value;
    drawSheetName(searchTerm);
});

document.getElementById('add-button').addEventListener('click', function () {
    // Aquí puedes agregar la funcionalidad para añadir invitados
    alert('Función de agregar invitado no implementada aún.');
});