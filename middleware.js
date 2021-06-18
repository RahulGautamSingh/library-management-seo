module.exports = function middleware(req, res, next) {
    
  setTimeout(()=>{console.log(req.method,req.originalUrl,res.statusCode),10})
  next();
};
