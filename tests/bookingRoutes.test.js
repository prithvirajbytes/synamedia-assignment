const request = require('supertest');
const app = require('../index');
const { rooms, bookings } = require('../data/hotelData');

describe('Booking API', () => {
    beforeEach(() => {
        // Reset the in-memory data before each test
        rooms.forEach((room) => (room.available = true));
        bookings.length = 0;
    });

    it('should book a room', async () => {
        const response = await request(app).post('/api/book-room').send({
            name: 'John Doe',
            email: 'john.doe@example.com',
            checkIn: '2025-01-15',
            checkOut: '2025-01-20',
        });
        expect(response.status).toBe(200);
        expect(response.body.booking).toHaveProperty('roomNumber');
        expect(response.body.booking.name).toBe('John Doe');
    });

    it('should return error if no rooms are available', async () => {
        // Mark all rooms as unavailable
        rooms.forEach((room) => (room.available = false));

        const response = await request(app).post('/api/book-room').send({
            name: 'John Doe',
            email: 'john.doe@example.com',
            checkIn: '2025-01-15',
            checkOut: '2025-01-20',
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No rooms available.');
    });

    it('should retrieve booking details', async () => {
        bookings.push({
            name: 'John Doe',
            email: 'john.doe@example.com',
            roomNumber: 101,
            checkIn: '2025-01-15',
            checkOut: '2025-01-20',
        });

        const response = await request(app).get('/api/booking-details').query({
            email: 'john.doe@example.com',
        });
        expect(response.status).toBe(200);
        expect(response.body.booking).toHaveProperty('roomNumber');
        expect(response.body.booking.name).toBe('John Doe');
    });

    it('should return error for non-existent booking', async () => {
        const response = await request(app).get('/api/booking-details').query({
            email: 'non.existent@example.com',
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No booking found for this email.');
    });

    it('should retrieve all guests in the hotel', async () => {
        bookings.push(
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                roomNumber: 101,
                checkIn: '2025-01-15',
                checkOut: '2025-01-20',
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                roomNumber: 102,
                checkIn: '2025-01-16',
                checkOut: '2025-01-22',
            }
        );

        const response = await request(app).get('/api/all-guests');
        expect(response.status).toBe(200);
        expect(response.body.guests).toHaveLength(2);
        expect(response.body.guests[0].name).toBe('John Doe');
        expect(response.body.guests[1].name).toBe('Jane Smith');
    });

    it('should cancel a booking', async () => {
        bookings.push({
            name: 'John Doe',
            email: 'john.doe@example.com',
            roomNumber: 101,
            checkIn: '2025-01-15',
            checkOut: '2025-01-20',
        });

        const response = await request(app).delete('/api/cancel-booking').send({
            email: 'john.doe@example.com',
            roomNumber: 101,
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Booking canceled successfully.');
        expect(bookings).toHaveLength(0);
    });

    it('should return error when canceling a non-existent booking', async () => {
        const response = await request(app).delete('/api/cancel-booking').send({
            email: 'non.existent@example.com',
            roomNumber: 101,
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Booking not found.');
    });

    it('should modify a booking', async () => {
        bookings.push({
            name: 'John Doe',
            email: 'john.doe@example.com',
            roomNumber: 101,
            checkIn: '2025-01-15',
            checkOut: '2025-01-20',
        });

        const response = await request(app).put('/api/modify-booking').send({
            email: 'john.doe@example.com',
            roomNumber: 101,
            checkIn: '2025-01-18',
            checkOut: '2025-01-22',
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Booking modified successfully.');
        expect(response.body.booking.checkIn).toBe('2025-01-18');
        expect(response.body.booking.checkOut).toBe('2025-01-22');
    });

    it('should return error when modifying a non-existent booking', async () => {
        const response = await request(app).put('/api/modify-booking').send({
            email: 'non.existent@example.com',
            roomNumber: 101,
            checkIn: '2025-01-18',
            checkOut: '2025-01-22',
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Booking not found.');
    });
});
