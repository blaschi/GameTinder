/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    'signup': function(req, res) {
        res.view();
    },

    //Crear el usuario una vez enviado el formulario de 'signup'
    create: function(req, res, next) {
        console.log("The create function @ UserController was called");
        User.create(req.params.all(), function userCreated (err, user) {

            if (err) return next(err);    
            
            req.session.authenticated = true;
            req.session.User = user;
            user.online = true;
            
            user.save(function(err, user) {
                
                if (err) return next(err);
                User.publishCreate(user);

                //Sino seguir
                console.log('Usuario creado exitosamente');
                res.redirect('/user/main/' + req.param('id'));
            })
        });
    },

    'main': function(req, res, next) {
        User.findOne(req.param('id')).populate('games', {
            title: {'contains': ''}
        }).exec(function foundUser (err, user) {
            if (err) return next(err);
            console.log(user);
            /*
            for (var game in user.games) {
                console.log(game.title);
            }
            */
            res.view({
                user: user
            });
        });
    },

    'edit': function(req, res, next) {
        //Busca el usuario por id para mostrar
        var games = [];
        var userHasGame = false;
        console.log('break');
        User.findOne(req.param('id')).populate('games').exec(function foundUser(err, user) {
            if (err) return next(err);
            Game.find(function foundGames(err, gamesFound) {
                if (err) return next(err);

                for (var game in gamesFound) {
                    for (var userGame in user.games) {
                        if (gamesFound[game].id == user.games[userGame].id) {
                            userHasGame = true;
                        }
                    }
                    if (!userHasGame) {
                        games.push(gamesFound[game]);
                    }
                    userHasGame = false;
                }
               
                res.view({
                    user: user,
                    games: games
                });
                
            });
        });
        
    },

    update: function(req, res, next) {
        var parGames = req.param('game');
        
        //console.log(req.param('game'));
        console.log(parGames);
        var userObject = {
            email: req.param('email'),
        }

        User.update(req.param('id'), userObject, function userUpdated(err) {
                if (err) {
                    return res.redirect('/user/edit/' + req.param('id'));
                }
                actualizarJuegos();
        });

        function actualizarJuegos() {
            User.findOne(req.param('id')).populate('games').exec(function foundUser(err, user) {
                if (err) return next(err);
                if (!user) return next();

                if (Array.isArray(parGames)) { 
                    for (i = 0;i < parGames.length; i++) {
                        console.log(parGames[i]);
                        user.games.add(parGames[i]);
                    }
                    persistirActualizacion();
                }
                else
                {    
                    user.games.add(parGames);
                //console.log(user.games);
                    persistirActualizacion();
                }

                function persistirActualizacion() {
                    user.save(function(err) {
                        
                        if (err) {
                            
                            return next(err);
                        }            
                        res.redirect('/user/main/' + req.param('id'));
                        
                    });
                    
                }

            });
        };    
},

    'remove-game': function(req, res, next) {
        User.findOne(req.param('id')).populate('games').exec(function foundUser(err, user) {
            if (err) return next(err);
            
            user.games.remove(req.param('game'));
            user.save(function(err) {
                if (err) return next(err);
                actualizarPaginaJuegos();
            });
        });

        function actualizarPaginaJuegos() {
                res.redirect('/user/main/' + req.param('id'));
        }
    
    },

    'find-players': function(req, res, next) {
        Game.findOne(req.param('id')).populate('users').exec
        (
            function foundGame(err, game) {
            if (err) return(err);

            res.view({
                userId: req.session.User.id,
                users: game.users
            });
        }); 
    },
    
    //Utiliza sockets para ver si el usuario esta online
    subscribe: function(req, res) {
        User.find(function foundUsers(err, users) {
            if (err) return next(err);

            //Suscribir el socket al modelo User
            User.subscribe(req.socket);
            //Suscribir a los rooms
            User.subscribe(req.socket, users);

            res.send(200);
        });     
    }
    
};
