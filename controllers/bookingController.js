const { rooms, bookings } = require('../data/hotelData');

// Book Room
exports.bookRoom = (req, res) => {
    const { name, email, checkIn, checkOut } = req.body;

    const availableRoom = rooms.find((room) => room.available);
    if (!availableRoom) {
        return res.status(400).json({ message: 'No rooms available.' });
    }

    availableRoom.available = false;

    const booking = {
        name,
        email,
        roomNumber: availableRoom.roomNumber,
        checkIn,
        checkOut,
    };
    bookings.push(booking);

    res.status(200).json({
        message: 'Room booked successfully',
        booking,
    });
};

// Get Booking Details
exports.getBookingDetails = (req, res) => {
    const { email } = req.query;

    const booking = bookings.find((b) => b.email === email);
    if (!booking) {
        return res.status(404).json({ message: 'No booking found for this email.' });
    }

    res.status(200).json({ booking });
};

// Get All Guests
exports.getAllGuests = (req, res) => {
    const guests = bookings.map((b) => ({
        name: b.name,
        roomNumber: b.roomNumber,
    }));
    res.status(200).json({ guests });
};

// Cancel Booking
exports.cancelBooking = (req, res) => {
    const { email, roomNumber } = req.body;

    const bookingIndex = bookings.findIndex(
        (b) => b.email === email && b.roomNumber === roomNumber
    );

    if (bookingIndex === -1) {
        return res.status(404).json({ message: 'Booking not found.' });
    }

    const canceledBooking = bookings.splice(bookingIndex, 1)[0];
    const room = rooms.find((r) => r.roomNumber === canceledBooking.roomNumber);
    if (room) room.available = true;

    res.status(200).json({ message: 'Booking canceled successfully.' });
};

// Modify Booking
exports.modifyBooking = (req, res) => {
    const { email, roomNumber, checkIn, checkOut } = req.body;

    const booking = bookings.find(
        (b) => b.email === email && b.roomNumber === roomNumber
    );

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.checkIn = checkIn;
    booking.checkOut = checkOut;

    res.status(200).json({ message: 'Booking modified successfully.', booking });
};
