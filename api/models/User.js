/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    /*
    userID: {
      type: 'INTEGER',
      autoincrement: true,
      primaryKey: true,
      unique: true
    },
    */
    
    userName: { 
      type: 'STRING',
      required: true,
      unique: true
    },
    
    userPassword: { 
      type: 'STRING',
    },

    email: { 
      type: 'STRING',
      email: true,
      required: true,
      unique: true
    },

    //Estado del usuario
    online: {
      type: 'BOOLEAN',
      defaultTo: false
    },

    admin: {
      type: 'BOOLEAN',
      defaultTo: false 
    },

    //JOIN con coleccion Game. Relacion muchos a muchos
    games: {
      collection: 'game',
      via: 'users',
      dominant: true
    }
    
  }
  
};

