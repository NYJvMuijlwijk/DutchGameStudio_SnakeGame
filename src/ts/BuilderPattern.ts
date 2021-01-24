namespace Patterns {
    /*
    * The builder pattern is used when you have to create objects that are complex and have extensive configuration. By using
    * a builder class to construct the different parts of the object you prevent the need for large constructors allowing for
    * all the possible configurations, or big inheritance trees to allow for the different configurations through inheritance.
    * Using a builder you simply need to call the required methods and retrieve the created object. Different types of builders
    * don't even need to create the same type of object, allowing for even more flexibility in the kinds of objects you want
    * to create.
    * In the event that there are configurations that are common, you can use a director class with methods for quickly creating 
    * these common objects, saving time.
    * */
    class BuilderPatternProgram {
        // Properties for demonstrating the builder pattern
        enemyBuilder: CustomEnemyBuilder;
        manualBuilder: CustomEnemyManualBuilder;
        director: Director;

        constructor() {
            // Initializing the different builders and director for creating custom enemies and enemy manuals
            this.enemyBuilder = new CustomEnemyBuilder();
            this.manualBuilder = new CustomEnemyManualBuilder();
            this.director = new Director();

            // Use the director to create common configurations of the builder classes
            this.director.ConstructDefaultReptileEnemy(this.enemyBuilder);
            this.director.ConstructDefaultReptileEnemy(this.manualBuilder);

            // Retrieve the created objects from the different builders
            let enemy = this.enemyBuilder.GetEnemy();
            let manual = this.manualBuilder.GetEnemy();

            // Log the results. These can be vastly different as the different builders can create objects of different types
            console.log(enemy.Eyes)// Will log "2"
            console.log(manual.Eyes)// Will log "This enemy has 2 eyes."

            // Manually create a new enemy manual
            this.manualBuilder.Reset();
            this.manualBuilder.SetArms(4);
            this.manualBuilder.SetEyes(6);
            this.manualBuilder.SetWings(4);
            this.manualBuilder.SetBossEnemy(true);

            // Store the newly created manual 
            manual = this.manualBuilder.GetEnemy();

            // Log the results
            console.log(manual.isBossEnemy);// Will log "This enemy is a boss enemy."
        }
    }

// Builder interface specifying the methods needed to construct the different parts of the enemy type object
    interface EnemyBuilder {
        Reset(): void;

        SetEyes(eyes: number): void

        SetArms(arms: number): void

        SetLegs(legs: number): void

        SetWings(wings: number): void

        SetWeapons(hasWeapons: boolean): void

        SetBossEnemy(isBoss: boolean): void
    }

// Reptile enemy class containing all the properties of an enemy
    class ReptileEnemy {
        Eyes: number = 0;
        Arms: number = 0;
        Legs: number = 0;
        Wings: number = 0;

        hasWeapons: boolean = false;
        isBossEnemy: boolean = false;
    }

// Reptile Enemy Manual class containing all the properties of a manual
    class ReptileEnemyManual {
        Eyes: string = "";
        Arms: string = "";
        Legs: string = "";
        Wings: string = "";

        hasWeapons: string = "";
        isBossEnemy: string = "";
    }

// EnemyBuilder implementation for creating a custom Enemy
    class CustomEnemyBuilder implements EnemyBuilder {
        enemy: ReptileEnemy;

        constructor() {
            this.enemy = new ReptileEnemy();
        }

        Reset(): void {
            this.enemy = new ReptileEnemy();
        }

        SetArms(arms: number): void {
            this.enemy.Arms = arms;
        }

        SetBossEnemy(isBoss: boolean): void {
            this.enemy.isBossEnemy = isBoss;
        }

        SetEyes(eyes: number): void {
            this.enemy.Eyes = eyes;
        }

        SetLegs(legs: number): void {
            this.enemy.Legs = legs;
        }

        SetWeapons(hasWeapons: boolean): void {
            this.enemy.hasWeapons = hasWeapons;
        }

        SetWings(wings: number): void {
            this.enemy.Wings = wings;
        }

        GetEnemy(): ReptileEnemy {
            return this.enemy;
        }
    }

// EnemyBuilder implementation for creating a custom Enemy Manual
    class CustomEnemyManualBuilder implements EnemyBuilder {
        manual: ReptileEnemyManual;

        constructor() {
            this.manual = new ReptileEnemyManual();
        }

        Reset(): void {
            this.manual = new ReptileEnemyManual();
        }

        SetArms(arms: number): void {
            this.manual.Arms = `This enemy has ${arms} arms.`;
        }

        SetEyes(eyes: number): void {
            this.manual.Eyes = `This enemy has ${eyes} eyes.`;
        }

        SetLegs(legs: number): void {
            this.manual.Legs = `This enemy has ${legs} legs.`;
        }

        SetWings(wings: number): void {
            this.manual.Wings = `This enemy has ${wings} wings.`;
        }

        SetBossEnemy(isBoss: boolean): void {
            this.manual.isBossEnemy = `This enemy is ${isBoss ? "" : "not "}a boss enemy.`;
        }

        SetWeapons(hasWeapons: boolean): void {
            this.manual.hasWeapons = `This enemy does ${hasWeapons ? "" : "not"} carry weapons.`;
        }

        GetEnemy(): ReptileEnemyManual {
            return this.manual;
        }
    }

// Director class used for easily creating common configurations of the EnemyBuilder
    class Director {
        // Quickly create a common configuration using a set of predefined method calls
        ConstructDefaultReptileEnemy(builder: EnemyBuilder) {
            builder.SetArms(2);
            builder.SetLegs(2);
            builder.SetEyes(2);
            builder.SetWeapons(true);
        }
    }

    new BuilderPatternProgram();// Run with: npx ts-node src/ts/BuilderPattern.ts
}