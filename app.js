// app.js

// Sélectionner le canvas et obtenir le contexte 2D pour dessiner
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Ajuster la taille du canvas pour s'adapter à la fenêtre
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables pour gérer les particules et les interactions
let particlesArray = [];
const numParticles = 100; // Nombre total de particules à générer
const maxDistance = 150; // Distance maximale pour connecter les particules par des lignes

// Objet pour stocker la position de la souris
const mouse = {
    x: null,
    y: null,
    radius: 100 // Rayon d'influence de la souris pour repousser les particules
};

/**
 * Écouteur d'événement pour détecter les mouvements de la souris
 * et mettre à jour la position du curseur.
 */
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

/**
 * Redimensionner le canvas en cas de changement de taille de la fenêtre
 * et réinitialiser les particules pour maintenir l'animation.
 */
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // Réinitialiser les particules
});

/**
 * Classe représentant une particule.
 */
class Particle {
    /**
     * Crée une particule.
     * @param {number} x - Position en x de la particule.
     * @param {number} y - Position en y de la particule.
     * @param {number} dx - Vitesse de déplacement sur l'axe x.
     * @param {number} dy - Vitesse de déplacement sur l'axe y.
     * @param {number} size - Taille de la particule.
     * @param {string} color - Couleur de la particule.
     */
    constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx; // Vitesse sur l'axe x
        this.dy = dy; // Vitesse sur l'axe y
        this.size = size;
        this.color = color;
    }

    /**
     * Dessine la particule sur le canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    /**
     * Met à jour la position de la particule.
     * Gère l'interaction avec la souris et les rebonds contre les bords du canvas.
     */
    update() {
        // Calcul de la distance entre la souris et la particule
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Si la particule est proche de la souris, elle est repoussée
        if (distance < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 5;
            this.y -= Math.sin(angle) * 5;
        } else {
            // Sinon, la particule suit son mouvement normal
            this.x += this.dx;
            this.y += this.dy;
        }

        // Rebondir contre les bords du canvas
        if (this.x < 0 || this.x > canvas.width) this.dx = -this.dx;
        if (this.y < 0 || this.y > canvas.height) this.dy = -this.dy;

        // Dessiner la particule mise à jour
        this.draw();
    }
}

/**
 * Initialise les particules et les stocke dans un tableau.
 */
function init() {
    particlesArray = [];
    for (let i = 0; i < numParticles; i++) {
        let size = Math.random() * 3 + 1; // Taille aléatoire de 1 à 4
        let x = Math.random() * (canvas.width - size * 2) + size; // Position initiale en x
        let y = Math.random() * (canvas.height - size * 2) + size; // Position initiale en y
        let dx = (Math.random() - 0.5) * 2; // Vitesse aléatoire en x
        let dy = (Math.random() - 0.5) * 2; // Vitesse aléatoire en y
        let color = `rgba(255, 255, 255, 0.7)`; // Couleur blanche avec transparence
        particlesArray.push(new Particle(x, y, dx, dy, size, color));
    }
}

/**
 * Fonction d'animation pour mettre à jour le canvas à chaque frame.
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
    particlesArray.forEach(particle => particle.update()); // Mettre à jour chaque particule
    connectParticles(); // Connecter les particules proches
    requestAnimationFrame(animate); // Demander la prochaine frame
}

/**
 * Connecte les particules proches par des lignes pour un effet visuel.
 */
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Si les particules sont proches, on les connecte par une ligne
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
