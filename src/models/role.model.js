module.exports = (sequelize, Sequelize, DataTypes) => {
  const Role = sequelize.define(
    'role', // Model name
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Optional but common for IDs
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true, // Corrected typo
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'roles', // Optional: if your DB table name is 'roles'
      freezeTableName: true // Prevent Sequelize from pluralizing table name
    }
  )

  return Role
}
