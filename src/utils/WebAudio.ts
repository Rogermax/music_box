/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoteEnum } from './NoteEnum';

const frequencyMap: { [note: string]: number } = {
    C: 261.63, // DO
    D: 293.66, // RE
    // Agrega más notas según sea necesario
};

const reduceIntervalMs = 20;

const notesFreq: {
    [note: string]: {
        osc: OscillatorNode | null;
        vol: GainNode | null;
        pressing: boolean;
    };
} = {
    C: { osc: null, vol: null, pressing: false },
    D: { osc: null, vol: null, pressing: false },
};

let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let dataArray: Uint8Array;

export class WebAudio {
    static start() {
        audioContext = new (window.AudioContext ||
            (window as unknown as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.connect(audioContext!.destination);

        notesFreq.C.osc = audioContext.createOscillator();
        notesFreq.C.vol = audioContext.createGain();
        notesFreq.C.pressing = false;
        notesFreq.C.osc.connect(notesFreq.C.vol);
        notesFreq.C.vol.connect(analyser);
        notesFreq.C.osc.frequency.value = frequencyMap['C'];
        notesFreq.C.vol.gain.value = 0;
        notesFreq.C.osc.start();

        notesFreq.D.osc = audioContext.createOscillator();
        notesFreq.D.vol = audioContext.createGain();
        notesFreq.D.pressing = false;
        notesFreq.D.osc.connect(notesFreq.D.vol);
        notesFreq.D.vol.connect(analyser);
        notesFreq.D.osc.frequency.value = frequencyMap['D'];
        notesFreq.D.vol.gain.value = 0;
        notesFreq.D.osc.start();

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        setInterval(WebAudio.reduceGains, reduceIntervalMs);
    }

    static reduceGains() {
        if (notesFreq) {
            Object.keys(notesFreq).map((key) => {
                const vol = notesFreq[key].vol;
                if (vol) {
                    const newVolume = Math.min(
                        Math.max(
                            vol.gain.value -
                                reduceIntervalMs /
                                    (notesFreq[key].pressing ? 3000 : 1000),
                            0
                        ),
                        1
                    );
                    vol.gain.value = newVolume;
                }
            });
        }
    }

    static playNote(note: NoteEnum): void {
        console.log('Play note: ', note);
        if (!notesFreq[note].vol) {
            WebAudio.start();
        }
        notesFreq[note].vol!.gain.value = 1;
        notesFreq[note].pressing = true;
    }

    static stopNote(note: NoteEnum): void {
        console.log('Stop note: ', note);
        notesFreq[note].pressing = false;
    }

    static getWaveform(): Uint8Array {
        if (analyser) {
            analyser.getByteTimeDomainData(dataArray);
            return dataArray;
        }
        return new Uint8Array();
    }
}
