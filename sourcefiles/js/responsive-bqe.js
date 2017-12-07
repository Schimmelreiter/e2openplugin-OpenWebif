(function() {
    var b = function() {
        var m;
        var l;
        var h;
        var d;
        var e;
        var k;
        var j;
        var f;
        var i;
        var g;
        return {
            showProviders: function(n) {
                $("#sel0").show();
                $("#btn-provider-add").show().prop("disabled", (m.cType !== 1));
                $("#provider").empty();
                $.each(n, function(p, o) {
                    $("#provider").append(o)
                });
                $("#provider").children().first().addClass("ui-selected");
                m.changeProvider($("#provider").children().first().data("sref"), m.showChannels);
                m.setHover("#provider")
            },
            showChannels: function(n) {
                $("#channels").empty();
                $.each(n, function(p, o) {
                    $("#channels").append(o)
                });
                m.setChannelButtons();
                m.setHover("#channels")
            },
            showBouquets: function(n) {
                $("#bql").empty();
                $.each(n, function(p, o) {
                    $("#bql").append(o)
                });
                $("#bql").children().first().addClass("ui-selected");
                m.changeBouquet($("#bql").children().first().data("sref"), m.showBouquetChannels);
                m.setHover("#bql")
            },
            showBouquetChannels: function(n) {
                $("#bqs").empty();
                $.each(n, function(p, o) {
                    $("#bqs").append(o)
                });
                m.setBouquetChannelButtons();
                m.setHover("#bqs")
            },
            buildRefStr: function(n) {
                var o;
                if (m.Mode === 0) {
                    o = "1:7:1:0:0:0:0:0:0:0:(type == 1) || (type == 17) || (type == 195) || (type == 25) || (type == 22) || (type == 31) || (type == 211) "
                } else {
                    o = "1:7:2:0:0:0:0:0:0:0:(type == 2) "
                }
                if (n === 0) {
                    o += 'FROM BOUQUET "bouquets.';
                    o += (m.Mode === 0) ? "tv" : "radio";
                    o += '" ORDER BY bouquet'
                } else {
                    if (n === 1) {
                        o += "FROM PROVIDERS ORDER BY name"
                    } else {
                        if (n === 2) {
                            o += "FROM SATELLITES ORDER BY satellitePosition"
                        } else {
                            if (n === 3) {
                                o += "ORDER BY name"
                            }
                        }
                    }
                }
                return o
            },
            setTvRadioMode: function(o) {
                var n = false;
                if (o !== m.Mode || o === 3) {
                    n = true
                }
                if (o > 1) {
                    m.Mode = 0
                } else {
                    m.Mode = o
                }
                if (m.cType === 0) {
                    m.getSatellites(m.showProviders)
                } else {
                    if (m.cType === 1) {
                        m.getProviders(m.showProviders)
                    } else {
                        if (m.cType === 2) {
                            $("#sel0").hide();
                            m.getChannels(m.showChannels)
                        }
                    }
                }
                if (n) {
                    m.getBouquets(m.showBouquets)
                }
            },
            getSatellites: function(p) {
                m.cType = 0;
                var o = m.buildRefStr(2);
                var n = (m.Mode === 0) ? "tv" : "radio";
                $.ajax({
                    url: "/api/getsatellites",
                    dataType: "json",
                    cache: true,
                    data: {
                        sRef: o,
                        stype: n,
                        date: m.date
                    },
                    success: function(t) {
                        var q = [];
                        var r = t.satellites;
                        $.each(r, function(v, w) {
                            var s = w.service;
                            var u = w.name;
                            q.push($("<li/>", {
                                data: {
                                    sref: s
                                }
                            }).html(u))
                        });
                        if (p) {
                            p(q)
                        }
                    }
                })
            },
            getProviders: function(o) {
                m.cType = 1;
                var n = m.buildRefStr(1);
                $.ajax({
                    url: "/api/getservices",
                    dataType: "json",
                    cache: true,
                    data: {
                        sRef: n,
                        date: m.date
                    },
                    success: function(r) {
                        var p = [];
                        var q = r.services;
                        $.each(q, function(u, v) {
                            var s = v.servicereference;
                            var t = v.servicename;
                            p.push($("<li/>", {
                                data: {
                                    sref: s
                                }
                            }).html(t))
                        });
                        if (o) {
                            o(p)
                        }
                    }
                })
            },
            getChannels: function(o) {
                m.cType = 2;
                var n = m.buildRefStr(3);
                $.ajax({
                    url: "/api/getservices?sRef=" + n,
                    dataType: "json",
                    cache: true,
                    data: {
                        sRef: n,
                        date: m.date
                    },
                    success: function(p) {
                        m.allChannelsCache = p.services;
                        m.filterChannelsCache = p.services;
                        m.fillChannels(o)
                    }
                })
            },
            fillChannels: function(o) {
                var n = [];
                $.each(m.filterChannelsCache, function(t, u) {
                    var r = u.servicereference;
                    var s = u.servicename;
                    var q = r.split(":")[2];
                    var p = s + '<span class="pull-right">' + (m.sType[q] || "") + '&nbsp;<span class="dd-icon-selected pull-left"><i class="material-icons material-icons-centered">done</i></span></span>';
                    n.push($("<li/>", {
                        data: {
                            stype: q,
                            sref: r
                        }
                    }).html(p))
                });
                if (o) {
                    o(n)
                }
            },
            getBouquets: function(n) {
                $.ajax({
                    url: "/bouqueteditor/api/calcpos",
                    dataType: "json",
                    cache: false,
                    data: {
                        type: m.Mode
                    },
                    success: function(p) {
                        m.bqStartPositions = {};
                        var q = p.services;
                        $.each(q, function(r, s) {
                            m.bqStartPositions[s.servicereference] = s.startpos
                        });
                        var o = m.buildRefStr(0);
                        $.ajax({
                            url: "/bouqueteditor/api/getservices",
                            dataType: "json",
                            cache: false,
                            data: {
                                sRef: o
                            },
                            success: function(u) {
                                var r = [];
                                var t = u.services;
                                $.each(t, function(w, x) {
                                    var s = x.servicereference;
                                    var v = x.servicename;
                                    r.push($("<li/>", {
                                        data: {
                                            sref: s
                                        }
                                    }).html('<span class="handle dd-icon"><i class="material-icons material-icons-centered">list</i>&nbsp;</span>' + v + '<span class="dd-icon-selected pull-right"><i class="material-icons material-icons-centered">done</i></span></li>'))
                                });
                                if (n) {
                                    n(r)
                                }
                            }
                        })
                    }
                })
            },
            changeProvider: function(n, o) {
                $.ajax({
                    url: "/api/getservices",
                    dataType: "json",
                    cache: true,
                    data: {
                        sRef: n,
                        date: m.date
                    },
                    success: function(p) {
                        m.allChannelsCache = p.services;
                        m.filterChannelsCache = p.services;
                        m.fillChannels(o)
                    }
                })
            },
            changeBouquet: function(o, p) {
                var n = 0;
                if (m.bqStartPositions[o]) {
                    n = m.bqStartPositions[o]
                }
                $.ajax({
                    url: "/bouqueteditor/api/getservices",
                    dataType: "json",
                    cache: false,
                    data: {
                        sRef: o
                    },
                    success: function(t) {
                        var q = [];
                        var r = t.services;
                        $.each(r, function(w, x) {
                            var u = x.servicereference;
                            var s = (x.ismarker == 1) ? '<span style="float:right">(M)</span>' : "";
                            var v = x.servicename;
                            var y = n + x.pos;
                            if (x.ismarker == 2) {
                                s = '<span style="float:right">(S)</span>'
                            }
                            v = y.toString() + " - " + v;
                            if (v != "") {
                                q.push($("<li/>", {
                                    data: {
                                        ismarker: x.ismarker,
                                        sref: u
                                    }
                                }).html('<span class="handle dd-icon"><i class="material-icons material-icons-centered">list</i>&nbsp;</span>' + v + s + '<span class="dd-icon-selected pull-right"><i class="material-icons material-icons-centered">done</i></span></li>'))
                            }
                        });
                        if (p) {
                            p(q)
                        }
                    }
                })
            },
            addProvider: function() {
                var n = $("#provider li.ui-selected").data("sref");
                $.ajax({
                    url: "/bouqueteditor/api/addprovidertobouquetlist",
                    dataType: "json",
                    cache: true,
                    data: {
                        sProviderRef: n,
                        mode: m.Mode,
                        date: m.date
                    },
                    success: function(p) {
                        var o = p.Result;
                        if (o.length == 2) {
                            m.showError(o[1], o[0])
                        }
                        m.getBouquets(m.showBouquets)
                    }
                })
            },
            moveBouquet: function(n) {
                $.ajax({
                    url: "/bouqueteditor/api/movebouquet",
                    dataType: "json",
                    cache: false,
                    data: {
                        sBouquetRef: n.sBouquetRef,
                        mode: n.mode,
                        position: n.position
                    },
                    success: function() {}
                })
            },
            addBouquet: function() {
                swal({
                    title: tstr_bqe_name_bouquet,
                    text: "",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    animation: "slide-from-top",
                    inputValue: "",
                    input: "text",
                }, function(n) {
                    if ((n === false)) {
                        return false
                    }
                    if (n.length) {
                        $.ajax({
                            url: "/bouqueteditor/api/addbouquet",
                            dataType: "json",
                            cache: false,
                            data: {
                                name: n,
                                mode: m.Mode
                            },
                            success: function(p) {
                                var o = p.Result;
                                if (o.length == 2) {
                                    m.showError(o[1], o[0])
                                }
                                m.getBouquets(m.showBouquets)
                            }
                        })
                    }
                })
            },
            renameBouquet: function() {
                if ($("#bql li.ui-selected").length !== 1) {
                    return
                }
                var p = $("#bql li.ui-selected");
                var r = p.index();
                var n = p.text();
                var q = $.trim(n.replace(/^list/, "").replace(/done$/, ""));
                var o = p.data("sref");
                swal({
                    title: tstr_bqe_rename_bouquet,
                    text: "",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    animation: "slide-from-top",
                    inputValue: q,
                    input: "text",
                }, function(s) {
                    if ((s === false) || (s === n)) {
                        return false
                    }
                    if (s.length) {
                        $.ajax({
                            url: "/bouqueteditor/api/renameservice",
                            dataType: "json",
                            cache: false,
                            data: {
                                sRef: o,
                                mode: m.Mode,
                                newName: s
                            },
                            success: function(u) {
                                var t = u.Result;
                                if (t.length == 2) {
                                    m.showError(t[1], t[0])
                                }
                                m.getBouquets(m.showBouquets)
                            }
                        })
                    }
                })
            },
            deleteBouquet: function() {
                if ($("#bql li.ui-selected").length !== 1) {
                    return
                }
                var n = $("#bql li.ui-selected").text();
                var o = $("#bql li.ui-selected").data("sref");
                swal({
                    title: tstr_bqe_del_bouquet_question,
                    text: n.replace(/^list/, "").replace(/done$/, "") + " ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: tstrings_yes_delete + " !",
                    cancelButtonText: tstrings_no_cancel + " !",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function(p) {
                    if (p) {
                        $.ajax({
                            url: "/bouqueteditor/api/removebouquet",
                            dataType: "json",
                            cache: false,
                            data: {
                                sBouquetRef: o,
                                mode: m.Mode
                            },
                            success: function(s) {
                                var q = s.Result;
                                if (q.length == 2) {
                                    m.showError(q[1], q[0])
                                }
                                m.getBouquets(m.showBouquets)
                            }
                        })
                    }
                })
            },
            setChannelButtons: function() {
                var n = $("#channels li.ui-selected").length == 0;
                $("#btn-channel-add").prop("disabled", n);
                $("#btn-alternative-add").prop("disabled", n)
            },
            setBouquetChannelButtons: function() {
                var n = $("#bqs li.ui-selected");
                var o = n.length == 0;
                $("#btn-channel-delete").prop("disabled", o);
                $("#btn-marker-add").prop("disabled", o);
                $("#btn-spacer-add").prop("disabled", o);
                o = n.length != 1 || n.data("ismarker") != 1;
                $("#btn-marker-group-rename").prop("disabled", o)
            },
            moveChannel: function(n) {
                $.ajax({
                    url: "/bouqueteditor/api/moveservice",
                    dataType: "json",
                    cache: false,
                    data: {
                        sBouquetRef: n.sBouquetRef,
                        sRef: n.sRef,
                        mode: n.mode,
                        position: n.position
                    },
                    success: m.renumberChannel
                })
            },
            renumberChannel: function() {},
            addChannel: function() {
                var p = [];
                var o = $("#bql li.ui-selected").data("sref");
                var n = $("#bqs li.ui-selected").data("sref") || "";
                $("#channels li.ui-selected").each(function() {
                    p.push($.ajax({
                        url: "/bouqueteditor/api/addservicetobouquet",
                        dataType: "json",
                        cache: false,
                        data: {
                            sBouquetRef: o,
                            sRef: $(this).data("sref"),
                            sRefBefore: n
                        },
                        success: function() {}
                    }))
                });
                if (p.length !== 0) {
                    $.when.apply($, p).then(function() {
                        m.changeBouquet(o, m.showBouquetChannels)
                    })
                }
            },
            addAlternative: function() {
                alert("NOT implemented YET");
                return
            },
            deleteChannel: function() {
                if ($("#bqs li.ui-selected").length === 0) {
                    return
                }
                var p = $("#bql li.ui-selected").data("sref");
                var o = [];
                var q = [];
                var n = [];
                $("#bqs li.ui-selected").each(function() {
                    q.push($(this).text().replace(/^list/, "").replace(/done$/, ""));
                    o.push($(this).text());
                    n.push({
                        sBouquetRef: p,
                        mode: m.Mode,
                        sRef: $(this).data("sref")
                    })
                });
                swal({
                    title: tstr_bqe_del_channel_question,
                    text: q.join(", ") + " ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: tstrings_yes_delete + " !",
                    cancelButtonText: tstrings_no_cancel + " !",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function(r) {
                    if (r) {
                        var s = [];
                        $.each(n, function(t, u) {
                            s.push($.ajax({
                                url: "/bouqueteditor/api/removeservice",
                                dataType: "json",
                                cache: false,
                                data: u,
                                success: function() {}
                            }))
                        });
                        if (s.length !== 0) {
                            $.when.apply($, s).then(function() {
                                m.changeBouquet(p, m.showBouquetChannels)
                            })
                        }
                    }
                })
            },
            addMarker: function() {
                m._addMarker(false)
            },
            addSpacer: function() {
                m._addMarker(true)
            },
            _addMarker: function(o) {
                var n = "";
                if (!o) {
                    swal({
                        title: tstr_bqe_name_marker,
                        text: "",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: true,
                        animation: "slide-from-top",
                        inputValue: "",
                        input: "text",
                    }, function(p) {
                        if ((p === false)) {
                            return false
                        }
                        if (p.length || o) {
                            var s = $("#bql li.ui-selected").data("sref");
                            var q = $("#bqs li.ui-selected").data("sref") || "";
                            var r = {
                                sBouquetRef: s,
                                Name: p,
                                sRefBefore: q
                            };
                            if (o) {
                                r = {
                                    sBouquetRef: s,
                                    SP: "1",
                                    sRefBefore: q
                                }
                            }
                            $.ajax({
                                url: "/bouqueteditor/api/addmarkertobouquet",
                                dataType: "json",
                                cache: false,
                                data: r,
                                success: function(u) {
                                    var t = u.Result;
                                    if (t.length == 2) {
                                        m.showError(t[1], t[0])
                                    }
                                    m.changeBouquet(s, m.showBouquetChannels)
                                }
                            })
                        }
                    })
                }
            },
            renameMarkerGroup: function() {
                var p = $("#bqs li.ui-selected");
                if (p.length !== 1) {
                    return
                }
                if (p.data("ismarker") == 0) {
                    return
                }
                var t = p.index();
                var n = p.text();
                var r = $.trim(n.replace(/^list/, "").replace(/done$/, ""));
                var o = p.data("sref");
                var s = $("#bql li.ui-selected").data("sref");
                var q = $("#bqs li.ui-selected").next().data("sref") || "";
                swal({
                    title: tstr_bqe_rename_marker,
                    text: "",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    animation: "slide-from-top",
                    inputValue: "",
                    input: "text",
                }, function(u) {
                    if ((u === false) || (u === n)) {
                        return false
                    }
                    if (u.length) {
                        $.ajax({
                            url: "/bouqueteditor/api/renameservice",
                            dataType: "json",
                            cache: false,
                            data: {
                                sBouquetRef: s,
                                sRef: o,
                                newName: u,
                                sRefBefore: q
                            },
                            success: function(w) {
                                var v = w.Result;
                                if (v.length == 2) {
                                    m.showError(v[1], v[0])
                                }
                                m.changeBouquet(s, m.showBouquetChannels)
                            }
                        })
                    }
                })
            },
            searchChannel: function(n) {
                var o = n.toLowerCase();
                m.filterChannelsCache = [];
                $.each(m.allChannelsCache, function(q, r) {
                    var p = r.servicename;
                    if (p.toLowerCase().indexOf(o) !== -1) {
                        m.filterChannelsCache.push({
                            servicename: r.servicename,
                            servicereference: r.servicereference
                        })
                    }
                });
                m.fillChannels(m.showChannels);
                m.setChannelButtons()
            },
            showError: function(n, o) {
                o = typeof o !== "undefined" ? o : "False";
                $("#statustext").text("");
                if (o === true || o === "True" || o === "true") {
                    $("#statusbox").removeClass("ui-state-error").addClass("ui-state-highlight");
                    $("#statusicon").removeClass("ui-icon-alert").addClass("ui-icon-info")
                } else {
                    $("#statusbox").removeClass("ui-state-highlight").addClass("ui-state-error");
                    $("#statusicon").removeClass("ui-icon-info").addClass("ui-icon-alert")
                }
                $("#statustext").text(n);
                if (n !== "") {
                    $("#statuscont").show()
                } else {
                    $("#statuscont").hide()
                }
            },
            exportBouquets: function() {
                var n = prompt(tstr_bqe_filename + ": ", "bouquets_backup");
                if (n) {
                    $.ajax({
                        url: "/bouqueteditor/api/backup",
                        dataType: "json",
                        cache: false,
                        data: {
                            Filename: n
                        },
                        success: function(q) {
                            var p = q.Result;
                            if (p[0] === false) {
                                showError(p[1], p[0])
                            } else {
                                var o = "/bouqueteditor/tmp/" + p[1];
                                window.open(o, "Download")
                            }
                        }
                    })
                }
            },
            importBouquets: function() {
                $("#rfile").trigger("click")
            },
            prepareRestore: function() {
                var n = $(this).val();
                n = n.replace("C:\\fakepath\\", "");
                if (confirm(tstr_bqe_restore_question + " ( " + n + ") ?") === false) {
                    return
                }
                $("form#uploadrestore").unbind("submit").submit(function(p) {
                    var o = new FormData(this);
                    $.ajax({
                        url: "/bouqueteditor/uploadrestore",
                        type: "POST",
                        data: o,
                        mimeType: "multipart/form-data",
                        contentType: false,
                        cache: false,
                        processData: false,
                        dataType: "json",
                        success: function(t, u, s) {
                            var q = t.Result;
                            if (q[0]) {
                                m.doRestore(q[1])
                            } else {
                                m.showError("Upload File: " + u)
                            }
                        },
                        error: function(q, s, r) {
                            m.showError("Upload File Error: " + r)
                        }
                    });
                    p.preventDefault();
                    try {
                        p.unbind()
                    } catch (p) {}
                });
                $("form#uploadrestore").submit()
            },
            doRestore: function(n) {
                if (n) {
                    $.ajax({
                        url: "/bouqueteditor/api/restore",
                        dataType: "json",
                        cache: false,
                        data: {
                            Filename: n
                        },
                        success: function(p) {
                            var o = p.Result;
                            if (o.length == 2) {
                                m.showError(o[1], o[0])
                            }
                        }
                    })
                }
            },
            setup: function() {
                m = this;
                m.Mode = 0;
                m.cType = 1;
                m.sType = {
                    "1": "[SD]",
                    "16": "[SD4]",
                    "19": "[HD]",
                    "1F": "[UHD]",
                    D3: "[OPT]"
                };
                m.hovercls = getHoverCls();
                m.activecls = getActiveCls();
                $("#btn-provider-add").click(m.addProvider);
                $("#btn-channel-add").click(m.addChannel);
                $("#btn-alternative-add").click(m.addAlternative);
                $("#btn-bouquet-add").click(m.addBouquet);
                $("#btn-bouquet-rename").click(m.renameBouquet);
                $("#btn-bouquet-delete").click(m.deleteBouquet);
                $("#btn-channel-delete").click(m.deleteChannel);
                $("#btn-marker-add").click(m.addMarker);
                $("#btn-spacer-add").click(m.addSpacer);
                $("#btn-marker-group-rename").click(m.renameMarkerGroup);
                $("#provider").selectable({
                    selected: function(n, o) {
                        $(o.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                        m.changeProvider($(o.selected).data("sref"), m.showChannels)
                    },
                    classes: {
                        "ui-selected": m.activecls
                    }
                });
                $("#channels").selectable({
                    stop: m.setChannelButtons,
                    classes: {
                        "ui-selected": m.activecls
                    }
                });
                $("#bql").sortable({
                    handle: ".handle",
                    stop: function(p, q) {
                        var o = $(q.item).data("sref");
                        var n = q.item.index();
                        m.moveBouquet({
                            sBouquetRef: o,
                            mode: m.Mode,
                            position: n
                        })
                    }
                }).selectable({
                    filter: "li",
                    cancel: ".handle",
                    selected: function(n, o) {
                        $(o.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                        m.changeBouquet($(o.selected).data("sref"), m.showBouquetChannels)
                    },
                    classes: {
                        "ui-selected": m.activecls
                    }
                });
                $("#bqs").sortable({
                    handle: ".handle",
                    stop: function(p, q) {
                        var r = $("#bql li.ui-selected").data("sref");
                        var o = $(q.item).data("sref");
                        var n = q.item.index();
                        m.moveChannel({
                            sBouquetRef: r,
                            sRef: o,
                            mode: m.Mode,
                            position: n
                        })
                    }
                }).selectable({
                    filter: "li",
                    cancel: ".handle",
                    stop: m.setBouquetChannelButtons,
                    classes: {
                        "ui-selected": m.activecls
                    }
                });
                $("#toolbar-choose-tv").click(function() {
                    m.setTvRadioMode(0)
                });
                $("#toolbar-choose-radio").click(function() {
                    m.setTvRadioMode(1)
                });
                $("#toolbar-choose-satellites").click(function() {
                    m.getSatellites(m.showProviders)
                });
                $("#toolbar-choose-providers").click(function() {
                    m.getProviders(m.showProviders)
                });
                $("#toolbar-choose-channels").click(function() {
                    $("#sel0").hide();
                    $("#btn-provider-add").hide();
                    m.getChannels(m.showChannels)
                });
                $("#toolbar-bouquets-reload").click(function() {
                    m.getBouquets(m.showBouquets)
                });
                $("#toolbar-bouquets-export").click(m.exportBouquets);
                $("#toolbar-bouquets-import").click(m.importBouquets);
                $("#searchch").focus(function() {
                    if ($(this).val() === "...") {
                        $(this).val("")
                    }
                }).keyup(function() {
                    if ($(this).data("val") !== this.value) {
                        m.searchChannel(this.value)
                    }
                    $(this).data("val", this.value)
                }).blur(function() {
                    $(this).data("val", "");
                    if ($(this).val() === "") {
                        $(this).val("...")
                    }
                });
                $("#rfile").change(m.prepareRestore);
                m.setTvRadioMode(3)
            },
            setHover: function(n) {
                $(n + " li").hover(function() {
                    $(this).addClass(m.hovercls)
                }, function() {
                    $(this).removeClass(m.hovercls)
                })
            }
        }
    };
    var c = new b();
    var a = new Date();
    c.date = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();
    c.setup()
})();