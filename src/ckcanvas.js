$(function() {
    var $ckcanvas = $("#ckcanvas"),
        $lineWidth = $("#lineWidth"),
        canvas = $("#ckcanvas>canvas")[0],
        winH = $(window).height(),
        winW = $(window).width()
    ;

    var $canvas = $("<canvas>").attr({
        width: $ckcanvas.width(),
        height: $ckcanvas.height()
    });

    var $mask = $("<div>").addClass("mask");
    $ckcanvas.append($canvas, $mask);

    var c = $canvas.get(0).getContext('2d');

    var startX = 0,
        startY = 0,
        prevX = 0,
        prevY = 0,
        mousedown = false,
        mouseup = false,
        mouseleave = false,
        mouseenter = false
    ;

    c.lineCap = 'round';
    c.lineJoin = 'round';

    $mask.on("mousedown", function(e) {
        mousedown = true;
        mouseup = false;
        startX = prevX = e.offsetX;
        startY = prevY = e.offsetY;
        console.log(e.offsetX, e.offsetY);
    }).on("mouseenter", function(e) {
        mouseenter = true;
        mouseleave = false;
    }).on("mouseleave", function(e) {
        mouseenter = false;
        mouseleave = true;
    }).on("mousemove", function(e) {
        if(mouseenter && mousedown) {
            c.beginPath();
            c.moveTo(prevX, prevY);
            c.lineTo(e.offsetX,e.offsetY);
            c.stroke();
            // c.closePath();
            prevX = e.offsetX;
            prevY = e.offsetY;
        }

    });

    $lineWidth.on("change", function(e) {
        c.lineWidth = parseInt($(this).val());
    }).trigger("change");

    var cacheHistory = [c.getImageData(0, 0, $canvas.attr("width"), $canvas.attr("height"))];
    var historyIndex = 1;
    $(document).on("mouseup", function(e) {
        if(mousedown){
            // 存储历史记录

            cacheHistory = cacheHistory.slice(0, historyIndex);

            var imageData = c.getImageData(0, 0, $canvas.attr("width"), $canvas.attr("height"));
            cacheHistory.push(imageData);
            historyIndex++;
            console.log(cacheHistory);
        }
        mousedown = false;
        mouseup = true;
    });

    // 颜色拾取
    $("#colorPicker>label").palette({}, function(data) {
        c.strokeStyle = c.fillStyle = data.rgba;
    });

    // 历史后退
    $("#prevHistory").on("click", function(e) {
        historyIndex--;
        if(historyIndex < 1)  historyIndex = 1;
        c.putImageData(cacheHistory[historyIndex - 1], 0, 0);
    });

    // 历史前进
    $("#nextHistory").on("click", function(e) {
        historyIndex++;
        if(historyIndex > cacheHistory.length)  historyIndex = cacheHistory.length;
        c.putImageData(cacheHistory[historyIndex - 1], 0, 0);
    });

});
