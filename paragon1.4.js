"use strict";

var paragons;
function LoadParagon(onload) {
    $.getJSON("paragontotals.json", function (data) {
        paragons = [];
        for (var i = 0; i < 2252; i++) {
            paragons.push(BigNumber(data[i]));
        }
        onload();
    });
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

var c1 = BigNumber(166105421028000);
var c2 = BigNumber(201211626000);
var c3 = BigNumber(229704000);
var c4 = BigNumber(102000);
var half = BigNumber(0.5);
var six = BigNumber(6);
function GetParagonLevelXP(level) {
    if (isNaN(level) || level <= 0) {
        return paragons[0];
    }
    if (level < 2252) {
        return paragons[level];
    }
    var x = BigNumber(level - 2252);
    var xp1 = BigNumber(level - 2251);
    var xp2 = BigNumber(level - 2250);
    return c1.plus(c2.multipliedBy(x).plus(c3.multipliedBy((x.multipliedBy(xp1).multipliedBy(half))).plus((x.multipliedBy(xp1).multipliedBy(xp2).dividedBy(six)) * c4)))
}

function DiffParagon(a, b) {
    var l = Math.min(a, b);
    var h = Math.max(a, b);
    return GetParagonLevelXP(h).minus(GetParagonLevelXP(l));
}

function GetParagonLevel(xp) {
    var l = 0;
    var h = 1;
    while (GetParagonLevelXP(h).isLessThan(xp)) {
        l = h;
        h *= 2;
    }
    while (l < h) {
        var mid = Math.floor((l + h) / 2);
        var midXP = GetParagonLevelXP(mid);
        if (xp.isLessThanOrEqualTo(midXP)) {
            h = mid;
        } else {
            l = mid + 1;
        }
    }
    return l;
}

var baseRiftXP = BigNumber(11794543);
var baseCloseXP = BigNumber(15667533);
function ScaleXP(xp, level) {
    if (level <= 25) {
        return xp.multipliedBy(Math.pow(1.127, level - 1));
    }
    if (level <= 70) {
        return xp.multipliedBy(Math.pow(1.127, 24) * Math.pow(1.08, level - 25));
    }
    return xp.multipliedBy(Math.pow(1.127, 24) * Math.pow(1.08, 70 - 25) * Math.pow(1.05, level - 70));
}

function GetRiftXP(level) {
    return ScaleXP(baseRiftXP, level);
}

function GetCloseXP(level) {
    return ScaleXP(baseCloseXP, level);
}
