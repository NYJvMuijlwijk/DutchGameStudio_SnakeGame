namespace Patterns {
    /*
    * The observer pattern helps with many to one relationships in your code. Rather then constantly requesting an update to
    * see if there have been changes, the observable instead allows observers to register onto itself and then notifies them
    * at the desired time eg. PlayerDeath, LevelFinished or CheckpointReached. When this happens, the observable calls a predefined
    * method on the observer where the logic of that specific observer is located, optionally with some eventArgs.
    * This way, updates aren't needlessly requested and the observable doesn't need to be concerned with the observers code,
    * making things decoupled. It is also easy to create new implementations of observers and add or remove them dynamically.
    * */
    class ObserverProgram {
        constructor() {
            // Create a player/IObservable and two different implementations of the IObserver interface
            let player = new Player();
            let observerA = new ObserverA();
            let observerB = new ObserverB();

            // Add the two observers to the player's observer list
            player.AddObserver(observerA);
            player.AddObserver(observerB);

            // Notify the player's observers with some eventArgs
            player.Notify({message: "Notify"});

            // Remove Observer A from list of observers
            player.RemoveObserver(observerA)

            // Notify the player's observers again
            player.Notify({message: "Notify again"})
        }
    }

    /*
    * Interface for defining an Observable.
    * Observables have a list of all its current observers and functions for adding, removing and notifying those observers.
    * It is however not aware of or concerned about the observers code, keeping everything decoupled.
    * */
    interface IObservable {
        observers: IObserver[];

        AddObserver(observer: IObserver): void;

        RemoveObserver(observer: IObserver): void;

        Notify(eventArgs: IEventArgs): void;
    }

// Interface for some simple eventArgs
    interface IEventArgs {
        message: string;
    }

    /*
    * Interface for defining an Observer.
    * Holds the Update method which gets called by the Observable in the Notify method.
    * */
    interface IObserver {
        Update(eventArgs: IEventArgs): void;
    }

// Implementation of the IObservable interface
    class Player implements IObservable {
        // List of all the observers of the observable
        observers: IObserver[] = [];

        // Calls the Update method on all the registered observers
        Notify(eventArgs: IEventArgs): void {
            this.observers.forEach((observer) => {
                observer.Update(eventArgs);
            })
        }

        // Method for adding an observer to the list
        AddObserver(observer: IObserver): void {
            this.observers.push(observer)
        }

        // Method for removing an observer from the list
        RemoveObserver(observer: IObserver): void {
            let index = this.observers.indexOf(observer)
            this.observers.splice(index, 1);
        }
    }

// Implementation A of the IObserver interface
    class ObserverA implements IObserver {
        Update(eventArgs: IEventArgs): void {
            console.log("Observer A: " + eventArgs.message);
        }
    }

// Implementation B of the IObserver interface
    class ObserverB implements IObserver {
        Update(eventArgs: IEventArgs): void {
            console.log("Observer B: " + eventArgs.message);
        }
    }

    new ObserverProgram();// Run with: npx ts-node src/ts/ObserverPattern.ts
}