# Flit

Flap through the gaps. See how long you last.

**[Play the game](https://gabe-torres.github.io/flit/)**

![Title screen on a clear day. A yellow finch hangs in the sky, and a ruby peeks out of the dirt.](docs/load.png)

Flit is a one-button flyer in the tradition of Flappy Bird. [PixiJS](https://pixijs.com/) draws the bird, the gates, and the field. The sound is synthesized. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) caches the page so a home-screen install still runs offline. The published game is still one HTML file.

## How to play

The bird falls. You keep it in the air.

- On the title, and again after a run, a button beside pause opens the flyer, the map, and the difficulty.
- Pick a flyer: finch, flamingo, penguin, cardinal, blue jay, pelican, magpie, pterodactyl, drone, lunar lander, Ha'tak, kiwi, weka, flying rainbow trout, rocket shark, or Mew. The choice stays in this browser.
- Normal is the original distance and opening from the first gate. Hard is tighter than that original, and the hole can sit anywhere. Test keeps that original course and adds powers. The choice stays in this browser.
- In Test, powers sit in the gap between the pipes. You can hold one. Picking up another replaces it. Slow motion and passing through pipes wear off. A blaster gives three shots, and each flap fires one. One shot removes a pipe. A stargate is a rare random find, and another cannot appear for the next 20 pipes. It races up and down. Fly through it and you skip 10 pipes ahead.
- Classic keeps the green gates. Roman builds stone columns wrapped in vines. The gaps stay the same. The choice stays in this browser.
- On the title, a stargate drifts across the sky on every map. The wormhole turns.
- The field follows the real date where you are: spring, summer, autumn, or winter. A holiday dresses the whole month it falls in: January is New Year, February is Valentine's Day, March is St. Patrick's Day, the month of Easter is Easter, October is Halloween, November is Thanksgiving, and December is Christmas.
- Each gate you clear is one point.
- A gate or the ground ends the run.
- Each run has a 1 in 100 chance a pterodactyl flies in after you clear the first pipe, grabs you, and carries you away. The chance lasts until you clear 25 pipes.
- After the score card, flap again to fly. The card lists your taps, the pipes you cleared, and your time in the air.

## Controls

On a phone:

- Tap the screen to flap. The same tap starts a run, resumes a pause, and starts the next run after the score card.
- A button beside pause opens the flyer, the map, and the difficulty. The other corner buttons pause and mute.
- In Test, each tap fires while you hold the blaster. A Shoot button does too.

On a computer:

- Click the screen, or press Space, Up, or W, to flap. The same control starts a run, resumes a pause, and starts the next run after the score card.
- P pauses. M mutes. R returns to the title. The corner buttons pause and mute too, and the one beside pause opens the flyer, the map, and the difficulty.
- In Test, each flap fires the blaster. F and the Shoot button do too.

Each difficulty keeps its own best score in this browser. That score sits in the top left, under the name of the difficulty you have selected, and the medal that score earned sits beside the number. A run of 30 earns bronze, 70 silver, and 100 a ruby. A few more rubies are buried in the dirt. They are just sitting there. Deeper down, a bone turns up now and then, and one of them is a T. rex skull.

On a phone, open the play link in the browser. A texted HTML file is only a preview, and the game will not start from it. Open the play link once while you are online, then add it to the home screen. The icon is the yellow bird. After that the game runs with the network off.

## Develop

From this folder:

```bash
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/).

```bash
npm test          # checks the flight numbers
npm run build     # writes one HTML file and copies it to docs/
npm run preview   # serves that build
```

GitHub Pages serves `docs/index.html` at the play link above. The Vite entry stays `index.html`. Leave the source file alone when you publish.
