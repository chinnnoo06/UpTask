import type { TNote } from "@/types/index"
import { AddNoteForm } from "./AddNoteForm"
import { NoteDetail } from "./NoteDetail"

type TNotesPanelProps = {
    notes: TNote[]
}

export const NotesPanel = ({ notes }: TNotesPanelProps) => {
    return (
        <>
            <AddNoteForm />


            {notes.length ? (
                <>
                    <p className="font-bold text-2xl text-gray-600 mt-5">
                        Notas:
                    </p>

                    <div className="divide-y divide-gray-100">
                        {notes.map(note => (
                            <NoteDetail key={note._id} note={note} />
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center pt-3">No hay notas</p>
            )}

        </>
    )
}
