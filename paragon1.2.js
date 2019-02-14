"use strict";

var paragons;
function LoadParagon(onload) {
    $.getJSON("paragontotals.json", function (data) {
        paragons = [];
        for (var i = 0; i < data.length; i++)
        {
            paragons.push(BigNumber(data[i]));
        }
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
    return paragons[h].minus(paragons[l]);
}

function GetParagonLevel(xp) {
    var l = 0;
    var h = 10001;
    while (l < h) {
        var mid = Math.floor((l + h) / 2);
        var midXP = paragons[mid];
        if (xp.isLessThanOrEqualTo(midXP)) {
            h = mid;
        } else {
            l = mid + 1;
        }
    }
    if (l > 10000) {
        return 10000;
    }
    return l;
}

function GetParagonLevelXP(level) {
    if (isNaN(level) || level <= 0) {
        return paragons[0];
    }
    level = Math.min(level, paragons.length - 1);
    return paragons[level];
}
