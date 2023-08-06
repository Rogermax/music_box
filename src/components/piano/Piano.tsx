import { KeyboardEventHandler, useState } from "react";
import { NoteEnum } from "../../utils/NoteEnum";
import { WebAudio, octava4 } from "../../utils/WebAudio";
import { Key } from "./key/Key";

const mapKeysOctava: {[key: string]: NoteEnum} = {
    a: NoteEnum.C4,
    w: NoteEnum.C4D4,
    s: NoteEnum.D4,
    e: NoteEnum.D4E4,
    d: NoteEnum.E4,
    f: NoteEnum.F4,
    t: NoteEnum.F4G4,
    g: NoteEnum.G4,
    y: NoteEnum.G4A4,
    h: NoteEnum.A4,
    u: NoteEnum.A4B4,
    j: NoteEnum.B4,
    k: NoteEnum.C5,
    o: NoteEnum.C5D5,
    l: NoteEnum.D5
}

export const Piano = () =>  {

    const [keysInPress, setKeysInPress] = useState<{[note: string]: boolean}>({});

    const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (ev) => {
        const key = Object.keys(mapKeysOctava).find(el => el === ev.key);
        if (key) {
            const note = mapKeysOctava[key];
            if (!keysInPress[note]) {
                setKeysInPress({...keysInPress, [note]: true})
                WebAudio.playNote(note);
            }
        }
    }

    const onKeyUp: KeyboardEventHandler<HTMLDivElement> = (ev) => {
        const key = Object.keys(mapKeysOctava).find(el => el === ev.key);
        if (key) {
            const note = mapKeysOctava[key];
            if (keysInPress[note]) {
                setKeysInPress({...keysInPress, [note]: false})
                WebAudio.stopNote(note);
            }
        }
    }

    return <div className='container' autoFocus onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0}>
        {octava4.map((note, i) => note === null ?
            <button key={i} className="fake-key"></button>
            :
            note.length === 2 ? 
            <Key key={note} note={note} type="white" pressed={keysInPress[note]}></Key>
            :
            <Key key={note} note={note} type="black" pressed={keysInPress[note]}></Key>)
        }
    </div>

};