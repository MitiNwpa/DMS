import React, { Component } from 'react';
import FormError from './FormError';
import firebase from './Firebase';


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: '',
      lName:'',
      email: '',
      phone: '',
      company: '',
      jobtitle: '',
      passOne: '',
      passTwo: '',
      uid: '',
      errorMessage: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue }, () => {
      if (this.state.passOne !== this.state.passTwo) {
        this.setState({ errorMessage: 'Passwords no not match' });
      } else {
        this.setState({ errorMessage: null });
      }
    });
  }

  handleSubmit(e) {
    var registrationInfo = {
      fName: this.state.fName,
      lName: this.state.lName,
      email: this.state.email,
      phone: this.state.phone,
      company: this.state.company,
      jobtitle: this.state.jobtitle,
      password: this.state.passOne
    };
    e.preventDefault();
    

    firebase
      .auth()
      .createUserWithEmailAndPassword(
        registrationInfo.email,
        registrationInfo.password
      )
      .then((user) => {
        // pass on first name to App.js
        this.props.registerUser(registrationInfo.fName);

        // get user from firebase.auth.UserCredential
        const authUser = user.user
        console.log(authUser.email)
        console.log(authUser.uid)
        
        // get information from registration inputs
        const userid = authUser.uid;
        const newuser = {
          fname: registrationInfo.fName,
          lname: registrationInfo.lName,
          email: registrationInfo.email,
          phone: registrationInfo.phone,
          company: registrationInfo.company,
          jobtitle: registrationInfo.jobtitle
        }

        // check if the collection exists 
        // if (firebase.firestore().collection('user').doc('uid').get().then(doc => {
        // }) {
        // } else {
        //   firebase.firestore().collection('user').doc(userid).set(newuser);
        // }

        // write user data to firestore
          firebase.firestore().collection('user').doc(userid).set(newuser);
      })
      .catch(error => {
        if (error.message !== null) {
          this.setState({ errorMessage: error.message });
        } else {
          this.setState({ errorMessage: null });
        }
      });
  }

  render() {
    return (
      <form className="mt-3" onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="font-weight-light mb-3">Register</h3>
                  <div className="form-row">
                    {this.state.errorMessage !== null ? (
                      <FormError
                        theMessage={this.state.errorMessage}
                      />
                    ) : null}
                    <section className="col-sm-12 form-group">
                      <label
                        className="form-control-label sr-only"
                        htmlFor="fName"
                      >
                        First Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="fName"
                        id="fName"
                        placeholder="First Name"
                        required
                        value={this.state.fName}
                        onChange={this.handleChange}
                      />
                    </section>
                    <section className="col-sm-12 form-group">
                      <label
                        className="form-control-label sr-only"
                        htmlFor="lName"
                      >
                        Last Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="lName"
                        placeholder="Last Name"
                        name="lName"
                        required
                        value={this.state.lName}
                        onChange={this.handleChange}
                      />
                    </section>
                  </div>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                      placeholder="Email Address"
                      required
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </section>
                  <div className="form-row"></div>
                    <section className="form-group">
                      <input
                        className="form-control"
                        type="password"
                        name="passOne"
                        placeholder="Password"
                        value={this.state.passOne}
                        onChange={this.handleChange}
                      />
                    </section>
                    <section>
                      <input
                        className="form-control"
                        type="password"
                        required
                        name="passTwo"
                        placeholder="Repeat Password"
                        value={this.state.passTwo}
                        onChange={this.handleChange}
                      />
                    </section>
                    <section>
                      <input
                        className="form-control"
                        type="phone"
                        required
                        name="phone"
                        placeholder="Phone Number"
                        value={this.state.phone}
                        onChange={this.handleChange}
                      />
                    </section>
                    <section>
                      <select 
                        className="form-control"
                        type="company"
                        required
                        defaultValue = '' 
                        onChange={(e) => this.setState({company: e.target.value})}>
                        <option name=""> </option>
                        <option name="cndd"> CNDD</option>
                        <option name="cycon">CYCON</option>
                      </select>
                      {/* <input
                        className="form-control"
                        type="company"
                        required
                        name="company"
                        placeholder="Company Name"
                        value={this.state.company}
                        onChange={this.handleChange}
                      /> */}
                    </section>
                    <section>
                      <input
                        className="form-control"
                        type="jobtitle"
                        required
                        name="jobtitle"
                        placeholder="Job Title"
                        value={this.state.jobtitle}
                        onChange={this.handleChange}
                      />
                    </section>
                  </div>
{/*                   
                  <div className="form-row">
                    <section className="col-sm-6 form-group">
                      <input
                        className="form-control"
                        type="password"
                        name="passOne"
                        placeholder="Password"
                        value={this.state.passOne}
                        onChange={this.handleChange}
                      />
                    </section>
                    <section className="col-sm-6 form-group">
                      <input
                        className="form-control"
                        type="password"
                        required
                        name="passTwo"
                        placeholder="Repeat Password"
                        value={this.state.passTwo}
                        onChange={this.handleChange}
                      />
                    </section>
                  </div> */}
                  
                  <div className="form-group text-right mb-0">
                    <button className="btn btn-primary" type="submit">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </form>
    );
  }
}

export default Register;
