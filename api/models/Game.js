/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: 'STRING',
      unique: true
    },

    genre: {
      type: 'STRING'
    },

    //JOIN con coleccion User. Relacion muchos a muchos
    users: {
      collection: 'user',
      via: 'games'
    }
  }
};

