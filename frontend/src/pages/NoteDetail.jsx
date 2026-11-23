import {useParams,Link} from "react-router-dom";

function NoteDetail(){
    const {id} = useParams();

    return (
        <div>
            <Link to="notes/">Back to notes</Link>
            <h2>Note #{id}</h2>
        </div>
    );
}

export default NoteDetail;