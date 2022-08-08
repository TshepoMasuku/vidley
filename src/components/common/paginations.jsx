import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import propTypes from 'prop-types';

const Paginations = ({itemsCount, pageSize, onPageChange, currentPage}) => {
    const pagesCount = Math.ceil(itemsCount/pageSize);
    if ( pagesCount === 1 ) return null;

    let items = [];
    for (let page = 1; page <= pagesCount; page++) {
        items.push(
            <Pagination.Item 
                key={page} active={page === currentPage}
                onClick={ () => onPageChange(page) }
            >
                {page}
            </Pagination.Item>,
        );
    }

    return (
        <Pagination>{items}</Pagination>
    );
}

Paginations.propTypes = {
    itemsCount: propTypes.number.isRequired,
    pageSize: propTypes.number.isRequired,
    onPageChange: propTypes.func.isRequired,
    currentPage: propTypes.number.isRequired,
}

export default Paginations;