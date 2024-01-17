
import { normal } from 'color-blend'

// Mix some green and pink
const pinkBackground = { r: 255, g: 0, b: 0, a: 100/255 }
const greenForeground = { r: 0, g: 255, b: 0, a: 100/255 }

let returned = normal(pinkBackground, greenForeground)
console.log(returned)
// returns { r: 110, g: 170, b: 96, a: 0.768 }