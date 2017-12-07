function toUnixDate(a) {
    var b = a.split(":");
    var c = new Date();
    c.setHours(b[0]);
    c.setMinutes(b[1]);
    c.setSeconds(0);
    return Math.floor(c.getTime() / 1000)
}

function addZero(a) {
    if (a < 10) {
        a = "0" + a
    }
    return a
}

function isBQ(a) {
    return ((a.indexOf("FROM BOUQUET") > -1) && (a.indexOf("1:134:1") != 0))
}

function isAlter(a) {
    return (a.indexOf("1:134:1") == 0)
}(function() {
    var b = function() {
        var d;
        var c = false;
        var e = false;
        var f = true;
        return {
            setup: function() {
                d = this;
                $("#er_begin").val("22:30");
                $("#er_end").val("6:30");
                $("#bouquets").change(function() {
                    $("#bouquets").val($(this).val());
                    d.er_bqchchanged = true
                });
                $("#channels").change(function() {
                    $("#channels").val($(this).val());
                    d.er_bqchchanged = true
                });
                d.getAllServices();
                $("#epgrbutton0").click(function() {
                    d.reloadEPGR()
                });
                $("#epgrbutton0").button({
                    icons: {
                        primary: "ui-icon-arrowrefresh-1-w"
                    }
                });
                $("#epgrbutton1").click(function() {
                    d.saveEPGR()
                });
                $("#epgrbutton1").button({
                    icons: {
                        primary: "ui-icon-disk"
                    }
                });
                $("#epgrbutton2").click(function() {
                    d.DoRefresh()
                });
                $("#statuscont").hide()
            },
            getAllServices: function() {
                GetAllServices(function(g, h) {
                    $("#bouquets").hide();
                    $("#channels").hide();
                    $("#channels").append(g);
                    $("#channels").selectpicker("refresh");
                    $("#bouquets").append(h);
                    $("#bouquets").selectpicker("refresh");
                    d.reloadEPGR();
                    $("#bouquets").show();
                    $("#channels").show()
                })
            },
            reloadEPGR: function() {
                d.showError("");
                $.ajax({
                    type: "GET",
                    url: "/epgrefresh",
                    dataType: "xml",
                    success: function(g) {
                        d.readEPGR2(g)
                    },
                    error: function(i, g, h) {
                        d.showError(i.responseText)
                    }
                })
            },
            readEPGR2: function(i) {
                var h;
                var g;
                d.er_hasAutoTimer = false;
                $.ajax({
                    type: "GET",
                    url: "/epgrefresh/get",
                    dataType: "xml",
                    success: function(j) {
                        var k = [];
                        $(j).find("e2setting").each(function() {
                            var l = $(this).find("e2settingname").text();
                            var m = $(this).find("e2settingvalue").text();
                            if (l.indexOf("config.plugins.epgrefresh.") === 0) {
                                l = l.substring(26);
                                if (m === "True") {
                                    $("#er_" + l).prop("checked", true)
                                } else {
                                    if (m === "False") {
                                        $("#er_" + l).prop("checked", false)
                                    } else {
                                        if (l === "begin") {
                                            h = m
                                        } else {
                                            if (l === "end") {
                                                g = m
                                            } else {
                                                if (l == "interval_seconds") {
                                                    d.binterval_in_seconds = true;
                                                    $("#er_interval").val(m)
                                                } else {
                                                    if (l == "interval") {
                                                        d.binterval_in_seconds = false;
                                                        $("#er_interval").val(m)
                                                    } else {
                                                        $("#er_" + l).val(m)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (l === "hasAutoTimer" && m === "True") {
                                    d.er_hasAutoTimer = true
                                }
                            }
                        });
                        d.UpdateCHBQ(i, h, g)
                    },
                    error: function(l, j, k) {
                        d.showError(l.responseText)
                    }
                })
            },
            UpdateCHBQ: function(r, i, k) {
                var l = parseInt(i);
                var s = new Date(l * 1000);
                var n = addZero(s.getHours());
                var j = addZero(s.getMinutes());
                $("#er_begin").val(n + ":" + j);
                l = parseInt(k);
                s = new Date(l * 1000);
                n = addZero(s.getHours());
                j = addZero(s.getMinutes());
                $("#er_end").val(n + ":" + j);
                var p = [];
                var q = [];
                $(r).find("e2service").each(function() {
                    var h = $(this).find("e2servicereference").text();
                    if (isBQ(h)) {
                        q.push(encodeURIComponent(h))
                    } else {
                        if (isAlter(h)) {
                            p.push(encodeURIComponent(h))
                        } else {
                            p.push(h)
                        }
                    }
                });
                var g = p.slice();
                var o = q.slice();
                $("#channels").val(null);
                $("#bouquets").val(null);
                $.each(o, function(h, m) {
                    $('#bouquets option[value="' + m + '"]').prop("selected", true)
                });
                $.each(g, function(h, m) {
                    $('#channels option[value="' + m + '"]').prop("selected", true)
                });
                $("#bouquets").hide();
                $("#channels").hide();
                $("#bouquets").selectpicker("refresh");
                $("#channels").selectpicker("refresh");
                $("#bouquets").show();
                $("#channels").show();
                d.er_bqchchanged = false;
                if (d.binterval_in_seconds) {
                    $("#lbls").show();
                    $("#lblm").hide()
                } else {
                    $("#lblm").show();
                    $("#lbls").hide()
                }
                if (d.er_hasAutoTimer) {
                    $("#er_hasAT").show()
                } else {
                    $("#er_hasAT").hide()
                }
            },
            saveEPGR: function() {
                var g = "/epgrefresh/set?&enabled=";
                g += $("#er_enabled").is(":checked") ? "true" : "";
                g += "&enablemessage=";
                g += $("#er_enablemessage").is(":checked") ? "true" : "";
                g += "&begin=" + toUnixDate($("#er_begin").val());
                g += "&end=" + toUnixDate($("#er_end").val());
                g += "&delay_standby=" + $("#er_delay_standby").val();
                g += "&afterevent=";
                g += $("#er_afterevent").is(":checked") ? "true" : "";
                g += "&force=";
                g += $("#er_force").is(":checked") ? "true" : "";
                g += "&wakeup=";
                g += $("#er_wakeup").is(":checked") ? "true" : "";
                g += "&adapter=" + $("#er_adapter").val();
                if (d.er_hasAutoTimer) {
                    g += "&inherit_autotimer=";
                    g += $("#er_inherit_autotimer").is(":checked") ? "true" : "";
                    g += "&parse_autotimer=" + $("#er_parse_autotimer").val()
                }
                if (d.binterval_in_seconds) {
                    g += "&interval_seconds=" + $("#er_interval").val()
                } else {
                    g += "&interval=" + $("#er_interval").val()
                }
                $.ajax({
                    type: "GET",
                    url: g,
                    dataType: "xml",
                    success: function(i) {
                        var j = $(i).find("e2state").first();
                        var h = $(i).find("e2statetext").first();
                        d.showError(h.text(), j.text());
                        if (j) {
                            d.SaveCHBQ()
                        }
                    },
                    error: function(j, h, i) {
                        d.showError(j.responseText)
                    }
                })
            },
            SaveCHBQ: function() {
                if (d.er_bqchchanged === false) {
                    return
                }
                var h = "";
                var i = $("#bouquets").val();
                var g = $("#channels").val();
                if (g && g.length > 0) {
                    $.each(g, function(k, l) {
                        if (isAlter(l)) {
                            h += "&sref=" + l
                        } else {
                            h += "&sref=" + encodeURIComponent(l)
                        }
                    })
                }
                if (i && i.length > 0) {
                    $.each(i, function(k, l) {
                        h += "&sref=" + l
                    })
                }
                var j = "/epgrefresh/add?multi=1";
                if (h != "") {
                    j += h
                } else {
                    return
                }
                $.ajax({
                    type: "GET",
                    url: j,
                    dataType: "xml",
                    success: function(l) {
                        var m = $(l).find("e2state").first();
                        var k = $(l).find("e2statetext").first();
                        d.showError(k.text(), m.text())
                    },
                    error: function(m, k, l) {
                        d.showError(m.responseText)
                    }
                })
            },
            DoRefresh: function() {
                $.ajax({
                    type: "GET",
                    url: "/epgrefresh/refresh",
                    dataType: "xml",
                    success: function(h) {
                        var i = $(h).find("e2state").first();
                        var g = $(h).find("e2statetext").first();
                        d.showError(g.text(), i.text())
                    },
                    error: function(i, g, h) {
                        d.showError(i.responseText)
                    }
                })
            },
            showError: function(g, h) {
                h = typeof h !== "undefined" ? h : "False";
                var i = "error";
                if (h === true || h === "True" || h === "true") {
                    i = "success"
                }
                if (g !== "") {
                    swal("", g, i)
                } else {
                    $("#statuscont").hide()
                }
            },
        }
    };
    var a = new b();
    a.setup()
})();