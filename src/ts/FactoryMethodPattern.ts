namespace Patterns {
    /*
    * The factory method pattern allows to create subclasses extending a super class, while overriding part of its methods,
    * the factory methods. This makes it easy to create different variations on, in this case, the EnemySpawner while at the
    * same time inheriting some base functionality, the spawning of the created enemies. Because the spawners all extend the 
    * EnemySpawner class and the enemies they created implement the Enemy interface, the subclasses can create different types
    * of enemies without consequences later on when actually spawning them. The EnemySpawner can also be changed at runtime
    * to allow for different enemies to be spawned under different circumstances.
    * */
    class FactoryMethodProgram {
        // EnemySpawner property holding the current EnemySpawner subclass
        private enemySpawner: EnemySpawner;

        constructor() {
            // Instantiate an EnemySpawner subclass. It will be treated as an EnemySpawner object
            this.enemySpawner = new HeavyEnemySpawner();
            // Spawn an enemy from the subclass. The created enemy from the subclass will be treated as a base Enemy in the
            // base functionality of the EnemySpawner SpawnEnemy method
            this.enemySpawner.SpawnEnemy();// Will log: "Spawn heavy enemy"

            // Change the spawner, eg. when the level changes or the difficulty rises. Because the PsychicEnemy spawner extends
            // the EnemySpawner class, the enemySpawner property can easily be swapped out at runtime
            this.enemySpawner = new PsychicEnemySpawner();
            this.enemySpawner.SpawnEnemy();// Will log: "Spawn psychic enemy"
        }
    }

// Interface for an in game enemy
    interface Enemy {
        Spawn(): void;
    }

// Implementation of the Enemy interface for a heavy enemy
    class HeavyEnemy implements Enemy {
        Spawn(): void {
            console.log("Spawn heavy enemy")
        }
    }

// Implementation of the Enemy interface for a psychic enemy
    class PsychicEnemy implements Enemy {
        Spawn(): void {
            console.log("Spawn psychic enemy")
        }
    }

// Abstract class with the CreateEnemy factory method to be implemented in a subclass and the base logic for spawning an enemy
    abstract class EnemySpawner {
        abstract CreateEnemy(): Enemy;

        // Spawn the enemy created by this class' CreateEnemy method, inherited by all subclasses extending this class
        SpawnEnemy() {
            let Enemy: Enemy = this.CreateEnemy();

            Enemy.Spawn();
        }
    }

// Implementation of the EnemySpawner class with its own implementation of the CreateEnemy factory method for a heavy enemy
    class HeavyEnemySpawner extends EnemySpawner {
        CreateEnemy(): Enemy {
            return new HeavyEnemy();
        }
    }

// Implementation of the EnemySpawner class with its own implementation of the CreateEnemy factory method for a psychic enemy
    class PsychicEnemySpawner extends EnemySpawner {
        CreateEnemy(): Enemy {
            return new PsychicEnemy();
        }
    }

    new FactoryMethodProgram();// Run with: npx ts-node src/ts/FactoryMethodPattern.ts
}