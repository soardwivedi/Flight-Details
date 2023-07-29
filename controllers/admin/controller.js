import models from '../../models/index.js';
import * as bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { where } from 'sequelize';

const adminModel = models.admin;

const addAdmin = async (request, response) => {
  const data = request.body;
  try {
    const admin = await adminModel.create({
      name: data.name,
      email: data.email,
      password: data.password
    });
    response.send({
      success: true,
      message: 'admin created successfully.'
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return response.status(200).send({
        success: false,
        message: `There is already an admin exists with email ${data.email}`
      });
    }
    response.status(400).send({
      success: false,
      message: 'Something went wrong while saving admin.'
    });
  }
};

const adminLogin = async (req, res) => {
  const loginData = req.body;
  try {
    const admin = await adminModel.findOne({
      where: { email: loginData.email }
    });
    if (!admin) {
      return res.status(400).send({
        message: `admin with email ${loginData.email} has not found.`
      });
    }
    const isValidPassword = await bcrypt.compare(
      loginData.password,
      admin.password
    );
    if (!isValidPassword) {
      return res.status(400).send({
        message: `Either email or password is incorrect.`
      });
    }

    const access_token = JWT.sign(
      {
        id: admin.id,
        email: admin.email
      },
      'saltkey',
      { expiresIn: '1h' }
    );

    const refresh_token = JWT.sign(
      {
        id: admin.id,
        email: admin.email
      },
      'saltkey',
      { expiresIn: '1d' }
    );
    await adminModel.update(
      {
        refresh_token,
        access_token
      },
      { where: { id: admin.id } }
    );
    res.send({
      message: 'Your login data is correct.',
      access_token,
      refresh_token
    });
    //console.log(access_token, 'access_token');
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while login.'
    });
  }
};

const updatePassword = async (req, res) => {
  const inputData = req.body;
  const admin = req.admin;

  try {
    const adminU = await adminModel.findOne({
      where: { email: inputData.email }
    });
    if (!adminU) {
      return res.status(400).send({
        message: `admin with email has not found.`
      });
    }

    const passs = bcrypt.compare(inputData.oldPassword, adminU.password);
    if (!passs)
      return res.send({
        message: 'Entered old password is wrong.'
      });

    // adminModel.update(
    //   {
    //     password: inputData.newPassword
    //   },
    //   { where: { id: admin.id } }
    // );
    admin.password = inputData.newPassword;
    await admin.save();
    res.send({
      message: 'Password updated successfully.'
    });
  } catch (error) {
    console.log(error, 'There is an error while updating password.');
  }
};

const adminRefresLogin = async (req, res) => {
  const inputData = req.body;
  // Verify token;
  let payload;
  JWT.verify(inputData.refresh_token, 'saltkey', (error, data) => {
    // If any error on verifying token then return
    if (error) return;
    // If no error on verifying token then update payload variable with data(token payload)
    payload = data;
  });
  // If payload is undefind then throw error
  if (!payload) {
    return res.status(400).send({
      message: 'The given authorization token is invalid.'
    });
  }
  const admin = await adminModel.findOne({
    where: { email: payload.email, id: payload.id }
  });
  if (!admin) {
    return res.send({
      message: `admin not found with ${payload.email} "and id" ${payload.id}`
    });
  }
  //why we are genrating below new_access_token.
  const new_access_token = JWT.sign(
    {
      id: admin.id,
      email: admin.email
    },
    'saltkey',
    { expiresIn: '1d' }
  );
  await adminModel.update(
    {
      access_token: new_access_token
    },
    { where: { id: admin.id } }
  );
  res.send({
    message: 'New access token upadated in DB generated.',
    new_access_token
  });
};

const logoutAdmin = async (req, res) => {
  try {
    await adminModel.update(
      {
        access_token: null
      },
      {
        where: { id: req.admin.id }
      }
    );
    res.send({
      message: ' You loged out successfully.'
    });
  } catch (error) {}
};

export { addAdmin, adminLogin, logoutAdmin, adminRefresLogin, updatePassword };
