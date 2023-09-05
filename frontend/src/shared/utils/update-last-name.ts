export const updateLastName = (firstName: string, lastName: string) => {
  const brandName = "-Benefit";
  const customerNameLengthLimit = 32;
  const customerNameLength = `${firstName} ${lastName}`.length;
  const diff = customerNameLengthLimit - customerNameLength;
  return lastName + brandName.substring(0, diff);
};
