import './App.css';
import Calendar from "./Calendar";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Login from "./login"
import Profile from './Profile';
import { useState } from 'react';
import Alert from './Alert';
import Search from './Search';
import AddCourses from './AddCourses';
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-dark/src/bootstrap-dark.css";

document.title = "UIUC Course Planner";

function App() {
  const [logged, setLog] = useState(false);
  const [selectedSem, setSelectedSem] = useState(0);
  const [cur_user, setCurUser] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [isInitialized, setInitialized] = useState(false);
  const API_URL = 'https://ancient-ravine-23357.herokuapp.com';

  const [semesters, setSemesters] = useState(['Freshman Year Fall', 'Freshman Year Spring', 'Sophomore Year Fall', 'Sophomore Year Spring',
  'Junior Year Fall', 'Junior Year Spring', 'Senior Year Fall', 'Senior Year Spring']);

  const [sem_id, setSem_id] = useState([]);

  if(!isInitialized) {
    axios.get(API_URL+'/courses').then((response) => { setAllCourses(response.data.data) });
    setInitialized(true);
  }

  const [isSearch, setSearch] = useState(false);
  const [show, setShow] = useState(false);
  const [showReqs, setReqs] = useState(false);
  const [showAllReqs, setAllReqs] = useState(false);
  const [classInfo, setClass] = useState({});
  const [showAlert, setAlert] = useState(false);
  const [alertData, setAlertData] = useState(['', '']);

  const logout = () => {
    setCurUser({});
    setLog(false);
    setAlertData(['Log Out', 'Successfully logged out!']);
    setAlert(true);
  }

  const showClass = (className) => {
    setShow(true);
    setClass(className);
  }

  const showClassReqs = (className) => {
    setReqs(true);
    setClass(className);
  }

  const showEveryReq = () => { setAllReqs(true); }

  if(logged){
    return (
      <div className="App">
          <Alert
            alert={alertData[0]}
            description={alertData[1]}
            show={showAlert}
            setShow={setAlert}
          />
          <Row style={{"padding":"10px"}}>
            <Col id="tabs" sm={11}>
              <Tabs defaultActiveKey="profile" fill justify>
                <Tab eventKey="calendar" title="Calendar">
                  <Calendar
                    semesters={semesters}
                    show={show}
                    setShow={setShow}
                    showReqs={showReqs}
                    setReqs={setReqs}
                    showAllReqs={showAllReqs}
                    setAllReqs={setAllReqs}
                    classInfo={classInfo}
                    setClass={setClass}
                    showClass={showClass}
                    showClassReqs={showClassReqs}
                    showEveryReq={showEveryReq}
                    showAlert={showAlert}
                    setAlert={setAlert}
                    alertData={alertData}
                    setAlertData={setAlertData}
                    cur_user={cur_user}
                    setCurUser={setCurUser}
                    sem_id={sem_id}
                  />
                </Tab>
                <Tab eventKey="add courses" title="Add Courses">
                  <div>
                    <AddCourses
                      isSearch={isSearch}
                      setSearch={setSearch}
                      semesters={semesters}
                      semester={selectedSem}
                      setSemester={setSelectedSem}
                      sem_id={sem_id}
                    />
                    <Search
                      isSearch={isSearch}
                      setSearch={setSearch}
                      showClass={showClass}
                      showClassReqs={showClassReqs}
                      showEveryReq={showEveryReq}
                      semester={selectedSem}
                      setSemester={setSelectedSem}
                      showAlert={showAlert}
                      setAlert={setAlert}
                      alertData={alertData}
                      setAlertData={setAlertData}
                      allCourses={allCourses}
                      setAllCourses={setAllCourses}
                      cur_user={cur_user}
                      setCurUser={setCurUser}
                      sem_id={sem_id}
                    />
                  </div>
                </Tab>
                <Tab eventKey="profile" title="Profile">
                  <Profile
                    cur_user={cur_user}
                    setCurUser={setCurUser}
                    showAlert={showAlert}
                    setAlert={setAlert}
                    alertData={alertData}
                    setAlertData={setAlertData}
                  />
                </Tab>
              </Tabs>
            </Col>
            <Col id="logout" sm={1}>
              <Button variant="primary" id="logout" onClick={logout}>
                Logout
              </Button>
            </Col>
          </Row>
      </div>
    );
  }
  else{
    return (
      <div className="App">
          <Alert
            alert={alertData[0]}
            description={alertData[1]}
            show={showAlert}
            setShow={setAlert}
          />
          <Login
            setLog={setLog}
            setCurUser={setCurUser}
            setSemesters={setSemesters}
            setSem_id={setSem_id}
          />
      </div>
    );
  }
}

export default App;
