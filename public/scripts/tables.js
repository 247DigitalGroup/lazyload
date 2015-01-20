(function() {
  $(document).ready(function() {
    var factory;
    factory = function($, DataTable) {
      "use strict";
      $.extend(DataTable.ext.classes, {
        sWrapper: 'dataTables_wrapper dt-foundation'
      });
      $.extend(true, DataTable.defaults, {
        oLanguage: {
          sLengthMenu: '_MENU_',
          sSearch: '',
          sSearchPlaceholder: 'filter...',
          oPaginate: {
            sNext: 'Next',
            sPrevious: 'Previous'
          }
        },
        dom: "<'row collapse'<'small-6 column'l><'small-6 column'f>r>t<'row collapse'<'small-6 column'i><'small-6 column'p>>",
        renderer: 'foundation'
      });
      DataTable.ext.renderer.pageButton.foundation = function(settings, host, idx, buttons, page, pages) {
        var api, attach, classes, lang;
        api = new DataTable.Api(settings);
        classes = settings.oClasses;
        lang = settings.oLanguage.oPaginate;
        attach = function(container, buttons) {
          var btnClass, btnDisplay, button, clickHandler, i, id, node, _i, _ref, _results;
          clickHandler = function(e) {
            e.preventDefault();
            if (e.data.action !== 'ellipsis') {
              return api.page(e.data.action).draw(false);
            }
          };
          _results = [];
          for (i = _i = 0, _ref = buttons.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            button = buttons[i];
            if ($.isArray(button)) {
              _results.push(attach(container, button));
            } else {
              btnDisplay = '';
              btnClass = '';
              switch (button) {
                case 'ellipsis':
                  btnDisplay = '&hellip;';
                  btnClass = 'unavailable';
                  break;
                case 'first':
                  btnDisplay = lang.sFirst;
                  btnClass = button + (page > 0 ? '' : ' unavailable');
                  break;
                case 'previous':
                  btnDisplay = lang.sPrevious;
                  btnClass = button + (page > 0 ? '' : ' unavailable');
                  break;
                case 'next':
                  btnDisplay = lang.sNext;
                  btnClass = button + (page < pages - 1 ? '' : ' unavailable');
                  break;
                case 'last':
                  btnDisplay = lang.sLast;
                  btnClass = button + (page < pages - 1 ? '' : ' unavailable');
                  break;
                default:
                  btnDisplay = button + 1;
                  btnClass = page === button ? 'current' : '';
              }
              if (btnDisplay) {
                id = "" + settings.sTableId + "_" + button;
                if (idx !== 0 || typeof button !== 'string') {
                  id = null;
                }
                node = $('<li>', {
                  'class': "" + classes.sPageButton + " " + btnClass,
                  'aria-controls': settings.sTableId,
                  'tabindex': settings.iTabIndex,
                  'id': id
                }).append($('<a>', {
                  'href': '#'
                }).html(btnDisplay)).appendTo(container);
                _results.push(settings.oApi._fnBindAction(node, {
                  action: button
                }, clickHandler));
              } else {
                _results.push(void 0);
              }
            }
          }
          return _results;
        };
        attach($(host).empty().html('<ul class="pagination" />').children('ul'), buttons);
        return null;
      };
      return null;
    };
    if (jQuery) {
      factory(jQuery, jQuery.fn.dataTable);
    }
    if (typeof $.prototype.dataTable === 'function') {
      return $('table').dataTable();
    }
  });

}).call(this);
