import { response } from 'express';
import models from '../../models/index.js';
const flightDetailModel = models.flightDetail;

// const addFlightDetail = async (request, response){
//   try{
//     const data = request.body;
//     await flightDetailModel.create({
//       task: data.task,
//       status: data.status,
//       description: data.description,
//       user_id: data.user_id
//     })
//   } catch (error){
//     console.log('error', error);
//     response.status(500).send({
//       message: 'Something went wrong while saving flightDetail.'
//     });
//   }
// }

const addFlightDetail = async (request, response) => {
  try {
    const data = request.body;
    await flightDetailModel.create({
      task: data.task,
      status: data.status,
      description: data.description,
      user_id: request.user.id
    });
    response.send({
      message: 'Flight Detail created successfully.'
    });
  } catch (error) {
    console.log('error', error);
    response.status(500).send({
      message: 'Something went wrong while saving flight detail.'
    });
  }
};

const updateFlightDetail = async (req, res) => {
  try {
    const updateData = req.body;
    const id = req.params.id;
    await flightDetailModel.update(
      {
        task: updateData.task,
        status: updateData.status,
        description: updateData.description,
        email: updateData.email
      },
      { where: { id } }
    );

    res.send({
      message: 'Flight Detail updated successfully.'
    });
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while updating Flight Detail.'
    });
  }
};

const orderBy = async (req, res) => {
  try {
    let limit = 0;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const flightDetails = await flightDetailModel.findAll({
      // order: [[orderBy, limit]],
      // key: [column name, order (ASC, DSCE)]
      limit: [limit]
    });
    res.send({
      message: 'Flight Detail fetched successfully',
      flightDetails
    });
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while getting Flight Detail.'
    });
  }
};
const deleteFlightDetail = async (req, res) => {
  try {
    const deleteData = req.body;
    const deleteFlightDetailRow = await flightDetailModel.destroy({
      where: { id: deleteData.id }
    });
    res.send({
      message: 'Flight Detail row deleted successfully.'
    });
  } catch (error) {
    res.status(500).send({
      message: 'An error occured while deleting Flight Detail.'
    });
  }
};

export { addFlightDetail, updateFlightDetail, orderBy, deleteFlightDetail };
