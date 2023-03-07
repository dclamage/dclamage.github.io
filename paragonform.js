"use strict";

const trillion = BigNumber('1000000000000');
const billion = BigNumber('1000000000');
const million = BigNumber('1000000');
const thousand = BigNumber('1000');

function CalculateParagonSum()
{
	var p1 = $("#p1").val();
	var p2 = $("#p2").val();
	localStorage.setItem("p1", p1);
	localStorage.setItem("p2", p2);

	var xpsum = BigNumber(GetParagonLevelXP(p1)).plus(BigNumber(GetParagonLevelXP(p2)));
	var psum = GetParagonLevel(xpsum);
	$("#psum").val(psum);
}

function ParseTimeAsHours(time)
{
	var hour = parseInt(time.split(":")[0]);
	var minute = parseInt(time.split(":")[1]);
	if (typeof minute != "number" || isNaN(minute))
	{
		minute = 0;
	}
	var totalMinutes = hour * 60 + minute;
	var totalHours = totalMinutes / 60;
	return totalHours;
}

function Human(val)
{
	if (val.isGreaterThan(trillion))
	{
		return val.dividedBy(trillion).toFixed(2, 4) + ' trillion';
	}
	if (val.isGreaterThan(billion))
	{
		return val.dividedBy(billion).toFixed(2, 4) + ' billion';
	}
	if (val.isGreaterThan(million))
	{
		return val.dividedBy(million).toFixed(2, 4) + ' million';
	}
	if (val.isGreaterThan(thousand))
	{
		return val.dividedBy(thousand).toFixed(2, 4) + ' thousand';
	}
	return val.toFixed(2, 4);
}

function CalculateXPPerHour()
{
	var startingParagon = $("#xphrstartingparagon").val();
	var endingParagon = $("#xphrendingparagon").val();
	var startTime = $("#xphrstarttime").val();
	var endTime = $("#xphrendtime").val();
	localStorage.setItem("xphrstartingparagon", startingParagon);
	localStorage.setItem("xphrendingparagon", endingParagon);
	localStorage.setItem("xphrstarttime", startTime);
	localStorage.setItem("xphrendtime", endTime);

	var startTimeHours = ParseTimeAsHours(startTime);
	var endTimeHours = ParseTimeAsHours(endTime);
	if (endTimeHours < startTimeHours)
	{
		endTimeHours += 24;
	}
	var hours = endTimeHours - startTimeHours;

	var xpNeeded = DiffParagon(endingParagon, startingParagon);
	var xpPerHour = xpNeeded.dividedBy(hours);
	$("#xphrresult").val(Human(xpPerHour));
	$("#xphrtotalresult").val(Human(xpNeeded));
	$("#xphrtotalhours").val(hours.toFixed(2, 4));
}

function CalculateParagon()
{
	$("#result").empty();
	var current = $("#current").val();
	var desired = $("#desired").val();
	var xpHrInput = $("#xphr").val();
	var hrsPerDayInput = $("#hrsperday").val();
	localStorage.setItem("current", current);
	localStorage.setItem("desired", desired);
	localStorage.setItem("xphr", xpHrInput);
	localStorage.setItem("hrsperday", hrsPerDayInput);
	var xpHr = BigNumber("1000000000").multipliedBy(BigNumber(xpHrInput));
	var hrsPerDay = BigNumber($("#hrsperday").val());
	var xpNeeded = DiffParagon(desired, current);
	var hours = xpNeeded.dividedBy(xpHr);
	var days = hours.dividedBy(hrsPerDay);

	var unit = 1;
	while (unit < 1000000000000000 && xpNeeded.isGreaterThan(unit * 500))
	{
		unit *= 1000;
	}
	if (unit === 1)
	{
		$("#xpresultlabel").text("XP Needed");
	} else if (unit === 1000)
	{
		$("#xpresultlabel").text("Thousand XP Needed");
	} else if (unit === 1000000)
	{
		$("#xpresultlabel").text("Million XP Needed");
	} else if (unit === 1000000000)
	{
		$("#xpresultlabel").text("Billion XP Needed");
	} else if (unit === 1000000000000)
	{
		$("#xpresultlabel").text("Trillion XP Needed");
	} else if (unit === 1000000000000000)
	{
		$("#xpresultlabel").text("Quadrillion XP Needed");
	}
	$("#xpresult").val(xpNeeded.dividedBy(unit).toFixed(3, 4));
	$("#hoursresult").val(hours.toFixed(1, 4));
	$("#daysresult").val(days.toFixed(1, 4));

	UpdateChart(days.toNumber());
}

function CalculatePools()
{
	var paragon = $("#poolsparagon").val();
	if (paragon <= 1 || isNaN(paragon))
	{
		paragon = 2;
	}
	var level = $("#poolsgrlevel").val();
	if (level <= 0 || isNaN(paragon))
	{
		level = 1;
	}
	var numPlayers = $("#poolsnumplayers").val();
	if (numPlayers <= 0 || isNaN(paragon))
	{
		numPlayers = 1;
	} else if (numPlayers > 4)
	{
		numPlayers = 4;
	}
	var xpFromGear = $("#poolsxpgear").val();
	if (xpFromGear < 0 || isNaN(xpFromGear))
	{
		xpFromGear = 0;
	}
	localStorage.setItem("poolsparagon", paragon);
	localStorage.setItem("poolsgrlevel", level);
	localStorage.setItem("poolsnumplayers", numPlayers);
	localStorage.setItem("poolsxpgear", xpFromGear);

	var xpBonusTotal = (1.0 + xpFromGear / numPlayers * 0.01) * (0.9 + numPlayers * .1);
	var riftXP = GetRiftXP(level).multipliedBy(xpBonusTotal);
	var closeXP = GetCloseXP(level);
	var totalXP = riftXP.plus(closeXP);
	var poolXP = DiffParagon(paragon, paragon - 1).dividedBy(10);
	var riftPoolConsumed = riftXP.dividedBy(4);
	var closePoolConsumed = closeXP.multipliedBy(0.3125);
	var totalPoolConsumed = riftPoolConsumed.plus(closePoolConsumed);
	var riftNumPools = riftPoolConsumed.dividedBy(poolXP);
	var closeNumPools = closePoolConsumed.dividedBy(poolXP);
	var totalNumPools = totalPoolConsumed.dividedBy(poolXP);
	$("#baseriftxp").val(Human(riftXP));
	$("#pooledriftxp").val(Human(riftXP.multipliedBy(1.25)));
	$("#baseclosexp").val(Human(closeXP));
	$("#pooledclosexp").val(Human(closeXP.multipliedBy(1.5625)));
	$("#basetotalxp").val(Human(riftXP.plus(closeXP)));
	$("#closepooledtotalxp").val(Human(riftXP.plus(closeXP.multipliedBy(1.5625))));
	$("#allpooledtotalxp").val(Human(riftXP.multipliedBy(1.25).plus(closeXP.multipliedBy(1.5625))));
	$("#poolsresultrift").val(riftNumPools.toFixed(2, 4));
	$("#poolsresultclose").val(closeNumPools.toFixed(2, 4));
	$("#poolsresulttotal").val(totalNumPools.toFixed(2, 4));
}

function GetLocalStorage(key, def)
{
	var val = localStorage.getItem(key);
	if (val == null)
	{
		val = def;
	}
	return val;
}

function HaveParagon()
{
	$("#p1").bind('input', CalculateParagonSum);
	$("#p2").bind('input', CalculateParagonSum);
	$("#p1").val(GetLocalStorage("p1", "1000"));
	$("#p2").val(GetLocalStorage("p2", "1000"));
	CalculateParagonSum();

	$("#xphrstartingparagon").bind('input', CalculateXPPerHour);
	$("#xphrendingparagon").bind('input', CalculateXPPerHour);
	$("#xphrstarttime").bind('input', CalculateXPPerHour);
	$("#xphrendtime").bind('input', CalculateXPPerHour);
	$("#xphrstartingparagon").val(GetLocalStorage("xphrstartingparagon", "100"));
	$("#xphrendingparagon").val(GetLocalStorage("xphrendingparagon", "500"));
	$("#xphrstarttime").val(GetLocalStorage("xphrstarttime", "0:00"));
	$("#xphrendtime").val(GetLocalStorage("xphrendtime", "1:00"));
	CalculateXPPerHour();

	$("#current").bind('input', CalculateParagon);
	$("#desired").bind('input', CalculateParagon);
	$("#xphr").bind('input', CalculateParagon);
	$("#hrsperday").bind('input', CalculateParagon);

	$("#current").val(GetLocalStorage("current", "0"));
	$("#desired").val(GetLocalStorage("desired", "2000"));
	$("#xphr").val(GetLocalStorage("xphr", "2000"));
	$("#hrsperday").val(GetLocalStorage("hrsperday", "8"));
	$("#maindiv").show();
	CalculateParagon();

	// Pools
	$("#poolsparagon").bind('input', CalculatePools);
	$("#poolsgrlevel").bind('input', CalculatePools);
	$("#poolsnumplayers").bind('input', CalculatePools);
	$("#poolsxpgear").bind('input', CalculatePools);

	var poolsparagon = localStorage.getItem("poolsparagon");
	if (poolsparagon == null)
	{
		poolsparagon = "2000";
	}
	var poolsgrlevel = localStorage.getItem("poolsgrlevel");
	if (poolsgrlevel == null)
	{
		poolsgrlevel = "115";
	}
	var poolsnumplayers = localStorage.getItem("poolsnumplayers");
	if (poolsnumplayers == null)
	{
		poolsnumplayers = "4";
	}
	var poolsxpgear = localStorage.getItem("poolsxpgear");
	if (poolsxpgear == null)
	{
		poolsxpgear = "0";
	}
	$("#poolsparagon").val(poolsparagon);
	$("#poolsgrlevel").val(poolsgrlevel);
	$("#poolsnumplayers").val(poolsnumplayers);
	$("#poolsxpgear").val(poolsxpgear);
	CalculatePools();
}
var existingChart;

function UpdateChart(numDays)
{
	var days = []
	var level = []
	var curXP = GetParagonLevelXP(parseInt($("#current").val()));
	var xpHr = BigNumber("1000000000").multipliedBy(BigNumber($("#xphr").val()));
	var hrsPerDay = BigNumber($("#hrsperday").val());
	var xpDay = xpHr.multipliedBy(hrsPerDay);
	if (xpDay.isLessThanOrEqualTo(BigNumber("0")))
	{
		return;
	}
	numDays = Math.ceil(numDays);
	var increment = Math.max(1, Math.floor(numDays / 30) + 1)
	xpDay = xpDay.multipliedBy(BigNumber(increment))
	for (var i = 0; i <= numDays; i += increment)
	{
		days.push(i)
		level.push(GetParagonLevel(curXP))
		curXP = curXP.plus(xpDay)
	}

	var ctx = $("#paragonChart");
	if (existingChart)
	{
		existingChart.destroy()
	}
	Chart.defaults.global.defaultFontColor = "#e8e6e3";
	existingChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: days,
			datasets: [{
				label: 'Paragon Level',
				data: level,
				backgroundColor: '#ca4d55',
				borderColor: '#ca4d55',
				fill: false,
			}]
		},
		options: {
			responsive: true,
			title: {
				display: true,
				text: 'Paragon Level Over Time'
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Day'
					},
					gridLines: {
						color: "#444444"
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Paragon Level'
					},
					gridLines: {
						color: "#444444"
					}
				}]
			}
		}
	});
}

$(document).ready(function ()
{
	LoadParagon(HaveParagon);

	$(".toggle-help").click(function ()
	{
		$(".help-description").toggle();
		$(".toggle-help").text($(".help-description").is(":visible") ? "Hide Help" : "Show Help")
		localStorage.setItem("help-hidden", !$(".help-description").is(":visible"));
	});
	if (GetLocalStorage("help-hidden", "false") !== "false")
	{
		$(".help-description").hide();
		$(".toggle-help").text("Show Help")
	} else
	{
		$(".help-description").show();
		$(".toggle-help").text("Hide Help")
	}
});