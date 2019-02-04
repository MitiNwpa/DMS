// Import React
import React, { Component } from 'react';
import { Router, navigate } from '@reach/router';
import firebase from './Firebase';

import Home from './Home';
import Welcome from './Welcome';
import Navigation from './Navigation';
import Login from './Login';
import Register from './Register';
import Meetings from './Meetings';
import CheckIn from './CheckIn';
import Attendees from './Attendees';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      displayName: null,
      userID: null
    };
  }
  

  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {
      if (FBUser) {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });

        const meetingsRef = firebase
          .firestore()
          .collection('meetings')
          .doc(FBUser.uid)
          .collection('meetingDetail')
          
        var meetingList = []
        meetingsRef
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            
            //meetingList is an array of object. use function Array.prototype.find 

            if (typeof meetingList === 'object'){
              if (!meetingList.find(x => x.meetingID === doc.id)){
              meetingList.push({
                meetingID: doc.id, 
                meetingName: doc.get('meetingName')
              })
            }
                 
            };

            // DON'T WORK!!!!!!!

            // if (Object.values(meetingList).indexOf(doc.id) < 0){
              //   // console.log(doc.id)
              //   console.log(typeof meetingList)
              //   meetingList.push({
              //     meetingID: doc.id, 
              //     meetingName: doc.get('meetingName')
              //   })
              // }           

            // if (typeof meetingList === 'array') {
            //   meetingList.push({
            //     meetingID: doc.id, 
            //     meetingName: doc.get('meetingName')
            //   })
            // }
    

            this.setState({
              meetings: meetingList,
              howManyMeetings: meetingList.length
            });
          console.log('reset state');

          });
        }
      

      )} else {
        this.setState({ user: null });
      }
    });
  }

  registerUser = userName => {
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName
      }).then(() => {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });
        navigate('/meetings');
      });
    });
  };

  logOutUser = e => {
    e.preventDefault();
    this.setState({
      displayName: null,
      userID: null,
      user: null
    });

    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/login');
      });
  };

  addMeeting = meetingName => {
    const ref = firebase
      .firestore()
      .collection('meetings')
      .doc(`${this.state.user.uid}`)
      .collection('meetingDetail')
    
      ref.add({ meetingName: meetingName });
  };


  render() {
    return (
      <div>
        <Navigation
          user={this.state.user}
          logOutUser={this.logOutUser}
        />
        {this.state.user && (
          <Welcome
            userName={this.state.displayName}
            logOutUser={this.logOutUser}
          />
        )}

        <Router>
          <Home path="/" user={this.state.user} />
          <Login path="/login" />
          <Meetings
            path="/meetings"
            meetings={this.state.meetings}
            addMeeting={this.addMeeting}
            userID={this.state.userID}
          />
          <Attendees
            path="/attendees/:userID/:meetingID"
            adminUser={this.state.userID}
          />
          <CheckIn path="/checkin/:userID/:meetingID" />
          <Register
            path="/register"
            registerUser={this.registerUser}
          />
        </Router>
      </div>
    );
  }
}

export default App;