import validator from 'validator';


const validate = {
  verifyInput(req, res, next) {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'password'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(422).send({
        status: 422,
        message: 'The following field(s) is required',
        fields: missingFields,
      });
    }
    const {
      firstName, lastName, email, address, password,
    } = req.body;
    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)
    || !validator.isLength(firstName, { min: 3 }) || !validator.isLength(lastName, { min: 3 })) {
      return res.status(422).send({
        status: 422,
        message: 'Your names can only be in alphabets and must contain atleast three characters',
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(422).send({
        status: 422,
        message: 'please enter a valid email address',
      });
    }
    if (!validator.isAlphanumeric(password) || !validator.isLength(password, { min: 8 })) {
      return res.status(422).send({
        status: 422,
        message: 'Your password must contain atleast 8 characters and must include atleast one number(symbols are not allowed)',
      });
    }
    if (!validator.isLength(address, { min: 5 })) {
      return res.status(422).send({
        status: 422,
        message: 'Your address must contain atleast 5 characters',
      });
    }


    next();
  },
};
export default validate;
