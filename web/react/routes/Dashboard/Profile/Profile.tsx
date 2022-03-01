import "./Profile.css";
import "react-toastify/dist/ReactToastify.css";
import fallbackUser from "../../../../assets/fallbacks/user.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { getDoc, doc, DocumentData, DocumentSnapshot, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
function Profile() 
{
    const [user, setUser] = useState<DocumentSnapshot<DocumentData> | null>(null);
    const [data, setData] = useState({phno: "", email: ""});
    const [error, setError] = useState({phno:false, email:false});
    const navigate = useNavigate();

    useEffect(()=>
    {
        auth.onAuthStateChanged(async (authUser) =>
        {
            if (!authUser)
                navigate("/");
            else
            {
                const snap = await getDoc(doc(db, `users/${authUser.uid}`));
                setUser(snap);
                setData({phno: snap.get("phno"), email: snap.get("email")});
            }
        });
    }, []);
    function validateForm(event) 
    {
        event.preventDefault();
        if (!data.email || !data.email.match(/^\S+@\S+\.\S+$/gi))
        {
            setError((error) => ({...error, email: true}));
            return;
        }
        if (!data.phno || !data.phno.match(/^(\+\d{1,3})?\d{10}$/g))
        {
            setError((error) => ({...error, phno: true}));
            return;
        }
        setError({phno: false, email: false});
        SaveDetails();
    }
    function SaveDetails()
    {
        if (!user)
            return;
        updateDoc(user.ref, data).then(()=>
        {
            toast.success("Updated", {
                position:"top-right"
            });
        });
    }
    return(
        <>
            <div className="profileHeader">
                Profile
            </div>
            <div className="profileContainer">
                <form className="profileDetails" onSubmit={()=>validateForm(event)}>
                    <img className="userAvatar" src={user?.get("avatar")? user?.get("avatar"):fallbackUser} alt="User"/>
                    <br/>
                    <label className="labelField">
                        Email 
                        <br/>
                        <input className={error.email?"inputField errorField": "inputField"} placeholder="Email" type="email" value={data.email} onChange={ ({target}) => setData((data) => ({...data, email: target.value}))}/>
                    </label>
                    <br/>
                    <label  className="labelField">
                        PhoneNumber
                        <br/>
                        <input className={error.phno?"inputField errorField": "inputField"} placeholder="PhoneNumber" type="phone" value={data.phno} onChange={({target}) => setData((data) => ({...data, phno: target.value}))}/>
                    </label>
                    <br/>
                    <button className="btnSave" type="submit">Save</button>
                </form>
            </div>
            <ToastContainer/>
        </>
    );
}

export default Profile;
