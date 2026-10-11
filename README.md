# Flit

Flap through the gaps. See how long you last.

**[Play the game](https://gabe-torres.github.io/flit/)**

![Title screen on a clear day. A yellow finch hangs in the sky, and a ruby peeks out of the dirt.](docs/load.png)

Flit is a one-button flyer in the tradition of Flappy Bird. [PixiJS](https://pixijs.com/) draws the bird, the gates, and the field. The sound is synthesized. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) caches the page so a home-screen install still runs offline. The published game is still one HTML file.

## How to play

The bird falls. You keep it in the air.

- On the title, pick a flyer: finch, flamingo, penguin, cardinal, blue jay, pelican, dodo, pterodactyl, drone, lunar lander, kiwi, weka, flying rainbow trout, rocket shark, Appa, Momo, Charizard, or Mew. The choice stays in this browser.
- On the title, pick a difficulty. Easy begins with far gates and a tall opening. Every 5 you clear, the next ones sit a little closer and the opening gets a little shorter. After 20, they match the original. Normal is that original distance and opening from the first gate. Hard is tighter than that original, and the hole can sit anywhere. Random rolls every gate on its own, so a far gate can be followed by a close one, then a far one again. The choice stays in this browser.
- On the title, and again after a run, pick a map. Classic keeps the green gates. Roman builds stone columns wrapped in vines. Colony is a broken ship with aliens crawling on the wreck. Coral grows coral towers, with fish beside them. The gaps stay the same. The choice stays in this browser.
- The field follows the real date where you are: spring, summer, autumn, or winter. On a holiday it dresses for that day: New Year, Valentine's Day, St. Patrick's Day, Easter weekend, the week of Halloween, Thanksgiving and the Friday after, and the week of Christmas.
- Each run has its own weather: clear, rain, a storm with a tornado, a blizzard, a heat wave, fog, or wind. A new run rolls a new sky.
- Each gate you clear is one point.
- A gate or the ground ends the run.
- Before you clear 25 pipes, there is a 1 in 100 chance a pterodactyl flies in, grabs you, and carries you away. After 25 pipes it does not come.
- After the score card, flap again to fly. The card lists your taps, the pipes you cleared, and your time in the air.

## Controls

On a phone:

- Tap the screen to flap. The same tap starts a run, resumes a pause, and starts the next run after the score card.
- The buttons in the corner pause and mute.

On a computer:

- Click the screen, or press Space, Up, or W, to flap. The same control starts a run, resumes a pause, and starts the next run after the score card.
- P pauses. M mutes. R returns to the title. The buttons in the corner pause and mute too.

Each difficulty keeps its own best score in this browser. That score sits in the top left, under the name of the difficulty you have selected, and the medal that score earned sits beside the number. A run of 30 earns bronze, 70 silver, and 100 a ruby. A few more rubies are buried in the dirt. They are just sitting there.

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
