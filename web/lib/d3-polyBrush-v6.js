(function (d3) {
    d3.polyBrush = function () {
        let dispatch = d3.dispatch('start', 'brush', 'end'),
            el = null,
            x = null,
            y = null,
            extent = [],
            firstClick = true,
            firstTime = true,
            wasDragged = false,
            origin = null,
            line = d3.line()
                .x(d => d[0])
                .y(d => d[1]);

        let brush = function (g) {
            el = g;
            g.each(function () {
                let bg, e, fg;
                g = d3.select(this)
                    .style("pointer-events", "all")
                    .on("click.brush", addAnchor);
                bg = g.selectAll('.background')
                    .data([0])
                    .join('rect')
                    .attr("class", "background")
                    .style("visibility", "hidden")
                    .style("cursor", "crosshair");
                fg = g.selectAll('.extent')
                    .data([extent])
                    .join('path')
                    .attr("class", "extent")
                    .style("cursor", "move");
                if (x) {
                    e = scaleExtent(x.range());
                    bg.attr('x', e[0]).attr('width', e[1] - e[0]);
                }
                if (y) {
                    e = scaleExtent(y.range());
                    bg.attr('y', e[0]).attr('height', e[1] - e[0]);
                }
            });
        };

        let drawPath = function () {
            return el.each(function () {
                d3.select(this).selectAll('g path')
                    .attr('d', function (d) {
                        return line(d) + 'Z';
                    });
            });
        };

        let scaleExtent = function (domain) {
            let start = domain[0],
                stop = domain[domain.length - 1];
            if (start < stop) {
                return [start, stop];
            } else {
                return [stop, start];
            }
        };

        let withinBounds = function (point) {
            let rangeX = scaleExtent(x.range()),
                rangeY = scaleExtent(y.range()),
                _x = Math.max(rangeX[0], Math.min(rangeX[1], point[0])),
                _y = Math.max(rangeY[0], Math.min(rangeY[1], point[1]));
            return point[0] === _x && point[1] === _y;
        };

        let moveAnchor = function (event) {
            // TODO: bug. mouse coordinate and vis coordinate mismatch
            let point = d3.pointer(event);
            point[0] -= 30;
            point[1] -= 30;
            if (firstTime) {
                extent.push(point);
                firstTime = false;
            } else {
                if (withinBounds(point)) {
                    extent.splice(extent.length - 1, 1, point);
                }
                drawPath();
                dispatch.call("brush", this);
            }
        };

        let closePath = function () {
            let w = d3.select(window);
            w.on('dblclick.brush', null).on('mousemove.brush', null);
            firstClick = true;
            if (extent.length === 2 && extent[0][0] === extent[1][0] && extent[0][1] === extent[1][1]) {
                extent.splice(0, extent.length);
            }
            d3.select(".extent").on("mousedown.brush", moveExtent);
            return dispatch.call("end", this);
        };

        let addAnchor = function (event) {
            let g = d3.select(this),
                w = d3.select(window),
                _this = this;
            firstTime = true;
            if (wasDragged) {
                wasDragged = false;
                return;
            }
            if (firstClick) {
                extent.splice(0, extent.length);
                firstClick = false;
                d3.select(".extent").on("mousedown.brush", null);
                w.on("mousemove.brush", function (event) {
                    return moveAnchor(event);
                }).on("dblclick.brush", closePath);
                dispatch.call("start", this);
            }
            if (extent.length > 1) {
                extent.pop();
            }
            extent.push(d3.pointer(event));
            return drawPath();
        };

        let dragExtent = function (event) {
            let checkBounds, fail, p, point, scaleX, scaleY, updateExtentPoint, _i, _j, _len, _len1;
            // TODO: bug. mouse coordinate and vis coordinate mismatch
            point = d3.pointer(event);
            point[0] -= 30;
            point[1] -= 30;
            scaleX = point[0] - origin[0];
            scaleY = point[1] - origin[1];
            fail = false;
            origin = point;
            updateExtentPoint = function (p) {
                p[0] += scaleX;
                p[1] += scaleY;
            };
            for (_i = 0, _len = extent.length; _i < _len; _i++) {
                p = extent[_i];
                updateExtentPoint(p);
            }
            checkBounds = function (p) {
                if (!withinBounds(p)) {
                    fail = true;
                }
                return fail;
            };
            for (_j = 0, _len1 = extent.length; _j < _len1; _j++) {
                p = extent[_j];
                checkBounds(p);
            }
            if (fail) {
                return;
            }
            drawPath();
            return dispatch.call("brush", this, {
                mode: "move"
            });
        };

        let dragStop = function () {
            let w = d3.select(window);
            w.on("mousemove.brush", null).on("mouseup.brush", null);
            wasDragged = true;
            return dispatch.call("end", this);
        };

        let moveExtent = function (event) {
            let _this = this;
            event.stopPropagation();
            event.preventDefault();
            if (firstClick && !brush.empty()) {
                d3.select(window).on("mousemove.brush", function (event) {
                    return dragExtent(event);
                }).on("mouseup.brush", dragStop);
                origin = d3.pointer(event);
            }
        };

        brush.isWithinExtent = function (x, y) {
            let i, j, len, p1, p2, ret, _i, _len;
            len = extent.length;
            j = len - 1;
            ret = false;
            for (i = _i = 0, _len = extent.length; _i < _len; i = ++_i) {
                p1 = extent[i];
                p2 = extent[j];
                if ((p1[1] > y) !== (p2[1] > y) && x < (p2[0] - p1[0]) * (y - p1[1]) / (p2[1] - p1[1]) + p1[0]) {
                    ret = !ret;
                }
                j = i;
            }
            return ret;
        };

        brush.x = function (z) {
            if (!arguments.length) {
                return x;
            }
            x = z;
            return brush;
        };

        brush.y = function (z) {
            if (!arguments.length) {
                return y;
            }
            y = z;
            return brush;
        };

        brush.extent = function (z) {
            if (!arguments.length) {
                return extent;
            }
            extent = z;
            return brush;
        };

        brush.clear = function () {
            extent.splice(0, extent.length);
            return brush;
        };

        brush.empty = function () {
            return extent.length === 0;
        };

        brush.on = function (typename, callback) {
            dispatch.on(typename, callback);
            return brush;
        };

        return brush;
    };
})(d3)