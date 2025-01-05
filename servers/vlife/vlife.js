let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Paser", images: ["paser1.png", "paser2.png", "paser3.png"], description: "Pojawia się tylko między 23-04, co noc zmienia lokalizacje", download: "" },
        { name: "ChopShop", images: ["chopshop1.png", "chopshop2.png", "chopshop3.png"], description: "Zlecenia na kradzież samochodu, łatwy 15m cooldown, średni 30m cooldown. Do trudnego wymagany jammer", download: "" },
        { name: "Van", images: ["van1.png"], description: "Do wzięcia zlecenia wymagane jest 500$ w brudnej (rulon)", download: "" },
        { name: "Dom", images: ["domy.png"], description: "Zlecenia na włamania do domów, czysta gotówka. Sprzedajecie itemy z domów w lombardzie. Na vlife nie oplaca się je robić ponieważ policja przyjezdza po wejściu", download: "" },
        { name: "DarkShop", images: ["darkshop.png"], description: "Zakupicie tam rzeczy do prania brudnej. Tylko liczarke postawicie na ziemi, reszte tylko w mieszkaniu z możliwością meblowania", download: "" }
        //         { name: "", images: [""], description: "", download: "" }
    ],
    narkotyki: [
        { name: "Weed", images: ["ziolo.png", "ziolo2.png"], description: "Najpopularniejszy i najbardziej opłaclny narkotyk, są strefy w których zioło ma lepsza warunki. Do pobrania znajduję się pdf z całymi informacjami", download: "https://cdn.discordapp.com/attachments/1323303602134974464/1323308143450652703/Hodowanie_Roslin_Doniczkowych.pdf?ex=677755ff&is=6776047f&hm=59572784238ab012eb53f1904eb95afc498fd1b24f6eabc038c96dae08b553c1&" },
        { name: "Laboratoria", images: ["meta.png", "koka.png", "hera.png"], description: "Na v-life występują laboratorina, dostep do nich mają jedynie organizacje przestępcze, zazwyczaj ekipa admina 😂", download: "" },
    ],
    skrypty: [
        { name: "Siłownia", images: ["python.png"], description: "Skrypt który sam klika A D i wykonuje za ciebie ćwiczenia na siłowni", download: "https://mega.nz/file/06EVWS7b#Nr8qoUalsb8O1gKV_lEqiCR7PHKl2RtGgW1cp1sUInE" },
        { name: "Wytrych", images: ["python.png"], description: "Skrypt dzięki któremu przyspieszycie otwieranie wytrychem. Poruszasz się strzałkami, gdy zauważysz że żębatka się trzęsie klikasz ↑. Działa w 1920x1080, nie wiem jak z innymi", download: "https://mega.nz/file/ZjdzQJSR#VVv2Zxsl4Ln_D8YPzoCvyTMWnWSMdAeGgd3Dyns-510" }
    ]

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

    // TUTAJ WJEBAC API Z SERWERA 999
    fetch('https://servers-frontend.fivem.net/api/servers/single/xl3y4e')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Error fetching player count:', error));
});
