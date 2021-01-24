namespace Patterns {
    /*
    * We have a class that holds an Array, in this case one of numbers, and has a method to sort this Array based on an algorithm.
    * Rather than specifying a specific algorithm to use, it has a property that holds an implementation of the ISortingAlgorithm interface.
    * This implementation is passed as a parameter when the ListHolder class is created.
    * Doing it this way allows our code to remain decoupled and makes it easier to add new algorithms in the future,
    * without any risk of them affecting the code withing the ListHolder class. The class isn't concerned with the actual implementation
    * of the algorithm itself, it only cares about the it having a Sort method which takes and returns a Array of numbers.
    */
    class StrategyPatternProgram {
        constructor() {
            let algorithmA = new AlgorithmA();
            let algorithmB = new AlgorithmB();
            
            let listholderA = new ListHolder(algorithmA);
            let listholderB = new ListHolder(algorithmB);
            
            listholderA.GetSortedList();
            listholderB.GetSortedList();
        }
    }

    class ListHolder {
        private _algorithm: ISortingAlgorithm;
        public List: Array<number> = [2, 1, 3];

        /*
        * Here we pass an implementation of the ISortingAlgorithm, we can decide which algorithm to use when we are creating
        * an instance of the ListHolder class. If _algorithm were to be public, we could even change to algorithm at runtime.
        */
        constructor(algorithm: ISortingAlgorithm) {
            this._algorithm = algorithm;
        }

        /*
        * Here we use the algorithm to get us our sorted Array. We don't know how the algorithm implements the Sort method,
        * only that it takes an Array of numbers and returns an assumed sorted one. This allows us to stay decoupled from the
        * actual algorithm code.
        */
        GetSortedList(): Array<number> {
            return this._algorithm.Sort(this.List);
        }
    }

// The interface to be implemented by current and future algorithms.
    interface ISortingAlgorithm {
        Sort(list: Array<number>): Array<number>;
    }

// Implementation A of the ISortingAlgorithm interface
    class AlgorithmA implements ISortingAlgorithm {
        public Sort(list: Array<number>): Array<number> {
            // Sort list..
            console.log("Sorting A")
            return list;
        }
    }

// Implementation B of the ISortingAlgorithm interface
    class AlgorithmB implements ISortingAlgorithm {
        Sort(list: Array<number>): Array<number> {
            // Sort list..
            console.log("Sorting B")
            return list;
        }
    }
    
    new StrategyPatternProgram();
}