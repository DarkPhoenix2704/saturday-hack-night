import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ReactModal from "react-modal";
import { db } from "../../firebase";
import MemberChips from "../MemberChips/MemberChips";
import "./RegistrationModal.css";
interface RegistrationModalProps {
    id: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
    user:User | null,
}
ReactModal.setAppElement("#root");
function RegistrationModal({id, setOpen, open, user}:RegistrationModalProps) 
{
    const [members, setMembers] = useState(new Set());  
    const [data, setData] = useState({name:"", repo:""});
    const [error, setError] = useState({name:false, repo:false});
    const [status, setStatus] = useState<number>(0);
    
    function validateTeam(event)
    {
        event.preventDefault();
        setStatus(0);
        const repoNotValid = !data.repo.match(/^https:\/\/github.com\/[^\/]+\/[^\/]+$/g);
        const nameNotValid = !data.name.match(/^[a-z|1-9]+$/gi);
        if (nameNotValid)
            setError((error) => ({...error, name:true}));
        else
            setError((error) => ({...error, name:false}));
        if (repoNotValid)
            setError((error) => ({...error, repo:true}));
        else
            setError((error) => ({...error, repo:false}));
        if (!repoNotValid && !nameNotValid) 
        {
            setError({name:false, repo:false});
            createTeam();
        }
    }
    async function createTeam()
    {
        members.delete(user.uid);
        await addDoc(collection(db, `events/${id}/teams`), {
            name: data.name,
            repo: data.repo,
            members: Array.from(members),
            lead: user.uid
        }).then(()=>
        {
            setStatus(1);
            setMembers(null);
            setData({name:"", repo:""});
        }).catch( err =>
        {
            console.log(err);
            setStatus(-1);
        });
        
        setOpen(true);
    }
    return(
        <>
            <ReactModal style={
                {
                    overlay: {
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        backgroundColor: "rgba(255, 255, 255, 0.75)"
                    },
                    content: {
                        position: "relative",
                        top:"50%",
                        left:"50%",
                        transform: "translate(-50%, -50%)",
                        height:"max-content",
                        width:"75%",
                        border: "1px solid #ccc",
                        background: "#fff",
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                        borderRadius: "4px",
                        outline: "none",
                        padding: "20px"
                    }
                }
            } parentSelector={()=>document.querySelector("#root")} isOpen={open} onRequestClose={()=>setOpen(false)} shouldCloseOnOverlayClick={true}>
                <h1 className="modelHead">Create Team</h1>
                <form className="modelBody">
                    <label className="labelField">
                        <p className="labelText">
                            Team Name
                        </p>
                        <input type="text" placeholder="Team Name" className={error.name?"modalInput modalInputError":"modalInput"} onChange={({target}) => setData((data) => ({...data, name: target.value}))}/>
                        {error.name && <p className="text-error">Enter a Valid Team Name</p>}
                    </label>
                    <label className="labelField">
                        <p className="labelText">
                            RepoLink
                        </p>
                        <input type="text" placeholder="Repo Link" className={error.repo?"modalInput modalInputError":"modalInput"} onChange={({target}) => setData((data) => ({...data, repo: target.value}))}/>
                        {error.repo && <p className="text-error">Enter a Valid Repo</p>}
                    </label>
                    <MemberChips onChange={(uid, add)=> setMembers((members) => ( add ? members.add(uid) : members.delete(uid) ? members : members))}/>
                    {status === 1 && <p className="text-success">Team Registration Successful</p>}
                    {status === -1 && <p className="text-error">Team Registration Failed</p>}
                </form>
                <div className="modalFooter">
                    <button className="modalButton" onClick={(event)=>
                    {
                        validateTeam(event);
                    }}>Create</button>
                    <button className="modalButton" onClick={()=>setOpen(false)}>Cancel</button>
                </div>
            </ReactModal>
        </>
    );
}
export default RegistrationModal;
