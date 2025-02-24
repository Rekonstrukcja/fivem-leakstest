let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Kajdanixy", images: ["kajd1.png", "kajd2.png", "kajd3.png"], description: "JAVIER, trytytki i nozyczki do nich -- 2389.6, 4853.21, 41.22", download: "" },
        { name: "ChopShop", images: ["chopshop1.png", "chopshop2.png"], description: "Rozbieranie pojazdów, chopshop (tam powinnien byc jakis npc) -- 278.84, -1740.25, 29.38", download: "" },
        { name: "Groby", images: ["groby1.png", "groby2.png"], description: "Okradanie grobów -- -1734.47, -265.64, 51.56", download: "" },
        { name: "Fabuła", images: ["fabula1.png", "fabula2.png"], description: "Na starcie gdy dostaniecie zepsuty pistolet, mozecie mu go zaniesc i dostaniecie od niego 1k$. -- -206.04, -1605.68, 34.42", download: "" },
        { name: "ThiefShop", images: ["thiefshop1.png", "thiefshop2.png"], description: "Złodziej sklep, minimum 5 lvl aby korzystać -- -22.68, 6553.51, 30.95", download: "" },
        { name: "Graficiarz", images: ["graf1.png"], description: "Graficiarz, jeszcze nie wiem co robi -- -198.66, -1711.67, 31.66", download: "" },
        { name: "Baska", images: ["baska1.png", "baska2.png"], description: "Baśka -- 1720.48, 3859.01, 33.78", download: "" },
        { name: "Sklepix", images: ["sklepix1.png", "sklepix2.png"], description: "Kosatka, macie w niej dostep do dojebanego sklepu -- 1564.02, 385.78, -49.68", download: "" },
        { name: "Celnik", images: ["celnik1.png", "celnik2.png"], description: "Przekupywanie celnika, jest to chyba do tego aby łupać paczki -- 1240.08, -3179.51, 7.1 ", download: "" },
        { name: "Fiolka", images: ["fiolka1.png", "fiolka2.png", "fiolka3.png"], description: "", download: "" },


        //         { name: "", images: [".png"], description: "", download: "" },
    ],
    narko: [
        { name: "Karta OPIUM", images: ["joker1.png", "joker2.png", "joker3.png"], description: "JOKER, zakupicie tam karte dostępu do laboratorium opium -- 659.42, 593.24, 129.05", download: "" },
        { name: "Lab OPIUM", images: ["opium1.png", "opium2.png", "opium3.png", "opium4.png"], description: "Laboratorium opium -- 1700.752442, 3608.004150, 32.409726", download: "" },
        { name: "Pakowanie WEED", images: ["weed1.png", "weed2.png"], description: "Weed pakowanie -- -125.53, 2793.78, 53.11", download: "" },
        { name: "Pakowanie KOKA", images: ["koka1.png", "koka2.png", "koka3.png", "koka4.png"], description: "Pakowanie koki -- -2166.71, 5197.76, 16.88", download: "" },





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
    fetch('https://servers-frontend.fivem.net/api/servers/single/oer6mx')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
