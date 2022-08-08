import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Like from './common/like';
import Table from './common/table'; 

class MovieTable extends Component {
    movieColumns = [
        { path: 'title', label: 'Title',
            content: movie => ( this.props.user ?
                <Link 
                    style={{textDecoration: "none"}} 
                    to={`/movies/${movie._id}`}
                >   {movie.title} 
                </Link>
                :
                <> {movie.title} </> 
            ) 
        },
        { path: 'genre.name', label: 'Genre' },
        { path: 'numberInStock', label: 'Stock' },
        { path: 'dailyRentalRate', label: 'Rate' },
        { 
            key: 'like',  
            content: movie => (
                <Like like={movie.liked} onClick={ () => this.props.onLike(movie) }/>
            )
        },
        { 
            key: 'delete',
            content: movie => ( this.props.user?.isAdmin &&
                <button className="btn btn-danger" onClick={ () => this.props.onDelete(movie) }>
                    Delete 
                </button>
            )
        }
    ];

    render(){
        const { movies, onSort, sortColumn } = this.props;
        return ( 
            <Table 
                columns={this.movieColumns} 
                sortColumn={sortColumn}
                onSort={onSort}
                data={movies} 
            />
        );
    }
}

export default MovieTable;