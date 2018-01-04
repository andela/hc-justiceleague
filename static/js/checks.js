$(function() {
    var MINUTE = { name: "minute", nsecs: 60 };
    var HOUR = { name: "hour", nsecs: MINUTE.nsecs * 60 };
    var DAY = { name: "day", nsecs: HOUR.nsecs * 24 };
    var WEEK = { name: "week", nsecs: DAY.nsecs * 7 };
    var UNITS = [WEEK, DAY, HOUR, MINUTE];

    var secsToText = function(total) {
        var remainingSeconds = Math.floor(total);
        var result = "";
        for (var i = 0, unit;
            (unit = UNITS[i]); i++) {
            if (unit === WEEK && remainingSeconds % unit.nsecs != 0) {
                // Say "8 days" instead of "1 week 1 day"
                continue;
            }

            var count = Math.floor(remainingSeconds / unit.nsecs);
            remainingSeconds = remainingSeconds % unit.nsecs;

            if (count == 1) {
                result += "1 " + unit.name + " ";
            }

            if (count > 1) {
                result += count + " " + unit.name + "s ";
            }
        }

        return result;
    };

    // Creating a select component in Javascript and assigning options for different priorities
    var select = document.getElementById('input-select');
    var priorities = ["Lowest","Low","Normal","High","Emergency"];

    // Append the option elements
    for ( var i in priorities ){
    
        var option = document.createElement("option");
            option.text = priorities[i];
            option.value = i;
    
        select.appendChild(option);
    }

    //Creating a Slider to  display the different priorities
    var priorityslider = document.getElementById('priority-slider');
    noUiSlider.create(priorityslider, {
        start: [2],
        connect: "lower",
        range: {
            min: 0,
            max: 4
        },
        pips:{
            mode: "values",
            values: [0,1,2,3,4],
            density: 100

        }
    });


    priorityslider.noUiSlider.on('update', function( values, handle ) {
        var value = values[handle];

        if ( handle ) {
            inputPriority.value = value;
        } else {
            select.value = Math.round(value);
        }
    });

    select.addEventListener('change', function(){
        priorityslider.noUiSlider.set([this.value, null]);
    });





    var periodSlider = document.getElementById("period-slider");
    noUiSlider.create(periodSlider, {
        start: [20],
        connect: "lower",
        range: {
            min: [60, 60],
            "33%": [3600, 3600],
            "66%": [86400, 86400],
            "75%": [604800, 604800],
            max: 5184000
        },
        pips: {
            mode: "values",
            values: [60, 1800, 3600, 43200, 86400, 604800, 2592000, 5184000],
            density: 4,
            format: {
                to: secsToText,
                from: function() {}
            }
        }
    });

    periodSlider.noUiSlider.on("update", function(a, b, value) {
        var rounded = Math.round(value);
        $("#period-slider-value").text(secsToText(rounded));
        $("#update-timeout-timeout").val(rounded);
    });

    var graceSlider = document.getElementById("grace-slider");
    noUiSlider.create(graceSlider, {
        start: [20],
        connect: "lower",
        range: {
            min: [60, 60],
            "33%": [3600, 3600],
            "66%": [86400, 86400],
            "75%": [604800, 604800],
            max: 5184000
        },
        pips: {
            mode: "values",
            values: [60, 1800, 3600, 43200, 86400, 604800, 2592000, 5184000],
            density: 4,
            format: {
                to: secsToText,
                from: function() {}
            }
        }
    });

    graceSlider.noUiSlider.on("update", function(a, b, value) {
        var rounded = Math.round(value);
        $("#grace-slider-value").text(secsToText(rounded));
        $("#update-timeout-grace").val(rounded);
    });

    /*=======nag timeout ======*/
    /* Render noUIslider slider component into div with ID `nag-period-slider`
    */
    var nagPeriodSlider = document.getElementById("nag-period-slider");
    noUiSlider.create(nagPeriodSlider, {
        start: [20],
        connect: "lower",
        range: {
            'min': [60, 60],
            '33%': [3600, 3600],
            '66%': [86400, 86400],
            '83%': [604800, 604800],
            'max': 2592000,
        },
        pips: {
            mode: 'values',
            values: [60, 1800, 3600, 43200, 86400, 604800, 2592000],
            density: 4,
            format: {
                to: secsToText,
                from: function() {}
            }
        }
    });

    nagPeriodSlider.noUiSlider.on("update", function(a, b, value) {
        var rounded = Math.round(value);
        $("#nag-period-slider-value").text(secsToText(rounded));
        $("#update-timeout-nag").val(rounded);
        console.log('Nag value is ' + $("#update-timeout-nag").val());
    });


    var graceSliders = document.getElementById("nag-grace-slider");
    noUiSlider.create(graceSliders, {
        start: [20],
        connect: "lower",
        range: {
            'min': [60, 60],
            '33%': [3600, 3600],
            '66%': [86400, 86400],
            '83%': [604800, 604800],
            'max': 2592000,
        },
        pips: {
            mode: 'values',
            values: [60, 1800, 3600, 43200, 86400, 604800, 2592000],
            density: 4,
            format: {
                to: secsToText,
                from: function() {}
            }
        }
    });
    nagPeriodSlider.noUiSlider.on('change', function(ev) {
        var nag_period = ev
        $('input[name="nag_period"]').val(nag_period)
        console.log(nag_period);
    })

    graceSliders.noUiSlider.on("update", function(a, b, value) {
        var rounded = Math.round(value);
        $("#nag-grace-slider-value").text(secsToText(rounded));
        $("#update-timeout-grace").val(rounded);
    });


    graceSliders.noUiSlider.on('change', function(ev) {
        var nag_grace = ev
        $('input[name="nag_grace"]').val(nag_grace)
        console.log(nag_grace);
    })

    $('[data-toggle="tooltip"]').tooltip();

    $(".my-checks-name").click(function() {
        var $this = $(this);

        $("#update-name-form").attr("action", $this.data("url"));
        $("#update-name-input").val($this.data("name"));
        $("#update-tags-input").val($this.data("tags"));
        $("#update-name-modal").modal("show");
        $("#update-name-input").focus();

        return false;
    });

    $(".timeout-grace").click(function() {
        var $this = $(this);

        $("#advanced-settings").attr("data-advanced", $this.data("advanced"))
        $(".output_whizz_grace").val(secsToText(Math.round($this.data("grace"))))
        $(".output_whizz_period").val(secsToText(Math.round($this.data("timeout"))))
        $("#advanced-settings").attr("data-grace", $this.data("grace"))
        $("#advanced-settings").attr("data-period", $this.data("timeout"))
        $("#update-timeout-form").attr("action", $this.data("url"));
        periodSlider.noUiSlider.set($this.data("timeout"));
        graceSlider.noUiSlider.set($this.data("grace"));
        $("#update-timeout-modal").modal({ show: true, backdrop: "static" });
        $("#show-advanced-time").modal("hide");

        return false;
    });


    $(".priority-cell").click(function() {
        var $this = $(this);
        /*
        $("#advanced-settings").attr("data-advanced", $this.data("advanced"))
        $(".output_whizz_grace").val(secsToText(Math.round($this.data("grace"))))
        $(".output_whizz_period").val(secsToText(Math.round($this.data("timeout"))))
        $("#advanced-settings").attr("data-grace", $this.data("grace"))
        $("#advanced-settings").attr("data-period", $this.data("timeout"))
        $("#update-timeout-form").attr("action", $this.data("url"));
        periodSlider.noUiSlider.set($this.data("timeout"));
        graceSlider.noUiSlider.set($this.data("grace"));
        */
        $("#priority-modal").modal({ show: true, backdrop: "static" });
        $("#show-advanced-time").modal("hide");

        return false;
    });



    $("#advanced-settings").click(function() {
        var $this = $(this);
        $("#update-advanced-timeout-form").attr("action", $this.data("advanced"));
        $("#update-timeout-modal").modal("hide");
        $("#show-advanced-time").modal("show");
        return false;
    });

    // nag-timeout-grace
    $(".timeout-nag").change(function(event) {
        var $this = $(this);
        if (event.target.checked) {
            var nag_mode = event.target.checked
            var nag_check = $this.data("url").split("/")[2]
            console.log(nag_check);
            $("#nag-timeout-form").attr("action", $this.data("url"));
            $('input[name="nag-check"]').val(nag_check);
            $('#nag-timeout-modal').modal({"show":true, "backdrop":"static"});
            console.log(nag_mode)
        }else{
            var nag_mode = event.target.checked
            console.log(nag_mode)
        }

        return false;
    });
    /*==== nag mode ===== */

    $(".check-menu-remove").click(function() {
        var $this = $(this);

        $("#remove-check-form").attr("action", $this.data("url"));
        $(".remove-check-name").text($this.data("name"));
        $("#remove-check-modal").modal("show");

        return false;
    });

    $("#my-checks-tags button").click(function() {
        // .active has not been updated yet by bootstrap code,
        // so cannot use it
        $(this).toggleClass("checked");

        // Make a list of currently checked tags:
        var checked = [];
        $("#my-checks-tags button.checked").each(function(index, el) {
            checked.push(el.textContent);
        });

        // No checked tags: show all
        if (checked.length == 0) {
            $("#checks-table tr.checks-row").show();
            $("#checks-list > li").show();
            return;
        }

        function applyFilters(index, element) {
            var tags = $(".my-checks-name", element)
                .data("tags")
                .split(" ");
            for (var i = 0, tag;
                (tag = checked[i]); i++) {
                if (tags.indexOf(tag) == -1) {
                    $(element).hide();
                    return;
                }
            }

            $(element).show();
        }

        // Desktop: for each row, see if it needs to be shown or hidden
        $("#checks-table tr.checks-row").each(applyFilters);
        // Mobile: for each list item, see if it needs to be shown or hidden
        $("#checks-list > li").each(applyFilters);
    });

    $(".pause-check").click(function(e) {
        var url = e.target.getAttribute("data-url");
        $("#pause-form")
            .attr("action", url)
            .submit();
        return false;
    });

    $(".usage-examples").click(function(e) {
        var a = e.target;
        var url = a.getAttribute("data-url");
        var email = a.getAttribute("data-email");

        $(".ex", "#show-usage-modal").text(url);
        $(".em", "#show-usage-modal").text(email);

        $("#show-usage-modal").modal("show");
        return false;
    });

    var clipboard = new Clipboard("button.copy-link");
    $("button.copy-link").mouseout(function(e) {
        setTimeout(function() {
            e.target.textContent = "copy";
        }, 300);
    });

    clipboard.on("success", function(e) {
        e.trigger.textContent = "copied!";
        e.clearSelection();
    });

    clipboard.on("error", function(e) {
        var text = e.trigger.getAttribute("data-clipboard-text");
        prompt("Press Ctrl+C to select:", text);
    });

    /* Custom Scripts */
    $(".trigger_time_period, .trigger_time_grace").click(function(e) {
        kind = e.target.getAttribute("data-kind")
        if (!$(".whizz_container").attr('id')) {
            $(".whizz_container :input").each(function() {
                $(this).val('00');
            });
            $(".whizz_container").attr('id', "whizz_" + kind)
            move_pointer(kind)
            $("#whizz_" + kind).show();
        } else if ($(".whizz_container").attr('id') && $(".whizz_container").attr('id') != "whizz_" + kind) {
            $(".whizz_container :input").each(function() {
                $(this).val('00');
            });
            move_pointer(kind)
            $(".whizz_container").attr('id', "whizz_" + kind)
            $(".whizz_container").show();
        } else if ($(".whizz_container").attr('id') == "whizz_" + kind) {
            $(".whizz_container :input").each(function() {
                $(this).val('00');
            });
            $(".whizz_container").removeAttr('id')
            $(".whizz_container").hide();
        }

    });
    $(".output_whizz_grace").focus(function(){
        $(".trigger_time_grace").click();
    });
    $(".output_whizz_period").focus(function(){
        $(".trigger_time_period").click();
    });
    // Move the pointer pointing to the time inputs
    function move_pointer(type){
        if (type == "grace"){
            $(".whizz_pointer span").css('top', '-75px')
        }
        else{
            $(".whizz_pointer span").css('top', '-125px') 
        }
    }
    $("#time_whizz .flip_whizz, #time_whizz .whizz_value").hover(
        function() {
            $(this).css("background-color", "#ccc");
        },
        function() {
            $(this).css("background-color", "unset");
        }
    );
    $("#time_whizz .whizz_value").click(function(e) {
        e.preventDefault();
        var change_focus = $(this).find("input");
        change_focus.focus();
    });
    sec_min_max = 60;
    hours_max = 24;
    days_max = 61;
    $(".up_whizz").click(function(e) {
        var value_before = $(this)
            .siblings()
            .eq(1)
            .find("input");
        var value_before_input = value_before.val();
        value_time = value_before.attr("id");
        if (value_time == "days") {
            time_max = days_max;
        } else if (value_time == "hours") {
            time_max = hours_max;
        } else {
            time_max = sec_min_max;
        }
        value_before_whizz = parseInt(value_before_input);
        value_before_whizz = value_before_whizz + 1;
        if (isNaN(value_before_whizz)) {
            value_before.val("00");
        } else if (value_before_whizz < 10) {
            value_before.val("0" + value_before_whizz);
        } else if (value_before_whizz >= time_max) {
            value_before.val("00");
        } else {
            value_before.val(value_before_whizz);
        }
        render_to_whizz_input();
    });
    $(".down_whizz").click(function(e) {
        var value_before = $(this)
            .siblings()
            .eq(2)
            .find("input");
        value_time = value_before.attr("id");
        if (value_time == "days") {
            time_max = days_max;
        } else if (value_time == "hours") {
            time_max = hours_max;
        } else {
            time_max = sec_min_max;
        }
        var value_before_input = value_before.val();
        value_before_whizz = parseInt(value_before_input);
        if (isNaN(value_before_whizz)) {
            value_before.val("00");
        } else if (value_before_whizz > 0) {
            value_before_whizz = value_before_whizz - 1;
            if (value_before_whizz < 10) {
                value_before.val("0" + value_before_whizz);
            } else if (value_before_whizz >= sec_min_max) {
                value_before.val("00");
            } else {
                value_before.val(value_before_whizz);
            }
        } else {
            value_before.val("00");
        }
        render_to_whizz_input();
    });

    function render_to_whizz_input() {

        arr = [];
        seconds = []
        var value_kind = $(".whizz_container").attr('id')
        for (var i = 0; i <= 3; i++) {
            whizz_all = $("#" + value_kind)
                .children()
                .eq(i)
                .children()
                .eq(2)
                .find("input");
            whizz_value = parseInt(whizz_all.val());
            str = whizz_all.attr("id");
            if (whizz_value != 0) {
                if (whizz_value == 1) {
                    whizz_type = str.substring("s", str.length - 1);
                    whizz_valued = whizz_value + " " + whizz_type;
                    $(".output" + "_" + value_kind).val() + whizz_valued;
                    arr.push(whizz_valued);
                    seconds.push(to_seconds(whizz_value, str))
                } else {
                    whizz_type = whizz_all.attr("id");
                    whizz_valued = whizz_value + " " + whizz_type;
                    $(".output" + "_" + value_kind).val() + whizz_valued;
                    arr.push(whizz_valued);
                    seconds.push(to_seconds(whizz_value, str))
                }
            }
        }
        if (seconds.length != 0) {
            var _to_submit = seconds.reduce(function(a, b) {
                return a + b;
            });
        } else { var _to_submit = 0 }
        $("." + value_kind + "_to_submit").val(_to_submit)
        var whizz_str = arr.toString();
        var whizz_final = whizz_str.split(",").join(" ")
        $(".output" + "_" + value_kind).val(whizz_final);
    }

    // Hide modal after saving nag
    $('#submit-nag').click(function (ev) {
        $('#nag-timeout-modal').modal('hide');
    });

    function to_seconds(value, type) {
        if (type == "days") {
            return value * 86400
        } else if (type == "hours") {
            return value * 3600
        } else if (type == "minutes") {
            return value * 60
        } else if (type == "seconds") {
            return value
        } else {
            return false
        }
    }
});
