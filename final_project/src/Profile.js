import React from 'react';
import './Profile.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useState } from 'react';



function Profile({cur_user, showAlert, setAlert, alertData, setAlertData}){
    const [show1, setShow1] = useState(false);

    const handleClose1 = () => setShow1(false);

    const handleSaveClose = () => {
        setShow1(false);
        setAlertData(['Edit Profile', 'Successfully saved profile changes!']);
        setAlert(true);
    }

    const handleShow1 = () => {
        setUsername(cur_user.username);
        setPassword(cur_user.password);
        setFirstname(cur_user.firstname);
        setLastname(cur_user.lastname);
        setProfilePic(cur_user.profile_pic);
        setMajor(cur_user.major);
        setShow1(true);
    }
    const [username, setUsername] = useState(cur_user.username);
    const [password, setPassword] = useState(cur_user.password);
    const [firstname, setFirstname] = useState(cur_user.firstname);
    const [lastname, setLastname] = useState(cur_user.lastname);
    const [profilePic, setProfilePic] = useState(cur_user.profile_pic);
    const [major, setMajor] = useState(cur_user.major);

    const [showOverlay1, setShowOverlay1] = useState(false);
    const [tooltip1, setTooltip1] = useState("");

    const renderTooltip1 = (props) => (
        <Tooltip id="button-tooltip" class="align-self-center mx-auto" {...props}>
          {tooltip1}
        </Tooltip>
    );
    
    return(
    <div id="profile-page">
        <img id="profile-pic" src={cur_user.profile_pic} alt="Never gonna give you up, never gonna let you down, never gonna run around and desert you." />
        <div id="profile-info">
            <p id="profile-name">{cur_user.firstname}&nbsp;{cur_user.lastname}</p>
            <p id="profile-username"><span style={{"fontWeight":"bold"}}>Username:</span>&nbsp;{cur_user.username}</p>
            <p id="profile-period"><span style={{"fontWeight":"bold"}}>Enrollment Period:</span>&nbsp;{cur_user.start_year}-{cur_user.start_year+4}</p>
            <p id="profile-major"><span style={{"fontWeight":"bold"}}>Major:</span>&nbsp;{cur_user.major}</p>
            <p id="profile-major"><span style={{"fontWeight":"bold"}}>GPA:</span>&nbsp;{cur_user.GPA}</p>
            <p id="profile-major"><span style={{"fontWeight":"bold"}}>Credits Earned:</span>&nbsp;{cur_user.credits_earned}</p>
            <p id="profile-major"><span style={{"fontWeight":"bold"}}>Credits Needed:</span>&nbsp;{128-cur_user.credits_earned}</p>

            <div className="text-center">
                <Button id="profile-edit" variant="primary" onClick={handleShow1}>
                    Edit Information
                </Button>
            </div>
            
            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div id="input-spacing">
                    <label className="edit-formlabel" htmlFor="edit-firstname">First Name:&nbsp;</label>
                    <input
                        className="edit-forminput"
                        id="edit-firstname"
                        onInput={e => setFirstname(e.target.value)}
                        value={firstname}
                        placeholder="First Name"
                    />
                </div>
                <div id="input-spacing">
                    <label className="edit-formlabel" htmlFor="edit-lastname">Last Name:&nbsp;</label>
                    <input
                        className="edit-forminput"
                        id="edit-lastname"
                        onInput={e => setLastname(e.target.value)}
                        value={lastname}
                        placeholder="Last Name" 
                    />
                </div>
                <div id="input-spacing">
                    <label className="edit-formlabel" htmlFor="edit-username">Username:&nbsp;</label>
                    <input
                        className="edit-forminput"
                        id="edit-username"
                        onInput={e => setUsername(e.target.value)}
                        value={username}
                        placeholder="Username" 
                    />
                </div>
                <div id="input-spacing">
                    <label className="edit-formlabel" htmlFor="edit-password">Password:&nbsp;</label>
                    <input
                        className="edit-forminput"
                        id="edit-password"
                        type="password"
                        onInput={e => setPassword(e.target.value)}
                        value={password}
                        placeholder="Password" 
                    />
                </div>
                <div id="input-spacing">
                    <label className="edit-formlabel" htmlFor="edit-profile-pic">Profile Picture Image URL:&nbsp;</label>
                    <input
                        className="edit-forminput"
                        id="edit-profile-pic"
                        onInput={e => setProfilePic(e.target.value)}
                        value={profilePic}
                        placeholder="e.g. https://i.kym-cdn.com/entries/icons/original/000/037/319/cover1.jpg"
                    />
                </div>
                
                <div id="input-spacing">
                    <label className="edit-formlabel" htmlFor="major-dropdown">Major:&nbsp;</label>
                    <DropdownButton className="edit-forminput" variant="primary" id="major-dropdown" title={major}>
                        <Dropdown.Item onClick={e => setMajor("Undecided")} href="#/action-1">Undecided</Dropdown.Item>
                        <Dropdown.Item onClick={e => setMajor("Computer Engineering")} href="#/action-2">Computer Engineering</Dropdown.Item>
                    </DropdownButton>
                </div>
                
                </Modal.Body>
                <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose1}>
                    Cancel
                </Button>
                <OverlayTrigger
                    placement="top"
                    show={showOverlay1}
                    trigger="click"
                    overlay={renderTooltip1}
                >
                    <Button variant="primary" onClick={e => handleEdit(cur_user, firstname, lastname, username, password, profilePic, major, handleSaveClose, setShowOverlay1, setTooltip1)}>
                        Save Changes
                    </Button>
                </OverlayTrigger>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
    );
}

function handleEdit(cur_user, firstname, lastname, username, password, profilePic, major, handleSaveClose, setShowOverlay1, setTooltip1){
    if(firstname === "" || lastname === "" || username === "" || password === "" || profilePic === ""){
        setTooltip1("Invalid fields (e.g. empty)");
        setShowOverlay1(true);
        setTimeout(function() {
            setShowOverlay1(false);
        }, 1000);
        return;
    }

    const axios = require('axios');

    axios.put('https://ancient-ravine-23357.herokuapp.com/login',{username: username, student_id: cur_user.student_id, password: password})
    .then(function (response1) {
        // handle success
        // console.log(response1.data);
        cur_user.username = username;
        cur_user.password = password;
        axios.put('https://ancient-ravine-23357.herokuapp.com/students',{_id: cur_user.student_id, major: major, grad_year: cur_user.start_year+4, firstName: firstname, lastName: lastname, picture_url: profilePic})
        .then(function (response2) {
            // handle success
            // console.log(response2.data);
            cur_user.firstname = firstname;
            cur_user.lastname = lastname;
            cur_user.profile_pic = profilePic;
            cur_user.major = major;
            
            handleSaveClose();
        })
        .catch(function (error) {
            // handle error
            // console.log(error);
        })
    })
    .catch(function (error) {
        // handle error
        // console.log(error);
        setTooltip1("Username already in use");
        setShowOverlay1(true);
        setTimeout(function() {
            setShowOverlay1(false);
        }, 1000);
        return;
    })
}

export default Profile;
