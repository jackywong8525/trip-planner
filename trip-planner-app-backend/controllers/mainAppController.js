const mainAccess = (req, res) => {
    res.status(200).json({
        protected: true
    })
}

module.exports = {
    mainAccess
}