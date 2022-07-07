var subj_paths = [];
var clip_paths = [
    [{
            "X": 0.855985598559856,
            "Y": 0.855985598559856
        },
        {
            "X": -0.14401440144014402,
            "Y": 0.855985598559856
        },
        {
            "X": -0.14401440144014402,
            "Y": -0.14401440144014402
        },
        {
            "X": 0.855985598559856,
            "Y": -0.14401440144014402
        }
    ]
];

var result_path = [

]

function draw() {
    var cpr = new ClipperLib.Clipper();
    cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clipTypes = [ClipperLib.ClipType.ctUnion, ClipperLib.ClipType.ctDifference];
    var clipTypesTexts = "Union, Difference";
    var solution_paths, svg, cont = document.getElementById('svgcontainer');
    var i;
    for (i = 0; i < clipTypes.length; i++) {
        solution_paths = new ClipperLib.Paths();
        cpr.Execute(clipTypes[i], solution_paths, subject_fillType, clip_fillType);
        console.log(JSON.stringify(solution_paths));
        svg = '<svg style="margin-top:10px; margin-right:10px;margin-bottom:10px;background-color:#dddddd;" viewBox="0 0 16 16" width="160" height="160">';
        svg += '<path fill="black" d="' + paths2string(clip_paths, 1) + '"/>';
        svg += '</svg>';
        cont.innerHTML += svg;
        result_path = solution_paths
    }
    cont.innerHTML += "<br>" + clipTypesTexts;
    console.timeEnd("a")
}

// Converts Paths to SVG path string
// and scales down the coordinates
function paths2string(paths, scale) {
    var svgpath = "",
        i, j;
    if (!scale) scale = 1;
    for (i = 0; i < paths.length; i++) {
        for (j = 0; j < paths[i].length; j++) {
            if (!j) svgpath += "M";
            else svgpath += "L";
            svgpath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
        }
        svgpath += "Z";
    }
    if (svgpath == "") svgpath = "M0,0";
    return svgpath;
}