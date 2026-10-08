/**
 * Insurance Lifecycle Integration Service
 * Triggers:
 * 1. Ride Start: Notify insurance partner
 * 2. Successful Ride End: Completion audit
 * 3. Unsuccessful / SOS Ride End: Incident alert trigger
 */
const triggerRideStartInsurance = async (booking) => {
  try {
    console.log(`[Insurance Service] Triggering Ride Start Insurance Policy for Booking: ${booking.bookingCode}`);
    // External API invocation placeholder
    return {
      status: 'SUCCESS',
      policyNumber: `INS-POL-${Date.now()}`,
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`[Insurance Error] Start trigger failed: ${error.message}`);
    return { status: 'FAILED', error: error.message };
  }
};

const triggerRideCompleteInsurance = async (booking, isSuccess = true) => {
  try {
    console.log(`[Insurance Service] Triggering Ride Complete (Status: ${isSuccess ? 'COMPLETED' : 'ALERT'}) for Booking: ${booking.bookingCode}`);
    return {
      status: isSuccess ? 'COMPLETED' : 'INCIDENT_ALERT_SENT',
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`[Insurance Error] Complete trigger failed: ${error.message}`);
    return { status: 'FAILED', error: error.message };
  }
};

module.exports = {
  triggerRideStartInsurance,
  triggerRideCompleteInsurance
};
