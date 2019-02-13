var paragons;
function LoadParagon(onload) {
    $.getJSON("paragons.json", function (data) {
        paragons = data;
        onload();
    });
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function DiffParagon(a, b) {
    a = clamp(parseInt(a), 0, 10000);
    b = clamp(parseInt(b), 0, 10000);
    var l = Math.min(a, b);
    var h = Math.max(a, b);
    return BigNumber(paragons.paragon[h].total).minus(BigNumber(paragons.paragon[l].total));
}

function GetParagonLevel(xp) {
    var xpInt = xp.toNumber()
    for (var i = 0; i < 10000; i++) {
        var xpTotal = paragons.paragon[i].total;
        if (BigNumber(xpTotal).isGreaterThan(xp)) {
            return i - 1;
        }
    }
    return 10000;
}