function validatePhone(phone) {
  console.log('Validating phone:', phone);
  if (!phone) return false;

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  console.log('Clean phone:', cleanPhone);

  const russianPhoneRegex = /^(\+?7|8)[0-9]{10}$/;
  const isValid = russianPhoneRegex.test(cleanPhone);
  console.log('Phone validation result:', isValid);

  return isValid;
}

function normalizePhone(phone) {
  console.log('Normalizing phone:', phone);
  if (!phone) return null;

  let cleanPhone = phone.replace(/[^\d+]/g, '');
  console.log('Clean phone for normalization:', cleanPhone);

  if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
    cleanPhone = `+7${cleanPhone.slice(1)}`;
  } else if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
    cleanPhone = `+${cleanPhone}`;
  } else if (cleanPhone.startsWith('+7') && cleanPhone.length === 12) {
  } else {
    console.log('Invalid phone format, returning null');
    return null;
  }

  console.log('Normalized phone:', cleanPhone);
  return cleanPhone;
}

module.exports = {
  validatePhone,
  normalizePhone,
};
