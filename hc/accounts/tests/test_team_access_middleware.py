from django.contrib.auth.models import User
from django.test import TestCase
from hc.accounts.models import Profile


class TeamAccessMiddlewareTestCase(TestCase):

    def test_it_handles_missing_profile(self):
        user = User(username="ned", email="ned@example.org")
        user.set_password("password")
        user.save()

        self.client.login(username="ned@example.org", password="password")
        r = self.client.get("/about/")
        self.assertEqual(r.status_code, 200)

        ### Assert the new Profile objects count
        self.assertEqual(Profile.objects.count(), 1)

        #Another profile
        user = User(username="rat", email="rat@example.org")
        user.set_password("1234")
        user.save()

        self.client.login(username="rat@example.org", password="1234")
        r = self.client.get("/about/")
        self.assertEqual(r.status_code, 200)

        ### Assert the new Profile objects count
        self.assertNotEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.count(), 2)
