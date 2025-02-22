import { PrismaClient, Property } from "@prisma/client";

const prisma = new PrismaClient();

export class PropertiesService {
  // Create a new property
  async createProperty({ creatorId, data }: { creatorId: string; data: Property }) {
    return await prisma.property.create({
      data: {
        ...data,
        hostId: creatorId,
      },
    });
  }

  // Get all properties
  async getAllProperties() {
    return await prisma.property.findMany({
      where: { bookings: { none: { status: "CONFIRMED" } } },
      include: { host: true, bookings: true },
    });
  }

  async getAllHostProperties(hostId: string) {
    return await prisma.property.findMany({
      where: { hostId },
      include: { host: true, bookings: true },
    });
  }

  // Get a property by ID
  async getPropertyById(propertyId: string) {
    return await prisma.property.findUnique({
      where: { id: propertyId },
      include: { host: true, bookings: true },
    });
  }

  // Update a property
  async updateProperty(propertyId: string, updates: Partial<Property>) {
    return await prisma.property.update({
      where: { id: propertyId },
      data: updates,
    });
  }

  // Delete a property
  async deleteProperty(propertyId: string) {
    return await prisma.property.delete({
      where: { id: propertyId },
    });
  }
}

export default new PropertiesService();
