import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { getGenres } from "../services/genreService";
import { saveMovie } from "../services/movieService";
import Joi from "joi";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class MovieForm extends Component {
  state = {
    movie: {},
    errors: {},
    genres: [],
    navigateBtn: false,
  };

  async componentDidMount() {
    try {
      const allGenres = await getGenres();
      this.setState({ genres: allGenres.data });
    } catch (error) {
      this.navigate(error);
    }
  }

  navigate(error) {
    // This code below, should return the user to "/movies" route.
    console.log('Navigate back to="/movies" route... check');
    toast.error(error.response.data);
    this.setState({ btnClicked: true });
  }

  schema = Joi.object({
    title: Joi.string().min(5).max(15).label("Title").required(),
    genre: Joi.string().min(3).max(15).label("Genre").required(),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .label("NumberInStock")
      .required(),
    dailyRentalRate: Joi.number()
      .integer()
      .min(0)
      .max(10)
      .label("DailyRentalRate")
      .required(),
  });

  walkSchema = (name) => {
    if (name === "title") {
      const skima = Joi.object({
        title: Joi.string().min(5).max(15).label("Title").required(),
      });
      return skima;
    } else if (name === "genre") {
      const skima = Joi.object({
        genre: Joi.string().min(3).max(15).label("Genre").required(),
      });
      return skima;
    } else if (name === "numberInStock") {
      const skima = Joi.object({
        numberInStock: Joi.number()
          .integer()
          .min(0)
          .max(100)
          .label("NumberInStock")
          .required(),
      });
      return skima;
    } else if (name === "dailyRentalRate") {
      const skima = Joi.object({
        dailyRentalRate: Joi.number()
          .integer()
          .min(0)
          .max(10)
          .label("DailyRentalRate")
          .required(),
      });
      return skima;
    }
  };

  createMovie = () => {
    const { movie, genres } = this.state;
    const filteredGenre = genres.filter((g) => g.name === movie.genre);
    const genreID = filteredGenre[0]._id;
    const movieObj = {
      title: movie.title,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
      genreId: genreID,
    };
    try {
      saveMovie(movieObj);
    } catch (error) {
      this.navigate(error);
    }
  };

  saveMethod = () => {
    this.createMovie();
    this.setState({ btnClicked: true });
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
    const { movie, errors } = this.state;
    const movieReplica = { ...movie };
    const handleChangeErrors = { ...errors };

    const errorMessage = this.validateInput(name, input);
    if (errorMessage) {
      handleChangeErrors[name] = errorMessage;
    }
    if (!errorMessage) {
      delete handleChangeErrors[name];
    }
    movieReplica[name] = input;
    this.setState({
      movie: movieReplica,
      errors: handleChangeErrors,
    });
  };

  validateForm = () => {
    const { movie, errors } = this.state;
    const validateFormErrors = { ...errors };
    const options = { abortEarly: false };

    const results = this.schema.validate(movie, options);
    if (!results.error) return null;
    if (results.error) {
      for (let num = 0; num < results.error.details.length; num++) {
        validateFormErrors[results.error.details[num].path[0]] =
          results.error.details[num].message;
      }
      return validateFormErrors;
    }
  };
  // NOT INVOKED
  handleSubmit = (e) => {
    e.preventDefault();
    const handleSubmitErrors = this.validateForm();
    console.log("handleSubmitErrors", handleSubmitErrors);
    this.setState({ errors: handleSubmitErrors || {} });
    if (handleSubmitErrors) return;
    this.doSubmit();
  };
  doSubmit = () => {
    // Call Server
    console.log("Form Submitted!");
  };

  render() {
    const { errors, genres, navigateBtn } = this.state;
    return (
      <div className="mx-5">
        <h1 className="text-center">Movie Form</h1>
        {/* NOT INVOKED */}
        <Form onSubmit={this.handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  onChange={(event) => this.handleChange(event)}
                />
                {errors.title && (
                  <div className="alert alert-danger">{errors.title}</div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Genre</Form.Label>
                <select
                  className="form-select"
                  name="genre"
                  onChange={(event) => this.handleChange(event)}
                >
                  <option>Choose a genre below...</option>
                  {genres?.map((genre) => (
                    <option key={genre._id} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                {errors.genre && (
                  <div className="alert alert-danger">
                    {errors.numberInStock}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Number In Stock</Form.Label>
                <Form.Control
                  name="numberInStock"
                  onChange={(event) => this.handleChange(event)}
                />
                {errors.numberInStock && (
                  <div className="alert alert-danger">
                    {errors.numberInStock}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Daily Rental Rate</Form.Label>
                <Form.Control
                  name="dailyRentalRate"
                  onChange={(event) => this.handleChange(event)}
                />
                {errors.dailyRentalRate && (
                  <div className="alert alert-danger">
                    {errors.dailyRentalRate}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Button
              type="submit"
              size="lg"
              disabled={this.validateForm()}
              as={Col}
              className="mx-3"
              onClick={() => {
                this.saveMethod();
              }}
            >
              Save
              {navigateBtn && <Navigate to="/movies" replace={true} />}
            </Button>
            <Button
              type="submit"
              size="lg"
              active
              as={Col}
              className="mx-3"
              onClick={() => {
                this.setState({ btnClicked: true });
              }}
            >
              Cancel
              {navigateBtn && <Navigate to="/movies" replace={true} />}
            </Button>
          </Row>
        </Form>
      </div>
    );
  }
}

export default MovieForm;
