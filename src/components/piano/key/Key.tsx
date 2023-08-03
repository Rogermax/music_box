import { NoteEnum } from "../../../utils/NoteEnum";
import { WebAudio } from "../../../utils/WebAudio";

export const Key = ({note, type}: {note: NoteEnum, type: 'white' | 'black'}) => {

    const handleMouseDown = () => {
        WebAudio.playNote(note);
    }

    const handleMouseUp = () => {
        WebAudio.stopNote(note);
    }

    const className = type === 'white' ? 'white-key' : 'black-key';
    return <button className={className} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>{note}</button>
}