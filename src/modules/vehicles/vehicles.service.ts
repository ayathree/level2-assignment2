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

const deleteSingleVehicleByAD=async(vehicleId:string)=>{
    const result =  await pool.query(`DELETE FROM vehicles WHERE id = $1`, [vehicleId]);
    return result
}

export const vehicleServices={
    createVehicleIntoDB,getAllVehiclesFromDB,getSingleVehiclesFromDBForAD,updateSingleVehicleByAD,deleteSingleVehicleByAD
}