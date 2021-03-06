(function () {

    'use strict';

    var message = '.message',
        warning = 'warning',
        key = 'libraryForm';

    var checkMandatory = function (field) {
        var value = $.trim($(field).val());
        if (!value) {
            $(field).showWarning('This field is mandatory');
        } else {
            $(field).hideWarning();
        }
    };

    var checkEmail = function (field) {
        var re = /\S+@\S+\.\S+/;
        var value = $.trim($(field).val());
        if (!re.test(value)) {
            $(field).showWarning('The email format is invalid');
        } else {
            $(field).hideWarning();
        }
    };

    var fillSelect = function (select, options) {
        var opts = [];
        _.each(options, function (option) {
            opts.push('<option value="' + option + '">' + option + '</option>')
        });
        $(select).html(opts.join());
    };

    var fillYearSelect = function (select) {
        var years = _.range(1930, new Date().getFullYear());
        fillSelect(select, years);
    };

    var fillMonthSelect = function (select) {
        var months = _.range(1, 13);
        fillSelect(select, months);
    };

    var fillDaySelect = function (numberOfDays, select) {
        var days = _.range(1, numberOfDays + 1);
        fillSelect(select, days);
    };

    var daysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };

    var validate = function () {
        $.each($('input'), function (_, field) {
            var rule = $(field).data();
            if (rule.hasOwnProperty('mandatory')) {
                checkMandatory(field);
            }
            if (rule.hasOwnProperty('email')) {
                checkEmail(field);
            }
        });
    };

    var getInputData = function (input) {
        if ($(input).attr('type') === 'checkbox') {
            return $(input).prop('checked');
        }
        return $(input).val();
    };

    var getFormData = function () {
        var form = [];

        $.each($('.fields > div'), function (_, field) {
            var label = $(field).find('label');
            var name = $(label).text().replace(/\*/g, '').trim();
            var obj = {};
            obj['key'] = name;
            obj['value'] = getInputData($(label).nextAll('input, select'));
            form.push(obj);
        });

        return form;
    };

    var formIsValid = function () {
        var fields = $('input');
        for (var i = 0; i < fields.length; i++) {
            if ($(fields[i]).isWarningShown()) {
                return false;
            }
        }
        return true;
    };

    $(document).ready(function () {
        var birthSelect = $('#birthYear'),
            monthSelect = $('#month');

        fillYearSelect(birthSelect);

        fillMonthSelect(monthSelect);

        $('#register').click(function () {
            validate();
            if (!formIsValid()) {
                return;
            }
            localStorage.setItem(key, JSON.stringify(getFormData()));
            window.open('summary.html', '_blank');
        });

        $('#clear').click(function () {
            $.each($('input'), function (_, field) {
                var type = $(field).attr('type');
                if (type === 'checkbox') {
                    $(field).prop('checked', false).change()
                } else if (type === 'text') {
                    $(field).val('').change().hideWarning();
                }
            });

            $.each($('select'), function (_, select) {
                $(select).val($(select[0]).val());
            });
        });

        $('#university-check').change(function () {
            var checked = $(this).prop('checked'),
                el = $('#university-name, #university-degree');

            if (checked) {
                el.prop('disabled', false);
            } else {
                el.prop('disabled', true);
            }
        });

        $('input:text').keydown(function () {
            $(this).hideWarning();
        });

        birthSelect.change(function () {
            var year = $(this).find(':selected').text(),
                month = $('#month').find(':selected').text();

            fillDaySelect(daysInMonth(month, year), $('#day'));
        });

        monthSelect.change(function () {
            var year = $('#birthYear').find(':selected').text(),
                month = $(this).find(':selected').text();

            fillDaySelect(daysInMonth(month, year), $('#day'));
        });

        monthSelect.change();
    });

    $.fn.showWarning = function (msg) {
        if (!$(this).isWarningShown()) {
            $(this).addClass(warning)
                .next(message)
                .css('visibility', 'visible')
                .text(msg);
        }

    };

    $.fn.hideWarning = function () {
        $(this).removeClass(warning)
            .next(message).css('visibility', 'hidden');
    };

    $.fn.isWarningShown = function () {
        return $(this).next(message).css('visibility') === 'visible';
    };

})();