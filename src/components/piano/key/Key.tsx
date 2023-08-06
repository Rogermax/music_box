import { NoteEnum } from "../../../utils/NoteEnum";

export const Key = ({note, type, pressed}: {note: NoteEnum; type: 'white' | 'black', pressed: boolean}) => {
    let className = type === 'white' ? 'white-key' : 'black-key';
    if (pressed) className +=  ' pressed';
    return <button className={className}>{note}</button>
}