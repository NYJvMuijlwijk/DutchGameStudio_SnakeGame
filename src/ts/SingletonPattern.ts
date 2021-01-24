namespace Patterns {
    /*
    * The Singleton Pattern provides us with an object of which only one instance exists at the same time, and this instance
    * is globally available. A singleton can be helpful when dealing with something like a database connection. In this case,
    * having only a single instance can be important as multiple connections might interfere with each other when reading or 
    * writing data, as wel as simply being heavy on the programs memory. Global access makes it easy to get the created database
    * connection anywhere in your project.
    * Aside from these pros, there are also many cons to using the Singleton Pattern: it violates the Single Responsibility 
    * Principle, it couples your code the more you use it and it can create problems in a multi-threaded environment where 
    * multiple threads may try to access its data at the same time, to name a few.
    * */
    class SingletonProgram {
        constructor() {
            // Get the Singleton instance
            let singleton = Singleton.GetInstance();

            singleton.DoSomething();

            // Get another instance of the Singleton class
            let anotherSingleton = Singleton.GetInstance();

            singleton.DoSomething();

            // Both singleton variables reference the same Singleton instance
            console.log(`singleton == anotherSingleton: ${singleton == anotherSingleton}`);
        }
    }

    class Singleton {
        // Static instance property of the Singleton class.
        private static instance: Singleton;
        private doingSomethingCount: number = 0;

        // Make constructor private so no new instances can be created elsewhere in the project
        private constructor() {
        }

        // Retrieve the Singleton instance
        static GetInstance(): Singleton {
            // If the instance doesn't exist yet, create a new Singleton
            if (Singleton.instance == null) Singleton.instance = new Singleton();

            // Return the (now) existing instance
            return Singleton.instance;
        }

        // Simple method for demo purposes
        DoSomething(): void {
            this.doingSomethingCount++;
            console.log(`Doing Something. Count: ${this.doingSomethingCount}`);
        }
    }

    new SingletonProgram();// Run with: npx ts-node src/ts/SingletonPattern.ts
}