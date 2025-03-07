// Initialize GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Animate sections on scroll
document.querySelectorAll('.section-container').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 1
        }
    });
});

// Three.js scene setup with optimizations
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

// Optimized object creation
const objects = [];
const objectsCount = window.innerWidth < 768 ? 15 : 25; // Responsive object count

// Enhanced materials with better performance
const materials = [
    new THREE.MeshPhongMaterial({
        color: 0x4285f4,
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhongMaterial({
        color: 0x34a853,
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhongMaterial({
        color: 0xfbbc05,
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    }),
    new THREE.MeshPhongMaterial({
        color: 0xea4335,
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    })
];

// Enhanced geometry creation
function createShape() {
    const geometries = [
        new THREE.IcosahedronGeometry(0.5),
        new THREE.OctahedronGeometry(0.5),
        new THREE.TetrahedronGeometry(0.5),
        new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8)
    ];

    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geometry, material);

    // Enhanced positioning
    const radius = Math.random() * 20 + 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
    mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
    mesh.position.z = radius * Math.cos(phi);

    // Dynamic animation parameters
    mesh.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    };

    mesh.oscillationSpeed = Math.random() * 0.02;
    mesh.oscillationDistance = Math.random() * 0.5;
    mesh.initialY = mesh.position.y;

    return mesh;
}

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x4285f4, 1, 50);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x34a853, 1, 50);
pointLight2.position.set(-10, -10, -10);
scene.add(pointLight2);

// Create objects
for (let i = 0; i < objectsCount; i++) {
    const object = createShape();
    objects.push(object);
    scene.add(object);
}

camera.position.z = 20;

// Optimized animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    objects.forEach(obj => {
        // Rotation
        obj.rotation.x += obj.rotationSpeed.x;
        obj.rotation.y += obj.rotationSpeed.y;
        obj.rotation.z += obj.rotationSpeed.z;

        // Oscillation
        obj.position.y = obj.initialY + Math.sin(time * obj.oscillationSpeed) * obj.oscillationDistance;
        
        // Subtle scale animation
        obj.scale.x = obj.scale.y = obj.scale.z = 1 + Math.sin(time * 2) * 0.1;
    });

    // Gentle camera movement
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.position.y = Math.cos(time * 0.1) * 2;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Optimized resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Start animation
animate();

// Enhanced search functionality
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const micButton = document.getElementById('mic-button');

// Create and style suggestions container
const suggestionsContainer = document.createElement('div');
suggestionsContainer.className = 'suggestions-container';
searchInput.parentNode.appendChild(suggestionsContainer);

// Enhanced search suggestions functionality without caching
function fetchSuggestions(query) {
    if (!query) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Remove any existing suggestion scripts
    const existingScripts = document.querySelectorAll('script[data-suggestion]');
    existingScripts.forEach(script => script.remove());

    // Create new script for fresh suggestions
    const script = document.createElement('script');
    script.setAttribute('data-suggestion', 'true');
    script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&callback=handleSuggestions&_=${Date.now()}`;
    document.body.appendChild(script);
}

// Handle suggestions callback with improved clearing
window.handleSuggestions = function(data) {
    suggestionsContainer.innerHTML = ''; // Clear existing suggestions
    const suggestions = data[1];
    
    if (!suggestions || !suggestions.length || !searchInput.value.trim()) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search text-gray-400 mr-3';
        
        const textSpan = document.createElement('span');
        const queryRegex = new RegExp(`(${searchInput.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        textSpan.innerHTML = suggestion.replace(queryRegex, '<strong class="text-blue-400">$1</strong>');
        
        div.appendChild(searchIcon);
        div.appendChild(textSpan);
        
        div.addEventListener('click', () => {
            searchInput.value = suggestion;
            suggestionsContainer.style.display = 'none';
            performSearch(false); // Regular search on same page
        });
        
        div.addEventListener('mouseenter', () => {
            div.classList.add('bg-blue-500', 'bg-opacity-10');
        });
        
        div.addEventListener('mouseleave', () => {
            div.classList.remove('bg-blue-500', 'bg-opacity-10');
        });
        
        suggestionsContainer.appendChild(div);
    });
    
    suggestionsContainer.style.display = 'block';
};

// Clear suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
    }
});

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Handle input changes with debounce
const debouncedFetch = debounce(fetchSuggestions, 300);

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (!query) {
        suggestionsContainer.style.display = 'none';
    } else {
        debouncedFetch(query);
    }
});

// Handle keyboard navigation
searchInput.addEventListener('keydown', (e) => {
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    let currentIndex = Array.from(items).findIndex(item => item.classList.contains('bg-blue-500'));
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < items.length - 1) {
                if (currentIndex >= 0) items[currentIndex].classList.remove('bg-blue-500', 'bg-opacity-10');
                items[currentIndex + 1].classList.add('bg-blue-500', 'bg-opacity-10');
                searchInput.value = items[currentIndex + 1].textContent.trim();
            }
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
                items[currentIndex].classList.remove('bg-blue-500', 'bg-opacity-10');
                items[currentIndex - 1].classList.add('bg-blue-500', 'bg-opacity-10');
                searchInput.value = items[currentIndex - 1].textContent.trim();
            }
            break;
            
        case 'Enter':
            e.preventDefault();
            performSearch(false); // Regular search on same page
            break;
            
        case 'Escape':
            suggestionsContainer.style.display = 'none';
            break;
    }
});

// Handle search button click
searchButton.addEventListener('click', () => performSearch(false)); // Regular search on same page

// Improved performSearch function with option for different page
function performSearch(useNewPage = false) {
    const query = searchInput.value.trim();
    if (query) {
        // Create a visual feedback for the search action
        gsap.to(searchInput, {
            scale: 1.03,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
        
        // Hide suggestions
        suggestionsContainer.style.display = 'none';
        
        // Redirect to Google search
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        if (useNewPage) {
            // Open in new tab for voice search
            window.open(searchUrl, '_blank');
        } else {
            // Open in same tab for regular search
            window.location.href = searchUrl;
        }
    }
}

// Enhanced voice search functionality with error handling and browser support check
let recognition = null;
let isListening = false;

function initializeSpeechRecognition() {
    try {
        // Check for browser support
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!window.SpeechRecognition) {
            throw new Error('Speech recognition not supported');
        }
        
        // Create a new recognition instance if it doesn't exist
        if (!recognition) {
            recognition = new window.SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = true;
            
            // Set up event handlers
            recognition.onstart = () => {
                isListening = true;
                updateMicButtonUI(true);
                searchInput.placeholder = 'Listening...';
                console.log('Voice recognition started');
            };
            
            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                
                console.log('Transcript:', transcript);
                searchInput.value = transcript;
                
                // Animate the text appearance
                gsap.from(searchInput, {
                    opacity: 0.5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Show suggestions as user speaks
                if (transcript.trim()) {
                    fetchSuggestions(transcript);
                }
            };
            
            recognition.onend = () => {
                console.log('Voice recognition ended');
                isListening = false;
                updateMicButtonUI(false);
                searchInput.placeholder = 'Search anything...';
                
                // If we have a valid search query, perform the search on a different page
                if (searchInput.value.trim()) {
                    setTimeout(() => performSearch(true), 500); // Voice search on different page
                }
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                isListening = false;
                updateMicButtonUI(false);
                searchInput.placeholder = 'Search anything...';
                
                if (event.error === 'not-allowed') {
                    alert('Please allow microphone access to use voice search.');
                } else if (event.error === 'no-speech') {
                    // Just reset without alert for no speech
                    console.log('No speech detected');
                } else {
                    alert('Voice search error: ' + event.error + '. Please try again.');
                }
            };
        }
        
        return true;
    } catch (error) {
        console.error('Speech Recognition Error:', error);
        alert('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
        return false;
    }
}

function updateMicButtonUI(isActive) {
    const micIcon = micButton.querySelector('i');
    if (micIcon) {
        if (isActive) {
            // Enhanced visual feedback
            micIcon.className = 'fas fa-microphone text-red-500 animate-pulse';
            micIcon.style.filter = 'drop-shadow(0 0 10px #ef4444)';
            micButton.classList.add('active-mic');
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'mic-ripple';
            micButton.appendChild(ripple);
            
            // Add pulsating animation to the search input
            searchInput.classList.add('listening-animation');
        } else {
            micIcon.className = 'fas fa-microphone text-xl';
            micIcon.style.filter = '';
            micButton.classList.remove('active-mic');
            
            // Remove ripple effect
            const ripple = micButton.querySelector('.mic-ripple');
            if (ripple) {
                ripple.remove();
            }
            
            // Remove pulsating animation
            searchInput.classList.remove('listening-animation');
        }
    }
}

function handleVoiceSearch() {
    console.log('Voice search button clicked');
    
    // Initialize speech recognition if not already done
    if (!recognition && !initializeSpeechRecognition()) {
        console.error('Failed to initialize speech recognition');
        return;
    }
    
    // Toggle listening state
    if (isListening) {
        console.log('Stopping voice recognition');
        recognition.stop();
    } else {
        console.log('Starting voice recognition');
        try {
            // Clear previous input
            searchInput.value = '';
            recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            
            // Try to recreate the recognition object if it failed
            recognition = null;
            if (initializeSpeechRecognition()) {
                try {
                    recognition.start();
                } catch (retryError) {
                    console.error('Failed to restart speech recognition:', retryError);
                    alert('Could not start voice search. Please try again.');
                    isListening = false;
                    updateMicButtonUI(false);
                }
            }
        }
    }
}

// Add event listeners
micButton.addEventListener('click', handleVoiceSearch);

// Add a fallback for browsers that don't support the Web Speech API
function checkSpeechRecognitionSupport() {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        console.warn('Speech recognition not supported in this browser');
        
        // Add a visual indicator that voice search is not available
        const micIcon = micButton.querySelector('i');
        if (micIcon) {
            micIcon.className = 'fas fa-microphone-slash text-gray-400';
            micButton.setAttribute('title', 'Voice search not supported in this browser');
            micButton.style.opacity = '0.5';
        }
        
        // Change the click behavior to show an alert
        micButton.removeEventListener('click', handleVoiceSearch);
        micButton.addEventListener('click', function() {
            alert('Voice search is not supported in your browser. Please try using Chrome, Edge, or Safari.');
        });
    }
}

// Check for speech recognition support when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create particles
    createParticles();
    
    // Enhance JioHotstar logo
    enhanceJioHotstarLogo();
    
    // Check for speech recognition support
    checkSpeechRecognitionSupport();
});

// Enhanced Three.js animations
function createEnhancedMaterials() {
    return [
        new THREE.MeshPhysicalMaterial({
            color: 0x4285f4,
            metalness: 0.7,
            roughness: 0.2,
            transmission: 0.5,
            thickness: 0.5,
            clearcoat: 1,
            clearcoatRoughness: 0.1
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0x34a853,
            metalness: 0.6,
            roughness: 0.3,
            transmission: 0.4,
            thickness: 0.6,
            clearcoat: 0.8,
            clearcoatRoughness: 0.2
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xfbbc05,
            metalness: 0.5,
            roughness: 0.4,
            transmission: 0.3,
            thickness: 0.7,
            clearcoat: 0.6,
            clearcoatRoughness: 0.3
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xea4335,
            metalness: 0.8,
            roughness: 0.1,
            transmission: 0.6,
            thickness: 0.4,
            clearcoat: 1.2,
            clearcoatRoughness: 0.1
        })
    ];
}

// Update the materials
materials = createEnhancedMaterials();

// Add interactive mouse effects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove);

// Enhanced animation loop
function enhancedAnimate() {
    requestAnimationFrame(enhancedAnimate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    objects.forEach(obj => {
        // Basic rotation and movement
        obj.rotation.x += obj.rotationSpeed.x;
        obj.rotation.y += obj.rotationSpeed.y;
        obj.rotation.z += obj.rotationSpeed.z;

        // Interactive hover effect
        const isHovered = intersects.find(intersect => intersect.object === obj);
        if (isHovered) {
            gsap.to(obj.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.3
            });
            obj.material.transmission = 0.8;
            obj.material.emissive.setHex(0x444444);
        } else {
            gsap.to(obj.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3
            });
            obj.material.transmission = obj.initialTransmission || 0.5;
            obj.material.emissive.setHex(0x000000);
        }

        // Enhanced oscillation
        obj.position.y = obj.initialY + 
            Math.sin(time * obj.oscillationSpeed) * obj.oscillationDistance +
            Math.sin(time * 2 * obj.oscillationSpeed) * obj.oscillationDistance * 0.5;
        
        // Subtle scale pulsing
        obj.scale.x = obj.scale.y = obj.scale.z = 
            1 + Math.sin(time * 2) * 0.1 + Math.sin(time * 3) * 0.05;
    });

    // Dynamic camera movement
    camera.position.x = Math.sin(time * 0.1) * 3;
    camera.position.y = Math.cos(time * 0.1) * 3;
    camera.position.z = 20 + Math.sin(time * 0.05) * 2;
    camera.lookAt(scene.position);

    // Add subtle color shifts to lights
    pointLight1.color.setHSL(Math.sin(time * 0.1) * 0.1 + 0.5, 0.5, 0.5);
    pointLight2.color.setHSL(Math.cos(time * 0.1) * 0.1 + 0.5, 0.5, 0.5);

    renderer.render(scene, camera);
}

// Start enhanced animation
enhancedAnimate();

// Initialize enhanced animations for UI elements
function initializeEnhancedUI() {
    // Animate section headers on scroll
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
                end: "top 50%",
                scrub: 1
            }
        });
    });

    // Animate platform cards on scroll
    gsap.utils.toArray('.platform-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            rotation: 5,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 60%",
                scrub: 1
            }
        });
    });
}

// Initialize enhanced UI animations
initializeEnhancedUI();

// Enhanced hover animations for social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            y: -5,
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Create floating particles
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.3;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Random animation delay
        const delay = Math.random() * 10;
        
        // Apply styles
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}

// Add special effects to JioHotstar logo
function enhanceJioHotstarLogo() {
    const jioHotstarContainer = document.querySelector('.jio-hotstar-container');
    if (jioHotstarContainer) {
        // Add shine effect
        const shine = document.createElement('div');
        shine.classList.add('shine-effect');
        jioHotstarContainer.appendChild(shine);
        
        // Add click effect
        jioHotstarContainer.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            
            const rect = jioHotstarContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            jioHotstarContainer.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    }
}
