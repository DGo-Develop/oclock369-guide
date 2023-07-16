/**
 * HTTP response utility.
 */
class HttpResponse {
    /**
     * Send success response.
     * @param {object} res - The response object.
     * @param {object} data - The response data.
     * @returns {object} - The HTTP response.
     */
    ok(res, data) {
        return res.status(200).json({ 'data': data });
    }

    /**
     * Send created response.
     * @param {object} res - The response object.
     * @param {object} data - The response data.
     * @returns {object} - The HTTP response.
     */
    created(res, data) {
        return res.status(201).json({ 'data': data });
    }

    /**
     * Send no content response.
     * @param {object} res - The response object.
     * @returns {object} - The HTTP response.
     */
    noContent(res) {
        return res.sendStatus(204);
    }

    /**
     * Send bad request response.
     * @param {object} res - The response object.
     * @param {string} error - The error message.
     * @returns {object} - The HTTP response.
     */
    badRequest(res, error) {
        return res.status(400).json({ 'error': error });
    }

    /**
     * Send unauthorized response.
     * @param {object} res - The response object.
     * @param {string} error - The error message.
     * @returns {object} - The HTTP response.
     */
    unauthorized(res, error) {
        return res.status(401).json({ 'error': error });
    }

    /**
     * Send forbidden response.
     * @param {object} res - The response object.
     * @param {string} error - The error message.
     * @returns {object} - The HTTP response.
     */
    forbidden(res, error) {
        return res.status(403).json({ 'error': error });
    }

    /**
     * Send not found response.
     * @param {object} res - The response object.
     * @param {string} error - The error message.
     * @returns {object} - The HTTP response.
     */
    notFound(res, error) {
        return res.status(404).json({ 'error': error });
    }

    /**
        * Send bad request response.
        * @param {object} res - The response object.
        * @param {string} error - The error message.
        * @returns {object} - The HTTP response.
        */
    conflict(res, error) {
        return res.status(409).json({ 'error': error });
    }


    /**
     * Send internal server error response.
     * @param {object} res - The response object.
     * @param {string} error - The error message.
     * @returns {object} - The HTTP response.
     */
    internalServerError(res, error) {
        return res.status(500).json({ 'error': error });
    }
}

module.exports = new HttpResponse();
