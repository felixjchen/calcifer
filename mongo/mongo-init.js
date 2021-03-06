const dbsToCreate = ['calcifer'];

db.createUser(
  {
    user: 'admin',
    pwd: 'admin',
    roles: dbsToCreate.map(dbName => {
      return {
        role: 'readWrite',
        db: dbName
      }
    })
  }
);