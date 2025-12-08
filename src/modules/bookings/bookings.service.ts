import { pool } from "../../database/db";

const createBookingIntoDB = async (payload: any) => {
  // 1. Get vehicle with availability check
  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price 
     FROM vehicles 
     WHERE id = $1 AND availability_status = 'available'`,
    [payload.vehicle_id]
  );
  
  if (vehicleResult.rows.length === 0) {
    throw { status: 400, message: "Vehicle not available" };
  }
  
  const vehicle = vehicleResult.rows[0];
  
  // 2. Calculate price
  const startDate = new Date(payload.rent_start_date);
  const endDate = new Date(payload.rent_end_date);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const totalPrice = vehicle.daily_rent_price * daysDiff;
  
  // 3. Create booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [payload.customer_id, payload.vehicle_id, payload.rent_start_date, 
     payload.rent_end_date, totalPrice]
  );
  
  // 4. Update vehicle (separate query - risk of inconsistency)
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [payload.vehicle_id]
  );
  
  const booking = bookingResult.rows[0];
  
  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price
    }
  };
};

export const bookingService={
    createBookingIntoDB
}