/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'login': function(req, res) {
        res.view();
    },

    //Chequear datos ingresados por el usuario
    create: function (req, res, next) {
        if (!req.param('username') || !req.param('password')) {
            res.redirect('/session/login');
            return;
        }
        
        User.findOne({ userName : req.param('username')}).exec(function(err, user) {
            //Atrapar cualquier error
            if (err) return next(err);

            //Si no encontro el usuario
            if (!user) {
                res.redirect('/user/login');
                return;    
            }

            if (user.userPassword != req.param('password')) {
                res.redirect('/session/login');
            }
            else {
                req.session.authenticated = true;
                

                req.session.User = user;
				// Change status to online
				user.online = true;
                userName = req.param('username');
                userid=req.session.User.id;
				user.save(function(err, user) {
					if (err) return next(err);
                    
					// Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
					
                    User.publishUpdate(userid, {
						loggedIn: true,
						id: userid,
						name: userName,
						action: ' has logged in.'
                    });
                    
                    res.redirect('/user/main/' + userid);
                });
            }
            
        });

    
    },

    destroy: function(req, res, next) {
        User.findOne(req.session.User.id, function foundUser(err, user) {
            userId = req.session.User.id;

            if (user) {

                User.update(userId, {
                    online: false
                }, function (err){

                    if (err) return next(err);

                    User.publishUpdate(user.id, {
                        loggedIn: false,	
                        id: user.id,
                        name: user.userName,
                        action: ' has logged out.'
                    });
                    req.session.destroy();

                    res.redirect('/');
                });
            }
            else {
                req.session.destroy();

                res.redirect('/');
            }
        });
    }
    
};

