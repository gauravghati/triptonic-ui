# triptonic-ui

### Setup

- Git clone repo
- cd into the repo
- npm install
- npm start
(Ensure Expo go app is installed on your phone to check for testing mobile app)

---

### TODO

- [x] HD Splash screen with animations (Export png from figma designs)
- [x] Decide upon logo using lottie animations
- [x] Adjust font-weight for rethink font (download different weights from googlefonts)
- [x] Add logo to the header
- [ ] Rewrite all the styles using tailwind
- [x] Make components resusable like button, text
- [x] Setup constants for maps and color themes
- [x] Decide upon initial map zoom
- [ ] Google map styles - https://mapstyle.withgoogle.com/
- [x] Decide upon loader animations - lottie
- [ ] Add back navigation button to map view screens
- [ ] Make the filter screen button clickables.
- [ ] Make progress with the save page and login page.

---

### Troubleshooting

- If styles are not reflecting, do the following
  - Just comment/uncomment fontLoaded conditional in _layout.tsx to reflect the styles
  - And run: `npm start --clear`
