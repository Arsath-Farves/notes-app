from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from .models import Note

def items(response):
    """"Works whether or not pagination is on"""
    data = response.data
    return data['results'] if isinstance(data,dict) and 'results' in data else data

class NoteAPITests(APITestCase):
    def setUp(self):
        self.alice = User.objects.create_user('alice',password='pass12345')
        self.bob = User.objects.create_user('bob',password='pass12345')
        self.client.force_authenticate(self.alice)

    def test_create_note(self):
        res = self.client.post('/api/notes/',{'title':'Hi','content':'x'})
        self.assertEqual(res.status_code,201)
        self.assertEqual(Note.objects.get().owner,self.alice)

    def test_title_is_required(self):
        res = self.client.post('/api/notes/',{'content':'no title'})
        self.assertEqual(res.status_code,400)

    def test_list_only_shows_own_notes(self):
        Note.objects.create(title='Mine',owner=self.alice)
        Note.objects.create(title='theirs',owner=self.bob)
        res = self.client.get('/api/notes/')
        title = [n['title'] for n in items(res)]
        self.assertEqual(title,['Mine'])

    def test_cannot_see_others_notes(self):
        note = Note.objects.create(title='secret',owner=self.bob)
        res = self.client.get(f'/api/notes/{note.id}/')
        self.assertEqual(res.status_code,404)

    def test_update_changes_only_one_note(self):
        a = Note.objects.create(title='A',owner=self.alice)
        b = Note.objects.create(title='B',owner=self.alice)
        res = self.client.patch(f'/api/notes/{a.id}/',{'title':'A'})
        self.assertEqual(res.status_code,200)
        a.refresh_from_db()
        b.refresh_from_db()
        self.assertEqual(a.title,'A')
        self.assertEqual(b.title,'B')

    def test_delete_note(self):
        note = Note.objects.create(title='Bye',owner=self.alice)
        res = self.client.delete(f'/api/notes/{note.id}/')
        self.assertEqual(res.status_code,204)
        self.assertEqual(Note.objects.count(),0)

    def test_cannot_delete_others_notes(self):
        note= Note.objects.create(title='theirs',owner=self.bob)
        res = self.client.delete(f'/api/notes/{note.id}/')
        self.assertEqual(res.status_code,404)
        self.assertEqual(Note.objects.count(),1)

    def test_search(self):
        Note.objects.create(title='buy milk',owner=self.alice)
        Note.objects.create(title='run',owner=self.alice)
        res = self.client.get('/api/notes/?search=milk')
        self.assertEqual(len(items(res)),1)

    def test_requires_auth(self):
        self.client.force_authenticate(None)
        res = self.client.get('/api/notes/')
        self.assertEqual(res.status_code,401)

class AuthTests(APITestCase):
    def test_register_then_login(self):
        res = self.client.post('/api/register/',{
            'username':'carol','email':'caorl@gamil.com','password':'pass12345'})
        self.assertEqual(res.status_code,201)
        self.assertNotIn('password',res.data)

        res = self.client.post('/api/token/',{'username':'carol','password':'pass12345'})
        self.assertEqual(res.status_code,200)
        self.assertIn('access',res.data)

    def test_wrong_password_rejected(self):
        User.objects.create_user('dave', password='pass12345')
        res = self.client.post('/api/token/', {'username': 'dave', 'password': 'wrong'})
        self.assertEqual(res.status_code, 401)

    def test_me_endpoint(self):
        user = User.objects.create_user('erin', password='pass12345')
        Note.objects.create(title='One', owner=user)
        self.client.force_authenticate(user)
        res = self.client.get('/api/me/')
        self.assertEqual(res.data, {'username': 'erin', 'note_count': 1})




    

