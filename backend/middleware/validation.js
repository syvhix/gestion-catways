const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!require('mongoose').Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }
  next();
};

const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Paramètres de pagination invalides'
    });
  }
  
  req.pagination = { page, limit };
  next();
};

module.exports = { validateObjectId, validatePagination };