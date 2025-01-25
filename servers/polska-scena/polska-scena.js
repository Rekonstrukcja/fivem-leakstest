let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "ChopShop", images: ["chopshop1.png", "chopshop2.png"], description: "Zlecenia na kradzież aut. MinPD: 3. Cooldown od 60m do 180m. Wymagany lockpick", download: "" },
        { name: "Sklep narzędziowy", images: ["sklep2.png", "sklep1.png"], description: "Sklep z narzędziami potrzebnymi do jumania aut", download: "" },
        { name: "ChopShop wymiana", images: ["wymiana1.png", "wymiana2.png"], description: "NPC gdzie można wymienić itemy z chopshopa", download: "" },
        { name: "Pralnia", images: ["pranie1.png", "pranie2.png"], description: "MinPD: 3. 1 lvl clean = { min = 500, max = 1000 }, 2 lvl clean = { min = 750, max = 1500 }, 3 lvl clean = { min = 1000, max = 2000 }, 4 lvl clean = { min = 1500, max = 3000 }, 5 lvl clean = { min = 2000, max = 10000 },", download: "" },
        { name: "Meta", images: ["meta1.png", "meta2.png"], description: "NPC z zleceniem.", download: "" },
        { name: "Magazyn", images: ["maga1.png", "maga2.png"], description: "Kupno magazynów, prawdpodobnie do produkcji mety", download: "" },
        { name: "WeedShop", images: ["weedshop1.png", "weedshop2.png"], description: "Sklep z rzeczami do sadzenia zioła", download: "" },
        //         { name: "", images: [""], description: "", download: "" }
    ],
    narkotyki: [
        { name: "Zbiórka zioła", images: ["zbiorka.png"], description: "Zbiórka zioła", download: "" },
        { name: "WeedLab", images: ["lab.png"], description: "Wejście do laboratorium weeda. Wymagany jakiś 1 level i ls_access_card", download: "" },
    ]
        //         { name: "", images: [""], description: "", download: "" }
};

function showImage(imageIndex) {
    const map = document.getElementById('map');
    const desc = document.getElementById('image-description');
    
    if (currentImages.length > 0) {
        map.src = `img/${currentImages[imageIndex]}`;
        map.style.display = 'block';
        map.style.objectFit = 'cover';
        map.style.width = '600px';
        map.style.height = '600px';
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
            submenuContainer.classList.toggle('show');

            if (submenuContainer.classList.contains('show')) {
                submenuContainer.classList.remove('hide');
                submenuContainer.innerHTML = '';

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
    fetch('https://servers-frontend.fivem.net/api/servers/single/678op6')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
