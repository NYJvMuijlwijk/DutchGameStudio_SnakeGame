namespace Patterns {
    /*
    * The Object Pool Pattern when dealing with the creation of many objects of the same type. The best example for this would
    * be a particle system. Everytime a the users performs a certain action, let's say casts a spell, several particles get
    * spawned to make things look pretty. The downside of this is that the creation of what could be hundreds of particles, 
    * takes a lot of computation and with the constant creation and deletion of these particles can lead to a lot of fragmentation
    * in the memory. The Object Pool Pattern tries to solve this problem by simply reserving a chunk of memory by creating a 
    * bunch of particles upfront and activating them when necessary. You're recycling these objects by constantly re-using them
    * rather then creating new ones. Things to keep in mind is that you could waste memory by creating too many objects that
    * never get used, or the opposite where all objects are already in use when you want to use one. It therefore requires some
    * responsibility from the user to make a efficient implementation of this pattern and the required cleanup as the created 
    * objects remain in memory even when not being actively used.
    * */
    class ObjectPoolPatternProgram {
        // Property for holding the particle system
        particleSystem: ParticleSystem;

        constructor() {
            // Initialize a new particle system
            this.particleSystem = new ParticleSystem(100);
            // Spawn 25 particles
            this.particleSystem.SpawnParticles(25);
            // Animate particles for 1 frame
            this.particleSystem.Animate(1);
            // Spawn 50 particles
            this.particleSystem.SpawnParticles(50);
            // Animate particles for 3 frames
            this.particleSystem.Animate(3);
            // Try to spawn 50 more particles, only 25 available
            this.particleSystem.SpawnParticles(50);
            // Animate particles for 1 frame, the first 25 particles are now available again
            this.particleSystem.Animate(1);
            // Try to spawn 26 more particles, 1 will fail to spawn as all particles are in use and the pool is full
            this.particleSystem.SpawnParticles(26);
        }
    }

// Class defining a Particle with methods to initialize it and play it's animation
    class Particle {
        // Properties for the particles lifetime and the amount of frames left to be animated
        lifeTime: number;
        framesLeft: number = 0;

        // Initialize the particle's lifetime
        constructor(lifeTime: number = 5) {
            this.lifeTime = lifeTime;
        }

        // Animate the particle
        Animate() {
            if (this.framesLeft <= 0) return;

            this.framesLeft -= 1;
            // Animate particle..
        }

        // Set frames left to the particle's lifetime, allowing it to be animated
        Play() {
            this.framesLeft = this.lifeTime;
        }
    }

// Class defining a Particle System which uses the object pooling to re-use particles when they are done animating
    class ParticleSystem {
        // array for holding all the particles
        particles: Particle[];

        // Initialize a new array the length of the poolSize and fill it with Particles
        constructor(poolSize: number) {
            this.particles = new Array<Particle>(poolSize);
            for (let i = 0; i < this.particles.length; i++) this.particles[i] = new Particle();
        }

        // Reset all particles
        Reset() {
            for (let i = 0; i < this.particles.length; i++) this.particles[i].framesLeft = 0;
        }

        // Animate all particles in the pool for a certain amount of frames
        Animate(frames: number) {
            console.log(`Animating particles for ${frames} frames`)
            for (let i = 0; i < frames; i++) {
                for (let i = 0; i < this.particles.length; i++) this.particles[i].Animate();
            }
        }

        // Tries to spawn the number of particles
        SpawnParticles(number: number) {
            let particlesLeft = number;

            // Find an available particle and play it, if there aren't enough available particles they simply won't get played
            // Another option would be to take the oldest playing particle and replay that one instead, effectively destroying the animation.
            // The chosen options depends on whether the disappearance of an existing particle is more noticeable than the absence of a new one
            for (let i = 0; i < this.particles.length; i++) {
                if (particlesLeft > 0 && !(this.particles[i].framesLeft > 0)) {
                    this.particles[i].Play();
                    particlesLeft--;
                } else if (particlesLeft <= 0) break;
            }

            console.log(`${number - particlesLeft} particles spawned`)

            // Log the amount of particles that couldn't be spawned
            if (particlesLeft > 0) console.log(`${particlesLeft} particles couldn't be spawned`)
        }
    }

    new ObjectPoolPatternProgram();// Run with: npx ts-node src/ts/ObjectPoolPattern.ts
}