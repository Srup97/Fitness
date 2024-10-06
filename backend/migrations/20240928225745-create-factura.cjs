// migrations/20240928225745-create-factura.cjs

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('factura', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      membresia_usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'membresia_usuario', // Cambia esto si el nombre de la tabla es diferente
          key: 'id'
        }
      },

      monto: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      estado_pago: {
        type: Sequelize.ENUM('pagado', 'pendiente', 'cancelado'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('factura');
  }
};
