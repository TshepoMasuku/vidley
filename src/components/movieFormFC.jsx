import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getMovie, saveMovie, updateMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Joi from "joi";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MovieForm() {
  const [state, setState] = useState({
    movie: {},
    errors: {},
    genres: [],
  });
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/movies/new") {
      async function readGenres() {
        try {
          const { data: genres } = await getGenres();
          setState({ movie: {}, errors: {}, genres });
        } catch (error) {
          toast.error(error.response.data);
          return;
        }
      }
      readGenres();
      return;
    }
    const readMovie = async (id) => {
      try {
        const { data: genres } = await getGenres();
        const { data: movie } = await getMovie(id);
        if (movie) {
          setState({ movie, errors: {}, genres });
        }
      } catch (error) {
        navigate("*");
      }
    };
    readMovie(params.id);
  }, [params.id, navigate, location]);

  const schema = Joi.object({
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

  const walkSchema = (name) => {
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

  const saveChanges = () => {
    const { movie, genres } = state;
    const filteredGenre = genres.filter((g) => g.name === movie.genre);
    const genreID =
      filteredGenre.length === 1 ? filteredGenre[0]["_id"] : movie.genre._id;
    const movieObj = {
      title: movie.title,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
      genreId: genreID,
    };
    if (location.pathname === "/movies/new") {
      try {
        saveMovie(movieObj);
      } catch (error) {
        toast.error(error.response.data);
        navigate("/movies");
      }
    } else {
      try {
        updateMovie(movie._id, movieObj);
      } catch (error) {
        toast.error(error.response.data);
        navigate("/movies");
      }
    }
    console.log("Changes Saved!");
    navigate("/movies");
  };
  const cancelChanges = () => {
    console.log("Changes Cancelled!");
    navigate("/movies");
  };

  const validateInput = (name, input) => {
    const value = { [name]: input };
    const skima = walkSchema(name);
    const results = skima.validate(value);
    if (results.error) {
      return results.error.details[0].message;
    } else {
      return null;
    }
  };
  const handleChange = (e) => {
    const { name, value: input } = e.target;
    const { movie, errors } = state;
    const errorsReplica = { ...errors };
    const movieReplica = { ...movie };
    const errorMessage = validateInput(name, input);
    if (errorMessage) {
      errorsReplica[name] = errorMessage;
    }
    if (!errorMessage) {
      delete errorsReplica[name];
    }
    movieReplica[name] = input;
    setState({
      movie: movieReplica,
      errors: errorsReplica,
      genres: state.genres,
    });
  };

  const validateForm = () => {
    const formErrors = { ...state.errors };
    const options = { abortEarly: false };
    const results = schema.validate(state.movie, options);
    if (!results.error) return null;
    if (results.error) {
      for (let num = 0; num < results.error.details.length; num++) {
        formErrors[results.error.details[num].path[0]] =
          results.error.details[num].message;
      }
      return formErrors;
    }
  };
  // NOT INVOKED
  const handleSubmit = (e) => {
    e.preventDefault();
    const handleSubmitErrors = validateForm();
    setState({
      movie: state.movie,
      errors: handleSubmitErrors,
      genres: state.genres,
    });
    if (handleSubmitErrors) return;
    doSubmit();
  };
  const doSubmit = () => {
    // Call Server
    console.log("Form Submitted!");
  };

  return (
    <div className="mx-5">
      <h1 className="text-center">Movie Form</h1>
      {/* NOT INVOKED */}
      {/* <Form onSubmit={ event => (handleSubmit(event) )}> */}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                placeholder={state?.movie?.title}
                defaultValue={state?.movie?.title}
                name="title"
                onChange={(event) => handleChange(event)}
              />
              {state?.errors?.title && (
                <div className="alert alert-danger">{state.errors.title}</div>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Genre</Form.Label>
              <select
                className="form-select"
                name="genre"
                onChange={(event) => handleChange(event)}
              >
                {state?.movie.genre?.name ? (
                  <option value={state?.movie?.genre?.name}>
                    {state?.movie.genre?.name}
                  </option>
                ) : (
                  <option>Choose a genre below...</option>
                )}
                {state?.genres?.map((genre) => (
                  <option key={genre._id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
              {state?.errors?.genre && (
                <div className="alert alert-danger">{state.errors.genre}</div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Number In Stock</Form.Label>
              <Form.Control
                placeholder={state?.movie?.numberInStock}
                defaultValue={state?.movie?.numberInStock}
                name="numberInStock"
                onChange={(event) => handleChange(event)}
              />
              {state?.errors?.numberInStock && (
                <div className="alert alert-danger">
                  {state.errors.numberInStock}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Daily Rental Rate</Form.Label>
              <Form.Control
                placeholder={state?.movie?.dailyRentalRate}
                defaultValue={state?.movie?.dailyRentalRate}
                name="dailyRentalRate"
                onChange={(event) => handleChange(event)}
              />
              {state?.errors?.dailyRentalRate && (
                <div className="alert alert-danger">
                  {state.errors.dailyRentalRate}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Button
            type="submit"
            size="lg"
            disabled={validateForm()}
            as={Col}
            className="mx-3"
            onClick={() => {
              saveChanges();
            }}
          >
            Save
          </Button>
          <Button
            type="submit"
            size="lg"
            active
            as={Col}
            className="mx-3"
            onClick={() => {
              cancelChanges();
            }}
          >
            Cancel
          </Button>
        </Row>
      </Form>
    </div>
  );
}

export default MovieForm;
