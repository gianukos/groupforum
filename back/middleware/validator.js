const {body, validationResult} = require('express-validator');
const postPropertyInputs = () => {
    return [
        body('url').trim().escape(),
        body('title').trim().escape(),
        body('description').trim().escape(),
    ];
};

const commentPropertyInputs = () => {
    return [
        body('comment').trim().escape()
    ];
};

const loginSignupInputs = () => {
    return [
        body('email').isEmail().normalizeEmail()
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = {
    loginSignupInputs,
    postPropertyInputs,
    commentPropertyInputs,
    validate,
};