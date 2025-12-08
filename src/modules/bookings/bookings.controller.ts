import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    // Get booking data from request body
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
    
    // Basic validation
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: customer_id, vehicle_id, rent_start_date, rent_end_date"
      });
    }
    
    // Validate customer_id and vehicle_id are numbers
    if (isNaN(Number(customer_id)) || isNaN(Number(vehicle_id))) {
      return res.status(400).json({
        success: false,
        message: "customer_id and vehicle_id must be numbers"
      });
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(rent_start_date) || !dateRegex.test(rent_end_date)) {
      return res.status(400).json({
        success: false,
        message: "Dates must be in YYYY-MM-DD format"
      });
    }
    
    // Call service to create booking
    const booking = await bookingService.createBookingIntoDB({
      customer_id: Number(customer_id),
      vehicle_id: Number(vehicle_id),
      rent_start_date,
      rent_end_date
    });
    
    // Success response
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
    
  } catch (error:any) {
    res.status(400).json({
        success:false,
        message:error.message,
    })
    
   }
};

export const bookingController={
    createBooking
}