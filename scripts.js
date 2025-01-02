document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    if (header) {
        fetch('/d:/Skrypty/HTML/fivem-leaks/header.html')
            .then(response => response.text())
            .then(data => {
                header.innerHTML = data;
            });
    }
    document.getElementById('search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const servers = document.querySelectorAll('#server-list li');

        servers.forEach(server => {
            const serverName = server.querySelector('p').textContent.toLowerCase();
            if (serverName.includes(query)) {
                server.style.display = '';
            } else {
                server.style.display = 'none';
            }
        });
    });

    const modalOverlay = document.getElementById('modal-overlay');
    const modalOkButton = document.getElementById('modal-ok-button');
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
        modalOverlay.classList.add('show');
        sessionStorage.setItem('hasVisited', 'true');
    }

    modalOkButton.addEventListener('click', function() {
        modalOverlay.classList.remove('show');
    });
});
