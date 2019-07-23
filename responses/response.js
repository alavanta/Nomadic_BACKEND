'use strict';

/* Success Response */
exports.success = (res, value) => {
  const result = {
    status: {
      code: 200,
      message: 'success'
    },
    result: value
  };
  res.status(200).json({ nomadic: result });
  res.end();
};

exports.successWithInfo = (res, value, queryInfo) => {
  const result = {
    status: {
      code: 200,
      message: 'success'
    },
    query: {
      page: queryInfo.page,
      limit: queryInfo.limit,
      totalRows: queryInfo.totalRows,
      totalPage: queryInfo.totalPage
    },
    result: value
  };
  res.status(200).json({ nomadic: result });
  res.end();
};

exports.changed = (res, data, message) => {
  const result = {
    status: {
      code: 201,
      message: `data successfully ${message}`
    },
    data: data
  };
  res.status(201).json({ nomadic: result });
  res.end();
};

/* Error Response */

exports.notFound = res => {
  const result = {
    status: {
      code: 404,
      message: 'no entry found'
    }
  };
  res.status(200).json({ nomadic: result });
  res.end();
};

exports.error = (res, err) => {
  const result = {
    status: {
      code: 500,
      message: err.message
    }
  };
  res.status(500).json({ nomadic: result });
  res.end();
};

exports.falseRequirement = (res, field) => {
  const result = {
    status: {
      code: 500,
      message: 'the' + field + ' field is needed'
    }
  };
  res.status(500).json({ nomadic: result });
  res.end();
};

exports.loginFailed = res => {
  res.status(403).send({
    status: 403,
    message: 'Incorrect username or password'
  });
};

exports.loginSuccess = (res, rows, token) => {
  res.status(200).send({
    status: 200,
    data: rows,
    token: token
  });
};

exports.invalid = (res, status) => {
  res.status(400).json({
    status: 400,
    message: 'invalild ' + status
  });
};
