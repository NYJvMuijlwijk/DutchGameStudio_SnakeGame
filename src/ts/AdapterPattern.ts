namespace Patterns {
    /*
    * The Adapter Pattern is used when, for example, you start using a 3rd party library that takes in data in a different format
    * than is created by your own program (square hole, round peg). To be able to use the data created by your program in the 3rd 
    * party library, it will need to be converted into a form use-able by this 3rd party library. This is where you create an 
    * Adapter to handle this conversion. The Adapter returns data in the format used by the 3rd party library, but takes in 
    * data from your project. 
    * Using Adapters, your code can now utilize the 3rd party library without needing to change its code structure or the code 
    * structure of this 3rd party library (should that even be possible).
    * */
    class AdapterPatternProgram {
        // Properties for a Temperature probe and Display
        probe: TemperatureProbe;
        display: TemperatureDisplay;

        constructor() {
            // Initialize properties
            this.probe = new TemperatureProbe();
            this.display = new TemperatureDisplay();

            // Get the temperature from the probe
            let probeTemp = this.probe.GetTemperature();

            // Won't work because DisplayTemperature takes in a different type of data
            // this.display.DisplayTemperature(probeTemp);

            // Create an use-able type of data using an adapter
            let celsiusFahrenheitAdapter = new TemperatureCelsiusAdapter(probeTemp);

            // Display the temperature using the adapter
            this.display.DisplayTemperature(celsiusFahrenheitAdapter);
        }
    }

// Class for defining Temperature data in Celsius
    class TemperatureCelsius {
        temperature: number;

        constructor(temperature: number) {
            this.temperature = temperature;
        }
    }

// Class for defining Temperature data in Fahrenheit
    class TemperatureFahrenheit {
        temperature: string;

        constructor(temperature: string) {
            this.temperature = temperature;
        }
    }

// Class for getting temperature data
    class TemperatureProbe {
        GetTemperature(): TemperatureCelsius {
            return {temperature: Math.random() * 30};
        }
    }

// Class for displaying temperature data
    class TemperatureDisplay {
        DisplayTemperature(data: TemperatureFahrenheit): void {
            console.log(`The temperature is ${data.temperature} degrees fahrenheit`);
        }
    }

// Adapter class for converting TemperatureCelsius to TemperatureFahrenheit
    class TemperatureCelsiusAdapter extends TemperatureFahrenheit {
        constructor(celsius: TemperatureCelsius) {
            let temp = (celsius.temperature * 9 / 5 + 32).toFixed(2).toString();

            super(temp);
        }
    }

    new AdapterPatternProgram();// Run with: npx ts-node src/ts/AdapterPattern.ts
}