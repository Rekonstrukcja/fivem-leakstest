let currentImageIndex = 0;
let currentImages = [];

const categories = {
    lokalizacje: [
        { name: "ChopShop", images: ["chopshop1.png", "chopshop2.png"], description: "Wymagane hasło do wejścia, jeżeli ktoś ma wysyłać na dc", download: "" },
        { name: "Domy", images: ["dom1.png", "dom2.png", "dom3.png", "dom4.png", "dom5.png", "dom6.png", "dom7.png", "dom8.png", "dom9.png", "dom10.png", "dom11.png", "dom12.png", "dom13.png", "dom14.png"], description: "Zlecenia na okradanie domow, zlecenia bierzesz od 22-6. Rzeczy możecie sprzedaż u pasera", download: "" },
        { name: "Paser", images: ["paser.png"], description: "Paser", download: "" },
        { name: "Dealer", images: ["dealer2.png", "dealer1.png", "dealer3.png"], description: "Dealer posiadajacy na sprzedaz LSD, XANAX, ECSTAZY", download: "" },
        { name: "SpecShop", images: ["spec1.png"], description: "Specjalistyczny sklep, tam kupujecie wytrychy do trackera (chopshop), rozbierania aut, napad na dom", download: "" },
        { name: "Prochy", images: ["prochy.png"], description: "Możecie tam kupić syrop na kaszel, blisty itp", download: "" },
        { name: "Sklepix", images: ["sklepix1.png", "sklepix2.png", "sklepix3.png"], description: "Fajny sklep, niestety trzeba mieć cheaty żeby dostać się do środka ponieważ drzwi są na skrypt", download: "" },
        
        //         { name: "", images: [""], description: "", download: "" }
    ],
    napady: [
        { name: "Kasetka", images: ["kaseta.jpeg"], description: "Item: Wytrych | Cooldown: 30m | Drop: 1500$-4000$ | Min PD: 2 | Jedna próba", download: "" },
        { name: "Komputer", images: ["kaseta.jpeg"], description: "Cooldown: 30m | Drop: kod do sejfu | Jedna próba", download: "" },
        { name: "Sejf", images: ["kaseta.jpeg"], description: "Cooldown 30m | Drop: 2000-6000$, earings min -10 max 4, gold_bracelet min -15 max 2, weapon_snspistol min -100000, max 1 | Maksymalnie 2 próby", download: "" }
    ],
    narkotyki: [
        { name: "Laboratorium mety", images: ["meta1.png", "meta2.png", "meta3.png", "meta4.png", "meta5.png", "meta6.png"], description: "Z tworzeniem narko jest problem że wymagane są permisje lub karty dostępu i nie da się ich od buta tworzyć. Najprostsza droga do kupienia narko to zagadanie do blokersa. Jeżeli komuś się chce latać za kartami to tutaj info. Kup figurki, zdobądz pendrive (jeżeli wiesz skąd, wyśij na dc), udaj sie do domu madrazo, udaj sie do laboratorium.", download: "" },
        { name: "Stół do wytwarzania", images: ["stol1.png", "stol2.png", "stol3.png", "stol4.png", "stol5.png", "stol6.png", "stol7.png", "stol8.png", "stol9.png", "stol10.png", "stol11.png", "stol12.png", "stol13.png", "stol14.png"], description: "Zdobywa sie go prawdopodbnie jako organizacja przestepcza, stawia sie go na ziemi jako prop, podsylam craftingi.", download: "" },
    
    ],
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

    // 999 ZMIEN API ZA KAZDYM RAZEM
    fetch('https://servers-frontend.fivem.net/api/servers/single/v78km5')
        .then(response => response.json())
        .then(data => {
            const playerCount = data.Data.clients;
            const maxPlayers = data.Data.sv_maxclients;
            document.getElementById('player-count').textContent = `[${playerCount}/${maxPlayers}]`;
        })
        .catch(error => console.error('Error fetching player count:', error));
});
