// const isFormFieldInvalid = (name: string, formik: any) => !!(formik.touched[name] && formik.errors[name]);
// const getFormErrorMessage = (name: string, formik: any) => {
// 	return isFormFieldInvalid(name, formik) ? <small className="p-error">{formik.errors[name]}</small> : <></>;
// };
const getFormErrorMessageString = (name: string, formik: any) => {
	return isFormFieldInvalid(name, formik) ? formik.errors[name] : "";
};

const isFormFieldInvalid = (name: string, formik: any) => {
  const accessNestedField = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  };

  const error = accessNestedField(formik.errors, name);
  const touched = accessNestedField(formik.touched, name);
  return !!(touched && error);
};
const getFormErrorMessage = (name: string, formik: any) => {
  const accessNestedField = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  };

  const error = accessNestedField(formik.errors, name);
  return isFormFieldInvalid(name, formik) ? (
    <span className="text-danger">{error}</span>
  ) : null;
};



export { isFormFieldInvalid, getFormErrorMessage, getFormErrorMessageString };
