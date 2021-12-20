import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import SearchResults from './SearchResults';
import Advanced from './Advanced';

const Search = ({isSearch, setSearch, showClass, showClassReqs, showEveryReq, semester, setSemester, showAlert, setAlert, alertData, setAlertData, allCourses, setAllCourses, cur_user, setCurUser, sem_id}) => {
    const [showRes, setShowRes] = useState(false);
    const [subjectSearch, setSubject] = useState('');
    const [numberSearch, setNumber] = useState('');
    const [showAdvanced, setAdvanced] = useState(false);
    const [filters, setFilters] = useState({minNum: 100, maxNum: 599, minGPA: 0.0, maxGPA: 4.0,
        filterGenEd: false, humanities: false, social: false, libed: false,
        filterCultural: false, western: false, nonwestern: false, usmin: false, filterAdvComp: false}
    );

    if(!isSearch)
        return (<div></div>);

        const getYear = ['Freshman', 'Freshman', 'Sophomore', 'Sophomore', 'Junior', 'Junior', 'Senior', 'Senior'];

    const startSearch = () => {
        var courseSubject = document.getElementById("subjectSearch");
        var courseNumber = document.getElementById("numberSearch");
        if(courseSubject === undefined || courseSubject === null || courseNumber === undefined || courseNumber === null) {
            setShowRes(false);
            return;
        }
        setSubject(courseSubject.value);
        setNumber(courseNumber.value);
        setShowRes(true);
    }

    const selectSemester = () => { setSearch(false); }

    const openAdvanced = () => { setAdvanced(true); }

    const handleKeyPress = (e) => { if(e.key === 'Enter') startSearch(); }

    return (
        <div>
            <Advanced
                show={showAdvanced}
                setShow={setAdvanced}
                startSearch={startSearch}
                filters={filters}
                setFilters={setFilters}
            />
            <br></br>
            <h3 style={{"textAlign":"center"}}>
                Add Courses
            </h3>
            <div style={{"textAlign":"right"}}>
                <Button variant="outline-primary" onClick={selectSemester}>
                    Select Different Semester
                </Button>
            </div>
            <div style={{"textAlign":"center"}}>
                <Form>
                    <h5>
                        Search Courses To Add To {getYear[semester]+' Year '+sem_id[semester].term}
                    </h5>
                </Form>
                <Row>
                    <div id="search_bar">
                        <Col sm={3} style={{"padding":"5px"}}>
                            <Form.Control type="text" placeholder="Course Subject (e.g. ECE)" id="subjectSearch" onKeyDown={handleKeyPress} />
                        </Col>
                        <Col sm={3} style={{"padding":"5px"}}>
                            <Form.Control type="text" placeholder="Course Number (e.g. 391)" id="numberSearch" onKeyDown={handleKeyPress} />
                        </Col>
                    </div>
                </Row>
                <Row>
                    <div id="search_bar" style={{"padding":"5px"}}>
                        <div style={{"padding":"5px"}}>
                        <Col sm={1.6}>
                            <Button onClick={startSearch}>
                                Search
                            </Button>
                        </Col>
                        </div>
                        <div style={{"padding":"5px"}}>
                        <Col sm={1.6}>
                            <Button variant="outline-secondary" onClick={openAdvanced} style={{"color":"lightgray", "border-color":"gray"}}>
                                Advanced
                            </Button>
                        </Col>
                        </div>
                    </div>
                </Row>
            </div>
            <SearchResults
                show={showRes}
                setShow={setShowRes}
                subjectQuery={subjectSearch.trim().toUpperCase()}
                numberQuery={numberSearch.trim().toUpperCase()}
                showClass={showClass}
                showClassReqs={showClassReqs}
                showEveryReq={showEveryReq}
                showAlert={showAlert}
                setAlert={setAlert}
                alertData={alertData}
                setAlertData={setAlertData}
                allCourses={allCourses}
                setAllCourses={setAllCourses}
                filters={filters}
                cur_user={cur_user}
                setCurUser={setCurUser}
                sem_id={sem_id}
                semester={semester}
            />
        </div>
    );
}

export default Search;
