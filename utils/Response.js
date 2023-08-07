const setErrorResponse = (res, status, error) => {
    return res.status(status).json({ error: error });
}

const setSuccessResponse = (res, message, body = null) => {
    return res.json({ message, body });
}

module.exports = { setSuccessResponse, setErrorResponse }