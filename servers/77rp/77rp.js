let currentImageIndex = 0;
let currentImages = [];

const categories = {
    napady: [
        { name: "Grupa6", images: ["grupa1.png", "grupa2.png", "grupa3.png", "grupa4.png"], description: "Aktualnie są 4 lokalizacje, jednak policja co jakiś czas je znajduje.     MinPD: 4 | Cooldown 30m | Drop: money-black 17000-25000, weapon_thermite 1, thief_card 1. Są 2 npc mające comabt pdw", download: "" },
        { name: "Ammunation", images: ["amunnation1.png", "amunnation2.png", "amunnation3.png"], description: "Min PD: 4 | Cooldown: 7200s | Cooldown globalny: 360s | Drop: Proch 80-130, Łuski 80-130, Pociski 80-130, cases_weaponpart 3-. Wymagany ładunek wybuchowy (1)", download: "" },
        { name: "CarDealer", images: ["cardealer1.png"], description: "PoliceGpsTimeout = 2 | MinPD: 1 | Cooldown: 20m | Wymagana broń i amunicja do napadu", download: "" },
        { name: "ShopHeist", images: [""], description: "MinPD: 3 | Czas Trwania: 5m | Cooldown: 120m | Nagroda: money-black 6000-8000 (95% na dostanie nagrody)", download: "" },
        { name: "Kasetka", images: [""], description: "MinPD: 1 | Wymagana broń: łom | Nagroda: 1000-5000 brudnej | Cooldown: 180 minut", download: "" },
        { name: "WeedShop", images: [""], description: "MinPD: 5 | Cooldown: 120m | Drop z kasetki: money-black 200-8000, Drop z sejfu: money-black 5000-12000, kluczyk 15% szans na wydropienie (kluczyk może służyć do otwarcia zamkniętej walizki), zlecenie na łódke 40% szans na wydropienie, Drop z stołu: x1 weed_pack", download: "" },

        //         { name: "", images: [""], description: "", download: "" }
    ],
    lokalizacje: [
        { name: "Tablet", images: ["tablet1.png", "tablet2.png"], description: "Tablet do trenowania minigierek", download: "" },
        { name: "Baśka", images: ["baska1.png", "baska2.png", "baska3.png"], description: "", download: "" },
 
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
    fetch('https://servers-frontend.fivem.net/api/servers/single/py7bq7')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
