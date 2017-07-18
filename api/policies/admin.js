/**
 * Politicas para implementar usuario adminstrador
 */

module.exports = function (req, res, ok) {

    //El usuario es administrador 
    if (req.session.User && req.session.User.admin) {
        return ok();
    }
    else
    {
        //El usuario no es admin
        res.redirect('/session/new');
    }
}