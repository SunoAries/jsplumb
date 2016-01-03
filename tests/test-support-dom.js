;(function() {

    var mottle = new Mottle();
    var _t = function(el, evt, x, y) {
        mottle.trigger(el, evt, { pageX:x, pageY:y, screenX:x, screenY:y, clientX:x, clientY:y});
    };
    var _randomEvent = function() {
        var x = parseInt(Math.random() * 2000), y = parseInt(Math.random() * 2000);
        return {
            clientX:x,
            clientY:y,
            screenX:x,
            screenY:y,
            pageX:x,
            pageY:y
        };
    };
    var _distantPointEvent = {
        clientX: 50000,
        clientY: 50000,
        screenX: 50000,
        screenY: 50000,
        pageX: 50000,
        pageY: 50000
    };
    var _makeEvt = function (_jsPlumb, el) {
        var o = _jsPlumb.getOffset(el),
            s = _jsPlumb.getSize(el),
            l = o.left + (s[0] / 2),
            t = o.top + (s[1] / 2);

        return {
            clientX: l,
            clientY: t,
            screenX: l,
            screenY: t,
            pageX: l,
            pageY: t
        };
    };
    var _dragANodeAround = function(_jsPlumb, el) {
        _jsPlumb.trigger(el, "mousedown", _makeEvt(_jsPlumb, el));
        var steps = Math.random() * 50;
        for (var i = 0; i < steps; i++) {
            var evt = _randomEvent();
            el.style.left = evt.screenX + "px";
            el.style.top= evt.screenY + "px";
            _jsPlumb.trigger(document, "mousemove", evt);
        }
        _jsPlumb.trigger(document, "mouseup", _distantPointEvent);
    };

    var _dragNodeTo = function(_jsPlumb, el, x, y, events) {
        events = events || {};
        if (events.before) events.before();
        _jsPlumb.trigger(el, "mousedown", _makeEvt(_jsPlumb, el));
        if (events.beforeMouseMove) {
            events.beforeMouseMove();
        }
        _t(document, "mousemove", x, y);
        if (events.beforeMouseUp) {
            events.beforeMouseUp();
        }
        mottle.trigger(document, "mouseup");
        if (events.after) events.after();
    };

    var _dragNodeBy = function(_jsPlumb, el, x, y, events) {
        var xy = _jsPlumb.getOffset(el);
        _dragNodeTo(_jsPlumb, el, xy.left+x, xy.top+y, events);
    };

    //
    // helper method to cause a connection to be dragged via the mouse, but programmatically.
    //
    var _dragConnection = function (_jsPlumb, d1, d2) {
        var el1 = d1.canvas || d1, el2 = d2.canvas || d2;
        var e1 = _makeEvt(_jsPlumb, el1), e2 = _makeEvt(_jsPlumb, el2);

        var conns = _jsPlumb.select().length;

        _jsPlumb.trigger(el1, "mousedown", e1);
        _jsPlumb.trigger(document, "mousemove", e2);
        _jsPlumb.trigger(el2, "mouseup", e2);

        return _jsPlumb.select().get(conns);
    };

    //
    // helper method to cause a connection to be detached via the mouse, but programmatically.
    var _detachConnection = function (_jsPlumb, e, connIndex) {
        var el1 = e.canvas,
            c = e.connections[connIndex];

        var e1 = _makeEvt(_jsPlumb, el1);

        _jsPlumb.trigger(el1, "mousedown", e1);
        _jsPlumb.trigger(document, "mousemove", document);
        _jsPlumb.trigger(document, "mouseup", _distantPointEvent);
    };

    var _relocateTarget = function(_jsPlumb, conn, target) {
        _relocate(_jsPlumb, conn, 1, target);
    };

    var _relocate = function(_jsPlumb, conn, idx, newEl) {
        var el1 = conn.endpoints[idx].canvas;
        var e1 = _makeEvt(_jsPlumb, el1);
        var e2 = _makeEvt(_jsPlumb, newEl);
        _jsPlumb.trigger(el1, "mousedown", e1);
        _jsPlumb.trigger(document, "mousemove", e2);
        _jsPlumb.trigger(newEl, "mouseup", e2);
    };

    var _relocateSource = function(_jsPlumb, conn, source) {
        _relocate(_jsPlumb, conn, 0, source);
    };


    this.jsPlumbTestSupport = {
        getInstance:function(_jsPlumb) {
            return {
                getAttribute:function(el, att) {
                    return el.getAttribute(att);
                },
                droppableClass:"jsplumb-droppable",

                dragNodeBy:_dragNodeBy.bind(null, _jsPlumb),

                dragNodeTo:_dragNodeTo.bind(null, _jsPlumb),

                dragANodeAround:_dragANodeAround.bind(null, _jsPlumb),

                dragConnection:_dragConnection.bind(null, _jsPlumb),

                detachConnection:_detachConnection.bind(null, _jsPlumb),

                relocate:_relocate.bind(null, _jsPlumb),
                relocateSource:_relocateSource.bind(null, _jsPlumb),
                relocateTarget:_relocateTarget.bind(null, _jsPlumb)
            }
        }
    };

}).call(this);