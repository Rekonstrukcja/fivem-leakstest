let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Domy", images: ["dom1.png", "dom2.png"], description: "Zlecenia na łupanie domów", download: "" },
        { name: "Plantacja zioła", images: ["ziolo1.png"], description: "Możesz tam sadzic zioło", download: "" },
        { name: "Plecaki", images: ["plecak1.png", "plecak2.png", "plecak3.png"], description: "Zlecenia na plecaki", download: "" },
        { name: "Flipper Zero", images: ["flipper1.png", "flipper2.png"], description: "Można zakupić flipper tutaj", download: "" },
        //         { name: "", images: [""], description: "", download: "" }
    ],
    skrypty: [
        { name: "GPS", images: ["lua.png"], description: "Aktaulnie na serwerze wszystkie npc w powietrzu lub na wodzie, tutaj lua które zaznacza ci kordy na mapce zeby sie tepnac", download: "https://cdn.discordapp.com/attachments/1324402640112582698/1324406118633443390/gps.lua?ex=677808d0&is=6776b750&hm=9de1d511f3d5123654c60195f995455d9214d892567e8ad223bb79d33fabab2e&" }
 
        //         { name: "", images: [""], description: "", download: "" }
    ],
};

function showImage(imageIndex) {
    const map = document.getElementById('map');
    const desc = document.getElementById('image-description');
    
    if (currentImages.length > 0) {
        map.src = `img/${currentImages[imageIndex]}`;
        map.style.display = 'block'; // Wyświetlanie obrazu po jego ustawieniu
        map.style.objectFit = 'cover'; // 
        map.style.width = '600px'; // 
        map.style.height = '600px'; // 
        document.getElementById('arrow-container').style.display = 'flex';
    } else {
        map.style.display = 'none';
        document.getElementById('arrow-container').style.display = 'none';
    }

    updateArrows();
}

function updateArrows() {
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    if (currentImages.length <= 1) {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    } else {
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
    }
}

function showNextImage() {
    if (currentImages.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        showImage(currentImageIndex);
    }
}

function showPreviousImage() {
    if (currentImages.length > 1) {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentImageIndex);
    }
}

function fitMapToContainer() {
    const map = document.getElementById('map');
    const container = document.getElementById('map-container');
    
    const containerAspectRatio = container.offsetWidth / container.offsetHeight;
    const mapAspectRatio = map.naturalWidth / map.naturalHeight;
    
    if (mapAspectRatio > containerAspectRatio) {
        map.style.width = 'auto';
        map.style.height = '100%';
    } else {
        map.style.width = '100%';
        map.style.height = 'auto';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fitMapToContainer();
    window.addEventListener('resize', fitMapToContainer);
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const submenuContainer = document.getElementById('submenu-container');
            submenuContainer.classList.toggle('show'); // Przełącz klasę wyświetlania dla animacji przesuwania

            if (submenuContainer.classList.contains('show')) {
                submenuContainer.classList.remove('hide'); // Usuń klasę ukrycia, jeśli jest obecna
                submenuContainer.innerHTML = ''; // Wyczyść istniejące pozycje podmenu

                categories[category].forEach(subcategory => {
                    const div = document.createElement('div');
                    div.className = 'submenu-item';
                    div.textContent = subcategory.name;
                    div.setAttribute('data-images', JSON.stringify(subcategory.images));
                    div.setAttribute('data-description', subcategory.description);
                    div.setAttribute('data-download', subcategory.download);
                    submenuContainer.appendChild(div);

                    div.addEventListener('click', function() {
                        currentImages = JSON.parse(this.getAttribute('data-images'));
                        const description = this.getAttribute('data-description') || "Brak";
                        const download = this.getAttribute('data-download') || "#";
                        currentImageIndex = 0;
                        showImage(currentImageIndex);
                        document.getElementById('description-text').textContent = description;
                        const downloadText = document.getElementById('download-text');
                        downloadText.textContent = download === "#" ? "Brak" : "Download";
                        downloadText.href = download;
                    });
                });
            } else {
                submenuContainer.classList.add('hide'); 
                setTimeout(() => submenuContainer.innerHTML = '', 500);
            }
        });
    });

    document.getElementById('left-arrow').addEventListener('click', function() {
        showPreviousImage();
    });

    document.getElementById('right-arrow').addEventListener('click', function() {
        showNextImage();
    });

    // 999 ZMIEN API ZA KAZDYM RAZEM API SERWERA LICZBA GRACZY
    fetch('https://servers-frontend.fivem.net/api/servers/single/eblxmb')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
