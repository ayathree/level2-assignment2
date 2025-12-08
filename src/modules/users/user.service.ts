import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const createUserIntoDB = async (payLoad: Record<string, unknown>) => {
  const { name, email, password, phone,role} = payLoad;

  
  if (!name || !email || !password || !phone || !role) {
    throw {
      status: 400,
      message: "Missing fields",
    };
  }

 
  if ((password as string).length < 6) {
    throw {
      status: 400,
      message: "Password too short",
    };
  }

  
  const emailLower = (email as string).toLowerCase();


  const emailExists = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [emailLower]
  );

  if (emailExists.rowCount as number > 0) {
    throw {
      status: 400,
      message: "Email already exists",
    };
  }


  const hashedPassword = await bcrypt.hash(password as string, 12);


  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone,role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
  `,
    [name, emailLower, hashedPassword, phone, role]
  );

  return result.rows[0];
};

// const getSingleUserFromDB = async (email:string) => {
  
  



//   const result = await pool.query(
//     `
//     SELECT * FROM users WHERE email=$1
//   `,[email]
   
//   );

//   return result;
// };



export const userServices = {
  createUserIntoDB
};
