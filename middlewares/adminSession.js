function adminSession(req,res,next) {
    if(req.session.adminLoggged){
        next()
    } else {
        res.redirect('/admin/login')
    }
}

module.exports = adminSession