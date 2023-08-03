import { NoteEnum } from "../../../utils/NoteEnum";
import { WebAudio } from "../../../utils/WebAudio";

export const Key = ({note, type}: {note: NoteEnum, type: 'white' | 'black'}) => {

    const handleClick = () => {
        WebAudio.playNote(note);
    }

    const className = type === 'white' ? 'white-key' : 'black-key';
    return <button className={className} onClick={handleClick}>{note}</button>
}