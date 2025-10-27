import * as yup from "yup";

export const addAutomationSchema = yup.object({
  name: yup.string().required("Rule name is required"),
  description: yup.string().required("Description is required"),
  device: yup.string().required("Device is required"),
  location: yup.string().required("Location is required"),
  triggerCondition: yup.string().required("Trigger condition is required"),
  triggerValue: yup.string().required("Trigger value is required"),
  triggerUnit: yup.string().required("Trigger unit is required"),
  actionType: yup.string().required("Action type is required"),
  actionMethod: yup.string().required("Action method is required"),
  actionTarget: yup.string().required("Action target is required"),
});

export type AddAutomationFormData = yup.InferType<typeof addAutomationSchema>;
