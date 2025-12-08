import { pool } from "../../database/db";

const createVehicleIntoDB = async (payLoad: Record<string, unknown>) => {
  const { vehicle_name , type , registration_number , daily_rent_price , availability_status} = payLoad;

  
  if (!vehicle_name || !registration_number || !daily_rent_price) {
    throw {
      status: 400,
      message: "Missing fields",
    };
  }
  

  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name , type , registration_number , daily_rent_price , availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
    [vehicle_name , type , registration_number , daily_rent_price , availability_status]
  );

  return result.rows[0];
};

const getAllVehiclesFromDB = async () => {
  
  const result = await pool.query(
    `
    SELECT * FROM vehicles
  `,
   
  );

  return result;
};

const getSingleVehiclesFromDBForAD = async(vehicleId:string)=>{
const result=await pool.query(`SELECT * FROM vehicles WHERE id = $1`,[vehicleId]);
return result
}

export const vehicleServices={
    createVehicleIntoDB,getAllVehiclesFromDB,getSingleVehiclesFromDBForAD
}