let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "DarkShop", images: ["darkshop1.png"], description: "", download: "" },
        { name: "BlackMarket", images: ["blackmarket1.png"], description: "", download: "" },
        { name: "Paser HouseRob", images: ["houserobbery1.png"], description: "Sprzedaż itemów z łupania domów", download: "" },
        { name: "Pralnia", images: ["pranie1.png"], description: "Pranie pieniędzy", download: "" },
        { name: "Warsztat", images: ["warsztat1.png"], description: "Jakiś warsztat", download: "" },
        { name: "Crafting org", images: ["craftorg1.png"], description: "Crafting dla organizacji", download: "" },
        { name: "Crafting broni", images: ["craftgun1.png"], description: "", download: "" },
        { name: "Baśka", images: ["baska1.png", "baska2.png", "baska3.png", "baska4.png", "baska5.png", "baska6.png", "baska7.png", "baska8.png", "baska9.png", "baska10.png", "baska11.png", "baska12.png", "baska13.png", "baska14.png", "baska15.png", "baska16.png"], description: "Lokalizacje basiek, czarnych medyków", download: "" },


 
        //         { name: "", images: [".png"], description: "", download: "" },
    ],
    narko: [
        { name: "Crafting Narko", images: ["craftnarko1.png"], description: "Kuchenka służy do wytwarzania narkotyków", download: "" },
        { name: "Meta", images: ["meta1.png", "meta2.png"], description: "Zbieranie i przeróbka metaafetaminy", download: "" },
        { name: "Meskalina", images: ["meskalina1.png"], description: "", download: "" },
        { name: "Kokaina", images: ["koka1.png", "koka2.png"], description: "", download: "" },
        { name: "Opium", images: ["opium1.png", "opium2.png"], description: "", download: "" },
        { name: "Heroina", images: ["hera1.png", "hera2.png"], description: "", download: "" },
        { name: "Grzybki", images: ["grzybki1.png"], description: "", download: "" },
    ]
        //         { name: "", images: [".png"], description: "", download: "" },
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

    // ZMIEN API ZA KAZDYM RAZEM API SERWERA LICZBA GRACZY
    fetch('https://servers-frontend.fivem.net/api/servers/single/j8dd6k')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
