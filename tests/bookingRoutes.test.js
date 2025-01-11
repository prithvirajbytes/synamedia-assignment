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

    it('should retrieve booking details', async () => {
        // Pre-book a room
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
});
