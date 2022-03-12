import "./Card.css";
import eventImage from "../../../assets/fallbacks/event.png";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useState } from "react";
import { User, Auth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import RegistrationModal from "../RegistrationModal/RegistrationModal";
interface CardProps{
    doc:QueryDocumentSnapshot<DocumentData>,
    user: User | null;
    auth: Auth;
}

function Card({doc, user, auth}:CardProps) 
{
    const [open, setOpen] = useState(false);
    const provider = new GithubAuthProvider();
    return(
        <>
            <RegistrationModal id={doc.id} setOpen={setOpen} open={open} user={user}/>
            <div className="eventCard">
                <img src={doc.get("image") || eventImage} alt="event"/>
                <div className="eventInfo">
                    <h4>
                        {doc.get("name")}
                    </h4>
                    <p>
                        {doc.get("about")}
                    </p>
                    <button onClick={()=>user ? setOpen(true) : signInWithPopup(auth, provider)}>
                    Create Team
                    </button>
                </div>
            </div>
        </>
    );
}
export default Card;
