import { pool } from "../../database/db";

const getAllUserFromDB = async () => {
  



  const result = await pool.query(
    `
    SELECT id,name,email,phone,role FROM users
  `,
   
  );

  return result;
};

export const adminServices={
getAllUserFromDB
}