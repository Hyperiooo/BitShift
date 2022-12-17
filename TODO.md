# Todo

A list of all the things planned to do for BitShift

## Tools

- ~~Spray brush tool~~
  - ~~Improve to make speed 1 not produce as many particles ~~
- Smudge and scatter tools
  - Effect surrounding pixels
- Magic wand tool
- ~~Marquee tool~~
  - ~~add stuff to a dummy canvas and clip with either canvas built in clip or with global composite~~
- General transforming and rotation
- Tool settings
  - place under the toolbar
  - ~~Main Window~~
  - Brush:
    - Square brush
    - ~~Brush size~~
    - Smoothing w/ cardinal curves
    - Pixel Perfect Algorithm
  - ~~Spray Brush:~~
    - ~~Spray Speed~~
    - ~~Spray Size~~
      - ~~How big each pixel in the spray is~~
  - ~~Filled shapes~~
- Gradient tool (Dither & No dither)
- ~~Pan tool~~
  - ~~Improve pan tool~~
    - ~~just removed~~
- ~~Eyedropper~~
- ~~Zoom tool~~
  - ~~Improve zoom tool~~
    - ~~just removed~~

## Palettes

- Add color to palette
- ~~Rewrite to make class based~~
- Rename palettes
- Create palettes
- Recent colors palette (20 colors max ?)
- ~~Drag and drop to import ([Use Anypalette.js](https://1j01.github.io/anypalette.js/demo))~~
  - For mobile, add button to import palette
- ~~Import image as palette~~
- Palette window
  - Show only top x palettes in main window
  - Separate window for all palettes w/ search bar
- Export to image ?
- Export to palette formats
- ~~Palettes are saved in account~~
- ~~Add error handling for imports~~

## Layers

- Layer settings
  - Image blending
    - can be done with global composite operations when exporting, when editing can be done with css blend modes
  - opacity
  - alpha lock
    - can be done with global composite operations
  - ~~hidden or not~~
  - ~~locked~~
- Layer folders
- Reference images
- ~~Create new layer~~

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
- ~~Export Image~~
  - ~~Format options~~
  - ~~Location options~~
  - ~~Resize options~~
- Image options
  - Resize canvas
  - Crop

## Animation

## Visual changes

- ~~Fork remixicon to add Spray can, along with other various tools~~
- Make responsive on mobile devices
  - started
- ~~Enforce constant transitions on background and color across all ui~~
- Theming
  - started, no way to set in-app
- ~~Add min width, max height to tool settings content~~
- Improve tool settings inputs to allow for input groups with proper rounding and units
  - Add new input types
- Add full screen to phone to avoid annoying scroll issue
- ~~Make canvas parent full height when closing navbar on mobile~~
  - ~~Take functionality from Delta~~
- ~~Make canvas resize based on the canvas parent, not the entire document~~
- ~~Dont include toolbar with the canvasParent height~~
- ~~Transition between tool settings better; Change height smoothly, fade opacity at 0.1s~~
- ~~Give borders of palette windows an extra 4px~~

## Other

- ~~Keyboard Shortcuts~~
  - added framework for them
- Undo / Redo
  - added for brush strokes
- ~~Give spray tool an outline to show the radius of possible spray locations~~
- Show preview details for rectangle, line, and circle
  - Height, width, starting & end point, radius etc
  - For a singular pixel, show cursors position on canvas
- Add reset view button
- Use monaco for script editor
- ~~Give eraser outline to show where it will erase~~

## Bugs

- Document doesnt perfectly center
- ~~with how the current "outline" on eraser and spray works, when zoomed in a lot the canvas gets too big on large canvas sizes, slows down performance. Make outline canvas only as big as it needs to be and move it around instead of making it the entire size of the canvas.~~
- ~~when creating palette via preview, the palette doesnt save properly unless it is used (clicking on a swatch)~~
- ~~Some event listeners use faulty `touches` detection; adapt to new way of doing it (can be based on `opacDrag()`)~~
- ~~Setting color via number inputs doesnt change the actual brush color~~
- ~~valueRect appears as undefined sometimes~~
- ~~Zoom tool is not functional~~
- ~~Palette will pop off when scrolling through color window on mobile~~
  - ~~Maybe implement a delay where the cursor cant move much? ~~
    - ~~If successful, begin the pop off.~~
- ~~On iPadOS, drag import does not work, but on anypalette's website it does~~
  - ~~doesnt work on any mac device but anypalette still works~~
    - ~~wasnt an issue with imports but an issue with spans being used for colors~~
- ~~Palette popup is offset in weird amounts on firefox~~
- ~~Touch zoom on mobile is not functional~~
- ~~Filler crashes when filling on a blank canvas / pixel (only found on mobile, need to test on desktop)~~
- ~~Canvas doesnt fill on an empty canvas on mobile & crashes~~
- ~~Eraser tool does not function as a normal brush does~~
  - ~~Is not affected by `brushSize`~~
  - ~~Does not have lines going between its points~~
  - ~~Major performance issue inherent in destination-out~~
    - ~~Somehow doesnt perform poorly on mobile or second computer, may just be my personal computer?~~
      - ~~On both computers that it performed well on, the browser was Chrome. On the low performing computer, the browser was Firefox~~
        - ~~SOMEHOW FIXED ITSELF??? IT WORKS PERFECTLY FINE NOW IN MOST CASES.~~
  - ~~Should not display as a normal brush:~~
    - ~~consider making it just make the area below it darker? like a gray at 50% opacity~~
    - ~~Show as clearing the area below it~~
    - ~~OR Show as an outline (similar to Aseprite)~~
      - ~~Do this by creating a special canvas thats larger than the current drwaing but at the same ratio, offset pixels in all 4 directions ( nw, ne, sw, se)~~
- ~~Lines get cut off if theyre off screen, causing the canvas to see the cursor as drawing when the mouse buttons arent held.~~
  - ~~Allow drawing off screen~~
    - ~~Useful in lines, shapes, and general drawing.~~
- ~~Color palettes dont fill when making a new file~~
- ~~Tools dont get set on making a new file~~
- ~~New file has "artifacts" of an old file until you refresh (it almost draws between the old and new)~~
- ~~Number input in Settings doesnt work properly when drag editing:~~
  - ~~On firefox, when you lift mouse button, it ends event~~
  - ~~On chrome, it doesnt end the event when lift~~
- ~~Number Input doesnt clear event listeners when recreating the tool settings menu~~
- ~~On mobile, dragging the palette window ends up messing with the top bar~~
  - ~~Prevent Defaults~~

## Enhancements

- ~~**_Restructure everything_**~~
- Hold on a color in a palette -> reorder & delete
  - Delete by moving swatch on to a delete bar that shows on the bottom of the color menu
- Drag the color preview in the hue/value area over a palette
  - add to a palette
  - little color drop follows mouse/finger
- Make color ui responsive
- long press on color menu button and drag over canvas to fill
- double click/tap on color preview to make a palette based on the color
- ~~drag distance on palettes should only work on pc, on mobile devices it shuold be via a long press due to scrolling~~
- ~~Make mousedown/touchstart only draw when the button is lifted up/mouse is moved~~
  - ~~if two finger press, disable this~~
- ~~same thing for hue/value~~
- dragging palette over color swatch button when the menu is closed should open the menu
- Make eyedropper switch to previous tool
- add popup window for eyedropper to preview previous and next color
- add tiling
- add mirroring
- add custom grids n stuff of the sort
- add reference images
- add rulers
- add effects (adjustments)
  - hue
  - saturation
  - brightness
  - blur
  - grayscale
  - outline
- tile preview
- possible recording, take snapshot of all canvases every x seconds
- ~~pinch zoom in/out on value color box to resize it~~
  - ~~hide hue and opacity~~-
- Eyedropper tool compiles entire image w/ blend modes, when picking on a spot it picks from that compiled image.
