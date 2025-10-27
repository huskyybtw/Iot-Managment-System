import * as yup from "yup";

export const editDeviceSchema = yup.object({
  name: yup.string().required("Device name is required"),
  location: yup.string().required("Location is required"),
  macAddress: yup.string().required("MAC address is required"),
  status: yup
    .string()
    .oneOf(["online", "offline", "warning"], "Select a valid status")
    .required("Status is required"),
});

export type EditDeviceFormData = yup.InferType<typeof editDeviceSchema>;
