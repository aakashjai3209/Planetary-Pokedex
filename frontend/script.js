document.addEventListener('DOMContentLoaded', function() {
    // Celestial objects database
    const celestialObjects = {
        nebula: [
            {
                id: "neb-001",
                name: "NEBULA-X42",
                category: "COSMIC CLOUD",
                image: "https://i.imgur.com/ZkBnsya.png",
                mass: "2.3×10<sup>30</sup> kg",
                distance: "3,400 LIGHT-YRS",
                composition: "HYDROGEN, HELIUM, DUST",
                sector: "ORION-BETA",
                description: "A stunning nebula with vibrant blues and purples throughout its cosmic cloud structure. Contains multiple star-forming regions and potential planetary systems. First discovered in cosmic year 3420 by Deep Space Explorer VII."
            },
            {
                id: "neb-002",
                name: "EAGLE CLOUD",
                category: "EMISSION NEBULA",
                image: "https://i.imgur.com/h9KLmXJ.jpg",
                mass: "4.1×10<sup>31</sup> kg",
                distance: "5,700 LIGHT-YRS",
                composition: "IONIZED GASES, STELLAR DEBRIS",
                sector: "SERPENS-ALPHA",
                description: "This massive star-forming region resembles a cosmic eagle in flight. The central pillar contains numerous young stellar objects. Home to the rare Class-7 astral phenomena that occurs once every 270 years."
            }
        ],
        galaxy: [
            {
                id: "gal-001",
                name: "NEXUS SPIRAL",
                category: "BARRED SPIRAL GALAXY",
                image: "https://i.imgur.com/bKjKqO9.jpg",
                mass: "8.2×10<sup>42</sup> kg",
                distance: "2.5 MILLION LIGHT-YRS",
                composition: "STARS, GAS, DUST, DARK MATTER",
                sector: "QUADRANT ZETA",
                description: "A magnificent spiral galaxy with a prominent central bar structure. Contains approximately 400 billion stars and potentially millions of habitable worlds. Unusual radiation patterns suggest advanced civilizations may exist within."
            },
            {
                id: "gal-002",
                name: "QUANTUM ELLIPTICAL",
                category: "ELLIPTICAL GALAXY",
                image: "https://i.imgur.com/0KtU0dV.jpg",
                mass: "1.7×10<sup>43</sup> kg",
                distance: "11 MILLION LIGHT-YRS",
                composition: "ANCIENT STARS, DARK MATTER",
                sector: "HYPERION CLUSTER",
                description: "An ancient elliptical galaxy composed primarily of old, red stars. Notable for its unusually high dark matter concentration and minimal star formation. Contains numerous stellar remnants including neutron stars and black holes."
            }
        ],
        star: [
            {
                id: "star-001",
                name: "SOLARIS PRIME",
                category: "G-TYPE MAIN SEQUENCE",
                image: "https://i.imgur.com/Jx7NXIc.jpg",
                mass: "1.9×10<sup>30</sup> kg",
                distance: "87 LIGHT-YRS",
                composition: "HYDROGEN, HELIUM, TRACE METALS",
                sector: "LYRA-EPSILON",
                description: "A yellow dwarf star similar to Earth's sun but slightly larger. Supports a complex planetary system with 7 confirmed planets, including 2 in the habitable zone. Unusual plasma flare patterns occur in 17-day cycles."
            },
            {
                id: "star-002",
                name: "CRIMSON GIANT",
                category: "RED SUPERGIANT",
                image: "https://i.imgur.com/JghZ9z7.jpg",
                mass: "1.5×10<sup>31</sup> kg",
                distance: "640 LIGHT-YRS",
                composition: "HELIUM, CARBON, OXYGEN",
                sector: "CYGNUS-DELTA",
                description: "A massive star in the final stages of its life cycle. Approximately 900 times the diameter of Earth's sun. Expected to go supernova within the next 500,000 years, which will create a significant nebula."
            }
        ],
        planet: [
            {
                id: "planet-001",
                name: "AZURON",
                category: "OCEAN PLANET",
                image: "https://i.imgur.com/I29JHBW.jpg",
                mass: "8.7×10<sup>24</sup> kg",
                distance: "42 LIGHT-YRS",
                composition: "WATER, SILICATE CORE, THIN ATMOSPHERE",
                sector: "AQUARIUS-PRIME",
                description: "A planet covered almost entirely by a global ocean over 50km deep. Atmosphere contains high levels of oxygen produced by aquatic microorganisms. Unusual magnetic field fluctuations suggest possible metallic structures beneath the ocean floor."
            },
            {
                id: "planet-002",
                name: "PYROFORGE",
                category: "LAVA PLANET",
                image: "https://i.imgur.com/7PnH5qh.jpg",
                mass: "5.2×10<sup>24</sup> kg",
                distance: "103 LIGHT-YRS",
                composition: "SILICON, IRON, MAGNESIUM",
                sector: "VULCAN-GAMMA",
                description: "An extremely hot planet covered in active volcanoes and flowing lava rivers. Surface temperatures reach 870°C. Rich in rare minerals including quantum crystals that could be valuable for advanced computing systems."
            }
        ],
        blackhole: [
            {
                id: "bh-001",
                name: "TERMINUS VOID",
                category: "SUPERMASSIVE BLACK HOLE",
                image: "https://i.imgur.com/LqQmPAc.jpg",
                mass: "6.5×10<sup>36</sup> kg",
                distance: "26 MILLION LIGHT-YRS",
                composition: "SINGULARITY, ACCRETION DISK",
                sector: "CENTAURUS-OMEGA",
                description: "A colossal black hole at the center of galaxy cluster NGC-4993. Consumes matter equivalent to 3 Earths per day. Emits powerful radiation jets extending over 5,000 light-years. Theorized to be a potential gateway to another universe."
            },
            {
                id: "bh-002",
                name: "QUANTUM NEXUS",
                category: "INTERMEDIATE BLACK HOLE",
                image: "https://i.imgur.com/C5VYLO5.jpg",
                mass: "9.8×10<sup>32</sup> kg",
                distance: "1.2 MILLION LIGHT-YRS",
                composition: "SINGULARITY, STELLAR DEBRIS",
                sector: "PERSEUS ARM",
                description: "An unusual mid-sized black hole exhibiting quantum fluctuation patterns. Creates periodic gravitational waves on a 72-hour cycle. Surrounded by a unique radiation field that distorts space-time in unexpected ways."
            }
        ]
    };
    
    // Current display state
    let currentCategory = "nebula";
    let currentIndex = 0;
    
    // Function to update the display
    function updateDisplay() {
        const objects = celestialObjects[currentCategory];
        const object = objects[currentIndex];
        
        // Update image and name
        document.getElementById("object-image").src = object.image;
        document.getElementById("object-name").innerText = object.name;
        document.getElementById("object-category").innerText = object.category;
        
        // Update stats
        const statValues = document.querySelectorAll(".stat-value");
        statValues[0].innerHTML = object.mass;
        statValues[1].innerText = object.distance;
        statValues[2].innerText = object.composition;
        statValues[3].innerText = object.sector;
        
        // Update description
        document.getElementById("object-description").innerText = object.description;
        
        // Update active category button
        document.querySelectorAll(".data-btn").forEach(btn => {
            btn.classList.remove("active");
            if (btn.dataset.object === currentCategory) {
                btn.classList.add("active");
            }
        });
        
        // Add screen animation
        const screen = document.querySelector(".spacedex-screen");
        screen.style.animation = "none";
        setTimeout(() => {
            screen.style.animation = "flicker 0.3s";
        }, 10);
    }
    
    // Navigate through objects
    document.getElementById("next-btn").addEventListener("click", function() {
        const objects = celestialObjects[currentCategory];
        currentIndex = (currentIndex + 1) % objects.length;
        updateDisplay();
        playButtonSound();
    });
    
    document.getElementById("prev-btn").addEventListener("click", function() {
        const objects = celestialObjects[currentCategory];
        currentIndex = (currentIndex - 1 + objects.length) % objects.length;
        updateDisplay();
        playButtonSound();
    });
    
    // D-pad navigation
    document.querySelector(".d-right").addEventListener("click", function() {
        document.getElementById("next-btn").click();
    });
    
    document.querySelector(".d-left").addEventListener("click", function() {
        document.getElementById("prev-btn").click();
    });
    
    document.querySelector(".d-up").addEventListener("click", function() {
        const categories = Object.keys(celestialObjects);
        const currentCategoryIndex = categories.indexOf(currentCategory);
        const newCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
        currentCategory = categories[newCategoryIndex];
        currentIndex = 0;
        updateDisplay();
        playButtonSound();
    });
    
    document.querySelector(".d-down").addEventListener("click", function() {
        const categories = Object.keys(celestialObjects);
        const currentCategoryIndex = categories.indexOf(currentCategory);
        const newCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        currentCategory = categories[newCategoryIndex];
        currentIndex = 0;
        updateDisplay();
        playButtonSound();
    });
    
    // Button interaction effects
    document.getElementById("scan-btn").addEventListener("click", function() {
        const image = document.getElementById("object-image");
        image.style.animation = "scan 1.5s";
        setTimeout(() => {
            image.style.animation = "none";
        }, 1500);
        playButtonSound();
    });
    
    document.getElementById("info-btn").addEventListener("click", function() {
        const info = document.querySelector(".info-description");
        info.style.animation = "pulse-text 1s";
        setTimeout(() => {
            info.style.animation = "none";
        }, 1000);
        playButtonSound();
    });
    
    // Category selection
    document.querySelectorAll(".data-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            currentCategory = this.dataset.object;
            currentIndex = 0;
            updateDisplay();
            playButtonSound();
    });
});

    // Sound effects
    function playButtonSound() {
        // This would implement actual sound, but we'll just log it for this example
        console.log("Button sound played");
    }
    
    // Add animations to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flicker {
            0% { opacity: 0.7; }
            50% { opacity: 0.9; }
            100% { opacity: 1; }
        }
        
        @keyframes scan {
            0% { 
                filter: brightness(1) hue-rotate(0deg) drop-shadow(0 0 10px rgba(0, 243, 255, 0.7));
    }
    50% {
                filter: brightness(1.5) hue-rotate(180deg) drop-shadow(0 0 20px rgba(0, 243, 255, 1));
    }
    100% {
                filter: brightness(1) hue-rotate(0deg) drop-shadow(0 0 10px rgba(0, 243, 255, 0.7));
            }
        }
        
        @keyframes pulse-text {
            0% { color: var(--spacedex-text); }
            50% { color: var(--spacedex-highlight); }
            100% { color: var(--spacedex-text); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize display
    updateDisplay();
}); 