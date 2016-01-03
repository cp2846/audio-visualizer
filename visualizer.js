function playAudioVisualize(track) {
    var bars = 50;
    var waveResolution = 128;
    var style = "bars"; //set default style upon loading here
    var audio = new Audio();
    var canvas, source, context, analyser, fFrequencyData, barX, barWidth, barHeight, red, green, blue, ctx;
    audio.controls = true;
    audio.src = track;
    audio.loop = false;
    audio.autoplay = false;
    window.addEventListener("load", initPlayer, false);
    
    function initPlayer() {
        document.getElementById('audio-container').appendChild(audio);
        context = new AudioContext();
        analyser = context.createAnalyser();
        canvas = document.getElementById('audio-display');
        canvas.addEventListener("click", toggleStyle);
        ctx = canvas.getContext('2d');
        source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);
        drawFrames();       
        
        function toggleStyle() {
            style = (style === "wave" ? "bars" : "wave");
        }
    }
    
    var k = 0; //keep track of total number of frames drawn
    function drawFrames() {
        window.requestAnimationFrame(drawFrames);
        analyser.fftsize = 128;
        fFrequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fFrequencyData);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        numBarsBars = 16;
        //calculate average frequency for color
        var total = 0;
        
        for(var j = 0; j < fFrequencyData.length; j++) {
            total += fFrequencyData[j];
        }
        
        var avg = total / fFrequencyData.length;
        avg = avg / 1.2;
        //bar style visual representation
        function drawBars(numBars) {
            for(var i = 0; i < numBars; i++) {
                barX = i * (canvas.width / numBars);
                barWidth = (canvas.width / numBars - 1);
                barHeight = -(fFrequencyData[i] / 2);
                //reduce frequency of color changing to avoid flickering
                if(k % 15 === 0) {
                    getColors();
                    k = 0;
                }
                ctx.fillStyle = 'rgb('+red+','+green+','+blue+')';
                ctx.fillRect(barX, canvas.height, barWidth, barHeight);
            }
        }
        //waveform visualization
        function drawWave(resolution, lineWidth) {          
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            var barX, barY;
            
            for(var i = 0; i < resolution; i++) {
                barX = i * (Math.ceil(canvas.width / resolution));
                barY = -(fFrequencyData[i] / 2);
                getColors();
                k = 0;
                ctx.strokeStyle = 'rgb('+red+','+green+','+blue+')';
                ctx.lineTo(barX, barY + canvas.height );
                ctx.stroke();
            }
        }
        
        function getColors() {
            //can edit these values to get overall different coloration!!
            red     = Math.round(Math.sin(avg/29.0 + 6.1) * 127 + 128);
            green   = Math.round(Math.sin(avg/42.0 - 7.4) * 127 + 128);
            blue    = Math.round(Math.sin(avg/34.0 - 3.8) * 127 + 128);
        }
        
        if(style === "wave") {
            drawWave(waveResolution, 2);
        }
        if(style === "bars") {
            drawBars(bars);
        }
        
        k++;        
    }
}
