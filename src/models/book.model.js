module.exports = (sequelize, Sequelize, DataTypes) => {
  const Book = sequelize.define(
    'book',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true,
      underscored: true, // ✅ fixed typo
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'books',
      freezeTableName: true
    }
  )

  return Book
}
