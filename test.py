from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Set Up Before each testcase"""

        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_homepage(self):
        """Test for displayed information"""
        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session) #check if board is in session
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b'<p>High Score:', response.data)
            self.assertIn(b'Score:', response.data)
            self.assertIn(b'Seconds Left:', response.data)
    
    def test_valid_word(self):
        """Test if word is valid"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["H", "E", "N", "N", "N"], 
                                 ["H", "E", "N", "N", "N"], 
                                 ["H", "E", "N", "N", "N"], 
                                 ["H", "E", "N", "N", "N"], 
                                 ["H", "E", "N", "N", "N"]]
        response = self.client.get('/check-word?word=hen')
        self.assertEqual(response.json['result'], 'ok')

    
    def test_invalid_word(self):
        """Test if word in dict"""
        self.client.get('/')
        response = self.client.get('/check-word?word=impossible')
        self.assertEqual(response.json['result'], 'not-on-board')
    
    def non_english_word(self):
        """Test if word on board"""
        self.client.get('/')
        response = self.client.get('/check-word?word=abc123')
        self.assertEqual(response.json['result'], 'not-word')