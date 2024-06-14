   const { DataTypes } = require('sequelize');
   const { sequelize } = require('../database/database');
   const { TablaDB } = require('./tabladb');
   const { Columna } = require('./columna');
   const { Campania } = require('./campanias');
   const { Departamento_Proyectos } = require('./departamento_proyectos');

   const Proyectos = sequelize.define('proyectos', {
       id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: true,
       },

       descripcion: {
           type: DataTypes.STRING(200),
           allowNull: true,
           unique: true
       },

       ruta: {
           type: DataTypes.STRING(200),
           allowNull: true,
           unique: true
       },

       estado: {
           type: DataTypes.INTEGER,
           defaultValue: 1,
           allowNull: true
       },


   }, { timestamps: false });

   Proyectos.hasMany(Campania, {
       foreignKey: 'idProyecto',
       sourceKey: 'id'
   });

   Campania.belongsTo(Proyectos, {
       foreignKey: 'idProyecto',
       targetId: 'id'
   });

   Proyectos.hasMany(TablaDB, {
       foreignKey: 'idProyectos',
       sourceKey: 'id'
   });


   TablaDB.belongsTo(Proyectos, {
       foreignKey: 'idProyectos',
       targetId: 'id'
   });

   Proyectos.hasMany(Columna, {
       foreignKey: 'idProyectos',
       sourceKey: 'id',
   });

Columna.belongsTo(Proyectos,{
    foreignKey: 'idProyectos',
    targetId: 'id',
});
Proyectos.hasMany(Departamento_Proyectos,{
    foreignKey: 'idProyecto',
    sourceKey: 'id'
});

   Departamento_Proyectos.belongsTo(Proyectos, {
       foreignKey: 'idProyecto',
       targetKey: 'id',
   });


   // (async () => {
   //     await Proyectos.sync({ alter: true });

   // })();



// (async () => {
//     try{ 
//     await Proyectos.sync({ alter: true });
//     console.log("Se cargo correctamente");
    

//     } catch (error){
//         console.error("hay problema al cargar el modelo",error);
//     }
// })();

module.exports = { Proyectos }