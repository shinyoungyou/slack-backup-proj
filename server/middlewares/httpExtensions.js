// pagination.middleware.js
function addPaginationHeader(req, res, next) {
  res.addPaginationHeader = function (currentPage, itemsPerPage, totalItems, totalPages) {
    const paginationHeader = {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
    };
    res.set('Pagination', JSON.stringify(paginationHeader));
    res.set('Access-Control-Expose-Headers', 'Pagination');
  };
  next();
}

module.exports = addPaginationHeader;
