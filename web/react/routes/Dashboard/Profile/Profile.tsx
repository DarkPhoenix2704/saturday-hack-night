import "./Profile.css";
import fallbackUser from "../../../../assets/fallbacks/user.png";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { getDoc, doc, DocumentData, DocumentSnapshot, updateDoc } from "firebase/firestore";
function Profile() 
{
    const [user, setUser] = useState<DocumentSnapshot<DocumentData> | null>(null);
    const [data, setData] = useState({phno: " ", email: ""});
    const [error, setError] = useState({phno:false, email:false});
    const [updated, setUpdated] = useState<boolean>(null);

    useEffect(()=>
    {
        auth.onAuthStateChanged(async (authUser) =>
        {
            const snap = await getDoc(doc(db, `users/${authUser.uid}`));
            setUser(snap);
            setData({phno: snap.get("phno"), email: snap.get("email")});
        });
    }, []);
    function validateForm(event) 
    {
        event.preventDefault();
        const emailNotValid = !data.email || !data.email.match(/^\S+@\S+\.\S+$/gi);
        const numNotValid = !data.phno || !data.phno.match(/^(\+\d{1,3})?\d{10}$/g);
        if (emailNotValid) 
        {

            setError((error) => ({...error, email: true}));
            setUpdated(false);
        }
        else
            setError((error) => ({...error, email: false}));
        if (numNotValid) 
        {
            setError((error) => ({...error, phno: true}));
            setUpdated(false);
        }
        else
            setError((error) => ({...error, phno: false}));
        if(!emailNotValid && !numNotValid)
        {
            setError({phno: false, email: false}); 
            SaveDetails();
        }
    }
    function SaveDetails()
    {
        if (!user)
            return;
        updateDoc(user.ref, data).then(()=>
        {
            setUpdated(true);
        });
    }
    return(
        <>
            <div className="profileHeader">
                Profile
            </div>
            <div className="profileContainer">
                <form className="profileDetails" onSubmit={()=>validateForm(event)}>
                    <img src={user?.get("avatar")? user?.get("avatar"):fallbackUser} alt="User"/>
                    <label>
                        Email 
                        <br/>
                        <input className={error.email?"inputField errorField": "inputField"} placeholder="Email" type="email" value={data.email} onChange={ ({target}) => setData((data) => ({...data, email: target.value}))}/>
                        {error.email && <p className="text-error">Enter a valid emailID</p>}
                    </label>
                    <label>
                        PhoneNumber
                        <br/>
                        <input className={error.phno?"inputField errorField": "inputField"} placeholder="PhoneNumber" type="phone" value={data.phno} onChange={ ({target}) => setData((data) => ({...data, phno: target.value})) } />
                        {error.phno && <p className="text-error">Enter a Valid Number</p> }
                    </label>
                    <button className="btnSave" type="submit">Save</button>
                    { updated && <p className="text-success">Updated Successfully</p>}
                </form>
            </div>
        </>
    );
}

export default Profile;
