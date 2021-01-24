namespace Patterns {
    /*
    * The Facade Pattern introduces Facades: classes that simplify UI for what might otherwise be complex interaction. In the
    * example code below we have a lot of (simplified) complex logic required for loading a level. Rather than calling all this
    * logic manually in what could be a specific order based on several factors and requiring data from all over the project,
    * we instead create a facade class with methods which handle all of this for us. Now all we need to do is create an instance 
    * of this facade class and call the desired method eg. LoadLevel. When a facade class becomes too big, we can split it 
    * up into several smaller facade classes to keep things neatly separated.
    * */
    class FacadePatternProgram {
        // LevelLoader property for loading levels
        levelLoader: LevelManager;

        constructor() {
            // Initialize levelLoader and load levels using a simplified method call
            this.levelLoader = new LevelManager();
            // LoadLevel might use different logic based on which level is loaded, 
            // but the main program doesn't need to concerned about this
            this.levelLoader.LoadLevel(1);
            this.levelLoader.LoadLevel(5);
        }
    }

// Facade class for simplifying interaction for the management of levels inside the main program
    class LevelManager {
        // Load level method, calls all the required logic to initialize and actually load a level
        LoadLevel(levelNumber: number): void {
            let result = new InitializationLogic1().DoSomething(levelNumber);
            result = new InitializationLogic2().DoSomething(result);
            if (levelNumber > 3) result = new InitializationLogic3().DoSomething(result);
            else result = new InitializationLogic4().DoSomething(result);
            new InitializationLogic5().LoadLevel(result);
        }
    }

// Simple class for demo purposes
    class IntermediateResult {
        data: any;
    }

// Intricate and complex logic needed for loading a level
    class InitializationLogic1 {
        DoSomething(levelNumber: number): IntermediateResult {
            return {data: `Level: ${levelNumber}, Logic: `}
        }
    }

    class InitializationLogic2 {
        DoSomething(data: IntermediateResult): IntermediateResult {
            return {data: data.data + "Logic2"}
        }
    }

    class InitializationLogic3 {
        DoSomething(data: IntermediateResult): IntermediateResult {
            return {data: data.data + ", Logic3"}
        }
    }

    class InitializationLogic4 {
        DoSomething(data: IntermediateResult): IntermediateResult {
            return {data: data.data + ", Logic4"}
        }
    }

    class InitializationLogic5 {
        LoadLevel(data: IntermediateResult): void {
            console.log(`Loading level, results: ${data.data}`)
        }
    }

    new FacadePatternProgram();// Run With: npx ts-node src/ts/FacadePattern.ts
}