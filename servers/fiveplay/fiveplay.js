let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Zlecenia NPC", images: ["zlecnpc1.png"], description: "Zlecenia na zabijanie NPC. Nagroda to weapon_snspistol/hackingphone (mały %) i 15000-30000$. Gdy znajdziecie NPC napierdalacie go, potem altem i zrob zdjecie i zanosicie spowrotem.", download: "" },
        { name: "Paser", images: ["paser1.png", "paser2.png"], description: "Paser u ktorego sprzedajecie fanty z domow", download: "Gdy wezmiecie zlecenie auto bedzie oznaczone blipem. Nastepnie oddajecie auto na doki do garazu." },
        { name: "Tracker", images: ["tracker1.png", "tracker2.png", "tracker3.png", "tracker4.png"], description: "Trucker. Gdy wezmiecie zlecenie auto bedzie oznaczone blipem. Nastepnie oddajecie auto na doki do garazu.", download: "" },
        { name: "Skarby", images: ["skarby1.png", "skarby2.png"], description: "Zlecenia na wyławianie skarbów", download: "" },
        { name: "DarkShop [ORG]", images: ["darkshoporg1.png", "darkshoporg2.png"], description: "DarkShop (tylko organizacje mogą korzystać)", download: "" },
        { name: "DarkShop", images: ["darkshop1.png", "darkshop2.png", "darkshop3.png"], description: "DarkShop dla każdego", download: "" },
        { name: "Baśka", images: ["baska1.png", "baska2.png", "baska3.png"], description: "Baśka (5000$ za pomoc)", download: "" },
        //         { name: "", images: [".png"], description: "", download: "" },
    ],
    narko: [
        { name: "Dealer", images: ["dealer1.png", "dealer2.png"], description: "Dealer - nie moge podjac z nim interakcji", download: "" },
        { name: "Weed", images: ["weed1.png", "weed2.png", "weed3.png", "weed4.png"], description: "Minimum 2 PD aby zbierać/przerabiać", download: "" },
        { name: "Koka", images: ["koka1.png", "koka2.png", "koka3.png", "koka4.png"], description: "Minimum 2 PD aby zbierać/przerabiać", download: "" },
        { name: "Meta", images: ["meta1.png", "meta2.png", "meta3.png", "meta4.png"], description: "Minimum 2 PD aby zbierać/przerabiać", download: "" },


    ]
        //         { name: "", images: [".png"], description: "", download: "" },
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

    // ZMIEN API ZA KAZDYM RAZEM API SERWERA LICZBA GRACZY
    fetch('https://servers-frontend.fivem.net/api/servers/single/e95md3')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
