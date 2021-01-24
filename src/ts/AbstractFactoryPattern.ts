namespace Patterns {
    /*
    * The Abstract Factory Pattern is similar to the Factory Method pattern. But rather than having only part of the class logic
    * be overridden in a subclass, the entire class is to be implemented in the subclass. Again, the class using the factory doesn't
    * need to know the exact type of products (Archer, Warrior, Wizard) that are being created, only the base class/interface they
    * derive from. The same goes for the factory itself, it doesn't care what kind of factory it is, as long as it derives from
    * the factory base class/interface. This allows us to easily create new factories and products without it affecting the
    * code of the class the factory is used in. As well as allowing the factory to be changed at runtime should that be desired.
    * */
    class AbstractFactoryProgram {
        // Properties for holding the factory and the enemies created by them
        factory: EnemyFactory;
        archer: Archer;
        warrior: Warrior;
        wizard: Wizard;

        constructor() {
            // factory property initialized, this can also be done via the constructor, allowing for different factories based
            // on eg. the current level
            this.factory = new HumanEnemyFactory();

            // An enemy of each type is created
            this.archer = this.factory.CreateArcher();
            this.warrior = this.factory.CreateWarrior();
            this.wizard = this.factory.CreateWizard();

            // Enemies use their respective attacks
            this.archer.Shoot();
            this.warrior.Strike();
            this.wizard.Cast();

            // A different factory is created, for example because a new level is loaded or the difficulty is changed
            this.factory = new SkeletonEnemyFactory();

            // New set of enemies is created
            this.archer = this.factory.CreateArcher();
            this.warrior = this.factory.CreateWarrior();
            this.wizard = this.factory.CreateWizard();

            // New enemies attack
            this.archer.Shoot();
            this.warrior.Strike();
            this.wizard.Cast();
        }
    }

// Interfaces for the different enemies and the factory that creates them
    interface Archer {
        Shoot(): void;
    }

    interface Warrior {
        Strike(): void;
    }

    interface Wizard {
        Cast(): void;
    }

    interface EnemyFactory {
        CreateArcher(): Archer;

        CreateWarrior(): Warrior;

        CreateWizard(): Wizard;
    }

// Implementations of the different human enemies
    class HumanArcher implements Archer {
        Shoot(): void {
            console.log("Human Archer shoots");
        }
    }

    class HumanWarrior implements Warrior {
        Strike(): void {
            console.log("Human Warrior strikes");
        }
    }

    class HumanWizard implements Wizard {
        Cast(): void {
            console.log("Human Wizard casts");
        }
    }

// Implementations of the different skeleton enemies
    class SkeletonArcher implements Archer {
        Shoot(): void {
            console.log("Skeleton Archer shoots");
        }
    }

    class SkeletonWarrior implements Warrior {
        Strike(): void {
            console.log("Skeleton Warrior strikes");
        }
    }

    class SkeletonWizard implements Wizard {
        Cast(): void {
            console.log("Skeleton Wizard casts");
        }
    }

// Implementations of the different factories
    class HumanEnemyFactory implements EnemyFactory {
        CreateArcher(): Archer {
            return new HumanArcher();
        }

        CreateWarrior(): Warrior {
            return new HumanWarrior();
        }

        CreateWizard(): Wizard {
            return new HumanWizard();
        }
    }

    class SkeletonEnemyFactory implements EnemyFactory {
        CreateArcher(): Archer {
            return new SkeletonArcher();
        }

        CreateWarrior(): Warrior {
            return new SkeletonWarrior();
        }

        CreateWizard(): Wizard {
            return new SkeletonWizard();
        }
    }

    new AbstractFactoryProgram();// Run with: npx ts-node src/ts/AbstractFactoryPattern.ts
}
