# audio-visualizer
A JavaScript-based audio visualizer that supports frequency (bar) visualization and waveform visualization. It uses the browser-based Web Audio API to obtain frequency data from an audio stream, and uses this data to produce a colorful visual effect. Works in all modern browsers except for IE11.


#Using the audio visualizer in your project
Simply add this HTML to your document:

	<div id="audio-container">
	    <canvas id="audio-display"></canvas>
	</div>
  
Then call the playAudioVisualize function with the path to the audio file to be played as the argument:

	<script>
	  playAudioVisualize('track.mp3');
	</script>
