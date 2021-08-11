if (
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.BCRYPT_SALT_ROUNDS
) {
  throw new Error("TOKENS/SALT_ROUNDS MISSING");
}
const AT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const RT_SECRET = process.env.REFRESH_TOKEN_SECRET;
const SALTROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

console.log(SALTROUNDS)

export default {
  AT_SECRET,
  RT_SECRET,
  SALTROUNDS
};
