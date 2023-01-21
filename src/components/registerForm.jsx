import React, { Component } from "react";
import { toast } from "react-toastify";
import Joi from "joi";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { registerUser } from "../services/usersService";
import "react-toastify/dist/ReactToastify.css";

class RegisterForm extends Component {
  state = {
    data: {
      username: "",
      email: "",
      passwordCrt: "",
      passwordCnfm: "",
      password: "",
    },
    errors: {}
  };
  schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .label("Username")
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .label("Email")
      .required(),
    passwordCrt: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%&*]{5,30}$"))
      .label("Password")
      .required(),
    passwordCnfm: Joi.ref("passwordCrt"),
  });

  walkSchema = (name) => {
    if (name === "username") {
      const skima = Joi.object({
        username: Joi.string()
          .alphanum()
          .min(5)
          .max(30)
          .label("Username")
          .required(),
      });
      return skima;
    } else if (name === "email") {
      const skima = Joi.object({
        email: Joi.string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
          })
          .label("Email")
          .required(),
      });
      return skima;
    } else if (name === "passwordCrt" || name === "passwordCnfm") {
      const skima = Joi.object({
        [name]: Joi.string()
          .pattern(new RegExp("^[a-zA-Z0-9!@#$%&*]{5,30}$"))
          .label(name)
          .required(),
      });
      return skima;
    }
  };

  validateInput = (name, input) => {
    const value = { [name]: input };
    const skima = this.walkSchema(name);
    const results = skima.validate(value);
    if (results.error) {
      return results.error.details[0].message;
    } else {
      return null;
    }
  };
  handleChange = (e) => {
    const { name, value: input } = e.target;
    const newAccount = { ...this.state.data };
    const errors = { ...this.state.errors };
    const errorMessage = this.validateInput(name, input);
    if (errorMessage) {
      errors[name] = errorMessage;
    }
    if (!errorMessage) {
      delete errors[name];
    }
    newAccount[name] = input;
    this.setState({ data: newAccount, errors });
  };

  validateForm = () => {
    const newAccount = { ...this.state.data };
    delete newAccount.password;
    const errors = { ...this.state.errors };
    const options = { abortEarly: false };
    const results = this.schema.validate(newAccount, options);
    if (!results.error) return null;
    if (results.error) {
      for (let num = 0; num < results.error.details.length; num++) {
        errors[results.error.details[num].path[0]] =
          results.error.details[num].message;
      }
      return errors;
    }
  };

  checkPassMatch = () => {
    const { passwordCrt, passwordCnfm } = this.state.data;
    const newAccount = { ...this.state.data };
    if (passwordCrt === passwordCnfm) {
      newAccount.password = passwordCnfm;
      this.setState({ data: newAccount }, () => {
        this.doSubmit();
      });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validateForm();
    this.setState({ errors: errors || {} });
    this.checkPassMatch();
    setTimeout(() => window.location = "/", 1111);
  };
  doSubmit = () => {
    const { username, email, password } = this.state.data;
    const userObj = {
      name: username,
      email: email,
      password: password,
    };
    if (password !== "") {
      try {
        registerUser(userObj);
      } catch (error) {
        toast.error(error);
        this.setState({ errors: { registration: error } });
      }
    }
  };

  render() {
    const { data, errors } = this.state;
    return (
      <div className="mx-5">
        <h1 className="text-center"> Sign-Up for Vidly </h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={data.username}
              onChange={this.handleChange}
            />
            {errors.username && (
              <div className="alert alert-danger">{errors.username}</div>
            )}
          </Form.Group>

          <Form.Group className="my-3" controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={data.email}
              onChange={this.handleChange}
            />
            {errors.email ? (
              <div className="alert alert-danger">{errors.email}</div>
            ) : (
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            )}
          </Form.Group>

          <Row>
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3" controlId="formBasicPassword1">
                <Form.Label>Create Password</Form.Label>
                <Form.Control
                  type="password"
                  name="passwordCrt"
                  value={data.passwordCrt}
                  onChange={this.handleChange}
                />
                {errors.passwordCrt && (
                  <div className="alert alert-danger">{errors.passwordCrt}</div>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3" controlId="formBasicPassword2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="passwordCnfm"
                  value={data.passwordCnfm}
                  onChange={this.handleChange}
                />
                {errors.passwordCnfm && (
                  <div className="alert alert-danger">
                    {errors.passwordCnfm}
                  </div>
                )}
              </Form.Group>
            </Col>
            {data.password ? (
              <div className="alert alert-success">
                Password match confirmed!
              </div>
            ) : (
              <Form.Text className="text-muted mb-3 mt-n1">
                Your password must include special characters and digits 0-9.
              </Form.Text>
            )}
          </Row>

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

export default RegisterForm;
