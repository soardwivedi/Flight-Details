import express from 'express';
const app = express();
const port = 3002;
import Yup from 'yup';
import bodyParser from 'body-parser';
import * as controllers from './controllers/index.js';
import { validate } from 'express-yup';
import { flightDetailAddSchema } from './controllers/flightDetails/validation.js';
import { addFlightDetail } from './controllers/flightDetails/controller.js';
import {
  adminAddSchema,
  adminLoginSchema,
  adminPasswordUpdateSchema,
  adminRfreshShema
} from './controllers/admin/validation.js';

import {
  addAdmin,
  adminLogin,
  logoutAdmin,
  adminRefresLogin,
  updatePassword
} from './controllers/admin/controller.js';
import models from './models/index.js';
import auth from './middlewares/auth.js';

// Middleware: For hadling yup validation error
app.use((error, req, res, next) => {
  if (error instanceof Yup.ValidationError) {
    console.log("Hi Kjhss");
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
});

// Syncronizing models with database tables
app.use(bodyParser.json());

// models.sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log(`Database connected and syncronized successfully!`);
//   })
//   .catch((error) => {
//     console.log('Error while syncronizing models.', error);
//   });

app.post('/', (req, res) => {
  res.send('successful connection.');
});

app.post('/mail-us', (req, res) => {
  res.send({
    mail_to: 'soarvivekdwivedi@gmail.com'
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.post(
  '/flightDetail',
  auth,
  validate(flightDetailAddSchema),
  controllers.flightDetails.addFlightDetail
);

app.put(
  '/flightDetail/:id',
  auth,
  validate(flightDetailAddSchema),
  controllers.flightDetails.updateFlightDetail
);

app.get('/flightDetail', auth, controllers.flightDetails.orderBy);
app.delete(
  '/deleteflightDetail',
  auth,
  controllers.flightDetails.deleteFlightDetail
);

app.post(
  '/admin/register',
  validate(adminAddSchema),
  controllers.admin.addAdmin
);

app.post(
  '/admin/login',
  validate(adminLoginSchema),
  controllers.admin.adminLogin
);
app.post('/admin/logout', auth, controllers.admin.logoutAdmin);
app.post(
  '/admin/refresh_token',
  validate(adminRfreshShema),
  controllers.admin.adminRefresLogin
);
app.post(
  '/admin/updatePassword',
  auth,
  validate(adminPasswordUpdateSchema),
  controllers.admin.updatePassword
);
// Middleware: For hadling yup validation error
app.use((error, req, res, next) => {
  if (error instanceof Yup.ValidationError) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
