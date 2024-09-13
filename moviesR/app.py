from flask import Flask, render_template, request, send_from_directory
import os

app = Flask(__name__)

# Sample movie data
movies = [
    {"id": 1, "title": "Sample Movie", "description": "This is a sample movie."}
]

@app.route('/')
def index():
    return render_template('index.html', movies=movies)

@app.route('/movie/<int:movie_id>')
def movie(movie_id):
    movie = next((m for m in movies if m["id"] == movie_id), None)
    if movie:
        return render_template('movie.html', movie=movie)
    return "Movie not found", 404

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(directory='movies', filename=filename)

if __name__ == '__main__':
    app.run(debug=True)