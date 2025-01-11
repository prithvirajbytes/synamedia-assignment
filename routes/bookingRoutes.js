const express = require('express');
const {
    bookRoom,
    getBookingDetails,
    getAllGuests,
    cancelBooking,
    modifyBooking,
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/book-room', bookRoom);
router.get('/booking-details', getBookingDetails);
router.get('/all-guests', getAllGuests);
router.delete('/cancel-booking', cancelBooking);
router.put('/modify-booking', modifyBooking);

module.exports = router;
