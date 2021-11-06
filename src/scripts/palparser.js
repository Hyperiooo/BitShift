

var finl = []
document.querySelectorAll(".palette").forEach(e=> {
    let col = []
    e.querySelectorAll(".color").forEach(e=> {
        e.style.background.replace(" none repeat scroll 0% 0%", "").replace("rgb(", "").replace(")", "").split(', ').forEach(e => {
            col.push(e/255)
        })
    })    
    finl.push(`[${col}]`)
})