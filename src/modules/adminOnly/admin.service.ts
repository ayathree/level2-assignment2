import { pool } from "../../database/db";

const getAllUserFromDB = async () => {
  



  const result = await pool.query(
    `
    SELECT id,name,email,phone,role FROM users
  `,
   
  );

  return result;
};

// const getSingleUserFromDBForAD = async(userId:string)=>{
// const result=await pool.query(`SELECT id,name,email,phone,role FROM users WHERE id = $1`,[userId]);
// return result
// }

const updateSingleUserByAD=async(name:string,email:string,phone:string,role:string,userId:string)=>{
    const result =await pool.query(`UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING id,name,email,phone,role`, [name,email,phone,role,userId]);
    return result;
}
export const adminServices={
getAllUserFromDB,updateSingleUserByAD
}