let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Crafting", images: ["crafting1.png", "crafting2.png", "crafting3.png"], description: "Crafting -- 2590.95, 6158.79, 165.79", download: "" },
        { name: "Lotniskowy Haker", images: ["haker1.png", "haker2.png", "haker3.png"], description: "-1085.3, -2791.1, 20.8", download: "" },
        { name: "DarkShop", images: ["darkshop1.png", "darkshop2.png", "darkshop3.png"], description: "DarkShop 1 -- 862.2, 2877.6, 57.9", download: "" },
        { name: "DarkShop2", images: ["darkshop21.png", "darkshop22.png", "darkshop23.png"], description: "DarkShop 2 (klamaziom) -- -3099.0, 409.1, 2.3", download: "" },
        { name: "Dodatki do broni", images: ["dodatki1.png", "dodatki2.png", "dodatki3.png"], description: "-505.3, -2910.2, 14.9", download: "" },


        //         { name: "", images: [""], description: "", download: "" },
    ],
    narko: [
        { name: "Meta", images: ["meta1.png", "meta2.png"], description: "Tu robicie mete, uwazajcie bo campia", download: "" },
        { name: "Weed", images: ["weed1.png", "weed2.png", "weed3.png"], description: "Strefy sadzenia ziola. -35.8, 3026.7, 40.9 | 752.7, 2784.5, 66.9 | 1537.7, 2318.1, 71.0", download: "" },
 
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
    fetch('https://servers-frontend.fivem.net/api/servers/single/zkyox5')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
