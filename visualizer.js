function playAudioVisualize(track) {
    var bars = 50;
    var waveResolution = 128;
    var defaultStyle = "bars";
	var audio = new Audio();
	audio.controls = true;
	audio.src = track;
	audio.loop = false;
	audio.autoplay = false;
	var style = defaultStyle;
	var canvas, source, context, analyser, fFrequencyData, numBarsBars, barX, barWidth, barHeight, red, green, blue, ctx;
	window.addEventListener("load", initPlayer, false);
	function initPlayer() {
	    document.getElementById('audio-container').appendChild(audio);
	    context = new AudioContext();
	    analyser = context.createAnalyser();
	    canvas = document.getElementById('audio-display');
	    ctx = canvas.getContext('2d');
	    source = context.createMediaElementSource(audio);
	    source.connect(analyser);
	    analyser.connect(context.destination);
	    drawFrames();	    
	    document.getElementById("audio-display").addEventListener("click",toggleStyle);
	    function toggleStyle() {
			if (style === "wave") { 
			    style = "bars"; 
			} else { 
			    style = "wave"; 
			}
		}
	}
	var k = 0;
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
			for (var i = 0; i < numBars; i++) {
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
				barX = i*(Math.ceil(canvas.width / resolution));
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
			red = Math.round(Math.sin(avg/29.0 + 6.1) * 127 + 128);
			green = Math.round(Math.sin(avg/42.0 - 7.4) * 127 + 128);
			blue = Math.round(Math.sin(avg/34.0 - 3.8) * 127 + 128);
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
