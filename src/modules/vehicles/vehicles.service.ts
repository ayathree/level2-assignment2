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
};

const updateSingleVehicleByAD=async(vehicle_name:string,type:string,registration_number:string,daily_rent_price:number,availability_status:string,vehicleId:string)=>{
    const result =await pool.query(`UPDATE vehicles SET vehicle_name=$1,type=$2,registration_number=$3,daily_rent_price=$4,availability_status=$5 WHERE id=$6 RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status`, [vehicle_name,type,registration_number,daily_rent_price,availability_status,vehicleId]);
    return result;
};

const deleteSingleVehicleByAD = async (vehicleId: string) => {
  // Try to delete, but only if available
  const result = await pool.query(
    `DELETE FROM vehicles 
     WHERE id = $1 AND availability_status = 'available'
     RETURNING id, vehicle_name, registration_number`,
    [vehicleId]
  );
  
  if (result.rows.length === 0) {
    // Either vehicle doesn't exist OR it's booked
    const check = await pool.query(
      `SELECT availability_status FROM vehicles WHERE id = $1`,
      [vehicleId]
    );
    
    if (check.rows.length === 0) {
      throw { status: 404, message: "Vehicle not found" };
    } else {
      throw { 
        status: 400, 
        message: "Cannot delete vehicle with active bookings" 
      };
    }
  }
  
  return result.rows[0];
};

export const vehicleServices={
    createVehicleIntoDB,getAllVehiclesFromDB,getSingleVehiclesFromDBForAD,updateSingleVehicleByAD,deleteSingleVehicleByAD
}