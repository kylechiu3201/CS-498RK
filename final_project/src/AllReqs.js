import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import async from 'async';
import axios from 'axios';
import './AllReqs.css';

import { useState } from 'react';

const req_check_map = {
    FMS: ['MATH 221', 'MATH 231', 'MATH 241', 'MATH 257', 'MATH 416', 'MATH 285', 'PHYS 211', 'PHYS 212', 'PHYS 213', 'PHYS 214'],
    CETC: ['ECE 110', 'ECE 120', 'ECE 210', 'ECE 220', 'CS 173', 'CS 225', 'ECE 313', 'ECE 374', 'ECE 385', 'ECE 391'],
    CETech: 9,
    EEF: ['ECE 310', 'ECE 330', 'ECE 329', 'ECE 340', 'ECE 461', 'ECE 486'],
    ADVC: ['CS 357', 'CS 411', 'CS 412', 'CS 414', 'CS 418', 'CS 419', 'CS 420', 'CS 421', 'CS 423', 'CS 424', 'CS 425', 'CS 426', 'CS 431', 'CS 436', 'CS 438', 'CS 440', 'CS 441', 'CS 446', 'CS 450', 'CS 461', 'CS 475', 'CS 476', 'CS 477', 'CS 483', 'ECE 408', 'ECE 411', 'ECE 412', 'ECE 419', 'ECE 422', 'ECE 424', 'ECE 425', 'ECE 428', 'ECE 435', 'ECE 438', 'ECE 439', 'ECE 448', 'ECE 462', 'ECE 470', 'ECE 478', 'ECE 484', 'ECE 491', 'ECE 492'],
    DES: ['ECE 411', 'ECE 445', 'ECE 496'],
    ACP: 1,
    Cult: {
        NW: 1,
        WCC: 1,
        US: 1,
    },
    HUM: 2,
    NST: 2,
    QR: {
        QR1: 1,
        QR2: 1
    },
    SBS: 2
};

function check_sets(al, bl) {
    let as = new Set(al);
    let bs = new Set(bl);
    if (as.size !== bs.size) return false;
    for (let a of as) {
        if (!bs.has(a)) {
            return false;
        }
    }
    return true;
}

function check_fulfilled(req_data) {
    let temp = { ...req_data }
    temp.FMS = !check_sets(req_data.FMS.map(ele => ele.course_id), req_check_map.FMS) ? false : true;
    temp.CETC = !check_sets(req_data.CETC.map(ele => ele.course_id), req_check_map.CETC) ? false : true;
    temp.CETech = req_data.CETech.length < req_check_map.CETech ? false : true;
    temp.EEF = !check_sets(req_data.EEF.map(ele => ele.course_id), req_check_map.EEF) ? false : true;
    temp.ADVC = !check_sets(req_data.ADVC.map(ele => ele.course_id), req_check_map.ADVC) ? false : true;
    temp.DES = !check_sets(req_data.DES.map(ele => ele.course_id), req_check_map.DES) ? false : true;
    temp.ACP = req_data.ACP.length < req_check_map.ACP ? false : true;
    let nw = req_data.Cult.NW.length < req_check_map.Cult.NW ? false : true;
    let wcc = req_data.Cult.WCC.length < req_check_map.Cult.WCC ? false : true;
    let us = req_data.Cult.US.length < req_check_map.Cult.US ? false : true;
    temp.Cult = nw && wcc && us;
    temp.HUM = req_data.HUM.length < req_check_map.HUM ? false : true;
    temp.NST = req_data.NST.length < req_check_map.NST ? false : true;
    let qr1 = req_data.QR.QR1.length;
    let qr2 = req_data.QR.QR2.length;
    temp.QR = qr1 > 2 || (qr1 > 1 && qr2 > 1) ? true : false;
    temp.SBS = req_data.SBS.length < req_check_map.SBS ? false : true;
    return temp;
}

function fill_reqs(req_data, curr_reqs) {
    let temp = { ...req_data }
    temp.FMS = curr_reqs.FMS;
    temp.CETC = curr_reqs.CETC;
    temp.CETech = curr_reqs.CETech;
    temp.EEF = curr_reqs.EEF;
    temp.ADVC = curr_reqs.ADVC;
    temp.DES = curr_reqs.DES;
    temp.ACP = curr_reqs.ACP;
    temp.Cult.NW = curr_reqs.NW;
    temp.Cult.WCC = curr_reqs.WCC;
    temp.Cult.US = curr_reqs.US;
    temp.HUM = [...curr_reqs.HP, ...curr_reqs.LA];
    temp.NST = [...curr_reqs.PS, ...curr_reqs.LS];
    temp.QR.QR1 = curr_reqs.QR1;
    temp.QR.QR2 = curr_reqs.QR2;
    temp.SBS = [...curr_reqs.BS, ...curr_reqs.SS];
    return temp;
}

function render_sub_req(req) {
    let rows = [];
    let arr = Object.keys(req);
    for (let i = 0; i < arr.length; i++) {
        let key = arr[i];
        let s_rq = req[key];
        rows.push(<tr class='sub-req'>
            <th></th>
            <th scope="row">{key}</th>
            </tr>);
        for (let j = 0; j < s_rq.length; j++) {
            let ele = s_rq[j];
            rows.push(<tr class='course-row'>
                <td></td>
                <td>{ele.course_id}</td>
                <td>{ele.grade}</td>
            </tr>)
        }
    }
    return rows;
}

function render_req(req) {
    return req.map(ele => {
        console.log(ele);
        return <tr class='course-row'>
            <td></td>
            <td>{ele.course_id}</td>
            <td>{ele.grade}</td>
        </tr>
    })
}

const AllReqs = ({ fulfilled, show, setShow, cur_user }) => {
    const handleClose = () => setShow(false);
    // if(fulfilled === undefined || fulfilled.fulfilled_reqs === undefined)
    //     fulfilled = {semesters: [], fulfilled_reqs: []};


    const [reqs, setReqs] = useState(null);

    let req_data = {
        FMS: [],
        CETC: [],
        CETech: [],
        EEF: [],
        ADVC: [],
        DES: [],
        ACP: [],
        Cult: {
            NW: [],
            WCC: [],
            US: [],
        },
        HUM: [],
        NST: [],
        QR: {
            QR1: [],
            QR2: []
        },
        SBS: []
    };

    if (reqs) {
        req_data = {...req_data, ...fill_reqs(req_data, reqs)};
        let has_fulfilled = check_fulfilled(req_data);
        return (
            <div>
                <Modal show={show} onHide={handleClose} onShow={e => handleReqs(cur_user, setReqs)}>
                    <Modal.Header closeButton>
                        <Modal.Title>All Degree Requirements</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table id="info_data">
                            <thead>
                                <tr>
                                    <th>Fulfilled</th>
                                    <th>Course Name</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="main-req">
                                    <div class={"fufilled " + has_fulfilled.ACP}>
                                        {has_fulfilled.ACP ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope="row">Advanced Composition</th>
                                </tr>
                                {render_req(req_data.ACP)}
                                <tr class="main-req">
                                    <div class={"fufilled " + has_fulfilled.Cult}>
                                        {has_fulfilled.Cult ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope="row">Cultural Studies</th>
                                </tr>
                                {render_sub_req(req_data.Cult)}
                                <tr class="main-req">
                                    <div class={"fufilled " + has_fulfilled.HUM}>
                                        {has_fulfilled.HUM ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope="row">Humanities and Arts</th>
                                </tr>
                                {render_req(req_data.HUM)}
                                <tr class="main-req">
                                    <div class={"fufilled " + has_fulfilled.NST}>
                                        {has_fulfilled.NST ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope="row">Natural Sciences and Technology</th>
                                </tr>
                                {render_req(req_data.NST)}
                                <tr class="main-req">
                                    <div class={"fufilled " + has_fulfilled.QR}>
                                        {has_fulfilled.QR ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope="row">Quantitative Reasoning</th>
                                </tr>
                                {render_sub_req(req_data.QR)}
                                <tr class="main-req">
                                    <div class={"fufilled " + has_fulfilled.SBS}>
                                        {has_fulfilled.SBS ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope="row">Social and Behavioral Sciences</th>
                                </tr>
                                {render_req(req_data.SBS)}
                                <tr class='main-req'>
                                    <div class={"fufilled " + has_fulfilled.FMS}>
                                        {has_fulfilled.FMS ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope='row'>Foundational Math and Science</th>
                                </tr>
                                {render_req(req_data.FMS)}
                                <tr class='main-req'>
                                    <div class={"fufilled " + has_fulfilled.CETC}>
                                        {has_fulfilled.CETC ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope='row'>Computer Engineering Technical Core</th>
                                </tr>
                                {render_req(req_data.CETC)}
                                <tr class='main-req'>
                                    <div class={"fufilled " + has_fulfilled.CETech}>
                                        {has_fulfilled.CETech ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope='row'>Technical Electives</th>
                                </tr>
                                {render_req(req_data.CETech)}
                                <tr class='main-req'>
                                    <div class={"fufilled " + has_fulfilled.EEF}>
                                        {has_fulfilled.EEF ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope='row'>Electrical Engineering Foundations</th>
                                </tr>
                                {render_req(req_data.EEF)}
                                <tr class='main-req'>
                                    <div class={"fufilled " + has_fulfilled.ADVC}>
                                        {has_fulfilled.ADVC ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope='row'>Advanced Computing Electives</th>
                                </tr>
                                {render_req(req_data.ADVC)}
                                <tr class='main-req'>
                                    <div class={"fufilled " + has_fulfilled.DES}>
                                        {has_fulfilled.DES ? <h1>O</h1> : <h1>X</h1>}
                                    </div>
                                    <th scope='row'>Design Elective</th>
                                </tr>
                                {render_req(req_data.DES)}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    } else {
        return (
            <div>
                <Modal show={show} onHide={handleClose} onShow={e => handleReqs(cur_user, setReqs)}>
                    <Modal.Header closeButton>
                        <Modal.Title>All Degree Requirements</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h1>Loading...</h1>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

function handleReqs(cur_user, setReqs) {
    //console.log(cur_user.major);

    axios.put('https://ancient-ravine-23357.herokuapp.com/students/requirements', { plan: cur_user.plan })
        .then(function (response) {
            // handle success
            console.log(response.data.data);
            let res = response.data.data;
            async.forEach(res, (req, callback) => {
                async.map(req, (course_data, callback1) => {
                    axios.get('https://ancient-ravine-23357.herokuapp.com/courses/' + course_data.course_id).then(
                        (resp) => {
                            course_data.course_id = resp.data.data.name;
                            callback1();
                        }
                    )
                }, err => {
                    callback();
                })
            }, err => {
                console.log(res);
                setReqs(res);
            });
            // setReqs(response.data.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

export default AllReqs;