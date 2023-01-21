import React, { Component } from 'react';
import Joi from "joi";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import auth from "../services/authService";
import "react-toastify/dist/ReactToastify.css";

class LoginForm extends Component {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {}
  };

  schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] }
    }).label('Email').required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%&*]{5,30}$"))
      .label('Password').required(),
  });

  walkSchema = (name) =>{
    if (name === "email"){
      const skima = Joi.object({
        email: Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] }
        }).label('Email').required()
      });
      return skima;
    }
    else if (name==="password"){
      const skima = Joi.object({
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%&*]{5,30}$"))
          .label('Password').required()
        });
      return skima;
    }
  }
  validateInput = (name, input) => {
    const value = {[name]: input};
    const skima = this.walkSchema(name);
    const result = skima.validate(value);
    if (result.error) {
      return result.error.details[0].message;
    } else {
      return null;
    }
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };
    
    const errorMessage = this.validateInput(name, value);
    if (errorMessage) {
      errors[name] = errorMessage;
    } else {
      delete errors[name];
    }
    data[name] = value;
    this.setState({ data, errors });
  };

  validateForm = () => {
    const errors = { ...this.state.errors };
    const options = {abortEarly: false};

    const result = this.schema.validate(this.state.data, options);
    if (!result.error) return null;
    if (result.error) {
      for (let num = 0; num < result.error.details.length; num++) {
        errors[result.error.details[num].path[0]] = 
          result.error.details[num].message
      }
      return errors;
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validateForm();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
    setTimeout(() => window.location = "/", 1111);
  };
  doSubmit = async () => {
    try {
      await auth.loginUser(this.state.data);
    } catch (error) {
      toast.error(error);
      this.setState({ errors: {signIn: error} });
    }
  }

  render() {
    const { errors } = this.state;
    const { email, password } = this.state.data;
    return (
      <div className="mx-5">
        <h1 className="text-center"> Login Vidly </h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="alert alert-danger">{errors.email}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              placeholder="Enter your password"
            />
            {errors.password ? (
              <div className="alert alert-danger">{errors.password}</div>
            ) : (
              <Form.Text className="text-muted">
                Your password must include special characters and digits 0-9.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>

          <Button
            className="my-3"
            type="submit"
            variant="primary"
            disabled={this.validateForm()}
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default LoginForm;
