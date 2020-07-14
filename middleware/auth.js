module.exports = function(req, res, next) {
    /*
    Если пользователь не зареган 
    и пытается попасть на защищенные страницы, то тогда
    его пересылает на страницу логина
    */
    if (!req.session.isAuthenticated) {
        return res.redirect("/auth/login");
    }

    next();
};
