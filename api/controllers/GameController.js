/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function(req,res) {
        res.view();
    },

    create: function(req, res, next) {
        Game.create(req.params.all(), function gameCreated(err, game) {
            if (err) 
               return next(err);
            else
            {
                 console.log('Juego creado exitosamente');
            res.json(
                200, game
            )
            }
        })
    }
};

