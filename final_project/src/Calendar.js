import "bootstrap/dist/css/bootstrap.css";
import Tab from "react-bootstrap/Tab";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import CourseInfo from "./CourseInfo";
import ClassReq from "./ClassReq";
import AllReqs from "./AllReqs";
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
// import axios from "axios";

const Calendar = ({semesters, show, setShow, showReqs, setReqs, showAllReqs, setAllReqs, classInfo, setClass, showClass, showClassReqs, showEveryReq, showAlert, setAlert, alertData, setAlertData, cur_user, setCurUser, sem_id}) => {
    // const classes = [{subject: 'CS', number: '173', hours: 3, label: 'Discrete Stuctures', avg_gpa: 3.42, semesters: [{sem_offered: 'Fall 2019', instructor: 'Margaret Fleck'}, {sem_offered: 'Spring 2019', instructor: 'John Schmidt'}], fulfilled_reqs: [], description: 'Discrete mathematical structures frequently encountered in the study of Computer Science. Sets, propositions, Boolean algebra, induction, recursion, relations, functions, and graphs. Credit is not given for both CS 173 and MATH 213. Prerequisite: One of CS 125, ECE 220; one of MATH 220, MATH 221.', schedule_info: 'Credit is not given for both CS 173 and MATH 213. Prerequisite: One of CS 125, ECE 220; one of MATH 220, MATH 221.', coreqs: [], constraints: []},
    //                  {subject: 'ECE', number: '374', hours: 4, label: 'Introduction To Algorithms and Models of Computation', avg_gpa: 2.76, semesters: [{sem_offered: 'Spring 2021', instructor: 'Jeff Erickson'}, {sem_offered: 'Fall 2019', instructor: 'Patrick Lin'}], fulfilled_reqs: [], description: 'Algs Broh. Discrete mathematical structures frequently encountered in the study of Computer Science. Sets, propositions, Boolean algebra, induction, recursion, relations, functions, and graphs. Credit is not given for both CS 173 and MATH 213. Prerequisite: One of CS 125, ECE 220; one of MATH 220, MATH 221.', schedule_info: 'Credit is not given for both CS 173 and MATH 213. Prerequisite: One of CS 125, ECE 220; one of MATH 220, MATH 221.', coreqs: [], constraints: []}];
 
    // const [classes, setClasses] = useState([{subject: 'CS', number: '374', hours: 4, avg_gpa: 0.01, label: 'Introduction to Algorithms & Models of Computation', semesters: [{sem_offered: 'Spring 2021', instructor: 'Chandra Chekuri'}, {sem_offered: 'Fall 2020', instructor: 'Jeff Erickson'}, {sem_offered: 'Winter 5 B.C.', instructor: 'Jesus Christ'}], description: 'Analysis of algorithms, major paradigms of algorithm design including recursive algorithms, divide-and-conquer algorithms, dynamic programming, greedy algorithms, and graph algorithms. Formal models of computation including finite automata and Turing machines. Limitations of computation arising from fundamental notions of algorithm and from complexity-theoretic constraints. Reductions, undecidability and NP-completeness.', schedule_info: 'Same as ECE 374. Prerequisite: One of CS 173, MATH 213; CS 225.'},
    //                                         {subject: 'ECE', number: '385', hours: 3},
    //                                         {subject: 'CS', number: '411', hours: 3},
    //                                         {subject: 'MUS', number: '130', hours: 3}
    // ]);
    // {subject: '', number: '', hours: 4, label: '', avg_gpa: 3.4, semesters: [{sem_offered: '', instructor: ''}], fulfilled_reqs: [], description: '', coreqs: [], constrains: []}
    // const requirements = ['Orientation and Professional Development', 'Foundational Mathematics and Science', 'Technical Core', 'Technical Electives', 'Electives'];

    // const [show, setShow] = useState(false);
    // const [showReqs, setReqs] = useState(false);
    // const [showAllReqs, setAllReqs] = useState(false);
    // const [classInfo, setClass] = useState({});


    //const [semesters, setSemesterResponse] = useState([]);
    const [classes, setClasses] = useState([]);

    const getYear = ['Freshman', 'Freshman', 'Sophomore', 'Sophomore', 'Junior', 'Junior', 'Senior', 'Senior'];

    // const getAllSemesters = () => {
    //     // axios.get('https://ancient-ravine-23357.herokuapp.com/semesters?where={"student_id":"'+cur_user.student_id+'"}')
    //     axios.get('https://ancient-ravine-23357.herokuapp.com/semesters?where={"student_id":"61ba21590c4eb039941eb313"}')
    //     .then((response) =>{
    //         let all = response.data.data;
    //         //setSemesterResponse(all);
    //         // setSemesterResponse(response.data.data);
    //     })
    //     .catch(error => console.error('call did not work'));
    // }

    // useEffect(()=> {
    //     getAllSemesters();
    //     return () => {
    //         //setSemesterResponse([]);
    //     };
    // }, []);

    const removeClass = (semester_id, className) => {
        const axios = require('axios');
        var idx = -1;
        for(var i = 0; i < semester_id.courses.length; i++){
            if(semester_id.courses[i].course_id === className._id){
                idx = i;
            }
        }

        if(idx > -1){
            semester_id.courses.splice(idx,1);
        }
        if(idx > -1){
            classes.splice(idx,1);
        }

        axios.put(`https://ancient-ravine-23357.herokuapp.com/semesters/${semester_id._id}`,{student_id: cur_user.student_id, term: semester_id.term, courses: semester_id.courses})
        .then(function (response) {
            // handle success
             console.log(response.data);
            axios.get(`https://ancient-ravine-23357.herokuapp.com/students/${cur_user.student_id}`)
            .then(function (response2) {
            // handle success
            // console.log(response2.data);
            cur_user.GPA = response2.data.data.gpa;
            cur_user.credits_earned = response2.data.data.total_credits;
            setCurUser(cur_user);
            })
            .catch(function (error) {
            // handle error
            // console.log(error);
            })
        })
        .catch(function (error) {
            // handle error
            // console.log(error);
        })
        setAlertData(['Remove Class', 'Successfully removed '+className.subject+' '+className.number+'!']);
        setAlert(true);
    }



    // const showClass = (className) => {
    //     setShow(true);
    //     setClass(className);
    // }

    // const showClassReqs = (className) => {
    //     setReqs(true);
    //     setClass(className);
    // }

    // const showEveryReq = () => {
    //     setAllReqs(true);
    // }

    return (
        <div style={{"marginRight":"-40%"}}>
            <br></br>
            <CourseInfo
                Course={classInfo}
                show={show}
                setShow={setShow}
            />
            <ClassReq
                Course={classInfo}
                show={showReqs}
                setShow={setReqs}
            />
            <AllReqs
                show={showAllReqs}
                setShow={setAllReqs}
                cur_user={cur_user}
            />
            <Row>
                <Col>
                    <Tab.Container>
                        <Row>
                            <Col sm={2}>
                                <Nav variant="pills" className="flex-column">
                                    {semesters.map((semester, index) => (
                                        <Nav.Item key={semester}>
                                            <Nav.Link onClick={e => handleCourses(semester, setClasses, sem_id)} eventKey={semester}>{getYear[index]+' Year '+semester}</Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </Col>
                            <Col sm={5}>
                                <Tab.Content id="show_classes">
                                    {semesters.map((semester, semIndex) => (
                                        <Tab.Pane eventKey={semester} key={semester}>
                                            <h2>{getYear[semIndex]+' Year '+semester}</h2>
                                                <Table id='semester_table'>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">
                                                                Class
                                                            </th>
                                                            <th scope="col">
                                                                Credit Hours
                                                            </th>
                                                            <th scope="col">
                                                                Grade Received
                                                            </th>
                                                            <th scope="col">
                                                                Course Info
                                                            </th>
                                                            <th scope="col">
                                                                Requirements Fulfilled
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {classes.map((className, classIndex) => (
                                                            <tr key={classIndex}>
                                                                <td>
                                                                    {className.subject+' '+className.number}
                                                                </td>
                                                                <td>
                                                                    {className.hours}
                                                                </td>
                                                                <td>
                                                                    {sem_id[semIndex].courses[classIndex] === undefined ? 'Not Taken' : (sem_id[semIndex].courses[classIndex].grade === 'NT' ? 'Not Taken' : (sem_id[semIndex].courses[classIndex].grade === 'IP' ? 'In Progress' : sem_id[semIndex].courses[classIndex].grade))}
                                                                </td>
                                                                <td>
                                                                    <button type="button" className="btn btn-outline-secondary" id="show_class" onClick={() => showClass(className)}>
                                                                        Show
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <button type="button" className="btn btn-outline-secondary" id="show_class" onClick={() => showClassReqs(className)}>
                                                                        Show
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <button type="button" className="btn btn-outline-secondary" id="remove_class" onClick={() => removeClass(sem_id[semIndex], className)}>
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                        </Tab.Pane>
                                    ))}
                                </Tab.Content>
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={showEveryReq}>
                                    Show All Degree Requirements
                                </Button>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Col>
            </Row>
        </div>
    )
};

function handleCourses(semester, setClasses, sem_id){
    const axios = require('axios');
    setClasses([]);
    for(var i = 0; i < sem_id.length; i++){
        if(semester === sem_id[i].term){
            for(var j = 0; j < sem_id[i].courses.length; j++){
                if(sem_id[i].courses[j].course_id === undefined)
                    continue;
                axios.get(`https://ancient-ravine-23357.herokuapp.com/courses/${sem_id[i].courses[j].course_id}`)
                .then(function (response) {
                // handle success
                // console.log(response.data);
                const res_data = response.data.data;
                    setClasses(oldarray => [...oldarray, res_data])
                })
                .catch(function (error) {
                // handle error
                // console.log(error);
                })
            }
        }
    }
}

export default Calendar;
