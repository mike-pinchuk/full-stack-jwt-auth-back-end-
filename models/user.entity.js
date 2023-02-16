module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_activated: {
      type: Sequelize.BOOLEAN ,
    },
    activation_link: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return User;
};
