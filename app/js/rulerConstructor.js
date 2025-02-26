
ruler.prototype.rulerConstructor =  function(_canvas, options, rulDimension)
{

    var canvas = _canvas,
        context = canvas.getContext('2d'),
        rulThickness = 0,
        rulLength = 0,
        rulScale = 1,
        dimension = rulDimension || 2,
        orgPos = 0,
        tracker = document.createElement('div');

    var getLength = function (){
        return rulLength;
    };

    var getThickness = function(){
        return rulThickness;
    };

    var getScale = function(){
        return rulScale;
    };

    var setScale = function(newScale){
        rulScale = parseFloat(newScale);
        drawPoints();
        return rulScale;
    };

    var drawRuler = function (_rulerLength, _rulerThickness, _rulerScale){
        rulLength = canvas.width = _rulerLength * 4;
        rulThickness = canvas.height = _rulerThickness;
        rulScale = _rulerScale || rulScale;
        context.strokeStyle = options.strokeStyle;
        context.font = options.fontSize + ' ' + options.fontFamily;
        context.lineWidth = options.lineWidth;
        context.beginPath();
        drawPoints();
        context.stroke();
    };



    var drawPoints = function () {
      var pointLength = 0,
        label = '',
        delta = 0,
        draw = false,
        lineLengthMax = 0,
        lineLengthMed = rulThickness / 2,
        lineLengthMin = rulThickness / 2;

      // do ten steps between each mark
      // then calculate how much space and value each step needs
      // then get the maximum number of points
      var distanceBetweenLabeledMarks = 50;
      var stepsInBetween = 10;
      var diffPerMark = distanceBetweenLabeledMarks / stepsInBetween;
      var positionDeltaPerStep = (distanceBetweenLabeledMarks / rulScale) / stepsInBetween;
      var maxPoints = (rulLength /positionDeltaPerStep);

      // to always have 0 / 0 at the top left of the image, calculate the offset error made by rounding
      // this will shift the ruler according to the error made by rounding
      var middlePointIndexOffset = (maxPoints - Math.floor(maxPoints)) / 2;

      //now calculate the position offset on the ruler
      var middlePointPositionOffset = middlePointIndexOffset * positionDeltaPerStep;

      // get the overall offset to set 0 into the middle of the canvas
      delta = ((rulLength * rulScale) / 2);

      // since we want to have our marks in certain steps (here : 5), we shift the values back to the next 5
      // steps like 2->7->12 would be steps of 5 too, but we want to have 0->5->10 etc.
      var valueOffset = delta % diffPerMark;

      // if the maxPoints is not an even number, we get another offset
      if(Math.floor(maxPoints/2) !== Math.round(maxPoints/2)) {
        var missingSteps = (maxPoints/2) - Math.floor(maxPoints/2);
        middlePointPositionOffset = missingSteps * positionDeltaPerStep;
      }

      // only do as many steps a needed
      for(var pos = 0;pos <=maxPoints; pos += 1){
        var value = Math.round(delta - (pos * diffPerMark) - valueOffset) * -1;

        // do big marks every distanceBetweenLabeledMarks steps
        if(value % distanceBetweenLabeledMarks === 0){
          pointLength = lineLengthMax;
          label =  value;
          draw = true;
        }
        else
        {
          // do small mark
          pointLength = lineLengthMed;
          draw = true;
          label = '';
        }

        //draw
        if(draw) {
          context.moveTo(pos * positionDeltaPerStep + middlePointPositionOffset, rulThickness + 0.5);
          context.lineTo(pos * positionDeltaPerStep+ middlePointPositionOffset, pointLength + 0.5);
          context.fillText(label, (pos * positionDeltaPerStep) + 1.5 + middlePointPositionOffset, (rulThickness / 2) + 1);
        }
      }
    };

    var mousemove = function(e) {
      var posX = e.clientX;
      var posY = e.clientY;
      if(dimension === 2){
        tracker.style.left = ruler.prototype.utils.pixelize(posX - parseInt(options.container.getBoundingClientRect().left));
      }
      else{
        tracker.style.top = ruler.prototype.utils.pixelize(posY - parseInt(options.container.getBoundingClientRect().top)) ;
      }
    };

    var destroy = function(){
      options.container.removeEventListener('mousemove', mousemove);
      tracker.parentNode.removeChild(tracker);
      this.clearListeners && this.clearListeners();

    };

    var initTracker = function(){
        tracker = options.container.appendChild(tracker);
        ruler.prototype.utils.addClasss(tracker, 'rul_tracker');
        var height = ruler.prototype.utils.pixelize(options.rulerHeight);
        if(dimension === 2){
            tracker.style.height = height;
        }
        else{
            tracker.style.width = height;
        }

        options.container.addEventListener('mousemove', mousemove);
    };

    if(options.enableMouseTracking){
        initTracker();
    }


    return{
        getLength: getLength,
        getThickness: getThickness,
        getScale: getScale,
        setScale: setScale,
        dimension: dimension,
        orgPos: orgPos,
        canvas: canvas,
        context: context,
        drawRuler: drawRuler,
        drawPoints: drawPoints,
        destroy: destroy
    }
};

