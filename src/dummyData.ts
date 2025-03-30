import { Product, Role, User } from '@prisma/client';
import PrismaSingleton from './service/prisma';
import bcrypt from 'bcryptjs';

const generateHash = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const users = [
  {
    id: '5bafe52b-8443-4a9c-84bf-f88c7a27754b',
    name: 'user',
    email: 'user@test.com',
    password: generateHash('Password@123'),
    roleId: 'af64d9a8-c113-4702-8277-c886eeebe85a',
  },
  {
    id: '46104db1-9173-4d95-870a-6f822f9c2d75',
    name: 'admin',
    email: 'admin@test.com',
    password: generateHash('Password@123'),
    roleId: 'f18a4f5c-c31f-49a5-a004-1415e7ad1b51',
  },
] as User[];

const roles = [
  {
    id: 'f18a4f5c-c31f-49a5-a004-1415e7ad1b51',
    name: 'admin',
    isAdmin: true,
  },
  {
    id: 'af64d9a8-c113-4702-8277-c886eeebe85a',
    name: 'user',
    isAdmin: false,
  },
] as Role[];

const products = [
  {
    id: 'dfe39545-21cb-4932-92d4-30ba94b4d7df',
    name: 'product1',
    price: 100,
    stock: 10,
  },
  {
    id: '8f14ef60-ca98-4f72-a8d6-fbdaf8961598',
    name: 'product2',
    price: 200,
    stock: 20,
  },
  {
    id: '9bacf82c-902f-4721-be6f-a734e604bd9a',
    name: 'product3',
    price: 300,
    stock: 30,
  },
  {
    id: '59a65146-1649-4d04-b986-7801f4b68e14',
    name: 'product4',
    price: 400,
    stock: 40,
  },
  {
    id: 'b32e39ed-2cc3-4b98-9305-66f614ff56e4',
    name: 'product5',
    price: 500,
    stock: 50,
  },
] as Product[];

export const insertDummyData = async () => {
  const prisma = PrismaSingleton.getInstance().getPrismaClient();
  // insert roles
  await prisma.role.createMany({
    data: roles,
  });
  // insert users
  await prisma.user.createMany({
    data: users,
  });
  // insert products
  await prisma.product.createMany({
    data: products,
  });
};
