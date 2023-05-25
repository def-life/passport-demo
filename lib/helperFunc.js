import bcrypt from "bcrypt";

const saltRounds = 10;

async function hashPassword(password) {
  try {
    // Hash the password with automatic salt generation
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    // Handle error
    throw new Error("Error hashing password");
  }
}

async function verifyPassword(password, hashedPassword) {
    try {
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, hashedPassword);
  
      return isMatch;
    } catch (error) {
      // Handle error
      throw new Error("Error verifying password");
    }
  }
  

export default {hashPassword, verifyPassword}