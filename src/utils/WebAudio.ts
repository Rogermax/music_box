/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoteEnum } from './NoteEnum';

export class WebAudio {
    private static audioContext: AudioContext | null = null;
    private static analyser: AnalyserNode | null = null;
    private static dataArray: Uint8Array;

    // Toca la nota durante 1 segundo.
    static playNote(note: NoteEnum): void {
        this.playNotes([note]);
    }

    static playNotes(notes: string[]): void {
        const frequencyMap: { [note: string]: number } = {
            C: 261.63, // DO
            D: 293.66, // RE
            // Agrega más notas según sea necesario
        };

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext ||
                (window as unknown as any).webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        }

        const oscillators: OscillatorNode[] = [];

        notes.forEach((note) => {
            const oscillator = this.audioContext!.createOscillator();
            oscillator.frequency.setValueAtTime(
                frequencyMap[note],
                this.audioContext!.currentTime
            );
            oscillator.connect(this.analyser!);
            this.analyser!.connect(this.audioContext!.destination);
            oscillators.push(oscillator);
            oscillator.start();
        });

        // Detener ambos osciladores después de 1 segundo
        setTimeout(() => {
            oscillators.forEach((oscillator) => oscillator.stop());
        }, 1000);
    }

    static getWaveform(): Uint8Array {
        if (this.analyser) {
            this.analyser.getByteTimeDomainData(this.dataArray);
            return this.dataArray;
        }
        return new Uint8Array();
    }
}
