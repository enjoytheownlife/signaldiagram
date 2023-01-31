# Signal Diagram

## Notes abou the code structure

Add <ENVIRONMENT=dev> to .env file

The home page redirects to /designer, this is the drawing tool.

Each svg object is derived from a class instance. The classes are defined in lib/classes

Keypress events are in lib/functions/events/key.ts

### About

Signal Diagram is a Svelte app designed to create signal and power diagrams for modular LED screen builds. It is completely free, requires no login, and stores no cookies from user sessions. PNG files can be download from the Export button in the toolbar. Saving a layout downloads a .json file. This file can be loaded into the app to recall a configuration.

The production branch is hosted [here](https://www.signaldiagram.com).

Signal Diagram utilizes the [d3.js libarary](https://d3js.org/).

### Reporting Bugs

Please post bugs to the forum on the issues tab above

### Pull Requests

Pull Requests are welcome! Contact me directly with questions at devon@leadled.io
