namespace Patterns {
    /*
    * The State Pattern allows an objects functionality to change depending on the state it is in. For this it requires an common
    * interface for methods that can be executed in any certain state. The main program has a property which holds an implementation
    * of the State interface with within it the logic that it can or cannot perform. By allowing the main program's state to change,
    * we can control the actions it can perform at a certain moment in time. 
    * Consider the example below of a Player in a game. When it is on the ground it can move, crouch, attack or jump. If the 
    * player crouches, we change to a crouched state in which we cannot attack (because we decided we can't). If we then jump 
    * we change to a jumping state where our logic changes once again. While jumping we cannot crouch, but we can double jump 
    * once and our attack turns into a ground pound.
    * 
    * Using states this way gives us control over the players functionality and allows us to store state specific data inside
    * a state implementation(think a boolean for canDoubleJump). This keeps it out of the main player class and prevents the need
    * for a large conditional tree to handle all our different allowed actions using many variable fields.
    * */
    class StatePatternProgram {
        // Property for holding the player
        player: StatePlayer;

        constructor() {
            // Initialize player
            this.player = new StatePlayer();

            // Manually simulate and handle input, normally happens inside the update loop.
            // State changes based on the input, each state handles input differently if at all (certain actions not possible)
            let input: IPlayerInput = {moved: true, crouched: true, attacked: true, jumped: true};
            this.player.HandleInput(input);// Player moves, then crouches, then jumps and then attacks (ground pound)
            input = {moved: false, crouched: false, attacked: false, jumped: true};
            this.player.HandleInput(input);// Player Jumps
            this.player.HandleInput(input);// Player double jumps
            this.player.HandleInput(input);// Player can't double jump again
            input = {moved: false, crouched: false, attacked: true, jumped: false};
            this.player.HandleInput(input);// Player ground pounds
            this.player.HandleInput(input);// Player attacks
        }
    }

// Interface for defining implementation of a player State
    interface IState {
        player: StatePlayer;

        Move(): void;

        Jump(): void;

        Crouch(): void;

        Attack(): void;
    }

// Implementations for a few different states with simplified input handling
    class CrouchedState implements IState {
        player: StatePlayer;

        constructor(player: StatePlayer) {
            this.player = player;
        }

        Attack(): void {
            // nothing happens
            console.log("Can't attack while crouching");
        }

        Crouch(): void {
            // Stand up and change to GroundedState
            console.log("Player stands up");
            this.player.ChangeState(new GroundedState(this.player));
        }

        Jump(): void {
            // Jump and change to Jumping State
            console.log("Player Jumps from crouched position");
            this.player.ChangeState(new JumpingState(this.player));
        }

        Move(): void {
            // move and remain in Crouched State
            console.log("Player moves while crouched");
        }
    }

    class JumpingState implements IState {
        player: StatePlayer;
        doubleJump: boolean;

        constructor(player: StatePlayer) {
            this.doubleJump = true;
            this.player = player;
        }

        Attack(): void {
            // Attack and change to Grounded State
            console.log("Player Ground Pounds");
            this.player.ChangeState(new GroundedState(this.player));
        }

        Crouch(): void {
            // nothing happens
            console.log("Can't crouch while jumping");
        }

        Jump(): void {
            // Double Jump if possible and remain in Jumping State
            if (this.doubleJump) {
                console.log("Player Double Jumps");
                this.doubleJump = false;
            } else console.log("Player can't Double Jump again");
        }

        Move(): void {
            // Land then Move and change to Grounded State
            console.log("Player Lands and Moves");
            this.player.ChangeState(new GroundedState(this.player));
        }
    }

    class GroundedState implements IState {
        player: StatePlayer;

        constructor(player: StatePlayer) {
            this.player = player;
        }

        Attack(): void {
            // Attack and remain in Grounded State
            console.log("Player Attacks");
        }

        Crouch(): void {
            // Crouch and change to Crouched State
            console.log("Player Crouches");
            this.player.ChangeState(new CrouchedState(this.player));
        }

        Jump(): void {
            // Jump and change to Jumping State
            console.log("Player Jumps");
            this.player.ChangeState(new JumpingState(this.player));
        }

        Move(): void {
            // Move and remain in Grounded State
            console.log("Player Moves");
        }

    }

// Interface to define implementation of player input
    interface IPlayerInput {
        moved: boolean;
        jumped: boolean;
        crouched: boolean;
        attacked: boolean;
    }

// Player class with states containing different state specific logic for handling player input
    class StatePlayer {
        // Property for storing the players current state
        private state: IState;

        // Initialize state to GroundedState
        constructor() {
            this.state = new GroundedState(this);
        }

        // Handle input by calling State methods on the current state
        HandleInput(input: IPlayerInput) {
            console.log("===== handle input =====")
            if (input.moved) this.state.Move();
            if (input.crouched) this.state.Crouch();
            if (input.jumped) this.state.Jump();
            if (input.attacked) this.state.Attack();
        }

        // Method for changing the current player State
        ChangeState(state: IState) {
            this.state = state;
        }
    }

    new StatePatternProgram();// Run With: npx ts-node src/ts/StatePattern.ts
}