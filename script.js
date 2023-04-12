// inspiration: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth

// sets up our global AudioContext
const audioContext = new AudioContext();
// list of all currently playing oscillators
const oscList = [];
// this contains a GainNode that all playing oscillators will connect to, so the overall volume can be controlled.
let mainGainNode = null;

// here's where we'll place all the keys
const keyboard = document.querySelector(".keyboard");
// use this to choose our waveforms
const wavePicker = document.querySelector("select[name='waveform']");
// the input element that controls volume
const volumeControl = document.querySelector("input[name='volume']");

// an array of arrays, with each array representing one octave containing the notes in that octave
let noteFreq = null;
// PeriodicWave for a custom waveform we make
// https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave
let customWaveform = null;
// these are the values for the custom waveform
let sineTerms = null;
let cosineTerms = null;

function createNoteTable() {
    // contains an array of objects for each octave
    // each octave has the name of the note and the freq
    const noteFreq = [];
    for (let i = 0; i < 9; i++) {
        noteFreq[i] = [];
    }

    noteFreq[0]["A"] = 27.5;
    noteFreq[0]["A#"] = 29.135235094880619;
    noteFreq[0]["B"] = 30.867706328507756;

    noteFreq[1]["C"] = 32.703195662574829;
    noteFreq[1]["C#"] = 34.647828872109012;
    noteFreq[1]["D"] = 36.708095989675945;
    noteFreq[1]["D#"] = 38.890872965260113;
    noteFreq[1]["E"] = 41.203444614108741;
    noteFreq[1]["F"] = 43.653528929125485;
    noteFreq[1]["F#"] = 46.249302838954299;
    noteFreq[1]["G"] = 48.999429497718661;
    noteFreq[1]["G#"] = 51.913087197493142;
    noteFreq[1]["A"] = 55.0;
    noteFreq[1]["A#"] = 58.270470189761239;
    noteFreq[1]["B"] = 61.735412657015513;

    noteFreq[2]["C"] = 65.406391325149658;
    noteFreq[2]["C#"] = 69.295657744218024;
    noteFreq[2]["D"] = 73.41619197935189;
    noteFreq[2]["D#"] = 77.781745930520227;
    noteFreq[2]["E"] = 82.406889228217482;
    noteFreq[2]["F"] = 87.307057858250971;
    noteFreq[2]["F#"] = 92.498605677908599;
    noteFreq[2]["G"] = 97.998858995437323;
    noteFreq[2]["G#"] = 103.826174394986284;
    noteFreq[2]["A"] = 110.0;
    noteFreq[2]["A#"] = 116.540940379522479;
    noteFreq[2]["B"] = 123.470825314031027;

    noteFreq[3]["C"] = 130.812782650299317;
    noteFreq[3]["C#"] = 138.591315488436048;
    noteFreq[3]["D"] = 146.83238395870378;
    noteFreq[3]["D#"] = 155.563491861040455;
    noteFreq[3]["E"] = 164.813778456434964;
    noteFreq[3]["F"] = 174.614115716501942;
    noteFreq[3]["F#"] = 184.997211355817199;
    noteFreq[3]["G"] = 195.997717990874647;
    noteFreq[3]["G#"] = 207.652348789972569;
    noteFreq[3]["A"] = 220.0;
    noteFreq[3]["A#"] = 233.081880759044958;
    noteFreq[3]["B"] = 246.941650628062055;

    noteFreq[4]["C"] = 261.625565300598634;
    noteFreq[4]["C#"] = 277.182630976872096;
    noteFreq[4]["D"] = 293.66476791740756;
    noteFreq[4]["D#"] = 311.12698372208091;
    noteFreq[4]["E"] = 329.627556912869929;
    noteFreq[4]["F"] = 349.228231433003884;
    noteFreq[4]["F#"] = 369.994422711634398;
    noteFreq[4]["G"] = 391.995435981749294;
    noteFreq[4]["G#"] = 415.304697579945138;
    noteFreq[4]["A"] = 440.0;
    noteFreq[4]["A#"] = 466.163761518089916;
    noteFreq[4]["B"] = 493.883301256124111;

    noteFreq[5]["C"] = 523.251130601197269;
    noteFreq[5]["C#"] = 554.365261953744192;
    noteFreq[5]["D"] = 587.32953583481512;
    noteFreq[5]["D#"] = 622.253967444161821;
    noteFreq[5]["E"] = 659.255113825739859;
    noteFreq[5]["F"] = 698.456462866007768;
    noteFreq[5]["F#"] = 739.988845423268797;
    noteFreq[5]["G"] = 783.990871963498588;
    noteFreq[5]["G#"] = 830.609395159890277;
    noteFreq[5]["A"] = 880.0;
    noteFreq[5]["A#"] = 932.327523036179832;
    noteFreq[5]["B"] = 987.766602512248223;

    noteFreq[6]["C"] = 1046.502261202394538;
    noteFreq[6]["C#"] = 1108.730523907488384;
    noteFreq[6]["D"] = 1174.659071669630241;
    noteFreq[6]["D#"] = 1244.507934888323642;
    noteFreq[6]["E"] = 1318.510227651479718;
    noteFreq[6]["F"] = 1396.912925732015537;
    noteFreq[6]["F#"] = 1479.977690846537595;
    noteFreq[6]["G"] = 1567.981743926997176;
    noteFreq[6]["G#"] = 1661.218790319780554;
    noteFreq[6]["A"] = 1760.0;
    noteFreq[6]["A#"] = 1864.655046072359665;
    noteFreq[6]["B"] = 1975.533205024496447;

    noteFreq[7]["C"] = 2093.004522404789077;
    noteFreq[7]["C#"] = 2217.461047814976769;
    noteFreq[7]["D"] = 2349.318143339260482;
    noteFreq[7]["D#"] = 2489.015869776647285;
    noteFreq[7]["E"] = 2637.020455302959437;
    noteFreq[7]["F"] = 2793.825851464031075;
    noteFreq[7]["F#"] = 2959.955381693075191;
    noteFreq[7]["G"] = 3135.963487853994352;
    noteFreq[7]["G#"] = 3322.437580639561108;
    noteFreq[7]["A"] = 3520.0;
    noteFreq[7]["A#"] = 3729.310092144719331;
    noteFreq[7]["B"] = 3951.066410048992894;

    noteFreq[8]["C"] = 4186.009044809578154;

    return noteFreq;
}

function setup() {
    // create our table of note names and octaves
    noteFreq = createNoteTable();

    // listen for a "change" event on our volume control https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
    volumeControl.addEventListener("change", changeVolume, false);

    // create a gain node on our audio context
    mainGainNode = audioContext.createGain();
    // connect this to our audio context destination
    mainGainNode.connect(audioContext.destination);
    // set the gain node value to our volume value
    mainGainNode.gain.value = volumeControl.value;

    noteFreq.forEach((keys, idx) => {
        // gets a list of notes in a given octave
        const keyList = Object.entries(keys);
        // create a div that holds each octave's notes
        const octaveElem = document.createElement("div");
        // set the classname to "octave"
        octaveElem.className = "octave";

        keyList.forEach((key) => {
            // if the note name has more than one character, skip it
            // we're skipping the sharps for now
            if (key[0].length === 1) {
                octaveElem.appendChild(createKey(key[0], idx, key[1]));
            }
        });
        // when each octave element has been built, append it to our keyboard
        keyboard.appendChild(octaveElem);
    });

    // scroll into view, centering on middle C
    document
        .querySelector("div[data-note='B'][data-octave='5']")
        .scrollIntoView(false);

    // custom waveform build with BaseAudioContext.createPeriodicWave() https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createPeriodicWave
    sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    cosineTerms = new Float32Array(sineTerms.length);
    customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

    // oscillator list is initialized so it can receive info identifying which oscillators are associated with which keys
    for (let i = 0; i < 9; i++) {
        oscList[i] = {};
    }
}

setup();

// creates the key and the label
function createKey(note, octave, freq) {
    const keyElement = document.createElement("div");
    const labelElement = document.createElement("div");

    // add data attributes to the element for fetching info we need with events
    keyElement.className = "key";
    keyElement.dataset["octave"] = octave;
    keyElement.dataset["note"] = note;
    keyElement.dataset["frequency"] = freq;

    labelElement.innerHTML = `${note}<sub>${octave}</sub>`;
    keyElement.appendChild(labelElement);

    // set up event handlers for each key
    keyElement.addEventListener("mousedown", notePressed, false);
    keyElement.addEventListener("mouseup", noteReleased, false);
    keyElement.addEventListener("mouseover", notePressed, false);
    keyElement.addEventListener("mouseleave", noteReleased, false);

    return keyElement;
}

function playTone(freq) {
    // create an oscillator
    // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createOscillator
    const osc = audioContext.createOscillator();
    // connect it to the main gain node
    osc.connect(mainGainNode);

    // grab which type of waveform we want from out select HTML element
    const type = wavePicker.options[wavePicker.selectedIndex].value;

    // if it's custom, pull from our customWaveForm values, otherwise pass through the wave type
    if (type === "custom") {
        osc.setPeriodicWave(customWaveform);
    } else {
        osc.type = type;
    }

    // pass the frequency to the oscillator
    // https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioParam
    osc.frequency.value = freq;
    // start the oscillator
    osc.start();

    return osc;
}

function notePressed(event) {
    // if the primary mouse button has been clicked
    if (event.buttons & 1) {
        // grab the dataset of what was clicked
        const dataset = event.target.dataset;

        // if the note's not playing already
        if (!dataset["pressed"]) {
            // store the octave the note is in
            const octave = Number(dataset["octave"]);
            // call playnote function with the relevant frequency
            // store the oscillator into oscList for future reference
            oscList[octave][dataset["note"]] = playTone(dataset["frequency"]);
            // set the pressed to yes, so we don't play it again
            dataset["pressed"] = "yes";
        }
    }
}

function changeVolume(event) {
    mainGainNode.gain.value = volumeControl.value;
}
