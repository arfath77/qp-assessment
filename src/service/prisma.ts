import { PrismaClient } from '@prisma/client';

class PrismaSingleton {
  private static instance: PrismaSingleton;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): PrismaSingleton {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton();
    }
    return PrismaSingleton.instance;
  }

  public async connectToPrisma(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('\x1b[36m%s\x1b[0m', 'Postgres connected...');
    } catch (err) {
      console.error(err, 'Prisma DB Connection failed..');
      process.exit(1);
    }
  }

  public getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}

export default PrismaSingleton;
