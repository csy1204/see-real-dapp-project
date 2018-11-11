from flask import Flask, url_for
from flask import request, after_this_request
from flask import render_template, make_response

app = Flask(__name__)

@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    name="aaa"
    return render_template('hello.html',name=name)

@app.route('/world')
def world():
    name="aaa"
    return render_template('world.html',name=name)

@app.route('/tube')
def tube():
    name="aaa"
    return render_template('youtube.html',name=name)


@app.route('/view', methods=['POST'])
def post_view_data():
    print(request.data)
    print("??")
    print(request.json)
    return request.data


@app.route('/user/<name>')
def show_user_profile(name):
    username = request.cookies.get('username')
    
    if username is None:

        # when the response exists, set a cookie with the language
        @after_this_request
        def remember_language(response):
            response.set_cookie('username','aaaa')
    else:
        resp = make_response(render_template('hello.html', name=username))

    resp.set_cookie('username', name)
    return resp

@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return 'Post %d' % post_id

@app.route('/path/<path:subpath>')
def show_subpath(subpath):
    # show the subpath after /path/
    return 'Subpath %s' % subpath


# Converter Types
# string	(default) accepts any text without a slash
# int	accepts positive integers
# float	accepts positive floating point values
# path	like string but also accepts slashes
# uuid	accepts UUID strings

