import Helper from '../Helper/helper';

const Users = [
  {
    id: 1,
    token: '',
    firstName: 'abiola',
    lastName: 'ojo',
    email: 'ojo@gmail.com',
    password: Helper.hashPassword('olo1'),
    address: 'number 2, ejinija',
    status: 'verified',
    isAdmin: true,
    created: new Date(),
    modified: new Date(),
  },
  {
    id: 2,
    token: '',
    firstName: 'Dayo',
    lastName: 'Oyedele',
    email: 'dayo@gmail.com',
    password: Helper.hashPassword('baba1'),
    address: 'number 2, ejinija',
    status: 'unverified',
    isAdmin: false,
    created: new Date(),
    modified: new Date(),
  },
];


export default Users;
