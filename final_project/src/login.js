import React from 'react';
import './login.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'



function Login({setLog, setCurUser, setSemesters, setSem_id}){
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handleClose2 = () => setShow2(false);
    const handleClose3 = () => setShow3(false);

    const handleShow1 = () => setShow1(true);
    const handleShow2 = () => setShow2(true);
    const handleShow3 = () => setShow3(true);

    const [showOverlay1, setShowOverlay1] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);
  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [major, setMajor] = useState("Undecided");
    const [startyear, setStartYear] = useState(0);

    const [tooltip2, setTooltip2] = useState("Username already in use");

    const renderTooltip1 = (props) => (
        <Tooltip id="button-tooltip" className="align-self-center mx-auto" {...props}>
          Invalid username or password
        </Tooltip>
    );

    const renderTooltip2 = (props) => (
        <Tooltip id="button-tooltip" className="align-self-center mx-auto" {...props}>
          {tooltip2}
        </Tooltip>
    );

    const handleKeyPress = (e) => {
        if(e.key === 'Enter')
            handleSignIn(setLog, setCurUser, setShowOverlay1, username, password, setSemesters, setSem_id);
    }

    const handleKeyPressSignUp = (e) => {
        if(e.key === 'Enter')
            handleSignUp(setShowOverlay2, handleShow3, setTooltip2, firstname, lastname, username, password, handleClose2);
    }

    return(
    <div id="login-page">
        
        <Button id="login-button" variant="primary" onClick={handleShow1}>
            Sign In
        </Button>

        <Modal show={show1} onHide={handleClose1}>
            <Modal.Header closeButton>
            <Modal.Title>Sign In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form action="/" method="get">
                <div id="input-spacing">
                    <input
                        id="username"
                        onInput={e => setUsername(e.target.value)}
                        placeholder="Username"
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <div id="input-spacing">
                    <input
                        id="password"
                        type="password"
                        onInput={e => setPassword(e.target.value)}
                        placeholder="Password"
                        onKeyDown={handleKeyPress}
                    />
                </div>
            </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose1}>
                Close
            </Button>
            <Button id="create-button" variant="success" onClick={handleShow2}>
                Create Account
            </Button>
            <OverlayTrigger
                placement="top"
                show={showOverlay1}
                trigger="click"
                overlay={renderTooltip1}
            >
                <Button variant="primary" onClick={e => handleSignIn(setLog, setCurUser, setShowOverlay1, username, password, setSemesters, setSem_id)}>
                    Sign In
                </Button>
            </OverlayTrigger>
            </Modal.Footer>
        </Modal>

        <Modal show={show2} onHide={handleClose2}>
            <Modal.Header closeButton>
            <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form action="/" method="get">
                <div id="input-spacing">
                    <input
                        id="first"
                        onInput={e => setFirstname(e.target.value)}
                        placeholder="First Name"
                        onKeyDown={handleKeyPressSignUp}
                    />
                </div>
                <div id="input-spacing">
                    <input
                        id="last"
                        onInput={e => setLastname(e.target.value)}
                        placeholder="Last Name"
                        onKeyDown={handleKeyPressSignUp}
                    />
                </div>
                <div id="input-spacing">
                    <input
                        id="startyear"
                        onInput={e => setStartYear(e.target.value)}
                        placeholder="Enrollment Year"
                        onKeyDown={handleKeyPressSignUp}
                    />
                </div>
                <div id="input-spacing">
                    <input
                        id="username"
                        onInput={e => setUsername(e.target.value)}
                        placeholder="Username"
                        onKeyDown={handleKeyPressSignUp}
                    />
                </div>
                <div id="input-spacing">
                    <input
                        id="password"
                        type="password"
                        onInput={e => setPassword(e.target.value)}
                        placeholder="Password"
                        onKeyDown={handleKeyPressSignUp}
                    />
                </div>
                <div id="input-spacing">
                    <label className="edit-formlabel" htmlFor="major-dropdown">Major:&nbsp;</label>
                    <DropdownButton className="edit-forminput" variant="primary" id="major-dropdown" title={major}>
                        <Dropdown.Item onClick={e => setMajor("Undecided")} href="#/action-1">Undecided</Dropdown.Item>
                        <Dropdown.Item onClick={e => setMajor("Computer Engineering")} href="#/action-2">Computer Engineering</Dropdown.Item>
                    </DropdownButton>
                </div>
            </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
                Close
            </Button>
            <OverlayTrigger
                placement="top"
                show={showOverlay2}
                trigger="click"
                overlay={renderTooltip2}
            >
                <Button id="create-button" variant="success" onClick={e => handleSignUp(setShowOverlay2, handleShow3, setTooltip2, firstname, lastname, username, password, startyear, major, handleClose2)}>
                    Sign Up
                </Button>
            </OverlayTrigger>
            </Modal.Footer>
        </Modal>

        <Modal show={show3} onHide={handleClose3}>
            <Modal.Header closeButton>
            <Modal.Title>User Created</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            User successfully created!
            <br></br><br></br><br></br><br></br>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleClose3}>
                Continue
            </Button>
            </Modal.Footer>
        </Modal>

        <div id="login-div">
            <figure>
                <div>
                    <Carousel>
                        {['demo1.png', 'demo2.png', 'demo3.png', 'demo4.png'].map((pic) => (
                            <Carousel.Item interval={4000} key={pic}>
                                <figure>
                                    <img id="login-pic" src={pic} alt="Never gonna give you up, never gonna let you down, never gonna run around and desert you." style={{"borderRadius":"10px", "border":"1px solid"}} />
                                </figure>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <figcaption id="fig-title">Course Planner</figcaption>
                <figcaption id="fig-cap">Course Planner for planning courses that will fulfill all degree requirements</figcaption>
            </figure>
        </div>
    </div>
    );
}

function handleSignIn(setLog, setCurUser, setShowOverlay1, username, password, setSemesters, setSem_id){
    const axios = require('axios');


    axios.get('https://ancient-ravine-23357.herokuapp.com/login', {params: {username: username, password: password}})
    .then(function (response1) {
    // handle success
    // console.log(response1.data);
        if(response1.data.message === "OK"){
            //setLog(true);
            axios.get(`https://ancient-ravine-23357.herokuapp.com/students/${response1.data.data._id}`)
            .then(function (response2) {
            // handle success
            axios.get(`https://ancient-ravine-23357.herokuapp.com/semesters?where={"student_id":"${response1.data.data._id}"}`)
            .then(function (response3) {
            // handle success
            // console.log(response3.data);
            const res_data = response3.data.data;
                setSemesters([res_data[0].term, res_data[1].term, res_data[2].term, res_data[3].term, res_data[4].term, res_data[5].term, res_data[6].term, res_data[7].term]);
                setSem_id([res_data[0], res_data[1], res_data[2], res_data[3], res_data[4], res_data[5], res_data[6], res_data[7]]);
            })
            .catch(function (error) {
            // handle error
            // console.log(error);
            setShowOverlay1(true);
            setTimeout(function() {
                setShowOverlay1(false);
            }, 1000);
            })
                if(response2.data.message === "OK"){
                    setLog(true);
                    setCurUser({
                        firstname: response2.data.data.firstName, 
                        lastname: response2.data.data.lastName, 
                        username: username, 
                        password: password,
                        start_year: response2.data.data.start_year,
                        major: response2.data.data.major,
                        GPA: response2.data.data.gpa,
                        credits_earned: response2.data.data.total_credits,
                        profile_pic: response2.data.data.picture_url,
                        student_id: response1.data.data._id,
                        plan: response2.data.data.plan
                    });
                    return;
                }
                else{
                    setShowOverlay1(true);
                    setTimeout(function() {
                        setShowOverlay1(false);
                    }, 1000);
                }
            })
            .catch(function (error) {
            // handle error
            // console.log(error);
            setShowOverlay1(true);
            setTimeout(function() {
                setShowOverlay1(false);
            }, 1000);
            })
        }
        else{
            setShowOverlay1(true);
            setTimeout(function() {
                setShowOverlay1(false);
            }, 1000);
        }
    })
    .catch(function (error) {
    // handle error
    // console.log(error);
    setShowOverlay1(true);
    setTimeout(function() {
        setShowOverlay1(false);
    }, 1000);
    })
}

function handleSignUp(setShowOverlay2, handleShow3, setTooltip2, firstname, lastname, username, password, startyear, major, handleClose2){
    if(firstname === "" || lastname === "" || username === "" || password === "" || startyear === ""){
        setTooltip2("Invalid fields (e.g. empty)");
        setShowOverlay2(true);
        setTimeout(function() {
            setShowOverlay2(false);
        }, 1000);
        return;
    }

    const axios = require('axios');
    
    axios.post('https://ancient-ravine-23357.herokuapp.com/login',{username: username, password: password, firstName: firstname, lastName: lastname, start_year: startyear, major: major})
    .then(function (response1) {
        // handle success
        // console.log(response1.data);
        handleClose2();
        handleShow3();
    })
    .catch(function (error) {
        // handle error
        // console.log(error);
        setTooltip2("Username already in use");
        setShowOverlay2(true);
        setTimeout(function() {
            setShowOverlay2(false);
        }, 1000);
        return;
    })
}

export default Login;
