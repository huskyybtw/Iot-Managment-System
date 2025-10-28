import * as yup from "yup";

// Schema for adding a new device (MAC address + label)
export const addDeviceSchema = yup.object({
  label: yup.string().required("Device name is required"),
  mac: yup.string().required("MAC address is required"),
  // .matches(
  //   /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{12})$/,
  //   "Enter a valid MAC address (e.g., 00:1B:44:11:3A:B7 or 001B44113AB7)"
  // ),
});

// Schema for editing a device (only label can be changed)
export const editDeviceSchema = yup.object({
  label: yup.string().required("Device name is required"),
});

export type AddDeviceFormData = yup.InferType<typeof addDeviceSchema>;
export type EditDeviceFormData = yup.InferType<typeof editDeviceSchema>;
