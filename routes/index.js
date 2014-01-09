
/*
 * GET home page.
 */

var fs = require('fs');
var path = require('path');
var util = require('util');

var easyimg = require('easyimage');

exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

exports.pic = function(req, res) {
    var p = req.param('path');
    console.log(p);
    res.sendfile(p);
};

exports.thumb = function(req, res) {
    var p = req.param('path');
    var thumbName = p.split(path.sep).join('_');
    var dest = path.join('thumbnails', thumbName);

    if(fs.existsSync(dest) == false) {
        easyimg.thumbnail(
                { src: p, dst: dest, width: 128, height: 128, x: 0, y: 0 },
                function(err, image) {
                    if (err) throw err;
                    console.log(util.format('Thumbnail created: (%s)', dest));
                    res.sendfile(dest);
                }
                );
    } else {
        res.sendfile(dest);
    }
}

exports.browse = function(req, res) {
    var p = req.param('path');
    console.log(p);
    var contents = fs.readdirSync(p);
    console.log(contents);

    var ret = '<html><body>' +
        '<script type="text/javascript" src="javascripts/jquery.js"></script>' +
        '<script type="text/javascript" src="javascripts/html5gallery.js"></script>' +
        '</head><body>';

    var img = '<div style="display:none;" class="html5gallery" data-skin="horizontal" data-width="480" data-height="272">';
    
    for(var i in contents) {
        var newPath = path.join(p, contents[i]);
        var stat = fs.statSync(newPath);
        if(stat.isFile()) {
            img += '<a href="pic?path='+ encodeURIComponent(newPath) +'"><img src="thumb?path='+ encodeURIComponent(newPath) +'"></a>\n';
            ret += '<a href="pic?path=' + encodeURIComponent(newPath) + '">' + contents[i] +'</a><br />';
        } else {
            ret += '<a href="browse?path=' + encodeURIComponent(newPath) + '">' + contents[i] +'</a><br />';
        }
    }
    img += '</div>';

    ret += img;

    ret += '</body></html>'
    res.send(ret);
};
