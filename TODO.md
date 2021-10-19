# Todo
A list of all the things planned to do for BitShift

## Tools
- ~~Pan tool~~
  - ~~Improve pan tool~~
- Zoom tool
  - Improve zoom tool
- Spray brush tool
  - Improve to make speed 1 not produce as many particles 
- Smudge and scatter tools
  - Effect surrounding pixels
- Magic wand tool
- Marquee tool
- General transforming and rotation
- ~~Eyedropper~~
- Tool settings
  - ~~Main Window~~
  - Brush:
    - Square brush
    - ~~Brush size~~
    - Smoothing w/ cardinal curves
    - Pixel Perfect Algorithm
  - Spray Brush: 
    - ~~Spray Speed~~
    - ~~Spray Size~~
      - ~~How big each pixel in the spray is~~
  - Filled shapes
- Gradient tool (Dither & No dither)

## Palettes
- Add color to palette
- Rewrite to make class based
- Rename palettes
- Create palettes
- Recent colors palette (20 colors max ?)
- Drag and drop to import ([Use Anypalette.js](https://1j01.github.io/anypalette.js/demo))
  - For mobile, add button to import palette
- Import image as palette
- Palette window 
  - Show only top x palettes in main window
  - Separate window for all palettes w/ search bar
- Export to image ?
- Export to palette formats
- Palettes are saved in account

## Layers
- Layer settings 
  - Image blending
  - opacity
  - alpha lock
  - hidden or not
  - locked
- Layer folders
- Reference images
- Create new layer
- Use masonry.js to handle the movement - https://masonry.desandro.com/ 

## Animation
- Add frames
- Change FPS
- Timeline window
- Export as GIF

## Menus
- File menu
  - add Preferences
  - Anything that can be modified in the code
  - Keyboard shortcuts & changing them
  - theming 
- Gallery
  - Create new
  - View all recent 
  - Star / rate an art
  - folders
  - rename 
  - duplicate
  - delete
  - export
  - Use Infinite Scroll.js - https://infinite-scroll.com/
  - Tagging
- Account 
- Export Image
  - Format options
  - Location options
  - Resize options
- Image options
  - Resize canvas
  - Crop

## Animation

## Visual changes 
- Fork remixicon to add Spray can, along with other various tools
- Make responsive on mobile devices
- ~~Give borders of palette windows an extra 4px~~
- Enforce constant transitions on background and color across all ui
- Theming

## Other
- Keyboard Shortcuts
- Undo / Redo
- Give spray tool an outline to show the radius of possible spray locations
- Give eraser outline to show where it will erase

## Bugs
- ~~Number input in Settings doesnt work properly when drag editing:~~
  - ~~On firefox, when you lift mouse button, it ends event~~
  - ~~On chrome, it doesnt end the event when lift~~
- Number Input doesnt clear event listeners when recreating the tool settings menu
- On mobile, dragging the palette window ends up messing with the top bar
- Color palettes dont fill when making a new file
- Tools dont get set on making a new file
- New file has "artifacts" of an old file until you refresh (it almost draws between the old and new)
- Touch zoom on mobile is not functional
- Zoom tool is not functional
- Eraser tool does not function as a normal brush does
  - ~~Is not affected by `brushSize`~~
  - ~~Does not have lines going between its points~~
  - Major performance issue inherent in destination-out
  - Should not display as a normal brush:
    - Show as clearing the area below it
    - OR Show as an outline (similar to Aseprite)
- Lines get cut off if theyre off screen, causing the canvas to see the cursor as drawing when the mouse buttons arent held.
  - Allow drawing off screen
    - Useful in lines, shapes, and general drawing.
- Some event listeners use faulty `touches` detection; adapt to new way of doing it (can be based on `opacDrag()`)
- Filler crashes when filling on a blank canvas / pixel (only found on mobile, need to test on desktop)