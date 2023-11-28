# Todo

A list of all the things planned to do for BitShift

## Tools

- Smudge and scatter tools
  - Effect surrounding pixels
- Magic wand tool
- General transforming and rotation
- Tool settings
  - ~~Main Window~~
  - Brush:
    - Square brush
    - ~~Brush size~~
    - Smoothing w/ cardinal curves
    - Pixel Perfect Algorithm
- Gradient tool (Dither & No dither)

## Palettes

- Add color to palette
- ~~Rewrite to make class based~~
- Rename palettes
- Create palettes
- ~~Recent colors palette (20 colors max ?)~~
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

- Theming
  - started, no way to set in-app
- Improve tool settings inputs to allow for input groups with proper rounding and units
  - Add new input types
- Add full screen to phone to avoid annoying scroll issue

## Other

- Undo / Redo
  - added for brush strokes
- Show preview details for rectangle, line, and circle
  - Height, width, starting & end point, radius etc
  - For a singular pixel, show cursors position on canvas
- Use monaco for script editor

## Bugs



## Enhancements

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
