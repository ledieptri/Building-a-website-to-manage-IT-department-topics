import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff} from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';

const AddNotice = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');

    const adminID = currentUser._id
    const address = "Notice"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)


    const fields = { title, details, date, adminID }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true);
        dispatch(addStuff(fields, address));
    }

    useEffect(() => {
        if (status === 'added') {         
            navigate('/Admin/notices')
            dispatch(underControl())
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Notice</span>
                    <label>Tilte</label>
                    <input className="registerInput" type="text" placeholder="Enter motice title..."
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required />
            
                    <label>Details</label>
                    <input className="registerInput" type="text" placeholder="Enter motice details..."
                        value={details}
                        onChange={(event) => setDetails(event.target.value)}
                        required />

                    <label>Date</label>
                    <input className="registerInput" type="date" placeholder="Enter motice date..."
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required />

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddNotice