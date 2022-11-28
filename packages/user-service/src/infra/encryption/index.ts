import bcrypt from "bcrypt";

export const hashIt = (text: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(text, salt);
};

export const verifyHash = (text: string, hash: string): boolean => {
  return bcrypt.compareSync(text, hash);
};
