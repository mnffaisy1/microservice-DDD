import { ObjectId } from "mongodb";

// to convert id string into object
export const getObjectId = (id: string) => {
  return new ObjectId(id);
};
