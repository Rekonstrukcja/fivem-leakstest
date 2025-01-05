let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Crafting", images: ["crafting1.png", "crafting2.png"], description: "", download: "" },
        { name: "Zlecenie grupe6", images: ["grupe61.png", "grupe62.png"], description: "Zlecenia na napad na furgon grupy6. Drop: 33500$-45500$, karta pracownika 30%", download: "" },
        { name: "Zlecenia domy", images: ["dom1.png", "dom2.png", "dom3.png", "dom4.png"], description: "Zlecenia na opierdalanie domów", download: "" },
        { name: "Biżuteria", images: ["jew1.png"], description: "Po napadzie na jewilery (min 6 pd, zysk: 95000-180000$)", download: "" },
        { name: "DarkShop", images: ["darkshop1.png", "darkshop2.png", "darkshop3.png"], description: "", download: "" },
        { name: "KlamaZiom", images: ["klamaziom1.png", "klamaziom2.png", "klamaziom3.png"], description: "", download: "" },
        { name: "Pojeb", images: ["pojeb1.png", "pojeb2.png", "pojeb3.png"], description: "", download: "" },
        { name: "Materiały", images: ["wybuch1.png", "wybuch2.png"], description: "Sprzedaż materiałów wybuchowych", download: "" },
        { name: "CocaShop", images: ["cocashop1.png", "cocashop2.png", "cocashop3.png"], description: "", download: "" },
        { name: "Dodatki", images: ["dodatki1.png", "dodatki2.png", "dodatki3.png"], description: "", download: "" },


        //         { name: "", images: [""], description: "", download: "" },
    ],
    narko: [
        { name: "Kokaina", images: ["koka1.png"], description: "Gotowanie kokainy", download: "" },
        { name: "Heroina", images: ["hera1.png", "hera2.png"], description: "Respawn heroiny", download: "" },
 
    ]
        //         { name: "", images: [""], description: "", download: "" }
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
    fetch('https://servers-frontend.fivem.net/api/servers/single/blqdbp')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
