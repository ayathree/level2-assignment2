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

// const updateSingleUserByAD=async(name:string,email:string,phone:string,role:string,userId:string)=>{
//     const result =await pool.query(`UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING id,name,email,phone,role`, [name,email,phone,role,userId]);
//     return result;
// }


const updateUser = async (
  name: string,
  email: string,
  phone: string,
  role: string | undefined,
  userId: string,
  loggedInUser: any
) => {
  
  if (loggedInUser.role === "customer") {
  
    if (String(loggedInUser.id) !== String(userId)) {
      return {
        status: 403,
        response: {
          success: false,
          message: "Forbidden — customers can update only their own profile,select correct user",
        },
      };
    }

   
    if (role) {
      return {
        status: 403,
        response: {
          success: false,
          message: "Forbidden — customers cannot change role,remove role field from request body",
        },
      };
    }

  
    const result = await pool.query(
      `UPDATE users
       SET name=$1, email=$2, phone=$3
       WHERE id=$4
       RETURNING id, name, email, phone, role`,
      [name, email, phone, userId]
    );

    if (result.rows.length === 0) {
      return {
        status: 404,
        response: {
          success: false,
          message: "User not found",
        },
      };
    }

    return {
      status: 200,
      response: {
        success: true,
        message: "Profile updated successfully",
        data: result.rows[0],
      },
    };
  }

 
  if (loggedInUser.role === "admin") {
    const result = await pool.query(
      `UPDATE users
       SET name=$1, email=$2, phone=$3, role=$4
       WHERE id=$5
       RETURNING id, name, email, phone, role`,
      [name, email, phone, role, userId]
    );

    if (result.rows.length === 0) {
      return {
        status: 404,
        response: {
          success: false,
          message: "User not found",
        },
      };
    }

    return {
      status: 200,
      response: {
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      },
    };
  }

  
  return {
    status: 401,
    response: {
      success: false,
      message: "Unauthorized",
    },
  };
};
export const adminServices={
getAllUserFromDB,updateUser
}