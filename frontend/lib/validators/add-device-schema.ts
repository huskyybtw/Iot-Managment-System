import * as yup from "yup";

export const addDeviceSchema = yup.object({
  name: yup.string().required("Device name is required"),
  type: yup
    .string()
    .oneOf(["sensor", "actuator", "gateway"], "Select a valid device type")
    .required("Device type is required"),
  mac: yup.string().required("MAC address is required"),
  location: yup.string().required("Location is required"),
});

export type AddDeviceFormData = yup.InferType<typeof addDeviceSchema>;
