export interface DataModel {
  shops: {
    id: string;
    shopifyDomain: string;
  }[];
  users: {
    id: string;
    email: string;
    name: string;
    shopId: string;
    token: string;
		phone: string;
  }[];
}

class Database {
  private store: DataModel;

  constructor() {
    this.store = {
      shops: [
        {
          id: '2',
          shopifyDomain: 'company-z.myshopify.com',
        },
      ],
      users: [
        {
          id: '1',
          email: 'person-1@company-z.com',
          name: 'Person 1',
          shopId: '2',
          token: 'fake-user-1-token',
					phone: '(555) 555-1234'
        },
      ],
    };
  }

  async findUserByToken(token: string) {
    return this.store.users.find(u => u.token === token);
  }

  async updateUser(
    id: string,
    { email, name }: Partial<{ email: string; name: string }>,
  ) {
    const userIndex = this.store.users.findIndex(u => u.id === id);

    if (userIndex < 0) {
      return false;
    }

    if (email) {
      this.store.users[userIndex].email = email;
    }

    if (name) {
      this.store.users[userIndex].name = name;
    }

    return true;
  }
}

const db = new Database();

export default db;
