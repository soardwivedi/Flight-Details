import yup from 'yup';

const flightDetailAddSchema = yup.object().shape({
  body: yup.object().shape({
    task: yup
      .string()
      .required('Task is required.')
      .min(2, 'Enter atlest two letters.'),
    status: yup.string().required('Status is required.')
  })
});

export { flightDetailAddSchema };
