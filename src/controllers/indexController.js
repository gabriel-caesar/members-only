exports.mainPageGet = async (req, res) => {
  res.render('index', { title: 'Home | Members Only' })
};