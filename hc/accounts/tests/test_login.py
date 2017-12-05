from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase
from hc.api.models import Check
from django.utils.html import escape


class LoginTestCase(TestCase):

    def test_it_sends_link(self):
        check = Check()
        check.save()

        session = self.client.session
        session["welcome_code"] = str(check.code)
        session.save()

        form = {"email": "alice@example.org"}

        r = self.client.post("/accounts/login/", form)
        assert r.status_code == 302

        ### Assert that a user was created
<<<<<<< HEAD
        
=======
        self.assertEqual(User.objects.count(), 1)

>>>>>>> 94a4bdb3655149b475072164cbf6ccf2b88510fe
        # And email sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Log in to healthchecks.io')

        ### Assert contents of the email body
        self.assertTrue("alice@example.org" in mail.outbox[0].to)
        self.assertIn('To log into healthchecks.io', mail.outbox[0].body)

        ### Assert that check is associated with the new user
        self.assertEqual(Check.objects.count(), 1)
        self.assertTrue(check.code)

    def test_it_pops_bad_link_from_session(self):
        self.client.session["bad_link"] = True
        self.client.get("/accounts/login/")
        assert "bad_link" not in self.client.session

        ### Any other tests?
