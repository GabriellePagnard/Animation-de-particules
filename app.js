// app.js

// Sélectionner le canvas et obtenir le contexte 2D
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Dimensionner le canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables pour gérer les particules
let particlesArray = [];
const numParticles = 100; // Nombre de particules
const maxDistance = 150; // Distance maximale pour les connexions entre particules

// Suivi de la souris
const mouse = {
    x: null,
    y: null,
    radius: 100 // Rayon d'influence de la souris
};

// Gestion de la position de la souris
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Classe pour une particule
class Particle {
    constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx; // Vitesse en x
        this.dy = dy; // Vitesse en y
        this.size = size;
        this.color = color;
    }

    // Dessiner une particule
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // Mise à jour de la position de la particule
    update() {
        // Interaction avec la souris
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 5;
            this.y -= Math.sin(angle) * 5;
        } else {
            // Revenir à la position normale doucement
            this.x += this.dx;
            this.y += this.dy;
        }

        // Rebondir contre les bords
        if (this.x < 0 || this.x > canvas.width) this.dx = -this.dx;
        if (this.y < 0 || this.y > canvas.height) this.dy = -this.dy;

        this.draw();
    }
}

// Initialisation des particules
function init() {
    particlesArray = [];
    for (let i = 0; i < numParticles; i++) {
        let size = Math.random() * 3 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let dx = (Math.random() - 0.5) * 2;
        let dy = (Math.random() - 0.5) * 2;
        let color = `rgba(255, 255, 255, 0.7)`;
        particlesArray.push(new Particle(x, y, dx, dy, size, color));
    }
}

// Animation des particules
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => particle.update());
    connectParticles();
    requestAnimationFrame(animate);
}

// Connexion entre les particules proches
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// Démarrer l'animation
init();
animate();
