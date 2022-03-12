import "./EventCard.css";
import eventImage from "../../../assets/fallbacks/event.png";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
interface EventCardProps{
    doc:QueryDocumentSnapshot<DocumentData>,
}

function EventCard({doc}: EventCardProps) 
{
    return(
        <>
            <div className="eventCardHome">
                <img src={doc.get("image") || eventImage} alt="event"/>
                <div className="eventInfo">
                    <h3>
                        {doc.get("name")}
                    </h3>
                    <p>
                        {doc.get("about")}
                    </p>
                </div>
            </div>
        </>
    );
}
export default EventCard;
