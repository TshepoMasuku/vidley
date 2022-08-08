import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { getMovies } from "../services/fakeMovieService";
// import { getGenres } from "../services/fakeGenreService";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SortGenre from "./common/sortGenre";
import MovieTable from "./movieTable";
import Paginations from "./common/paginations";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    selectedGenre: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: {
      path: "title",
      order: "asc",
    },
    searchText: "",
  };

  // use with Fake Services above
  // componentDidMount() {
  //   const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
  //   this.setState({ movies: getMovies(), genres });
  // }
  async componentDidMount() {
    try {
      const genres = [{ _id: "", name: "All Genres" }];
      const dbGenres = await getGenres();
      genres.push(...dbGenres.data);
      const allMovies = await getMovies();
      const movies = allMovies.data;
      this.setState({ genres, movies });
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  handleDelBtn = (movie) => {
    const { movies } = this.state;
    const originalMovies = movies;
    try {
      deleteMovie(movie._id);
      const movies2show = movies.filter((movii) => movii._id !== movie._id);
      this.setState({ movies: movies2show });
    } catch (error) {
      // damn code block not rendered(not working).
      toast.error(error.response.data);
      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1, searchText: "" });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData() {
    const {
      movies: allMovies,
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
    } = this.state;

    const genreFilter =
      selectedGenre && selectedGenre._id
        ? allMovies?.filter((m) => m.genre._id === selectedGenre._id)
        : allMovies;
    const sorted = _.orderBy(
      genreFilter,
      [sortColumn.path],
      [sortColumn.order]
    );
    const movies = paginate(sorted, currentPage, pageSize);
    return { totalCount: genreFilter.length, data: movies };
  }

  handleSearchMovie(input) {
    this.setState({
      searchText: input,
      currentPage: 1,
      selectedGenre: "All Genres",
    });
  }
  searchOutput(input) {
    const { movies: allMovies, pageSize, currentPage, sortColumn } = this.state;

    const search = allMovies?.filter((item) =>
      item.title.toLowerCase().startsWith(input.toLowerCase())
    );
    const sorted = _.orderBy(search, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sorted, currentPage, pageSize);
    return { totalNum: search.length, data: movies };
  }

  render() {
    const { user } = this.props;
    const { pageSize, currentPage, sortColumn, searchText } = this.state;

    const { totalCount, data: movies } = this.getPagedData();
    const { totalNum, data: searched } = this.searchOutput(searchText);

    return (
      <div className="container">
        <Row>
          <Col xs={4} sm={4} md={2} lg={3}>
            <SortGenre
              genreItems={this.state.genres}
              onGenreClick={this.handleGenreSelect}
              selectedGenre={this.state.selectedGenre}
            />
          </Col>
          <Col xs={8} sm={8} md={10} lg={9}>
            {user?.isAdmin && 
              <Button size="lg" className="mb-2">
                <Link
                  to="/movies/new"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  New Movie
                </Link>
              </Button>
            }
            <h4 className="mb-3 text-start">
              Showing {searchText === "" ? totalCount : totalNum} movies from the
              database.
            </h4>
            <Form className="mb-1 d-flex">
              <FormControl
                type="search"
                placeholder="Search..."
                value={searchText}
                onChange={(event) => {
                  this.handleSearchMovie(event.target.value);
                }}
              />
            </Form>
            <MovieTable
              movies={searchText === "" ? movies : searched}
              sortColumn={sortColumn}
              onLike={this.handleLike}
              onDelete={this.handleDelBtn}
              onSort={this.handleSort}
              user={user}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ offset: 5 }}
            sm={{ offset: 5 }}
            md={{ offset: 5 }}
            lg={{ offset: 5 }}
          >
            <Paginations
              itemsCount={searchText === "" ? totalCount : totalNum}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Movies;
