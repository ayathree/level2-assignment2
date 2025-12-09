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

const getAllBookingsFromDB = async (loggedInUser: any) => {
  if (loggedInUser.role === "admin") {
    // 1. Get all bookings for admin
    const bookingsResult = await pool.query(
      `SELECT * FROM bookings ORDER BY created_at DESC`
    );
    
    const bookings = bookingsResult.rows;
    
    // If no bookings, return empty array
    if (bookings.length === 0) {
      return [];
    }
    
    const results = [];
    
    // 2. Add customer and vehicle details for each booking
    for (const booking of bookings) {
      // Get customer details
      const customerResult = await pool.query(
        `SELECT name, email FROM users WHERE id = $1`,
        [booking.customer_id]
      );
      
      // Get vehicle details
      const vehicleResult = await pool.query(
        `SELECT vehicle_name, registration_number FROM vehicles WHERE id = $1`,
        [booking.vehicle_id]
      );
      
      // Get customer data - check if exists
      const customerData = customerResult.rows[0];
      const vehicleData = vehicleResult.rows[0];
      
      results.push({
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        customer: {
          name: customerData ? customerData.name : 'Unknown',
          email: customerData ? customerData.email : 'Unknown'
        },
        vehicle: {
          vehicle_name: vehicleData ? vehicleData.vehicle_name : 'Unknown',
          registration_number: vehicleData ? vehicleData.registration_number : 'Unknown'
        }
      });
    }
    
    return results;
  }
  
  if (loggedInUser.role === "customer") {
    // 1. Get customer's bookings only
    const bookingsResult = await pool.query(
      `SELECT * FROM bookings WHERE customer_id = $1 ORDER BY created_at DESC`,
      [loggedInUser.id]
    );
    
    const bookings = bookingsResult.rows;
    
    // If customer has no bookings, return empty array
    if (bookings.length === 0) {
      return [];
    }
    
    const results = [];
    
    // 2. Add vehicle details for each booking
    for (const booking of bookings) {
      // Get vehicle details
      const vehicleResult = await pool.query(
        `SELECT vehicle_name, registration_number, type FROM vehicles WHERE id = $1`,
        [booking.vehicle_id]
      );
      
      // Get vehicle data - check if exists
      const vehicleData = vehicleResult.rows[0];
      
      results.push({
        id: booking.id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
          vehicle_name: vehicleData ? vehicleData.vehicle_name : 'Unknown',
          registration_number: vehicleData ? vehicleData.registration_number : 'Unknown',
          type: vehicleData ? vehicleData.type : 'Unknown'
        }
      });
    }
    
    return results;
  }
  
  throw new Error("Invalid user role");
};

const updateBookingStatus = async (bookingId: string, status: string, loggedInUser: any) => {
  // 1. Get the booking details first
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );
  
  if (bookingResult.rows.length === 0) {
    throw { status: 404, message: "Booking not found" };
  }
  
  const booking = bookingResult.rows[0];
  
  // 2. Customer: Cancel booking (before start date only)
  if (loggedInUser.role === "customer") {
    // Customer can only cancel their own bookings
    if (booking.customer_id !== loggedInUser.id) {
      throw { 
        status: 403, 
        message: "You can only cancel your own bookings" 
      };
    }
    
    // Customer can only set status to 'cancelled'
    if (status !== 'cancelled') {
      throw { 
        status: 400, 
        message: "Customers can only cancel bookings" 
      };
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      throw { status: 400, message: "Booking is already cancelled" };
    }
    
    // Check if booking can be cancelled (before start date)
    const rentStartDate = new Date(booking.rent_start_date);
    const now = new Date();
    
    if (rentStartDate <= now) {
      throw { 
        status: 400, 
        message: "Cannot cancel booking after start date" 
      };
    }
  }
  
  // 3. Admin: Can only mark ANY booking as 'returned'
  if (loggedInUser.role === "admin") {
    // Admin can ONLY set status to 'returned' (NOT 'cancelled')
    if (status !== 'returned') {
      throw { 
        status: 400, 
        message: "Admin can only mark bookings as returned" 
      };
    }
    
    // Check if booking is already returned
    if (booking.status === 'returned') {
      throw { status: 400, message: "Booking is already returned" };
    }
    
    // Admin can only mark active bookings as returned
    if (booking.status !== 'active') {
      throw { 
        status: 400, 
        message: "Can only mark active bookings as returned" 
      };
    }
  }
  
  // 4. Update booking status
  const updateResult = await pool.query(
    `UPDATE bookings 
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [status, bookingId]
  );
  
  // 5. Update vehicle availability (both cancelled and returned set to 'available')
  if (status === 'cancelled' || status === 'returned') {
    await pool.query(
      `UPDATE vehicles 
       SET availability_status = 'available' 
       WHERE id = $1`,
      [booking.vehicle_id]
    );
  }
  
  // 6. Get vehicle status for admin response
  let vehicleInfo = null;
  if (loggedInUser.role === "admin" && status === 'returned') {
    const vehicleResult = await pool.query(
      `SELECT availability_status FROM vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );
    vehicleInfo = vehicleResult.rows[0];
  }
  
  const responseData = updateResult.rows[0];
  
  // Add vehicle info for admin returned response
  if (vehicleInfo) {
    responseData.vehicle = {
      availability_status: vehicleInfo.availability_status
    };
  }
  
  return responseData;
};

export const bookingService={
    createBookingIntoDB,getAllBookingsFromDB,updateBookingStatus
  
}