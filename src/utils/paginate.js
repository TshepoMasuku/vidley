import _ from 'lodash';

export function paginate(movieItems, currentPage, pageSize){
    const startIndex = (currentPage - 1)*pageSize;
    return(
        _(movieItems)
            .slice(startIndex)
            .take(pageSize)
            .value()
    )
}