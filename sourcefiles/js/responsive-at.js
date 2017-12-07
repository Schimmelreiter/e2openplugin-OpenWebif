function toUnixDate(e) {
    var t = moment(e, "DD.MM.YY").unix();
    return t
}

function AddFilter(e, t, r) {
    var a = $("#filterlist tbody tr").length.toString();
    $("#filterlist").append("<tr id='f" + a + "' style='display:none'> 	<td class='nopadding'> 		<select class='FT form-control' id='ft" + a + "' > 			<option value='include'>" + tstr_at_filter_include + "</option> 			<option value='exclude'>" + tstr_at_filter_exclude + "</option> 		</select> 	</td> 	<td class='nopadding'> 		<select class='FM form-control' id='fm" + a.toString() + "' > 			<option value='title' selected=''>" + tstr_at_filter_title + "</option> 			<option value='shortdescription'>" + tstr_at_filter_short_desc + "</option> 			<option value='description'>" + tstr_at_filter_desc + "</option> 			<option value='dayofweek'>" + tstr_at_filter_day + "</option> 			</select> 	</td> 	<td> 		<div class='form-line inactive' id='filine" + a + "'> 			<input type='text' class='FI form-control' size='20' value='' style='display: block;' id='fi" + a + "'> 		</div> 		<div id='fsline" + a + "'> 			<select class='FS' style='display: none;' id='fs" + a + "' > 				<option value='0' selected=''>" + tstr_monday + "</option> 				<option value='1'>" + tstr_tuesday + "</option> 				<option value='2'>" + tstr_wednesday + "</option> 				<option value='3'>" + tstr_thursday + "</option> 				<option value='4'>" + tstr_friday + "</option> 				<option value='5'>" + tstr_saturday + "</option> 				<option value='6'>" + tstr_sunday + "</option> 				<option value='weekend'>" + tstr_weekend + "</option> 				<option value='weekday'>" + tstr_weekday + "</option> 			</select> 		</div> 	</td> 	<td> 		<input type='checkbox' class='FR form-control' id='fr" + a + "'> 		<label for='fr" + a + "'>" + tstr_at_del + "</label> 	</td> </tr>"), "" != e && $("#ft" + a).val(e), "" != t && ($("#ft" + a).attr("disabled", !0), $("#fs" + a).attr("disabled", !0), $("#fm" + a).attr("disabled", !0), $("#fi" + a).attr("disabled", !0), "dayofweek" == t ? ($("#fm" + a).val(t), $("#fi" + a).hide(), $("#filine" + a).hide(), $("#fs" + a).val(r), $("#fs" + a).show()) : ($("#fm" + a).val(t), $("#fs" + a).hide(), $("#fsline" + a).hide(), $("#fi" + a).val(r), $("#fi" + a).show())), "" === e && "" === t && $.AdminBSB.select.activate(), $("#f" + a).show()
}

function initValues() {
    for (var e = $("#maxduration"), t = $("#counter"), r = $("#left"), a = 0; 100 > a; a++) {
        var i = a.toString();
        10 > a && (i = "0" + i), t.append($("<option></option>").val(a).html(i)), r.append($("<option></option>").val(a).html(i))
    }
    for (var a = 0; 1e3 > a; a++) {
        var i = a.toString();
        10 > a && (i = "0" + i), e.append($("<option></option>").val(a).html(i))
    }
    $("#tafter").val("5"), $("#tbefore").val("5"), $("#maxduration").val("70"), $("#after").datetimepicker({
        format: "dd.mm.yy",
        initialDate: n,
        autoclose: !0,
        minView: 2
    }), $("#after").datetimepicker().on("changeDate", function() {
        var e = moment($("#before").val(), "DD.MM.YY").unix(),
            t = moment($("#after").val(), "DD.MM.YY").unix();
        showError(t > e ? "AFTER:" + tstr_start_after_end : "")
    });
    var n = new Date;
    $("#after").val(moment(n).format("DD.MM.YY"));
    var s = new Date;
    s.setDate(n.getDate() + 7), $("#from").val("20:15"), $("#to").val("23:15"), $("#aefrom").val("20:15"), $("#aeto").val("23:15"), $("#before").datetimepicker({
        format: "dd.mm.yy",
        initialDate: n,
        autoclose: !0,
        minView: 2
    }), $("#before").datetimepicker().on("changeDate", function() {
        var e = moment($("#before").val(), "DD.MM.YY").unix(),
            t = moment($("#after").val(), "DD.MM.YY").unix();
        showError(t > e ? "BEFORE:" + tstr_start_after_end : "")
    }), $("#before").val(moment(s).format("DD.MM.YY"))
}

function timeFrameAfterCheck() {
    if ($("#timeFrameAfter").is(":checked") === !0) {
        var e = moment($("#after").val(), "DD.MM.YY").toDate(),
            t = new Date(e),
            r = new Date;
        r.setDate(t.getDate() + 7), e = moment(r).format("DD.MM.YY"), $("#before").val(e), $("#beforeE").show()
    } else {
        var t = new Date(2038, 0, 1),
            e = moment(t).format("DD.MM.YY");
        $("#before").val(e), $("#beforeE").hide()
    }
}

function AutoTimerObj(e) {
    if (this.isNew = !1, this.MustSave = !1, this.id = e.attr("id"), this.enabled = "yes" == e.attr("enabled"), this.name = e.attr("name"), this.name || (this.name = ""), this.match = e.attr("match"), this.match || (this.match = ""), this.searchType = "partial", e.attr("searchType") && (this.searchType = e.attr("searchType")), this.searchCase = "insensitive", e.attr("searchCase") && (this.searchCase = e.attr("searchCase")), this.justplay = "0", e.attr("justplay") && (this.justplay = e.attr("justplay")), e.attr("always_zap")) {
        var t = e.attr("always_zap");
        "1" == t && (this.justplay = "2")
    }
    if (this.overrideAlternatives = "1" == e.attr("overrideAlternatives"), this.timeSpan = !1, e.attr("from") && e.attr("to") && (this.from = e.attr("from"), this.to = e.attr("to"), this.timeSpan = !0), this.maxduration = null, e.attr("maxduration") && (this.maxduration = e.attr("maxduration")), e.attr("after") && e.attr("before")) {
        var r = parseInt(e.attr("after")),
            a = new Date(1e3 * r);
        this.after = moment(a).format("DD.MM.YY"), r = parseInt(e.attr("before")), a = new Date(1e3 * r), this.before = moment(a).format("DD.MM.YY"), this.timeFrame = !0
    } else this.before = null, this.after = null, this.timeFrame = !1;
    if (this.avoidDuplicateDescription = "0", e.attr("avoidDuplicateDescription") && (this.avoidDuplicateDescription = e.attr("avoidDuplicateDescription")), this.location = null, e.attr("location") && (this.location = e.attr("location")), this.timerOffset = !1, e.attr("offset")) {
        var i = e.attr("offset").split(","),
            n = i[0],
            s = i[1];
        "undefined" == typeof s ? (this.timerOffsetAfter = n, this.timerOffsetBefore = n) : (this.timerOffsetAfter = s, this.timerOffsetBefore = n), this.timerOffset = !0
    }
    var o = e.find("afterevent");
    this.afterevent = null, o.text() && (this.afterevent = o.text(), o.attr("from") && o.attr("to") ? (this.aftereventfrom = o.attr("from"), this.aftereventto = o.attr("to")) : (this.aftereventfrom = null, this.aftereventto = null));
    var l = [],
        n = [];
    e.find("e2service").each(function() {
        var e = $(this).find("e2servicereference").text();
        isBQ(e) ? n.push(encodeURIComponent(e)) : l.push(e)
    }), this.Channels = l.slice(), this.Bouquets = n.slice(), n = [], e.find("e2tags").each(function() {
        var e = $(this).text();
        n.push(encodeURIComponent(e))
    }), this.Tags = n.slice();
    var c = [];
    e.find("include").each(function() {
        c.push({
            t: "include",
            w: $(this).attr("where"),
            v: $(this).text()
        })
    }), e.find("exclude").each(function() {
        c.push({
            t: "exclude",
            w: $(this).attr("where"),
            v: $(this).text()
        })
    }), this.Filters = c.slice(), this.counter = e.attr("counter"), this.counter || (this.counter = "0"), this.left = e.attr("left"), this.left || (this.left = "0"), this.counterFormat = e.attr("counterFormat"), this.counterFormat || (this.counterFormat = ""), this.vps = !1, this.vpso = !1, "yes" === e.attr("vps_enabled") && (this.vps = !0, "yes" === e.attr("vps_overwrite") && (this.vpso = !0)), this.series_labeling = !1, "yes" === e.attr("series_labeling") && (this.series_labeling = !0)
}

function saveAT() {
    if (CurrentAT) {
        var e = "/autotimer/edit?";
        CurrentAT.enabled = $("#enabled").is(":checked"), CurrentAT.name = $("#name").val(), CurrentAT.match = $("#match").val(), CurrentAT.searchType = $("#searchType").val(), CurrentAT.searchCase = $("#searchCase").val(), CurrentAT.justplay = $("#justplay").val(), CurrentAT.overrideAlternatives = $("#overrideAlternatives").is(":checked"), CurrentAT.timeSpan = $("#timeSpan").is(":checked"), CurrentAT.avoidDuplicateDescription = $("#avoidDuplicateDescription").val(), CurrentAT.timeSpan = $("#timeSpan").is(":checked"), CurrentAT.from = $("#from").val(), CurrentAT.to = $("#to").val(), CurrentAT.timerOffset = $("#timerOffset").is(":checked"), CurrentAT.before = $("#before").val(), CurrentAT.after = $("#after").val(), $("#maxDuration").is(":checked") ? CurrentAT.maxduration = $("#maxduration").val() : CurrentAT.maxduration = null, $("#Location").is(":checked") ? CurrentAT.location = $("#location").val() : CurrentAT.location = null, CurrentAT.timeFrame = $("#timeFrame").is(":checked"), CurrentAT.timerOffsetBefore = $("#tbefore").val(), CurrentAT.timerOffsetAfter = $("#tafter").val(), CurrentAT.afterevent = $("#afterevent").val(), CurrentAT.aftereventfrom = $("#aefrom").val(), CurrentAT.aftereventto = $("#aeto").val(), CurrentAT.Bouquets = $("#bouquets").val(), CurrentAT.Channels = $("#channels").val();
        var t = [];
        for (i = 0; i < $("#filterlist tr").length; i++) {
            var r = $("#ft" + i.toString()).val(),
                a = $("#fm" + i.toString()).val(),
                n = $("#fi" + i.toString()).val(),
                s = $("#fs" + i.toString()).val(),
                o = !!$("#fr" + i.toString()).is(":checked");
            o === !1 ? "dayofweek" === a ? t.push({
                t: r,
                w: a,
                v: s
            }) : t.push({
                t: r,
                w: a,
                v: n
            }) : t.push({
                t: r,
                w: a,
                v: ""
            })
        }
        if (CurrentAT.Filters = t.slice(), CurrentAT.Tags = $("#tags").val(), CurrentAT.counter = $("#counter").val(), CurrentAT.left = $("#left").val(), CurrentAT.counterFormat = $("#counterFormat").val(), CurrentAT.vps = $("#vps").is(":checked"), CurrentAT.vpso = !$("#vpssm").is(":checked"), CurrentAT.series_labeling = $("#series_labeling").is(":checked"), e += "match=" + encodeURIComponent(CurrentAT.match), e += "&name=" + encodeURIComponent(CurrentAT.name), e += "&enabled=", e += CurrentAT.enabled ? "1" : "0", e += "2" == CurrentAT.justplay ? "&justplay=0&always_zap=1" : "&justplay=" + CurrentAT.justplay, e += "&setEndtime=", e += CurrentAT.setEndtime ? "1" : "0", e += "&searchCase=" + CurrentAT.searchCase, e += "&overrideAlternatives=", e += CurrentAT.overrideAlternatives ? "1" : "0", e += "&avoidDuplicateDescription=" + CurrentAT.avoidDuplicateDescription, CurrentAT.location && (e += "&location=" + encodeURIComponent(CurrentAT.location)), e += "&searchType=" + CurrentAT.searchType, e += "&maxduration=", CurrentAT.maxduration && CurrentAT.maxduration > -1 && (e += CurrentAT.maxduration), "0" != CurrentAT.counter && (e += "&counter=" + CurrentAT.counter, e += "&counterFormat=" + CurrentAT.counterFormat), e += CurrentAT.timerOffset && CurrentAT.timerOffsetAfter > -1 && CurrentAT.timerOffsetBefore > -1 ? "&offset=" + CurrentAT.timerOffsetBefore + "," + CurrentAT.timerOffsetAfter : "&offset=", e += CurrentAT.timeSpan ? "&timespanFrom=" + CurrentAT.from + "&timespanTo=" + CurrentAT.to : "&timespanFrom=&timespanTo=", e += CurrentAT.timeFrame ? "&before=" + toUnixDate(CurrentAT.before) + "&after=" + toUnixDate(CurrentAT.after) : "&before=&after=", CurrentAT.Tags && CurrentAT.Tags.length > 0 ? $.each(CurrentAT.Tags, function(t, r) {
                e += "&tag=" + r
            }) : e += "&tag=", e += "&services=", CurrentAT.Channels && CurrentAT.Channels.length > 0) {
            var l = [];
            $.each(CurrentAT.Channels, function(e, t) {
                l.push(encodeURIComponent(t))
            }), e += l.join(",")
        }
        e += "&bouquets=", CurrentAT.Bouquets && CurrentAT.Bouquets.length > 0 && (e += CurrentAT.Bouquets.join(",")), CurrentAT.Filters && CurrentAT.Filters.length > 0 && $.each(CurrentAT.Filters, function(t, r) {
            var a = "&";
            "exclude" === r.t && (a += "!"), a += r.w, a += "=", a += "dayofweek" === r.w ? r.v : encodeURIComponent(r.v), e += a
        }), CurrentAT.vps || (CurrentAT.vpo = !1), e += "&vps_enabled=", e += CurrentAT.vps ? "1" : "0", e += "&vps_overwrite=", e += CurrentAT.vpso ? "1" : "0", e += "&series_labeling=", e += CurrentAT.series_labeling ? "1" : "0";
        var c = CurrentAT.afterevent;
        "" == c ? c = "default" : "none" == c ? c = "nothing" : "shutdown" == c && (c = "deepstandby"), e += "&afterevent=" + c, "default" !== c && (e += "&aftereventFrom=" + CurrentAT.aftereventfrom, e += "&aftereventTo=" + CurrentAT.aftereventto), CurrentAT.isNew || (e += "&id=" + CurrentAT.id), $.ajax({
            type: "GET",
            url: e,
            dataType: "xml",
            success: function(e) {
                var t = $(e).find("e2state").first(),
                    r = $(e).find("e2statetext").first();
                showError(r.text(), t.text()), readAT($("#atlist").val())
            },
            error: function(e) {
                showError(e.responseText)
            }
        }), $("#filterlist").empty()
    }
}

function checkValues() {
    $("#timeSpan").is(":checked") === !0 ? $("#timeSpanE").show() : $("#timeSpanE").hide(), $("#timeSpanAE").is(":checked") === !0 ? $("#timeSpanAEE").show() : $("#timeSpanAEE").hide(), $("#timeFrame").is(":checked") === !0 ? ($("#timeFrameE").show(), $("#timeFrameAfterCheckBox").show()) : ($("#timeFrameE").hide(), $("#timeFrameAfterCheckBox").hide()), $("#timerOffset").is(":checked") === !0 ? $("#timerOffsetE").show() : $("#timerOffsetE").hide(), $("#maxDuration").is(":checked") === !0 ? $("#maxDurationE").show() : $("#maxDurationE").hide(), $("#Location").is(":checked") === !0 ? $("#LocationE").show() : $("#LocationE").hide(), $("#Bouquets").is(":checked") === !0 ? $("#BouquetsE").show() : $("#BouquetsE").hide(), $("#Channels").is(":checked") === !0 ? $("#ChannelsE").show() : $("#ChannelsE").hide(), $("#Tags").is(":checked") === !0 ? $("#TagsE").show() : $("#TagsE").hide(), $("#Filter").is(":checked") === !0 ? $(".FilterE").show() : $(".FilterE").hide(), "" != $("#afterevent").val() ? $("#AftereventE").show() : $("#AftereventE").hide(), "0" != $("#counter").val() ? $("#CounterE").show() : $("#CounterE").hide(), $("#vps").is(":checked") === !0 ? $("#vpsE").show() : $("#vpsE").hide()
}

function getAutoTimerSettings() {
    $.ajax({
        type: "GET",
        url: "/autotimer/get",
        dataType: "xml",
        success: function(e) {
            $(e).find("e2setting").each(function() {
                var e = $(this).find("e2settingname").text(),
                    t = $(this).find("e2settingvalue").text();
                0 === e.indexOf("config.plugins.autotimer.") && (e = e.substring(25), "True" === t ? $("#ats_" + e).prop("checked", !0) : "False" === t ? $("#ats_" + e).prop("checked", !1) : $("#ats_" + e).val(t))
            })
        },
        error: function(e) {
            showError(e.responseText)
        }
    })
}

function test_simulateAT(e) {
    $("#simtb").append("<tr><td COLSPAN=6>" + loadspinner + "</td></tr>");
    var t = e ? "simulate" : "test",
        r = e ? "e2simulatedtimer" : "e2testtimer";
    "test" !== t || CurrentAT.isNew ? (t = "simulate", r = "e2simulatedtimer") : t += "?id=" + CurrentAT.id, console.debug("LINK", t, r), $.ajax({
        type: "GET",
        url: "/autotimer/" + t,
        dataType: "xml",
        success: function(e) {
            console.debug(e);
            var t = [];
            $(e).find(r).each(function() {
                var e = "<tr>";
                e += "<td>" + $(this).find("e2state").text() + "</td>", e += "<td>" + $(this).find("e2autotimername").text() + "</td>", e += "<td>" + $(this).find("e2name").text() + "</td>", e += "<td>" + $(this).find("e2servicename").text() + "</td>";
                var r = $(this).find("e2timebegin").text(),
                    a = new Date(1e3 * Math.round(r)),
                    i = a.getHours(),
                    n = a.getMinutes(),
                    s = (i > 9 ? "" : "0") + i.toString(),
                    o = (n > 9 ? "" : "0") + n.toString();
                r = a.getMonth() + 1 + "/" + a.getDate() + "/" + a.getFullYear() + " " + s + ":" + o, e += "<td>" + r + "</td>", r = $(this).find("e2timeend").text(), a = new Date(1e3 * Math.round(r)), i = a.getHours(), n = a.getMinutes();
                var s = (i > 9 ? "" : "0") + i.toString(),
                    o = (n > 9 ? "" : "0") + n.toString();
                r = a.getMonth() + 1 + "/" + a.getDate() + "/" + a.getFullYear() + " " + s + ":" + o, e += "<td>" + r + "</td>", e += "</tr>", console.debug(e), t.push(e)
            }), $("#simtb").empty(), $(t).each(function(e, t) {
                $("#simtb").append(t)
            }), 0 === t.length && $("#simtb").append("<tr><td COLSPAN=6>NO Timer found</td></tr>")
        },
        error: function(e) {
            showError(e.responseText)
        }
    })
}

function InitPage() {
    $("#timeSpan").click(function() {
        checkValues()
    }), $("#timeSpanAE").click(function() {
        checkValues()
    }), $("#timeFrame").click(function() {
        checkValues()
    }), $("#timeFrameAfter").click(function() {
        timeFrameAfterCheck()
    }), $("#timerOffset").click(function() {
        checkValues()
    }), $("#maxDuration").click(function() {
        checkValues()
    }), $("#Location").click(function() {
        checkValues()
    }), $("#Bouquets").click(function() {
        checkValues()
    }), $("#Channels").click(function() {
        checkValues()
    }), $("#Filter").click(function() {
        checkValues()
    }), $("#Tags").click(function() {
        checkValues()
    }), $("#AddFilter").click(function() {
        AddFilter("", "", "")
    }), $("#afterevent").change(function() {
        checkValues()
    }), $("#counter").change(function() {
        checkValues()
    }), $("#vps").change(function() {
        checkValues()
    }), initValues(), checkValues(), getData(), $(".FM").change(function() {
        var e = $(this).parent().parent();
        "dayofweek" == $(this).val() ? (e.find(".FS").show(), e.find(".FI").hide()) : (e.find(".FS").hide(), e.find(".FI").show())
    })
}

function delAT() {
    CurrentAT && !CurrentAT.isNew && swal({
        title: tstr_del_autotimer + " ?",
        text: CurrentAT.name,
        type: "warning",
        showCancelButton: !0,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: tstrings_yes_delete + " !",
        cancelButtonText: tstrings_no_cancel + " !",
        closeOnConfirm: !1,
        closeOnCancel: !1
    }, function(e) {
        e ? $.ajax({
            type: "GET",
            url: "/autotimer/remove?id=" + CurrentAT.id,
            dataType: "xml",
            success: function(e) {
                var t = $(e).find("e2state").first(),
                    r = $(e).find("e2statetext").first();
                showError(r.text(), t.text()), readAT()
            },
            error: function(e) {
                showError(e.responseText)
            }
        }) : swal(tstrings_cancelled, CurrentAT.name, "error")
    })
}

function addAT(e) {
    if (CurrentAT && CurrentAT.isNew) return void showError("please save the current autotimer first");
    var t = 1;
    $(atxml).find("timer").each(function() {
        var e = parseInt($(this).attr("id"));
        e >= t && (t = e + 1)
    });
    var r = tstr_timernewname,
        a = t.toString(),
        i = '<timers><timer name="' + r + '" match="' + r + '" enabled="yes" id="' + a + '" justplay="0" overrideAlternatives="1"></timer></timers>';
    "undefined" != typeof e && (i = '<timers><timer name="' + e.name + '" match="' + e.name + '" enabled="yes" id="' + a + '" from="' + e.from + '" to="' + e.to + '"', i += ' searchType="exact" searchCase="sensitive" justplay="0" overrideAlternatives="1" ', i += "><e2service><e2servicereference>" + e.sref + "</e2servicereference><e2servicename>" + e.sname + "</e2servicename></e2service>", i += "</timer></timers>");
    var n = $.parseXML(i);
    $(n).find("timer").each(function() {
        $("#atlist").append($("<option data-id='" + $(this).attr("id") + "' value='" + $(this).attr("id") + "' selected >" + $(this).attr("name") + "</option>")), $("#atlist").selectpicker("refresh"), CurrentAT = new AutoTimerObj($(this)), CurrentAT.isNew = !0, CurrentAT.MustSave = !0, CurrentAT.UpdateUI()
    }), $("#atlist").find("li").each(function() {
        $(this).data("id") == a ? $(this).addClass("ui-selected") : $(this).removeClass("ui-selected")
    })
}

function readAT(e) {
    CurrentAT = null, $.ajax({
        type: "GET",
        url: "/autotimer",
        dataType: "xml",
        success: function(t) {
            atxml = t, Parse(e)
        },
        error: function(e) {
            showError(e.responseText)
        }
    })
}

function Parse(e) {
    e = "undefined" != typeof e ? e : -1, $("#atlist").empty(), $("#filterlist").empty();
    var t = [],
        r = $(atxml).find("e2state").first();
    "false" == r.text() && showError($(atxml).find("e2statetext").first().text()), $(atxml).find("timer").each(function() {
        t.push($(this))
    }), t.sort(function(e, t) {
        var r = e.attr("name"),
            a = t.attr("name");
        return r == a ? 0 : r > a ? 1 : -1
    });
    var a = "",
        i = 0;
    if ($(t).each(function() {
            var t = "";
            (0 === i && -1 === e || e.toString() === $(this).attr("id").toString()) && (t = "selected"), a += "<option data-id='" + $(this).attr("id") + "' value='" + $(this).attr("id") + "' " + t + " >" + $(this).attr("name") + "</option>", i++
        }), $("#atlist").html(a), $("#atlist").selectpicker("refresh"), at2add) addAT(at2add), at2add = null;
    else {
        var n = $("#atlist").val();
        n && FillAT(n)
    }
    t.length > 0 ? ($("#atbutton5").show(), $("#atbutton6").show()) : ($("#atbutton5").hide(), $("#atbutton6").hide())
}

function showError(e, t) {
    t = "undefined" != typeof t ? t : "False";
    var r = "error";
    t !== !0 && "True" !== t && "true" !== t || (r = "success"), "" !== e ? swal("", e, r) : $("#statuscont").hide()
}
AutoTimerObj.prototype.UpdateUI = function() {
    if ($("#filterlist").empty(), $("#enabled").prop("checked", this.enabled), $("#name").val(this.name), $("#match").val(this.match), $("#searchType").val(this.searchType), $("#searchCase").val(this.searchCase), $("#justplay").val(this.justplay), $("#overrideAlternatives").prop("checked", this.overrideAlternatives), $("#timeSpan").prop("checked", this.timeSpan), $("#at_name").html("(" + this.name + ")"), this.timeSpan && ($("#from").val(this.from), $("#to").val(this.to)), this.maxduration ? ($("#maxDuration").prop("checked", !0), $("#maxduration").val(this.maxduration)) : $("#maxDuration").prop("checked", !1), $("#timeFrame").prop("checked", this.timeFrame), this.timeFrame) {
        $("#after").val(this.after), $("#before").val(this.before);
        var e = moment($("#before").val(), "DD.MM.YY").toDate(),
            t = new Date(2038, 0, 1);
        t > e ? ($("#timeFrameAfter").prop("checked", !0), $("#beforeE").show()) : ($("#timeFrameAfter").prop("checked", !1), $("#beforeE").hide())
    }
    $("#avoidDuplicateDescription").val(this.avoidDuplicateDescription), this.location ? ($("#location").val(this.location), this.location !== $("#location").val() && (current_location = "<option value='" + this.location + "'>" + this.location + "</option>", $("#location").append(current_location), $("#location").val(this.location)), $("#Location").prop("checked", !0)) : $("#Location").prop("checked", !1), $("#timerOffset").prop("checked", this.timerOffset), this.timerOffset && ($("#tafter").val(this.timerOffsetAfter), $("#tbefore").val(this.timerOffsetBefore)), $("#timeSpanAE").prop("checked", !1), $("#afterevent").val(""), this.afterevent && ($("#afterevent").val(this.afterevent), this.aftereventfrom && this.aftereventto && ($("#aefrom").val(this.aftereventfrom), $("#aeto").val(this.aftereventto), $("#timeSpanAE").prop("checked", !0))), $("#channels").val(null), $("#bouquets").val(null), $.each(this.Bouquets, function(e, t) {
        $('#bouquets option[value="' + t + '"]').prop("selected", !0)
    }), $.each(this.Channels, function(e, t) {
        $('#channels option[value="' + t + '"]').prop("selected", !0)
    }), $("#bouquets").selectpicker("refresh"), $("#channels").selectpicker("refresh"), $("#Bouquets").prop("checked", this.Bouquets.length > 0), $("#Channels").prop("checked", this.Channels.length > 0), $("#tags").val(null), $.each(this.Tags, function(e, t) {
        $('#tags option[value="' + t + '"]').prop("selected", !0)
    }), $("#tags").selectpicker("refresh");
    var r = $("#filterlist tr").length;
    if (r > 1)
        for (var a = 1; r > a; a++) $("#f" + a.toString()).remove();
    var i = 0;
    $.each(this.Filters, function(e, t) {
        i++, AddFilter(t.t, t.w, t.v)
    }), $.AdminBSB.select.activate(), $("#Filter").prop("checked", i > 0), $("#counter").val(this.counter), $("#left").val(this.left), $("#counterFormat").val(this.counterFormat), $("#vps").prop("checked", this.vps), $("#vpssm").prop("checked", !this.vpso), $("#series_labeling").prop("checked", this.series_labeling), checkValues()
};