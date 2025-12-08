import { pool } from "../../database/db";

const createVehicleIntoDB = async (payLoad: Record<string, unknown>) => {
  const { vehicle_name , type , registration_number , daily_rent_price , availability_status} = payLoad;

  
  if (!vehicle_name || !registration_number || !daily_rent_price) {
    throw {
      status: 400,
      message: "Missing fields",
    };
  }
  const price = Number(daily_rent_price);
  
  // Check if it's a valid number
  if (isNaN(price) || price <= 0) {
    throw {
      status: 400,
      message: "daily_rent_price must be a positive number",
    };
  }

  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name , type , registration_number , daily_rent_price , availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
      id,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price::float,
      availability_status
  `,
    [vehicle_name , type , registration_number , price , availability_status]
  );

 const vehicle = result.rows[0];
  vehicle.daily_rent_price = parseFloat(vehicle.daily_rent_price);
  
  return vehicle;
};

const getAllVehiclesFromDB = async () => {
  
  const result = await pool.query(
    `
    SELECT * FROM vehicles
  `,
   
  );

  return result;
};

export const vehicleServices={
    createVehicleIntoDB,getAllVehiclesFromDB
}