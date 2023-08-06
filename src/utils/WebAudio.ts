/* eslint-disable @typescript-eslint/no-explicit-any */
import { frequencyMap } from "./Frequencies";
import { NoteEnum } from "./NoteEnum";

export const octava4 = [
  NoteEnum.C4,
  NoteEnum.C4D4,
  NoteEnum.D4,
  NoteEnum.D4E4,
  NoteEnum.E4,
  null,
  NoteEnum.F4,
  NoteEnum.F4G4,
  NoteEnum.G4,
  NoteEnum.G4A4,
  NoteEnum.A4,
  NoteEnum.A4B4,
  NoteEnum.B4,
  null,
  NoteEnum.C5,
  NoteEnum.C5D5,
  NoteEnum.D5,
];

const reduceIntervalMs = 20;
const maxGain = 1 / 6; // que suenen bin hasta 6 teclas

const notesFreq: {
  [note: string]: {
    osc: OscillatorNode | null;
    vol: GainNode | null;
    pressing: boolean;
  };
} = {};

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

    octava4.forEach((note) => {
      console.log("note stating: ", note);
      if (note) {
        notesFreq[note] = {
          osc: audioContext!.createOscillator(),
          vol: audioContext!.createGain(),
          pressing: false,
        };
        notesFreq[note].osc!.connect(notesFreq[note].vol!);
        notesFreq[note].vol!.connect(analyser!);
        notesFreq[note].osc!.frequency.value = frequencyMap[note];
        notesFreq[note].vol!.gain.value = 0;
        notesFreq[note].osc!.start();
      }
    });

    dataArray = new Uint8Array(analyser.frequencyBinCount);
    // setInterval(WebAudio.reduceGains, reduceIntervalMs);
  }

  static reduceGains() {
    if (notesFreq) {
      Object.keys(notesFreq).map((key) => {
        const vol = notesFreq[key].vol;
        if (vol) {
          const newVolume = Math.min(
            Math.max(
              vol.gain.value -
                reduceIntervalMs / (notesFreq[key].pressing ? 3000 : 1000),
              0.001
            ),
            1
          );
          notesFreq[key].vol!.gain.exponentialRampToValueAtTime(
            newVolume,
            audioContext!.currentTime
          );
        }
      });
    }
  }

  static playNote(note: NoteEnum): void {
    console.log("Play note: ", note);
    if (!notesFreq[note]) {
      WebAudio.start();
    }
    notesFreq[note].vol!.gain.setValueAtTime(0.01, audioContext!.currentTime);
    notesFreq[note].vol!.gain.exponentialRampToValueAtTime(
      maxGain,
      audioContext!.currentTime + 0.01
    );
    notesFreq[note].pressing = true;
  }

  static stopNote(note: NoteEnum): void {
    console.log("Stop note: ", note);

    notesFreq[note].vol!.gain.setValueAtTime(
      maxGain,
      audioContext!.currentTime
    );
    notesFreq[note].vol!.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext!.currentTime + 0.01
    );
    notesFreq[note].vol!.gain.setValueAtTime(
      0,
      audioContext!.currentTime + 0.015
    );
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
