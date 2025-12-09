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

const getAllBookings = async (req: Request, res: Response) => {
  try {
    // Get user from request (set by auth middleware)
    const loggedInUser = req.user;
    
    // Check if user is authenticated
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first"
      });
    }
    
    // Get bookings based on user role
    const bookings = await bookingService.getAllBookingsFromDB(loggedInUser);
    
    // Different message for admin vs customer
    const message = loggedInUser.role === 'admin' 
      ? "Bookings retrieved successfully" 
      : "Your bookings retrieved successfully";
    
    // Send response
    return res.status(200).json({
      success: true,
      message,
      data: bookings
    });
    
  } catch (error: any) {
    console.error('Error getting bookings:', error);
    
    // Send error response
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get bookings"
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const loggedInUser = req.user;
    
    // Validate booking ID
    if (!bookingId || isNaN(Number(bookingId))) {
      return res.status(400).json({
        success: false,
        message: "Valid booking ID is required"
      });
    }
    
    // Validate status
    if (!status || (status !== 'cancelled' && status !== 'returned')) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'cancelled' or 'returned'"
      });
    }
    
    // Call service to update booking status
    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId, 
      status, 
      loggedInUser
    );
    
    // Custom messages based on status
    let message = "";
    if (status === 'cancelled') {
      message = "Booking cancelled successfully";
    } else if (status === 'returned') {
      message = "Booking marked as returned. Vehicle is now available";
    }
    
    return res.status(200).json({
      success: true,
      message,
      data: updatedBooking
    });
    
  } catch (error: any) {
    console.error('Update booking status error:', error);
    
    // Handle specific errors
    if (error.status === 400 || error.status === 403 || error.status === 404) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    
    // Generic error
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update booking status"
    });
  }
};

export const bookingController={
    createBooking,getAllBookings,updateBookingStatus
}