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
                <img src={doc.get("image") || eventImage} alt="event" className="eventImage"/>
                <div className="eventInfo">
                    <div className="eventTitle">
                        {doc.get("name")}
                    </div>
                    <div className="eventDescription">
                        {doc.get("about")}
                    </div>
                </div>
            </div>
        </>
    );
}
export default EventCard;
