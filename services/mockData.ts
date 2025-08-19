
import { User } from '../types';

// This is mock data. In a real application, this would come from a database.
export const mockUsers: User[] = [
    {
        id: 101,
        name: "Ramesh Kumar",
        email: "ramesh.k@example.com",
        password: "password123",
        phone: "+919876543210",
        addresses: [
            { id: 201, name