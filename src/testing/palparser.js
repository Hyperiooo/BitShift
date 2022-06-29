var finl = []
document.querySelectorAll(".palette").forEach(e => {
    let col = []
    let differences = []
    let final = []
    e.querySelectorAll(".color").forEach(e => {
        var rgb = e.style.background.replace(" none repeat scroll 0% 0%", "").replace("rgb(", "").replace(")", "").split(', ')
        col.push(rgb2hsv(rgb[0], rgb[1], rgb[2]))
    })
    console.log(col)
    for (let i = 0; i < col.length - 1; i++) {
        const first = col[i];
        const second = col[i + 1];
        //console.log(first, second)
        differences.push({
            h: second.h - first.h,
            s: second.s - first.s,
            v: second.v - first.v
        })
    }
    console.log(differences)
    differences.forEach(e => {
        final.push(e.h)
        final.push(e.s)
        final.push(e.v)
    })
    console.log(final)
        //finl.push(`[${col}]`)
    finl.push(final)
    console.log(finl)
})

function rgb2hsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);