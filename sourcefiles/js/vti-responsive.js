var vol_slider = document.getElementById("volslider");
var cur_vol = -1;
var standby_status = -1;
var timerFormInitiated = -1;
$(function() {
    noUiSlider.create(vol_slider, {
        start: [30],
        connect: "lower",
        step: 5,
        range: {
            min: [0],
            max: [100]
        }
    });
    getNoUISliderValue(vol_slider, true);
    if (!timeredit_initialized) {
        $("#editTimerForm").load("ajax/edittimer")
    }
    $("#navbar-collapse").on("show.bs.modal", function(a) {
        $("#navbar-collapse").removeAttr("style")
    });
    $("#navbar-collapse").on("hide.bs.modal", function(a) {
        $("#navbar-collapse").addAttr("style", "width:100%")
    });
    $("#TimerModal").on("show.bs.modal", function(f) {
        if (!$("#TimerModal").data("bs.modal").isShown) {
            if (timerFormInitiated !== 1) {
                initTimerEditForm()
            }
            var c = $(f.relatedTarget).attr("data-evid");
            var d = $(f.relatedTarget).attr("data-ref");
            var b = $(f.relatedTarget).attr("data-begin");
            var a = $(f.relatedTarget).attr("data-end");
            if ((d !== "" && typeof d != "undefined") && (c !== "" && typeof c != "undefined")) {
                addEditTimerEvent(d, c)
            } else {
                if ((d !== "" && typeof d != "undefined") && (b !== "" && typeof b != "undefined") && (a !== "" && typeof a != "undefined")) {
                    editTimer(d, b, a)
                } else {
                    addTimer()
                }
            }
        }
    });
    $("#TimerModal").on("hidden.bs.modal", function(a) {});
    autosize($("textarea.auto-growth"));
    $.VTiTools.epgsearch.activate();
    $.VTiTools.moviesearch.activate();
    $(document).keydown(function(a) {
        if ((a.ctrlKey || a.cmdKey) && a.keyCode === 70) {
            a.preventDefault();
            $.VTiTools.epgsearch.showSearchBar()
        }
        if ((a.ctrlKey || a.cmdKey) && a.keyCode === 69) {
            a.preventDefault();
            $.VTiTools.epgsearch.showSearchBar()
        }
        if ((a.ctrlKey || a.cmdKey) && a.keyCode === 77) {
            a.preventDefault();
            $.VTiTools.moviesearch.showSearchBarMovie()
        }
    });
    skinChanger();
    activateNotificationAndTasksScroll();
    setSkinListHeightAndScroll(true);
    setSettingListHeightAndScroll(true);
    $(window).resize(function() {
        setSkinListHeightAndScroll(false);
        setSettingListHeightAndScroll(false)
    });
    initSkin();
    VTiWebConfig()
});

function getNoUISliderValue(b, a) {
    b.noUiSlider.on("update", function() {
        var c = b.noUiSlider.get();
        c = parseInt(c);
        $("#volumevalue").find("span.curvolume").text(c + "%");
        if (cur_vol != -1) {
            $.ajax("web/vol?set=set" + c)
        }
        cur_vol = c
    })
}

function initJsTranslationAddon(a) {
    tstr_timer = a.timer;
    tstr_loading = a.loading;
    tstr_add_timer = a.add_timer;
    tstr_cancel = a.cancel;
    tstr_close = a.close;
    tstr_weekday = a.at_filter_weekday;
    tstr_weekend = a.at_filter_weekend;
    tstr_at_del = a.at_del;
    tstr_at_filter_title = a.at_filter_title;
    tstr_at_filter_short_desc = a.at_filter_short_desc;
    tstr_at_filter_desc = a.at_filter_desc;
    tstr_at_filter_day = a.at_filter_day;
    tstr_at_filter_include = a.at_filter_include;
    tstr_at_filter_exclude = a.at_filter_exclude;
    tstrings_no_cancel = a.no_cancel;
    tstrings_yes_delete = a.yes_delete;
    tstrings_yes = a.yes;
    tstrings_deleted = a.deleted;
    tstrings_cancelled = a.cancelled;
    tstrings_need_input = a.need_input;
    tstrings_install_package = a.install_package;
    tstrings_remove_package = a.remove_package;
    tstrings_update_package = a.update_package;
    tstrings_upload_package = a.upload_package;
    tstrings_upload_error = a.upload_error
}

function toggleFullRemote() {
    $("#symbolRemoteView").toggle();
    $("#fullRemoteView").toggle()
}

function SetSpinner() {
    loadspinner = " 	<div class='page-loader-wrapper'> 		<div class='loader'> 			<div class='preloader'> 				<div class='spinner-layer pl-red'> 					<div class='circle-clipper left'> 						<div class='circle'></div> 					</div> 					<div class='circle-clipper right'> 						<div class='circle'></div> 					</div> 				</div> 			</div> 			<p>" + tstr_loading + "...</p> 		</div> 	</div>"
}

function listTimers() {
    $("#timerdlgcont").html(loadspinner).load("ajax/timers #timers")
}

function set_epg_modal_content(a) {
    $("#editTimerForm").load("ajax/edittimer");
    $("#epgmodalcontent").html($(a).find("#epgcards").html())
}

function open_epg_dialog(c, a) {
    $("#epgmodalcontent").html(loadspinner);
    var b = "ajax/epgdialog?sref=" + escape(c);
    $.get(b, set_epg_modal_content)
}

function load_channelsepg(a) {
    $("#channel_epg_container").load(a);
    return false
}

function load_subcontent(a) {
    $("[id^=sub_content_container]").load(a);
    return false
}

function loadtvcontent(a) {
    $("[id^=tvcontent]").load(a);
    return false
}

function load_maincontent(a) {
    if (lastcontenturl != a || (a.indexOf("screenshot") > -1) || (a.indexOf("boxinfo") > -1)) {
        $("#content_container").load(a);
        lastcontenturl = a
    }
    return false
}

function load_maincontent_spin_force(a) {
    var b = '<div id="content_main">' + loadspinner + "</div>";
    $("#content_container").html(b).load(a);
    lastcontenturl = a;
    return false
}
var SSHelperObj = function() {
    var b;
    var a = false;
    var c = 30;
    return {
        setup: function() {
            b = this;
            clearInterval(b.screenshotInterval);
            b.ssr_i = parseInt(GetLSValue("ssr_i", "30"));
            $("#screenshotbutton0").click(function() {
                grabScreenshot("all")
            });
            $("#screenshotbutton1").click(function() {
                grabScreenshot("video")
            });
            $("#screenshotbutton2").click(function() {
                grabScreenshot("osd")
            });
            $("#ssr_i").val(b.ssr_i);
            $("#ssr_s").prop("checked", GetLSValue("ssr_s", false));
            $("#ssr_hd").prop("checked", GetLSValue("ssr_hd", false));
            $("#screenshotspinner").addClass(GetLSValue("spinner", "fa-spinner"));
            $("#ssr_hd").change(function() {
                SetLSValue("ssr_hd", $("#ssr_hd").is(":checked"));
                grabScreenshot("auto")
            });
            $("#ssr_i").change(function() {
                var d = $("#ssr_i").val();
                SetLSValue("ssr_i", d);
                b.ssr_i = parseInt(d);
                if ($("#ssr_s").is(":checked")) {
                    clearInterval(b.screenshotInterval);
                    b.setSInterval()
                }
            });
            $("#ssr_s").change(function() {
                var d = $("#ssr_s").is(":checked");
                if (d) {
                    b.setSInterval()
                } else {
                    clearInterval(b.screenshotInterval)
                }
                SetLSValue("ssr_s", d)
            });
            screenshotMode = "all";
            grabScreenshot(screenshotMode);
            if (GetLSValue("ssr_s", false)) {
                b.setSInterval()
            }
        },
        setSInterval: function() {
            b.screenshotInterval = setInterval("grabScreenshot('auto')", (b.ssr_i + 1) * 1000)
        }
    }
};
var SSHelper = new SSHelperObj();

function load_reboot_dialog(b, c) {
    var a = loadspinner.replace("<p>" + tstr_loading + "...</p>", "<p>" + tstr_loading + "...</p><p>" + c + "</p>");
    $("#responsivespinner").html(a)
}

function toggleLeftSideBar() {
    var b = $("body");
    var a = b.height();
    var c = $("#fullmaincontent");
    if ($("body").hasClass("ls-closed-manual")) {
        c.addClass("content");
        c.removeClass("contentfull");
        b.removeClass("ls-closed-manual");
        $("#epgcard").height(($("#leftsidemenu").height() - 30) + "px");
        $("#topmenuheader,#mainfooter").show();
        $("#togglefullscreen").html("fullscreen");
        setTimeout(function() {
            load_tvcontent("ajax/multiepg?epgmode=tv")
        }, 500)
    } else {
        b.addClass("ls-closed-manual");
        c.removeClass("content");
        c.addClass("contentfull");
        $("#epgcard").height(a + "px");
        $("#topmenuheader,#mainfooter").hide();
        $("#togglefullscreen").html("fullscreen_exit");
        setTimeout(function() {
            load_tvcontent("ajax/multiepg?epgmode=tv")
        }, 500)
    }
}

function grabScreenshot(a) {
    $("#screenshotimage").load(function() {
        $("#responsivespinnerscreenshot").hide()
    });
    if (a != "auto") {
        screenshotMode = a
    } else {
        a = screenshotMode
    }
    timestamp = new Date().getTime();
    if ($("#ssr_hd").is(":checked")) {
        $("#screenshotimage").attr("src", "/grab?format=jpg&mode=" + a + "#" + timestamp)
    } else {
        $("#screenshotimage").attr("src", "/grab?format=jpg&r=720&mode=" + a + "#" + timestamp)
    }
    $("#screenshotimage").attr("style", "max-height:60vh;");
    $("#screenshotimage").attr("class", "img-responsive img-rounded center-block")
}

function getStatusInfo() {
    $.ajax({
        url: "/api/statusinfo",
        dataType: "json",
        cache: false,
        success: function(a) {
            if (cur_vol === -1) {
                vol_slider.noUiSlider.set(a.volume)
            } else {
                if (cur_vol != a.volume) {
                    cur_vol = -1;
                    vol_slider.noUiSlider.set(a.volume)
                }
            }
            var c = "";
            if (a.muted == true) {
                mutestatus = 1;
                c = "<a href='#' onClick='toggleMute(); return false;'><i class='material-icons'>volume_off</i></a>"
            } else {
                mutestatus = 0;
                c = "<a href='#'  onClick='toggleMute(); return false;'><i class='material-icons'>volume_up</i></a>"
            }
            $("#responsive_mute_status").html(c);
            setOSD(a);
            var f = "";
            var g = "";
            var h = "";
            if (a.isRecording == "true") {
                var m = a.Recording_list;
                var k = m.split("\n");
                var o = 0;
                var j = "";
                for (var e in k) {
                    if (k[e] != "") {
                        o += 1;
                        j += "<li> <a href='#' data-dismiss='modal' onClick='load_maincontent(\"ajax/timers\"); return false;'>" + k[e] + "</a></li><hr />"
                    }
                }
                $("#recmodalcontent").html(j);
                f = "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='modal' data-target='#RecModal' role='button'><i class='material-icons'>videocam</i><span class='label-count'>" + o + "</span></a>"
            }
            if (a.isStreaming == "true") {
                var p = a.Streaming_list;
                var i = p.split("\n");
                var d = 0;
                var j = "";
                for (var n in i) {
                    if (i[n] != "") {
                        d += 1;
                        j += "<li>" + i[n] + "</li><hr/>"
                    }
                }
                $("#streammodalcontent").html(j);
                g = "<a href='javascript:void(0);' data-toggle='modal' data-target='#StreamModal' class='dropdown-toggle' role='button'><i class='material-icons'>wifi_tethering</i><span class='label-count'>" + d + "</span></a>"
            }
            var l = "power_settings_new";
            if (a.inStandby == "true") {
                l = "lightbulb_outline";
                if ((standby_status === 0) || (standby_status === -1)) {
                    $(".osd-toggle").hide()
                }
                standby_status = 1
            } else {
                if ((standby_status === 1) || (standby_status === -1)) {
                    $(".osd-toggle").show()
                }
                standby_status = 0
            }
            var b = " 			<a href='#' onClick='toggleStandby();return false'> 				<i class='material-icons'>" + l + "</i> 			</a>";
            $("#osd_power_status").html(b);
            $("#responsive_rec_info").html(f);
            $("#responsive_stream_info").html(g)
        }
    })
}

function setOSD(b) {
    var c = current_ref = b.currservice_serviceref;
    var j = current_name = b.currservice_station;
    var h = tstr_stream + ": " + j + "'><i class='material-icons'>tv</i></a>";
    var g = tstr_stream + " (" + tstr_transcoded + "): " + j + "'><i class='material-icons'>phone_android</i></a>";
    var f = b.currservice_begin + " - " + b.currservice_end;
    var a = "";
    var e = "";
    var i = "";
    var d = "";
    if (j) {
        if ((c.indexOf("1:0:1") !== -1) || (c.indexOf("1:134:1") !== -1) || (c.indexOf("1:0:2") !== -1) || (c.indexOf("1:134:2") !== -1)) {
            if (b.transcoding && ((c.indexOf("1:0:1") !== -1) || (c.indexOf("1:134:1") !== -1))) {
                a = "<a href='#' onclick=\"jumper8002('" + c + "', '" + j + "')\"; title='" + g
            }
            if ((c.indexOf("1:0:2") !== -1) || (c.indexOf("1:134:2") !== -1)) {
                h = tstr_stream + ": " + j + "'><i class='material-icons'>radio</i></a>";
                i = "<a href='#' onClick='load_maincontent(\"ajax/radio\");return false;'><b>" + j + "&nbsp;&nbsp;</b>" + f + "</a>"
            } else {
                h = tstr_stream + ": " + j + "'><i class='material-icons'>tv</i></a>";
                i = "<a href='#' onClick='load_maincontent(\"ajax/tv\");return false;'><b>" + j + "&nbsp;&nbsp;</b>" + f + "</a>"
            }
            e = "<a target='_blank' href='/web/stream.m3u?ref=" + c + "&name=" + j + "' title='" + h;
            d = '<a href="#" onclick="open_epg_dialog(\'' + c + "', '" + j + '\')" data-toggle="modal" data-target="#EPGModal" title=\'' + b.currservice_fulldescription + "'><b>" + b.currservice_name + "</b></a>"
        } else {
            if ((c.indexOf("4097:0:0") !== -1) || (c.indexOf("1:0:0") !== -1)) {
                if (b.currservice_filename === "") {
                    h = tstr_stream + ": " + j + "'>" + j + "</a>";
                    e = "<a href='#' title='" + h
                } else {
                    h = tstr_stream + ": " + j + "'><i class='material-icons'>movie</i></a>";
                    e = "<a target='_blank' href='/web/ts.m3u?file=" + b.currservice_filename + "' title='" + h;
                    i = "<a href='#' onClick='load_maincontent(\"ajax/movies\");return false;'><b>" + j + "&nbsp;&nbsp;</b></a>";
                    if (b.transcoding) {
                        a = "<a href='#' onclick=\"jumper8003('" + b.currservice_filename + "')\"; title='" + g
                    }
                }
            }
        }
    }
    $("#responsive_osd_transcoding").html(a);
    $("#responsive_osd_stream").html(e);
    $("#responsive_osd_current").html(i);
    $("#responsive_osd_cur_event").html(d)
}

function loadeventepg(d, c, b) {
    if (typeof b !== "undefined") {
        channelpicon = b
    } else {
        delete channelpicon
    }
    var a = "ajax/event?idev=" + d + "&sref=" + escape(c);
    $("#eventdescriptionII").load(a)
}

function loadtimeredit(c, b) {
    var a = "ajax/event?idev=" + c + "&sref=" + escape(b);
    $("#eventdescriptionII").load(a)
}

function initTimerEdit(a, c) {
    var b = function() {
        $("#dirname").find("option").remove().end();
        $("#dirname").append($("<option></option>").attr("value", "None").text("Default"));
        for (var f in _locations) {
            var e = _locations[f];
            $("#dirname").append($("<option></option>").attr("value", e).text(e))
        }
        $("#dirname").selectpicker("refresh");
        $("#tagsnew").html("");
        for (var f in _tags) {
            var d = _tags[f];
            $("#tagsnew").append("<input type='checkbox' name='" + d + "' value='" + d + "' id='tag_" + d + "'/><label for='tag_" + d + "'>" + d + "</label>")
        }
        $("#tagsnew > input").checkboxradio({
            icon: false
        });
        timeredit_initialized = true;
        c()
    };
    initTimerBQ(a, b)
}

function initTimerEditBegin() {
    $("#timerbegin").datetimepicker({
        format: "dd.mm.yy hh:ii",
        autoclose: true,
        todayHighlight: true,
        todayBtn: "linked",
        minuteStep: 2,
        language: "de",
    });
    $("#timerbegin").datetimepicker().on("changeDate", function(b, a) {
        if ($("#timerend").val() != "" && $(this).datetimepicker("getDate") > $("#timerend").datetimepicker("getDate")) {
            showErrorMain(tstr_start_after_end)
        }
    })
}

function TimerConflict(a, e, d, b) {
    var c = "";
    a.forEach(function(f) {
        c += "<div class='row clearfix'><div class='col-xs-12'> 			<div class='card'> 				<div class='header'> 					<div class='row clearfix'> 						<div class='col-xs-12 col-sm-6'> 							<h2><i class='material-icons material-icons-centered'>alarm</i>" + f.name + "</h2> 						</div> 					</div> 				</div> 				<div class='body'> 						<div class='row clearfix'> 							<div class='col-xs-12'> 								<p>" + f.servicename + "</p> 								<p>" + f.realbegin + " - " + f.realend + "</p> 							</div> 						</div> 					</div> 				</div> 			</div> 		</div></div> 		"
    });
    $(".modal").modal("hide");
    $("#timerconflictmodal").html(c);
    $("#TimerConflictModal").modal("show")
}

function cbAddTimerEvent(a) {
    if (a.state) {
        $(".event[data-id=" + a.eventId + '][data-ref="' + a.sRef + '"] .timer').remove();
        $(".event[data-id=" + a.eventId + '][data-ref="' + a.sRef + '"] div:first').append('<div class="timer">' + tstr_timer + "</div>");
        showErrorMain(tstr_timer_added, true)
    }
}

function addTimerEvent(d, c, a, e) {
    var b = "/api/timeraddbyeventid?sRef=" + d + "&eventid=" + c;
    if (a) {
        b += "&eit=0&disabled=0&justplay=1&afterevent=3"
    }
    webapi_execute_result(b, function(h, g, f) {
        if (!h && f) {
            TimerConflict(f, d, c, a)
        } else {
            if (typeof e !== "undefined") {
                e({
                    sRef: d,
                    eventId: c,
                    justplay: a,
                    state: h,
                    txt: g
                })
            } else {
                showErrorMain(h ? tstr_timer_added : g, true)
            }
        }
    })
}

function addTimer(n, j, f, l) {
    current_serviceref = "";
    current_begin = -1;
    current_end = -1;
    servicename = "";
    var d = -1;
    var e = -1;
    var b = "";
    var m = "";
    var i = "";
    var h = 0;
    var k = 0;
    if (typeof n !== "undefined" && n != "") {
        d = n.begin;
        e = n.begin + n.duration;
        b = n.sref;
        servicename = n.channel;
        m = n.title;
        i = n.shortdesc;
        h = n.recording_margin_before;
        k = n.recording_margin_after
    }
    var g = $("#bouquet_select > optgroup").length;
    var c = false;
    if (typeof j !== "undefined") {
        c = (j.substring(0, 6) == "1:0:2:")
    }
    $("#cbtv").prop("checked", !c);
    $("#cbradio").prop("checked", c);
    var o = function() {
        if (typeof j !== "undefined" && typeof f !== "undefined") {
            b = j;
            m = f;
            if ($("#bouquet_select").val(j) === "undefined") {
                $("#bouquet_select").append($("<option></option>").attr("value", b).text(f))
            }
        }
        $("#timername").val(m);
        $("#description").val(i);
        $("#dirname").val("None");
        $("#enabled").prop("checked", true);
        $("#justplay").prop("checked", false);
        $("#afterevent").val(3);
        for (var q = 0; q < 7; q++) {
            $("#day" + q).prop("checked", false)
        }
        $("#tagsnew > input").prop("checked", false).checkboxradio("refresh");
        var r = d !== -1 ? new Date((Math.round(d) - h * 60) * 1000) : new Date();
        $("#timerbegin").datetimepicker("setDate", r);
        var p = e !== -1 ? new Date((Math.round(e) + k * 60) * 1000) : new Date(r.getTime() + (60 * 60 * 1000));
        $("#timerend").datetimepicker("setDate", p);
        $("#bouquet_select").val(b);
        $("#bouquet_select").trigger("chosen:updated");
        setTimerEditFormTitle(tstr_add_timer)
    };
    if (!timeredit_initialized || g < 2) {
        initTimerEdit(c, o)
    } else {
        var a = $("#bouquet_select option:last").val();
        if (c && a.substring(0, 6) !== "1:0:2:") {
            initTimerEdit(c, o)
        } else {
            if (!c && a.substring(0, 6) == "1:0:2:") {
                initTimerEdit(c, o)
            } else {
                o()
            }
        }
    }
}

function editTimer(c, f, a) {
    c = decodeURI(c);
    current_serviceref = c;
    current_begin = f;
    current_end = a;
    var b = false;
    if (typeof c !== "undefined") {
        b = (c.substring(0, 6) == "1:0:2:")
    }
    $("#cbtv").prop("checked", !b);
    $("#cbradio").prop("checked", b);
    var e = function() {
        if (timeredit_begindestroy) {
            initTimerEditBegin();
            timeredit_begindestroy = false
        }
        $.ajax({
            url: "/api/timerlist",
            dataType: "json",
            success: function(timers) {
                if (timers.result) {
                    for (var p in timers.timers) {
                        timer = timers.timers[p];
                        if (timer.serviceref == c && Math.round(timer.begin) == Math.round(f) && Math.round(timer.end) == Math.round(a)) {
                            $("#timername").val(timer.name);
                            $("#description").val(timer.description);
                            $("#bouquet_select").val(timer.serviceref);
                            $("#bouquet_select").trigger("chosen:updated");
                            if (timer.serviceref !== $("#bouquet_select").val()) {
                                $("#bouquet_select").append($("<option></option>").attr("value", timer.serviceref).text(timer.servicename));
                                $("#bouquet_select").val(timer.serviceref)
                            }
                            $("#dirname").val(timer.dirname);
                            if (timer.dirname !== $("#dirname").val()) {
                                current_location = "<option value='" + timer.dirname + "'>" + timer.dirname + "</option>";
                                $("#dirname").append(current_location);
                                $("#dirname").val(timer.dirname)
                            }
                            $("#enabled").prop("checked", timer.disabled == 0);
                            $("#justplay").prop("checked", timer.justplay);
                            $("#afterevent").val(timer.afterevent);
                            var h = timer.repeated;
                            for (var m = 0; m < 7; m++) {
                                $("#day" + m).prop("checked", ((h & 1) == 1));
                                h >>= 1
                            }
                            $("#tagsnew > input").prop("checked", false);
                            var l = timer.tags.split(" ");
                            for (var k = 0; k < l.length; k++) {
                                var g = l[k].replace(/\(/g, "_").replace(/\)/g, "_").replace(/\'/g, "_");
                                if (g.length > 0) {
                                    if ($("#tag_" + g).length) {
                                        $("#tag_" + g).prop("checked", true).checkboxradio("refresh")
                                    } else {
                                        $("#tagsnew").append("<input type='checkbox' checked='checked' name='" + g + "' value='" + g + "' id='tag_" + g + "'/><label for='tag_" + g + "'>" + g + "</label>")
                                    }
                                }
                            }
                            $("#tagsnew > input").checkboxradio({
                                icon: false
                            });
                            $("#timerbegin").datetimepicker("setDate", (new Date(Math.round(timer.begin) * 1000)));
                            $("#timerend").datetimepicker("setDate", (new Date(Math.round(timer.end) * 1000)));
                            var n = (timer.state === 2);
                            if (n) {
                                $("#timerbegin").datetimepicker("destroy");
                                timeredit_begindestroy = true;
                                $("#timerbegin").addClass("ui-state-disabled");
                                $("#timername").addClass("ui-state-disabled");
                                $("#dirname option").not(":selected").attr("disabled", "disabled");
                                $("#bouquet_select option").not(":selected").attr("disabled", "disabled")
                            } else {
                                $("#timername").removeClass("ui-state-disabled");
                                $("#timerbegin").removeClass("ui-state-disabled");
                                $("#dirname option").removeAttr("disabled");
                                $("#bouquet_select option").removeAttr("disabled")
                            }
                            $("#timerbegin").prop("readonly", n);
                            $("#timername").prop("readonly", n);
                            if (typeof timer.vpsplugin_enabled !== "undefined" && (!typeof timer.vpsplugin_enabled)) {
                                console.debug(timer.vpsplugin_enabled);
                                $("#vpsplugin_enabled").prop("checked", timer.vpsplugin_enabled);
                                $("#vpsplugin_safemode").prop("checked", !timer.vpsplugin_overwrite);
                                $("#has_vpsplugin1").show();
                                checkVPS()
                            } else {
                                $("#has_vpsplugin1").hide()
                            }
                            if (typeof timer.always_zap !== "undefined") {
                                $("#always_zap1").show();
                                $("#always_zap").prop("checked", timer.always_zap == 1);
                                $("#justplay").prop("disabled", timer.always_zap == 1)
                            } else {
                                $("#always_zap1").hide()
                            }
                            setTimerEditFormTitle(tstr_edit_timer + " - " + timer.name);
                            break
                        }
                    }
                }
            }
        })
    };
    if (!timeredit_initialized) {
        initTimerEdit(b, e)
    } else {
        var d = $("#bouquet_select option:last").val();
        if (b && d.substring(0, 6) !== "1:0:2:") {
            initTimerEdit(b, e)
        } else {
            if (!b && d.substring(0, 6) == "1:0:2:") {
                initTimerEdit(b, e)
            } else {
                e()
            }
        }
    }
}

function changeMoviesort(a) {
    MLHelper.SortMovies(a);
    MLHelper.ChangeSort(a);
    MLHelper.ReadMovies();
    lastcontenturl = "";
    load_maincontent_spin("ajax/movies")
}

function changeMoviesortSearch(a) {
    MLHelper.SortMovies(a);
    MLHelper.ChangeSort(a);
    MLHelper.ReadMovies();
    load_maincontent_spin_force(lastcontenturl)
}

function initTimerEditForm() {
    if (timerFormInitiated !== 1) {
        timerFormInitiated = 1;
        addTimer();
        element = document.getElementById("editTimerForm");
        $("#timereditmodal").html(element)
    }
}

function setTimerEditFormTitle(a) {
    $("#timerEditTitle").html(a)
}

function toggleMute() {
    $.ajax("web/vol?set=mute");
    getStatusInfo()
}

function CallEPGResponsive(a) {
    load_tvcontent_spin(a)
}

function CallEPG() {
    $("#myepgbtn2").click(function() {
        $("#tvcontent").load("ajax/multiepg?epgmode=radio")
    });
    $("#myepgbtn3").click(function() {
        $("#tvcontent").load("ajax/multiepg?epgmode=tv")
    });
    $("#tvbutton").buttonset();
    $("#tvcontent").load("ajax/multiepg?epgmode=tv")
}

function myEPGSearch() {
    var b = $("#epgSearchTVRadio").val();
    var d = $("#myepgbtn0").is(":checked") ? "&full=1" : "";
    var g = $("#myepgbtn1").is(":checked") ? "&bouquetsonly=1" : "";
    var c = "ajax/epgdialog?sstr=" + encodeURIComponent(b) + d + g;
    var a = $(window).width() - 100;
    var e = $(window).height() - 100;
    var f = {};
    f[tstr_close] = function() {
        $(this).dialog("close")
    };
    f[tstr_open_in_new_window] = function() {
        $(this).dialog("close");
        open_epg_search_pop(b, d)
    };
    load_dm_spinner(c, tstr_epgsearch, a, e, f)
}
$.VTiTools = {};
var $searchBar = $(".search-bar-epg");
var $searchBarMovie = $(".search-bar-movie");
$.VTiTools.epgsearch = {
    activate: function() {
        var a = this;
        $(".js-search-epg").on("click", function() {
            a.showSearchBar()
        });
        $searchBar.find(".close-search").on("click", function() {
            a.hideSearchBar()
        });
        $searchBar.find(".start-search").on("click", function() {
            a.startSearch()
        });
        $searchBar.find('input[type="text"]').on("keyup", function(b) {
            if (b.keyCode == 27) {
                a.hideSearchBar()
            } else {
                if (b.keyCode == 13) {
                    a.startSearch()
                }
            }
        })
    },
    showSearchBar: function() {
        $.VTiTools.moviesearch.hideSearchBarMovie();
        $searchBar.addClass("open");
        $searchBar.find('input[type="text"]').focus()
    },
    hideSearchBar: function() {
        $searchBar.removeClass("open");
        $searchBar.find('input[type="text"]').val("")
    },
    startSearch: function() {
        if ($("body").hasClass("ls-closed-manual")) {
            toggleLeftSideBar()
        }
        gotEPGSearch();
        this.hideSearchBar()
    }
};
$.VTiTools.moviesearch = {
    activate: function() {
        var a = this;
        $(".js-search-movie").on("click", function() {
            console.debug("xlkj");
            a.showSearchBarMovie()
        });
        $searchBarMovie.find(".close-search").on("click", function() {
            a.hideSearchBarMovie()
        });
        $searchBarMovie.find(".start-search").on("click", function() {
            a.startSearchMovie()
        });
        $searchBarMovie.find('input[type="text"]').on("keyup", function(b) {
            if (b.keyCode == 27) {
                a.hideSearchBarMovie()
            } else {
                if (b.keyCode == 13) {
                    a.startSearchMovie()
                }
            }
        })
    },
    showSearchBarMovie: function() {
        $.VTiTools.epgsearch.hideSearchBar();
        $searchBarMovie.addClass("open");
        $searchBarMovie.find('input[type="text"]').focus()
    },
    hideSearchBarMovie: function() {
        $searchBarMovie.removeClass("open");
        $searchBarMovie.find('input[type="text"]').val("")
    },
    startSearchMovie: function() {
        if ($("body").hasClass("ls-closed-manual")) {
            toggleLeftSideBar()
        }
        gotMovieSearch();
        this.hideSearchBarMovie()
    }
};

function gotEPGSearch() {
    var d = $("#epgsearchtext").val();
    var b = $("#myepgbtn0").is(":checked") ? "&full=1" : "";
    var c = $("#myepgbtn1").is(":checked") ? "&bouquetsonly=1" : "";
    var a = "ajax/epgdialog?sstr=" + encodeURIComponent(d) + b + c;
    $("#epgSearch").val("");
    load_maincontent(a);
    lastcontenturl = ""
}

function gotMovieSearch() {
    var b = $("#moviesearchtext").val();
    var d = $("#mymoviesearchbtn0").is(":checked") ? "&short=1" : "";
    var c = $("#mymoviesearchbtn1").is(":checked") ? "&extended=1" : "";
    var a = "ajax/moviesearch?find=" + encodeURIComponent(b) + d + c;
    $("#epgSearch").val("");
    load_maincontent_spin_force(a)
}

function closeMessageModal() {
    $("#messageSentResponse").html("")
}

function sendModalMessage() {
    var c = $("#messageText").val();
    var a = $("#messageType").val();
    var b = $("#messageTimeout").val();
    $.ajax({
        url: "/api/message?text=" + c + "&type=" + a + "&timeout=" + b,
        dataType: "json",
        cache: false,
        success: function(d) {
            $("#messageSentResponse").html('<div class="alert alert-info">' + d.message + "</div>");
            if (a == 0) {
                MessageAnswerCounter = b;
                setTimeout(countdowngetMessage, 1000)
            }
        }
    });
    $("#messageText").val("");
    $("#messageType").val(1);
    $("#messageType").selectpicker("refresh");
    $("#messageTimeout").val("30");
    $("#messageTimeout").removeClass("active");
    $("#messageText").addClass("active")
}

function btn_saveTimer() {
    var a = moment($("#timerend").val(), "DD.MM.YYYY hh:mm").unix();
    var e = 0;
    $('[name="repeated"]:checked').each(function() {
        e += parseInt($(this).val())
    });
    var b = "";
    $('[name="tagsnew"]:checked').each(function() {
        if (b != "") {
            b += " "
        }
        b += $(this).val()
    });
    var c = {
        sRef: $("#bouquet_select").val(),
        end: a,
        name: $("#timername").val(),
        description: $("#description").val(),
        disabled: ($("#enabled").is(":checked") ? "0" : "1"),
        afterevent: $("#afterevent").val(),
        tags: b,
        repeated: e
    };
    if ($("#always_zap").is(":checked")) {
        c.always_zap = "1";
        c.justplay = "0"
    } else {
        c.justplay = $("#justplay").is(":checked") ? "1" : "0"
    }
    if ($("#dirname").val() != "None") {
        c.dirname = $("#dirname").val()
    }
    if (!$("#has_vpsplugin1").is(":hidden")) {
        c.vpsplugin_enabled = ($("#vpsplugin_enabled").is(":checked") ? "1" : "0");
        c.vpsplugin_overwrite = ($("#vpsplugin_safemode").is(":checked") ? "0" : "1")
    }
    if (!timeredit_begindestroy) {
        var f = moment($("#timerbegin").val(), "DD.MM.YYYY hh:mm").unix();
        c.begin = f
    } else {
        c.begin = Math.round(current_begin)
    }
    var d = false;
    if (current_serviceref == "") {
        $.ajax({
            async: false,
            dataType: "json",
            cache: false,
            url: "/api/timeradd?",
            data: c,
            success: function(result) {
                if (result.result) {
                    d = true
                } else {
                    if (result.conflicts) {
                        var h = "Timer Conflicts:<br>";
                        result.conflicts.forEach(function(i) {
                            h += i.name + " / " + i.servicename + " / " + i.realbegin + " - " + i.realend + "<br>"
                        });
                        showErrorMain(h)
                    } else {
                        showErrorMain(result.message)
                    }
                }
            }
        })
    } else {
        c.channelOld = current_serviceref;
        c.beginOld = Math.round(current_begin);
        c.endOld = Math.round(current_end);
        $.ajax({
            async: false,
            dataType: "json",
            cache: false,
            url: "api/timerchange?",
            data: c,
            success: function(result) {
                if (result.result) {
                    d = true
                } else {
                    if (result.conflicts) {
                        var h = "Timer Conflicts:<br>";
                        result.conflicts.forEach(function(i) {
                            h += i.name + " / " + i.servicename + " / " + i.realbegin + " - " + i.realend + "<br>"
                        });
                        $("#error").text(h)
                    } else {
                        $("#error").text(result.message)
                    }
                }
            }
        })
    }
    if (d) {
        if (reloadTimers) {
            if (lastcontenturl.startsWith("ajax/timers")) {
                lastcontenturl = "";
                setTimeout(function() {
                    load_maincontent("ajax/timers")
                }, 500)
            }
        }
    }
}

function skinChanger() {
    $(".right-sidebar .demo-choose-skin li").on("click", function() {
        var b = $("body");
        var c = $(this);
        var a = $(".right-sidebar .demo-choose-skin li.active").data("theme");
        $(".right-sidebar .demo-choose-skin li").removeClass("active");
        b.removeClass("theme-" + a);
        c.addClass("active");
        b.addClass("theme-" + c.data("theme"));
        $(".progress-bar, #moviedirbtn, .atbtn, .responsivebtn, .vti-colored-card").removeClass("bg-" + a);
        $(".progress-bar, #moviedirbtn, .atbtn, .responsivebtn, .vti-colored-card").addClass("bg-" + c.data("theme"));
        $(".lever").removeClass("switch-col-" + a);
        $(".lever").addClass("switch-col-" + c.data("theme"));
        $(".radio-vti").removeClass("radio-col-" + a);
        $(".radio-vti").addClass("radio-col-" + c.data("theme"));
        $(".theme-link-color").removeClass("theme-link-col-" + a);
        $(".theme-link-color").addClass("theme-link-col-" + c.data("theme"));
        $(".nav-tabs").removeClass("tab-col-" + a);
        $(".nav-tabs").addClass("tab-col-" + c.data("theme"));
        $(".navtab-active").css("border-bottom", "2px solid " + c.data("theme"));
        $(":checkbox").removeClass("chk-col-" + a);
        $(":checkbox").addClass("chk-col-" + c.data("theme"));
        $.get("api/setskincolor?skincolor=" + c.data("theme"));
        $("a").addClass("link-col-black")
    })
}

function VTiWebConfig() {
    $("#mymoviesearchbtn0").change(function() {
        var a = $("#mymoviesearchbtn0").is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?moviesearchshort=" + a)
    });
    $("#mymoviesearchbtn1").change(function() {
        var a = $("#mymoviesearchbtn1").is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?moviesearchextended=" + a)
    });
    $("#myepgbtn0").change(function() {
        var a = $("#myepgbtn0").is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?fullsearch=" + a)
    });
    $("#myepgbtn1").change(function() {
        var a = $("#myepgbtn1").is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?bqonly=" + a)
    });
    $("#remotegrabscreen1").change(function() {
        var a = $(this).is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?rcugrabscreen=" + a)
    });
    $("#remotecontrolview").change(function() {
        var a = $(this).is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?remotecontrolview=" + a);
        toggleFullRemote()
    });
    $("#minmovielist").change(function() {
        var a = $(this).is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?minmovielist=" + a);
        if (lastcontenturl.startsWith("ajax/movies")) {
            load_maincontent_spin_force(lastcontenturl)
        }
    });
    $("#mintimerlist").change(function() {
        var a = $(this).is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?mintimerlist=" + a);
        if (lastcontenturl === "ajax/timers") {
            lastcontenturl = "";
            load_maincontent("ajax/timers")
        }
    });
    $("#minepglist").change(function() {
        var a = $(this).is(":checked") ? "1" : "0";
        $.get("api/setvtiwebconfig?minepglist=" + a)
    })
}

function setSkinListHeightAndScroll(b) {
    var a = $(window).height() - ($(".navbar").innerHeight() + $(".right-sidebar .nav-tabs").outerHeight());
    var c = $(".demo-choose-skin");
    if (!b) {
        c.slimScroll({
            destroy: true
        }).height("auto");
        c.parent().find(".slimScrollBar, .slimScrollRail").remove()
    }
    c.slimscroll({
        height: a + "px",
        color: "rgba(0,0,0,0.5)",
        size: "6px",
        alwaysVisible: false,
        borderRadius: "0",
        railBorderRadius: "0"
    })
}

function initSkin() {
    var b = $("body");
    var a = b.attr("class");
    a = a.replace("theme-", "");
    $(".right-sidebar .demo-choose-skin li").removeClass("active");
    b.removeClass("theme-" + a);
    $('.right-sidebar .demo-choose-skin li[data-theme="' + a + '"]').addClass("active");
    b.addClass("theme-" + a)
}

function setSettingListHeightAndScroll(b) {
    var a = $(window).height() - ($(".navbar").innerHeight() + $(".right-sidebar .nav-tabs").outerHeight());
    var c = $(".right-sidebar .demo-settings");
    if (!b) {
        c.slimScroll({
            destroy: true
        }).height("auto");
        c.parent().find(".slimScrollBar, .slimScrollRail").remove()
    }
    c.slimscroll({
        height: a + "px",
        color: "rgba(0,0,0,0.5)",
        size: "6px",
        alwaysVisible: false,
        borderRadius: "0",
        railBorderRadius: "0"
    })
}

function activateNotificationAndTasksScroll() {
    $(".navbar-right .dropdown-menu .body .menu").slimscroll({
        height: "254px",
        color: "rgba(0,0,0,0.5)",
        size: "4px",
        alwaysVisible: false,
        borderRadius: "0",
        railBorderRadius: "0"
    })
}

function showErrorMain(a, b) {
    b = typeof b !== "undefined" ? b : "False";
    var c = "error";
    if (b === true || b === "True" || b === "true") {
        c = "success"
    }
    if (a !== "") {
        swal("", a, c)
    } else {
        $("#statuscont").hide()
    }
}

function deleteTimer(e, c, a, d) {
    var b = decodeURIComponent(d);
    swal({
        title: tstr_del_timer,
        text: b,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: tstrings_yes_delete + " !",
        cancelButtonText: tstrings_no_cancel + " !",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function(f) {
        if (f) {
            webapi_execute("/api/timerdelete?sRef=" + e + "&begin=" + c + "&end=" + a, function() {
                $("#" + c + "-" + a).remove()
            });
            swal(tstrings_deleted, b, "success")
        } else {
            swal(tstrings_cancelled, b, "error")
        }
    })
}

function deleteMovie(b, c, a) {
    swal({
        title: tstr_del_recording,
        text: a,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: tstrings_yes_delete + " !",
        cancelButtonText: tstrings_no_cancel + " !",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function(d) {
        if (d) {
            webapi_execute_movie("/api/moviedelete?sRef=" + b, function(e) {
                if (e) {
                    swal(tstrings_deleted, a, "success");
                    $("#" + c).remove()
                }
            })
        } else {
            swal(tstrings_cancelled, a, "error")
        }
    })
}

function renameMovie(b, a) {
    swal({
        title: tstr_ren_recording,
        text: a,
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: a,
        inputValue: a,
        input: "text",
    }, function(c) {
        if ((c === false) || (c === a)) {
            return false
        }
        if (c === "") {
            swal.showInputError(tstrings_need_input);
            return false
        }
        webapi_execute_movie("/api/movierename?sRef=" + b + "&newname=" + c);
        showErrorMain(c, true)
    })
}

function closeSideBar() {
    var c = $("body");
    var b = c.width();
    if (b < $.AdminBSB.options.leftSideBar.breakpointWidth) {
        var a = $(".navbar .navbar-header .bars");
        c.addClass("ls-closed");
        a.fadeIn()
    } else {
        c.removeClass("ls-closed")
    }
};