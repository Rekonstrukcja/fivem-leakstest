let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Magazyn", images: ["mag1.png", "mag2.png", "mag3.png"], description: "Tutaj od npc możecie kupić magazyny", download: "" },
        { name: "Paczki", images: ["paczki1.png", "paczki2.png", "paczki3.png"], description: "Podchodzicie do NPC i on daje wam zebyscie odbierali jakies paczki za free. w tych paczkach sa 'ls_pseudoephedrine', 'ls_ammonia', 'ls_iodine', 'ls_acetone', 'ls_hydrochloric_acid'. Limit to 10 chyba na restart nie wiem", download: "" },
        { name: "DarkShop", images: ["ds1.png", "ds2.png", "ds3.png"], description: "DarkShop z chujowymi itemami", download: "" },
        { name: "Domy", images: ["dom1.png", "dom2.png", "dom3.png", "dom4.png"], description: "Zlecenie na łupanie domów", download: "" },
        { name: "Lombard", images: ["paser1.png", "paser2.png"], description: "Taki paser bez znaczka na mapie, sprzedajecie tam fanty z domów", download: "" },

        //         { name: "", images: [".png"], description: "", download: "" },
    ],
    narko: [
        { name: "Zioło Crafting", images: ["stol1.png", "stol2.png"], description: "Stół do craftingu zioła", download: "" },
        { name: "Ceny narko", images: ["ceny1.png", "ceny2.png", "ceny3.png", "ceny4.png"], description: "Ceny sprzedaży narko i ich specyfikacje", download: "" },
        { name: "Meth Table", images: ["meth1.png", "meth2.png"], description: "Ten npc daje meth table totalnie za free", download: "" },
        { name: "Meth Lab", images: ["lab1.png", "lab2.png", "lab3.png"], description: "Laboratorium mety", download: "" },
        { name: "Meth Gotowanie", images: ["got1.png", "got2.png", "got3.png"], description: "Info z discorda", download: "" },
        { name: "Zioło hurt", images: ["hurt1.png", "hurt2.png"], description: "Sprzedaz zioła hurtowo. po podejsicu do npc daje wam lokalizacje zebyscie podjechali pod npc i ojebali ziolo", download: "" },
        { name: "Zioło sadzenie", images: ["ziolo1.png"], description: "Mini poradnik z sadzeniem zioła, więcej na dc", download: "" },


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
    fetch('https://servers-frontend.fivem.net/api/servers/single/m9gj89')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
