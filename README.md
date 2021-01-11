# Kill/Death/Win Logger

An example server to log kill/death/win stats from Overwolf + Shots Fired (via webhook).

> The example only supports Fortnite events.


## Usage

You'll need Node.js installed on your computer, and either `npm` or `yarn`.

With `npm`, run the following:

```
npm install && npm start
```

Replace `npm` with `yarn` in the above if you're using that instead.

## Info

You can setup the paths to each file in the config directory, by default it will log to the `./logs` directory.

When the script starts, it will check when the logs were last accessed, and if they were before today, it will copy the value to a `*.yesterday` file and set the current stat to '0'.

If the file doesn't exist for the stat (i.e. `wins.txt` doesn't exist), it will create the file with a '0' as the contents.

Each time you have a kill/death/win, the current value will be incremented by 1.

To use this in OBS, setup a `Text (GDI+)` source and click the `Read from file` checkbox (above the Text field) - point to one of the files above.

## Questions

Join the [Shots Fired Discord server](https://discord.gg/eBBnNfM)
