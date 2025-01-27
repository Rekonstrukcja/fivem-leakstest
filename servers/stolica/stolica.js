let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "Wycinka kata", images: ["kat1.png", "kat2.png"], description: "Wyciannie katów z samochodów, udajecie sie do lomabardu aby zakupic diaxa a nastepnie wycinacie katy", download: "" },
        { name: "Crime Stół", images: ["stol1.png", "stol2.png", "stol3.png"], description: "Można craftować tam kosy", download: "" },
        { name: "Krystan", images: ["krystian1.png", "krystian2.png", "krystian3.png"], description: "Krystan ktory opierdala info za pojebana cena i szkielet broni -- 27/01 USUNELI", download: "" },
        { name: "Trucker", images: ["trucker1.png", "trucker2.png", "trucker3.png", "trucker4.png", "trucker5.png", "trucker6.png", "trucker7.png", "trucker8.png", "trucker9.png", "trucker10.png", "trucker11.png"], description: "Minimum 1 pd. 2250-3000 zł. Po odebraniu zlecenia dostajecie item DIGI SCANNER nim szukacie auta, po znalezieniu i bedac niego (pojawi się na tym urządzeniu takie zielone) blisko klikacie E i robicie minigierkę. Podsyłam również lokalizacje gdzie respią się auta po wzieciu zlecenia.", download: "" },
        { name: "NPC Zioło", images: ["ziolo1.png", "ziolo2.png", "ziolo3.png", "ziolo4.png"], description: "Kupicie u niego nasiona do sadzenia zioła", download: "" }
        //         { name: "", images: [""], description: "", download: "" }
    ],
    dump: [
        { name: "DUMP", images: ["dump.png"], description: "Kliknij download aby przenieś się do dumpa", download: "https://mega.nz/file/B29n0aRQ#K0wE0PIiF069Z4KrM84zXP3AxTAaynpi8SFz_YSyfwU" },
 
    ],
    napady: [
        { name: "Fanty z aut", images: ["fanty1.png"], description: "Na serwerze można okradać itemy z aut. Sprawa wygląda tak że szukacie fury która stoi na parkingu, jeżeli w środku fury na siedzeniach znajduje się prop (plecak, pudlo itp). Wchodzicie najlepiej na dach samochodu walicie kopy tak aby wybić szybe, po wybiciu pod E zabieracie fanty. Na dc wiecej info. Dodatkowo na discord znajduje sie trigger na szukanie propow.", download: "" },
        { name: "Bankomaty", images: ["bankomat1.png"], description: "Dodali na serwer łupanie bankomatów ale w chuj pobugowane ludzie piszą że trzeba wychodzić z serwera i wchodzić żeby następny łupać. Wymagany jest łom.", download: "" }

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
    fetch('https://servers-frontend.fivem.net/api/servers/single/8kyzq3')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Błąd pobierania liczby graczy:', error));
});
